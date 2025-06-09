
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GuestBookEntry, AIValidationStatus, GuestBookViewProps as ViewProps } from '../../App/types'; 
import type { FirebaseUser as AuthUser } from '../../Utils/firebase'; 
import { 
  auth, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from '../../Utils/firebase';
import { 
  addGuestBookEntryToFirestore, 
  subscribeToGuestBookEntries,
  addReactionToEntry,
  removeReactionFromEntry
} from '../../Utils/guestBookUtils';
import { validateGuestBookMessageWithGemini } from '../../Utils/aiUtils';
import GuestBookForm from './GuestBookForm';
import GuestBookEntryItem from './GuestBookEntryItem';
import { ICONS, PREDEFINED_EMOJIS } from '../../App/constants';
import { LogLevel } from '../../App/types';
import { playSound } from '../../Utils/audioUtils';

const GuestBookView: React.FC<ViewProps> = ({ addAppLog, currentUser, userGuestBookNickname, userGitHubUsername }) => {
  const [entries, setEntries] = useState<GuestBookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false); 
  const [isFetchingInitialEntries, setIsFetchingInitialEntries] = useState(true);
  // currentUser is now passed as a prop
  const [error, setError] = useState<string | null>(null);
  const newEntryTimeoutRef = useRef<number | null>(null);

  // Effective nickname calculation for the form
  const effectiveNickname = useMemo(() => {
    if (currentUser) {
      return userGuestBookNickname || currentUser.displayName || 'Authenticated User';
    }
    return 'Authenticated User';
  }, [currentUser, userGuestBookNickname]);


  useEffect(() => {
    addAppLog('info', 'GuestBookView mounted', 'GuestBook');
    // Auth state is now managed by App.tsx, currentUser is a prop.
    // We still log when currentUser prop changes.
    if (currentUser) {
      addAppLog('info', `User state updated in GuestBookView: ${currentUser.displayName}`, 'GuestBookAuth', {
        uid: currentUser.uid,
        displayName: currentUser.displayName,
      });
    } else {
      addAppLog('info', 'User state updated in GuestBookView: No user signed in.', 'GuestBookAuth');
    }

    const unsubscribeEntries = subscribeToGuestBookEntries((newEntries) => {
      setEntries(prevEntries => {
        const prevEntryIds = new Set(prevEntries.map(e => e.id));
        return newEntries.map(ne => ({
          ...ne,
          isNew: !prevEntryIds.has(ne.id) && prevEntries.length > 0 
        }));
      });

      if (isFetchingInitialEntries) {
        setIsFetchingInitialEntries(false);
        addAppLog('info', 'Initial guest book entries loaded.', 'GuestBook');
      }
    });

    return () => {
      unsubscribeEntries();
      if (newEntryTimeoutRef.current) clearTimeout(newEntryTimeoutRef.current);
      addAppLog('info', 'GuestBookView unmounted, entries subscription cleaned up.', 'GuestBook');
    };
  }, [addAppLog, isFetchingInitialEntries, currentUser]); // Added currentUser to deps
  
  useEffect(() => {
    const newEntry = entries.find(e => e.isNew);
    if (newEntry) {
      if (newEntryTimeoutRef.current) clearTimeout(newEntryTimeoutRef.current);
      newEntryTimeoutRef.current = window.setTimeout(() => { 
        setEntries(prev => prev.map(e => e.id === newEntry.id ? { ...e, isNew: false } : e));
      }, 3000); 
    }
  }, [entries]);


  const handleSignIn = async (providerName: 'google' | 'github') => {
    const provider = providerName === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();
    try {
      setError(null);
      addAppLog('action', `Attempting sign-in with ${providerName}.`, 'GuestBookAuth');
      await signInWithPopup(auth, provider);
      playSound('ui-click'); 
    } catch (err: any) {
      console.error("Sign-in error:", err);
      setError(`Sign-in failed: ${err.message}`);
      addAppLog('error', `Sign-in failed with ${providerName}.`, 'GuestBookAuth', { errorCode: err.code, errorMessage: err.message });
      playSound('error');
    }
  };

  const handleSignOut = async () => {
    try {
      setError(null);
      addAppLog('action', 'Attempting sign-out.', 'GuestBookAuth');
      await firebaseSignOut(auth);
      playSound('ui-click');
    } catch (err: any) {
      console.error("Sign-out error:", err);
      setError(`Sign-out failed: ${err.message}`);
      addAppLog('error', 'Sign-out failed.', 'GuestBookAuth', { errorCode: err.code, errorMessage: err.message });
      playSound('error');
    }
  };

  const handleSubmitMessage = async (message: string) => {
    if (!currentUser) {
      setError("You must be signed in to post a message.");
      addAppLog('warning', 'Submit attempt failed: User not signed in.', 'GuestBook');
      playSound('error');
      return;
    }
    setIsLoading(true);
    setError(null);
    
    const githubProviderInfo = currentUser.providerData.find(pd => pd.providerId === 'github.com');
    const authProviderForEntry = githubProviderInfo ? 'github' : 'google';
    
    let autoDetectedGitHubUsername: string | undefined = undefined;
    if (githubProviderInfo) {
      if (githubProviderInfo.email && githubProviderInfo.email.includes('+') && githubProviderInfo.email.endsWith('@users.noreply.github.com')) {
        const emailParts = githubProviderInfo.email.split('@')[0].split('+');
        if (emailParts.length === 2 && emailParts[1]) autoDetectedGitHubUsername = emailParts[1];
      }
      if (!autoDetectedGitHubUsername && githubProviderInfo.displayName && !githubProviderInfo.displayName.includes(' ')) {
        autoDetectedGitHubUsername = githubProviderInfo.displayName;
      }
    }

    // Prioritize user-defined preferences, then auth data, then defaults
    const finalNickname = userGuestBookNickname || currentUser.displayName || (authProviderForEntry === 'github' ? 'GitHub User' : 'Google User');
    const finalGithubLogin = userGitHubUsername || (authProviderForEntry === 'github' ? autoDetectedGitHubUsername : undefined);

    const entryDataForFirestore = {
      userId: currentUser.uid,
      authProvider: authProviderForEntry,
      nickname: finalNickname,
      avatarUrl: currentUser.photoURL || null, 
      githubLogin: finalGithubLogin || null,
      message: message,
      aiValidationStatus: 'pending', 
      reactions: {}, 
    };
    addAppLog('debug', 'Data prepared for Firestore guest book entry creation (before AI validation).', 'GuestBook', entryDataForFirestore);

    addAppLog('action', 'Attempting to submit guest book message.', 'GuestBook', { 
        messageLength: message.length,
        userId: currentUser.uid,
        finalNickname,
        finalGithubLogin,
        authProvider: authProviderForEntry
    });

    let tempEntryId: string | null = null; 

    try {
      let aiValidationStatus: AIValidationStatus = 'pending';
      tempEntryId = `temp-${Date.now()}`; 

      const optimisticEntry: GuestBookEntry = {
        id: tempEntryId,
        userId: currentUser.uid,
        authProvider: authProviderForEntry,
        nickname: finalNickname, 
        avatarUrl: currentUser.photoURL || undefined,
        githubLogin: finalGithubLogin, 
        message,
        timestamp: new Date(),
        aiValidationStatus: 'pending',
        reactions: {},
        isNew: true,
      };
      setEntries(prev => [optimisticEntry, ...prev]);

      aiValidationStatus = await validateGuestBookMessageWithGemini(message, addAppLog);
      
      if (tempEntryId) {
        setEntries(prev => prev.filter(entry => entry.id !== tempEntryId));
      }

      await addGuestBookEntryToFirestore(
        currentUser.uid,
        authProviderForEntry,
        finalNickname, 
        message,
        aiValidationStatus,
        currentUser.photoURL || undefined,
        finalGithubLogin 
      );
      playSound('chat-receive'); 
      addAppLog('info', 'Guest book message submitted successfully.', 'GuestBook', { validationStatus: aiValidationStatus });

    } catch (err: any) {
      console.error("Error submitting message:", err);
      setError(`Failed to post message: ${err.message}`);
      addAppLog('error', 'Failed to submit guest book message.', 'GuestBook', { errorCode: err.code, errorMessage: err.message });
      if (tempEntryId) { 
        setEntries(prev => prev.filter(entry => entry.id !== tempEntryId));
      }
      playSound('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReaction = async (entryId: string, newEmojiClicked: string) => {
    if (!currentUser) {
      setError("You must be signed in to react.");
      addAppLog('warning', 'Reaction attempt failed: User not signed in.', 'GuestBook');
      playSound('error');
      return;
    }
    setError(null);
    
    const entry = entries.find(e => e.id === entryId);
    if (!entry) {
      addAppLog('warning', `Reaction attempt failed: Entry ${entryId} not found.`, 'GuestBook');
      return;
    }

    const userId = currentUser.uid;
    const currentReactions = entry.reactions || {};
    let previousReactionEmoji: string | null = null;

    for (const existingEmoji of PREDEFINED_EMOJIS) {
      if (currentReactions[existingEmoji]?.includes(userId)) {
        previousReactionEmoji = existingEmoji;
        break;
      }
    }

    try {
      if (previousReactionEmoji) {
        if (previousReactionEmoji === newEmojiClicked) {
          addAppLog('action', `User ${userId} removing reaction '${newEmojiClicked}' from entry ${entryId} (toggle off).`, 'GuestBook');
          await removeReactionFromEntry(entryId, newEmojiClicked, userId);
        } else {
          addAppLog('action', `User ${userId} changing reaction from '${previousReactionEmoji}' to '${newEmojiClicked}' on entry ${entryId}.`, 'GuestBook');
          await removeReactionFromEntry(entryId, previousReactionEmoji, userId); 
          await addReactionToEntry(entryId, newEmojiClicked, userId);
        }
      } else {
        addAppLog('action', `User ${userId} adding new reaction '${newEmojiClicked}' to entry ${entryId}.`, 'GuestBook');
        await addReactionToEntry(entryId, newEmojiClicked, userId);
      }
      playSound('ui-click');
    } catch (err: any) {
      console.error("Error updating reaction:", err);
      let displayError = "Failed to update reaction.";
      if (err.message && (err.message.toLowerCase().includes("permission") || err.message.toLowerCase().includes("missing or insufficient permissions"))) {
        displayError = `Failed to update reaction: Permission issue with database. Please ensure Firestore rules allow reaction updates. (${err.code || 'No Code'})`;
      } else if (err.message) {
        displayError = `Failed to update reaction: ${err.message} (${err.code || 'No Code'})`;
      }
      setError(displayError);
      addAppLog('error', 'Failed to update reaction.', 'GuestBook', { 
        errorMessage: err.message, 
        errorCode: err.code, 
        entryId, 
        emoji: newEmojiClicked,
        userId: currentUser.uid,
        userProvider: currentUser.providerData[0]?.providerId
      });
      playSound('error');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--editor-background)] text-[var(--editor-foreground)] overflow-y-auto relative">
      {isFetchingInitialEntries && (
        <div className="linear-progress-bar" aria-label="Loading guest book entries...">
          <div className="linear-progress-bar-indicator"></div>
        </div>
      )}
      <div className="flex-shrink-0">
        <GuestBookForm
          currentUser={currentUser}
          effectiveNickname={effectiveNickname}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          onSubmitMessage={handleSubmitMessage}
          isSubmitting={isLoading}
        />
      </div>
      
      {error && (
        <div className="p-2 bg-red-500/20 text-red-300 text-xs text-center flex-shrink-0" role="alert">
          {error}
        </div>
      )}

      <div className="p-2 sm:p-3 space-y-3">
        {entries.length === 0 && !isFetchingInitialEntries && (
          <div className="text-center text-[var(--text-muted)] py-10">
            <ICONS.guest_book_icon size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-lg">The Guest Book is empty.</p>
            <p className="text-sm">Be the first to leave a message!</p>
          </div>
        )}
        {entries.map(entry => (
          <GuestBookEntryItem
            key={entry.id}
            entry={entry}
            currentUser={currentUser}
            onReaction={(emoji) => handleReaction(entry.id, emoji)}
          />
        ))}
      </div>
    </div>
  );
};

export default GuestBookView;
