import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

import { useLikePost, useLikeStatus, useUnlikePost } from "../hooks";
import type { Post } from "../types";

type PostItemProps = {
  post: Post;
};

export const PostItem = ({ post }: PostItemProps) => {
  const { data: status, isLoading } = useLikeStatus(post.id);
  const likeMutation = useLikePost();
  const unlikeMutation = useUnlikePost();

  const liked = status?.liked ?? false;
  const count = status?.count ?? 0;
  const isPending = likeMutation.isPending || unlikeMutation.isPending;

  const images = [...post.images].sort((a, b) => a.position - b.position);

  const toggleLike = () => {
    if (liked) {
      unlikeMutation.mutate(post.id);
    } else {
      likeMutation.mutate(post.id);
    }
  };

  return (
    <Card className="w-full max-w-xl overflow-hidden">
      {images.length > 0 && (
        <div className="flex snap-x snap-mandatory overflow-x-auto bg-muted">
          {images.map((image) => (
            <img
              key={image.id}
              src={image.url}
              alt={image.alt_text ?? ""}
              width={image.width ?? undefined}
              height={image.height ?? undefined}
              loading="lazy"
              className="max-h-[32rem] w-full shrink-0 snap-center object-contain"
            />
          ))}
        </div>
      )}

      <CardFooter className="gap-1 pt-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={liked ? "Unlike post" : "Like post"}
          aria-pressed={liked}
          disabled={isLoading || isPending}
          onClick={toggleLike}
        >
          <Heart
            className={liked ? "fill-destructive text-destructive" : undefined}
          />
        </Button>
        <span className="text-sm tabular-nums text-muted-foreground">
          {count}
        </span>
      </CardFooter>

      <CardContent className="space-y-1">
        {post.caption && <p className="text-sm">{post.caption}</p>}
        <CardDescription>
          <time dateTime={post.created_at}>
            {new Date(post.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
        </CardDescription>
      </CardContent>
    </Card>
  );
};
