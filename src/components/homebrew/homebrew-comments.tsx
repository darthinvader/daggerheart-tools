/**
 * Homebrew Comments
 *
 * Displays and manages comments for a homebrew item.
 */
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { useAuth } from '@/components/providers';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  useAddHomebrewComment,
  useDeleteHomebrewComment,
  useHomebrewComments,
} from '@/features/homebrew';
import { cn } from '@/lib/utils';

interface HomebrewCommentsProps {
  homebrewId: string;
}

function formatAuthorLabel(authorId: string, currentUserId?: string) {
  if (currentUserId && authorId === currentUserId) return 'You';
  return `User ${authorId.slice(0, 6)}`;
}

export function HomebrewComments({ homebrewId }: HomebrewCommentsProps) {
  const { user } = useAuth();
  const [draft, setDraft] = useState('');
  const { data: comments = [], isLoading } = useHomebrewComments(homebrewId);
  const addComment = useAddHomebrewComment();
  const deleteComment = useDeleteHomebrewComment();

  const canSubmit = useMemo(() => draft.trim().length > 0, [draft]);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    await addComment.mutateAsync({ homebrewId, body: draft.trim() });
    setDraft('');
  };

  return (
    <section className="space-y-3 rounded-lg border border-slate-500/20 bg-slate-500/5 p-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="size-4 text-slate-500" />
        <h3 className="text-sm font-semibold">Comments</h3>
        <span className="text-muted-foreground text-xs">{comments.length}</span>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No comments yet. Start the discussion.
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map(comment => {
            const isOwner = user?.id === comment.authorId;
            return (
              <div
                key={comment.id}
                className="bg-background/60 space-y-1 rounded-md border p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-muted-foreground text-xs font-medium">
                    {formatAuthorLabel(comment.authorId, user?.id)}
                  </div>
                  {isOwner && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive h-6 w-6"
                      onClick={() =>
                        deleteComment.mutateAsync({
                          commentId: comment.id,
                          homebrewId,
                        })
                      }
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  )}
                </div>
                <p className="text-sm leading-relaxed">{comment.body}</p>
                <div className="text-muted-foreground text-xs">
                  {new Date(comment.createdAt).toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="space-y-2">
        <Textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder={
            user ? 'Leave a comment...' : 'Sign in to leave a comment.'
          }
          rows={2}
          disabled={!user}
          className="resize-none"
        />
        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={!user || addComment.isPending || !canSubmit}
            className={cn('gap-2')}
          >
            <Send className="size-3" />
            {addComment.isPending ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </div>
    </section>
  );
}
