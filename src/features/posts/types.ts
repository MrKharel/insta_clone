export type PostImage = {
  id: string;
  post_id: string;
  storage_path: string;
  url: string;
  position: number;
  alt_text: string | null;
  width: number | null;
  height: number | null;
};

export type Post = {
  id: string;
  profile_id: string;
  caption: string | null;
  created_at: string;
  updated_at: string;
  images: PostImage[];
};

export type ActionResult<T> =
  { ok: true; data: T } | { ok: false; error: string };

export type PostsPage = {
  posts: Post[];
  nextCursor: string | null;
};
