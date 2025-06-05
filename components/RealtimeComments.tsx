
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../utils/firebase'; // Assuming db is exported from firebase.ts
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { PageComment, LogLevel } from '../types';
import { Send, User, MessageCircle, Loader2, AlertTriangle } from 'lucide-react';

interface RealtimeCommentsProps {
  addAppLog: (level: LogLevel, message: string, source?: string, details?: Record<string, any>) => void;
}

const GLOBAL_GUESTBOOK_PATH = 'global_guestbook'; // Collection for global guestbook
const GLOBAL_GUESTBOOK_DOC_ID = 'main'; // Document ID within that collection to hold the 'comments' subcollection

const generateAvatarColor = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit integer
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 80%)`; // Light, soft colors
};


const RealtimeComments: React.FC<RealtimeCommentsProps> = ({ addAppLog }) => {
  const [comments, setComments] = useState<PageComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    addAppLog('info', `Initializing Global Guestbook comments.`, 'RealtimeComments');

    const commentsColRef = collection(db, GLOBAL_GUESTBOOK_PATH, GLOBAL_GUESTBOOK_DOC_ID, 'comments');
    const q = query(commentsColRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments: PageComment[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        fetchedComments.push({
          id: doc.id,
          text: data.text,
          author: data.author || 'Anonymous',
          timestamp: data.timestamp, 
          avatarColor: data.avatarColor || generateAvatarColor(data.author || 'Anonymous'),
        });
      });
      setComments(fetchedComments);
      setIsLoading(false);
      setError(null);
      addAppLog('debug', `Fetched ${fetchedComments.length} comments for Global Guestbook.`, 'RealtimeComments');
    }, (err) => {
      console.error("Error fetching global comments: ", err);
      setError("Failed to load comments. Please try again later.");
      addAppLog('error', `Error fetching Global Guestbook comments: ${err.message}`, 'RealtimeComments', { error: err });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [addAppLog]);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const finalAuthor = author.trim() || 'Anonymous';
    const commentData: Omit<PageComment, 'id'> = {
      text: newComment.trim(),
      author: finalAuthor,
      timestamp: serverTimestamp(),
      avatarColor: generateAvatarColor(finalAuthor),
    };

    try {
      const commentsColRef = collection(db, GLOBAL_GUESTBOOK_PATH, GLOBAL_GUESTBOOK_DOC_ID, 'comments');
      await addDoc(commentsColRef, commentData);
      setNewComment('');
      addAppLog('action', `Global Guestbook comment submitted by ${finalAuthor}.`, 'User', { textLength: commentData.text.length });
    } catch (err) {
      console.error("Error submitting global comment: ", err);
      setError("Failed to submit comment. Please try again.");
      addAppLog('error', `Error submitting Global Guestbook comment by ${finalAuthor}: ${err instanceof Error ? err.message : String(err)}`, 'RealtimeComments', { error: err });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatTimestamp = (timestamp: any): string => {
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    }
    return 'Just now'; 
  };


  return (
    <div className="comments-section p-3 sm:p-4 h-full flex flex-col">
      <h3 className="text-md sm:text-lg font-semibold text-[var(--text-accent)] mb-2 sm:mb-3 flex items-center flex-shrink-0">
        <MessageCircle size={20} className="mr-2" />
        Global Guestbook
      </h3>

      {error && (
        <div className="mb-3 p-2 bg-[var(--notification-error-background)] text-[var(--notification-error-foreground)] border border-[var(--notification-error-border)] rounded-md text-xs flex items-center flex-shrink-0">
          <AlertTriangle size={14} className="mr-2" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmitComment} className="mb-3 sm:mb-4 flex-shrink-0">
        <div className="mb-2">
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value.slice(0,50))}
            placeholder="Your name (optional, max 50 chars)"
            className="comment-input w-full p-1.5 text-xs rounded-md focus:outline-none"
            aria-label="Your name for comment"
          />
        </div>
        <div className="mb-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value.slice(0,280))}
            placeholder="Leave a comment for Nandang (max 280 chars)..."
            rows={3}
            className="comment-textarea w-full p-1.5 text-xs rounded-md focus:outline-none resize-none"
            required
            aria-label="Your comment"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !newComment.trim()}
          className="comment-submit-button px-3 py-1.5 text-xs font-medium rounded-md focus:outline-none flex items-center"
        >
          {isSubmitting ? <Loader2 size={14} className="animate-spin mr-1.5" /> : <Send size={14} className="mr-1.5" />}
          {isSubmitting ? 'Submitting...' : 'Submit Comment'}
        </button>
      </form>

      {isLoading && (
        <div className="text-center py-4 text-[var(--text-muted)] text-sm flex-grow flex items-center justify-center">
          <Loader2 size={20} className="animate-spin inline mr-2" /> Loading comments...
        </div>
      )}

      <div className="flex-grow overflow-y-auto pr-1 space-y-3">
        {!isLoading && comments.length === 0 && !error && (
          <p className="text-sm text-[var(--text-muted)] text-center py-3">
            No comments yet. Be the first to leave one!
          </p>
        )}

        {!isLoading && comments.length > 0 && (
          <>
            {comments.map(comment => (
              <div key={comment.id} className="comment-item p-2 sm:p-2.5 rounded-md shadow-sm">
                <div className="flex items-start">
                  <div
                    className="comment-avatar w-7 h-7 sm:w-8 sm:h-8 rounded-full flex-shrink-0 mr-2 sm:mr-2.5 flex items-center justify-center text-sm font-semibold text-gray-700"
                    style={{ backgroundColor: comment.avatarColor }}
                    title={comment.author}
                  >
                    {comment.author.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-baseline justify-between">
                      <span className="font-semibold text-xs sm:text-sm text-[var(--editor-foreground)]">
                        {comment.author}
                      </span>
                      <span className="text-[0.65rem] sm:text-xs text-[var(--text-muted)]">
                         {formatTimestamp(comment.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--text-default)] mt-0.5 whitespace-pre-line break-words">
                      {comment.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
         <div ref={commentsEndRef} />
      </div>
    </div>
  );
};

export default RealtimeComments;
