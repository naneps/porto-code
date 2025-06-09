
import { 
  db, 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  Timestamp 
} from './firebase'; 
import { GuestBookEntry, AIValidationStatus, ReactionsMap } from '../App/types';

const GUESTBOOK_COLLECTION = 'guestbook_entries';

export async function addGuestBookEntryToFirestore(
  userId: string,
  authProvider: 'google' | 'github',
  nickname: string,
  message: string,
  aiValidationStatus: AIValidationStatus,
  avatarUrl?: string,
  githubLogin?: string,
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, GUESTBOOK_COLLECTION), {
      userId,
      authProvider,
      nickname,
      avatarUrl: avatarUrl || null,
      githubLogin: githubLogin || null,
      message,
      timestamp: serverTimestamp(),
      aiValidationStatus,
      reactions: {} as ReactionsMap, // Initialize with empty reactions
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding guest book entry to Firestore: ", error);
    throw error; // Re-throw to be handled by the caller
  }
}

export function subscribeToGuestBookEntries(
  callback: (entries: GuestBookEntry[]) => void
): () => void { // Returns an unsubscribe function
  const q = query(collection(db, GUESTBOOK_COLLECTION), orderBy('timestamp', 'desc'));
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const entries: GuestBookEntry[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Convert Firestore Timestamp to JavaScript Date object
      const timestamp = data.timestamp instanceof Timestamp ? data.timestamp.toDate() : new Date();
      
      entries.push({
        id: doc.id,
        userId: data.userId,
        authProvider: data.authProvider,
        nickname: data.nickname,
        avatarUrl: data.avatarUrl,
        githubLogin: data.githubLogin,
        message: data.message,
        timestamp: timestamp,
        aiValidationStatus: data.aiValidationStatus,
        reactions: data.reactions || {},
      } as GuestBookEntry);
    });
    callback(entries);
  }, (error) => {
    console.error("Error subscribing to guest book entries: ", error);
    // Optionally, notify the user or log more formally
  });

  return unsubscribe; // Return the unsubscribe function provided by onSnapshot
}


export async function addReactionToEntry(entryId: string, emoji: string, userId: string): Promise<void> {
  const entryRef = doc(db, GUESTBOOK_COLLECTION, entryId);
  try {
    await updateDoc(entryRef, {
      [`reactions.${emoji}`]: arrayUnion(userId)
    });
  } catch (error) {
    console.error(`Error adding reaction ${emoji} to entry ${entryId}:`, error);
    throw error;
  }
}

export async function removeReactionFromEntry(entryId: string, emoji: string, userId: string): Promise<void> {
  const entryRef = doc(db, GUESTBOOK_COLLECTION, entryId);
  try {
    await updateDoc(entryRef, {
      [`reactions.${emoji}`]: arrayRemove(userId)
    });
  } catch (error) {
    console.error(`Error removing reaction ${emoji} from entry ${entryId}:`, error);
    throw error;
  }
}
