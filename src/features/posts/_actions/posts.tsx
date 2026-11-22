import { supabase } from "@/lib/supabase";
import type { ActionResult, Post, PostsPage } from "../types";

const BUCKET = "post-images";
const MAX_IMAGES = 10;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // keep in sync with the bucket limit
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const POST_SELECT =
  "id, profile_id, caption, created_at, updated_at, post_images(id, post_id, storage_path, position, alt_text, width, height)";

export type PostRow = {
  id: string;
  profile_id: string;
  caption: string | null;
  created_at: string;
  updated_at: string;
  post_images: {
    id: string;
    post_id: string;
    storage_path: string;
    position: number;
    alt_text: string | null;
    width: number | null;
    height: number | null;
  }[];
};

export type CreatePostInput = {
  caption?: string | null;
  images: File[];
  altTexts?: (string | null)[]; // same order as images
};

export type UpdatePostInput = {
  id: string;
  caption?: string | null;
  newImages?: File[];
  newAltTexts?: (string | null)[]; // same order as newImages
  removeImageIds?: string[];
};

function toPost(row: PostRow): Post {
  const { post_images, ...rest } = row;
  return {
    ...rest,
    images: [...post_images]
      .sort((a, b) => a.position - b.position)
      .map((img) => ({
        ...img,
        url: supabase.storage.from(BUCKET).getPublicUrl(img.storage_path).data
          .publicUrl,
      })),
  };
}

async function fetchPost(id: string) {
  const { data, error } = await supabase
    .from("post")
    .select(POST_SELECT)
    .eq("id", id)
    .maybeSingle<PostRow>();

  if (error) return { post: null, error: error.message };
  if (!data) return { post: null, error: "Post not found" };
  return { post: toPost(data), error: null };
}

function validateFiles(files: File[]): string | null {
  for (const file of files) {
    if (!(file.type in EXTENSIONS)) {
      return `Unsupported file type: ${file.type || "unknown"}`;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return `${file.name} is larger than 5 MB`;
    }
  }
  return null;
}

async function uploadFiles(profileId: string, postId: string, files: File[]) {
  const uploaded: string[] = [];

  for (const file of files) {
    const path = `${profileId}/${postId}/${crypto.randomUUID()}.${EXTENSIONS[file.type]}`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type });

    if (error) {
      if (uploaded.length > 0) {
        await supabase.storage.from(BUCKET).remove(uploaded);
      }
      return { paths: null, error: error.message };
    }
    uploaded.push(path);
  }

  return { paths: uploaded, error: null };
}

// ---------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------
export async function createPost(
  input: CreatePostInput,
): Promise<ActionResult<Post>> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const { images, altTexts = [] } = input;
  const caption = input.caption ?? null;

  if (images.length === 0) {
    return { ok: false, error: "At least one image is required" };
  }
  if (images.length > MAX_IMAGES) {
    return { ok: false, error: `You can upload up to ${MAX_IMAGES} images` };
  }
  const fileError = validateFiles(images);
  if (fileError) return { ok: false, error: fileError };

  const postId = crypto.randomUUID();

  const { error: postError } = await supabase
    .from("post")
    .insert({ id: postId, profile_id: user.id, caption });
  if (postError) return { ok: false, error: postError.message };

  const { paths, error: uploadError } = await uploadFiles(
    user.id,
    postId,
    images,
  );
  if (!paths) {
    await supabase.from("post").delete().eq("id", postId);
    return { ok: false, error: uploadError ?? "Upload failed" };
  }

  const { error: imagesError } = await supabase.from("post_images").insert(
    paths.map((storage_path, position) => ({
      post_id: postId,
      storage_path,
      position,
      alt_text: altTexts[position] ?? null,
    })),
  );
  if (imagesError) {
    await supabase.storage.from(BUCKET).remove(paths);
    await supabase.from("post").delete().eq("id", postId);
    return { ok: false, error: imagesError.message };
  }

  const { post, error } = await fetchPost(postId);
  if (!post) return { ok: false, error: error ?? "Post not found" };
  return { ok: true, data: post };
}

// ---------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------
export async function getPosts(params?: {
  profileId?: string;
  limit?: number;
  cursor?: string; // created_at of the last post from the previous page
}): Promise<ActionResult<PostsPage>> {
  const limit = params?.limit ?? 20;

  let query = supabase
    .from("post")
    .select(POST_SELECT)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (params?.profileId) query = query.eq("profile_id", params.profileId);
  if (params?.cursor) query = query.lt("created_at", params.cursor);

  const { data, error } = await query.returns<PostRow[]>();
  if (error) return { ok: false, error: error.message };

  const posts = data.map(toPost);
  const nextCursor =
    posts.length === limit ? posts[posts.length - 1].created_at : null;

  return { ok: true, data: { posts, nextCursor } };
}

export async function getPost(id: string): Promise<ActionResult<Post>> {
  const { post, error } = await fetchPost(id);
  if (!post) return { ok: false, error: error ?? "Post not found" };
  return { ok: true, data: post };
}

// ---------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------
export async function updatePost(
  input: UpdatePostInput,
): Promise<ActionResult<Post>> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const { id, newImages = [], newAltTexts = [] } = input;

  const { post: existing, error: fetchError } = await fetchPost(id);
  if (!existing) return { ok: false, error: fetchError ?? "Post not found" };
  if (existing.profile_id !== user.id) {
    return { ok: false, error: "You can only edit your own posts" };
  }

  const caption =
    input.caption !== undefined ? input.caption : existing.caption;
  const removeIds = new Set(input.removeImageIds ?? []);

  const toRemove = existing.images.filter((img) => removeIds.has(img.id));
  const remainingCount = existing.images.length - toRemove.length;

  if (remainingCount + newImages.length < 1) {
    return { ok: false, error: "A post needs at least one image" };
  }
  if (remainingCount + newImages.length > MAX_IMAGES) {
    return { ok: false, error: `A post can have up to ${MAX_IMAGES} images` };
  }
  const fileError = validateFiles(newImages);
  if (fileError) return { ok: false, error: fileError };

  // 1. upload and insert new images
  if (newImages.length > 0) {
    const { paths, error: uploadError } = await uploadFiles(
      user.id,
      id,
      newImages,
    );
    if (!paths) return { ok: false, error: uploadError ?? "Upload failed" };

    const startPosition =
      existing.images.reduce((max, img) => Math.max(max, img.position), -1) + 1;

    const { error: insertError } = await supabase.from("post_images").insert(
      paths.map((storage_path, i) => ({
        post_id: id,
        storage_path,
        position: startPosition + i,
        alt_text: newAltTexts[i] ?? null,
      })),
    );
    if (insertError) {
      await supabase.storage.from(BUCKET).remove(paths);
      return { ok: false, error: insertError.message };
    }
  }

  // 2. update the post itself (the trigger bumps updated_at)
  const { error: updateError } = await supabase
    .from("post")
    .update({ caption })
    .eq("id", id);
  if (updateError) return { ok: false, error: updateError.message };

  // 3. remove images the user dropped
  if (toRemove.length > 0) {
    const { error: removeError } = await supabase
      .from("post_images")
      .delete()
      .in(
        "id",
        toRemove.map((img) => img.id),
      );
    if (removeError) return { ok: false, error: removeError.message };

    await supabase.storage
      .from(BUCKET)
      .remove(toRemove.map((img) => img.storage_path));
  }

  const { post, error } = await fetchPost(id);
  if (!post) return { ok: false, error: error ?? "Post not found" };
  return { ok: true, data: post };
}
