import { useEffect, useRef, useState } from "react";
import { useCreatePost } from "../hooks";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";

import type { SubmitEvent } from "react";

const MAX_IMAGES = 10;

type ImageItem = {
  id: string;
  file: File;
  url: string;
  alt: string;
};

export const CreatePost = () => {
  const { mutate: create, isPending } = useCreatePost();

  const [caption, setCaption] = useState("");
  const [items, setItems] = useState<ImageItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<ImageItem[]>([]);
  itemsRef.current = items;

  // Revoke any remaining object URLs on unmount
  useEffect(() => {
    return () => {
      itemsRef.current.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, []);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const picked = Array.from(fileList);
    const images = picked.filter((file) => file.type.startsWith("image/"));

    if (images.length !== picked.length) {
      setError("Only image files are supported.");
    } else {
      setError(null);
    }

    setItems((prev) => {
      const room = MAX_IMAGES - prev.length;
      if (images.length > room) {
        setError(`You can attach up to ${MAX_IMAGES} images.`);
      }
      const added = images.slice(0, Math.max(room, 0)).map((file) => ({
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
        alt: "",
      }));
      return [...prev, ...added];
    });

    // allow re-selecting the same file
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((item) => item.id !== id);
    });
    setError(null);
  };

  const setAlt = (id: string, alt: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, alt } : item)),
    );
  };

  const reset = () => {
    items.forEach((item) => URL.revokeObjectURL(item.url));
    setItems([]);
    setCaption("");
    setError(null);
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (items.length === 0) {
      setError("Add at least one image.");
      return;
    }

    try {
      create({
        caption: caption === "" ? null : caption,
        images: items.map((item) => item.file),
        altTexts: items.map((item) => (item.alt === "" ? null : item.alt)),
      });
      reset();
    } catch {
      setError("Something went wrong while creating your post.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <FieldSet>
        <FieldLegend>Create post</FieldLegend>

        <FieldGroup>
          <Field data-invalid={!!error}>
            <Label htmlFor="post-images">Images</Label>
            <Input
              ref={inputRef}
              id="post-images"
              type="file"
              accept="image/*"
              multiple
              disabled={isPending || items.length >= MAX_IMAGES}
              aria-invalid={!!error}
              onChange={(e) => handleFiles(e.target.files)}
            />
            <FieldDescription>
              Up to {MAX_IMAGES} images ({items.length}/{MAX_IMAGES}).
            </FieldDescription>
            {error && <FieldError>{error}</FieldError>}
          </Field>

          {items.length > 0 && (
            <ul className="grid gap-4">
              {items.map((item, index) => (
                <li
                  key={item.id}
                  className="flex gap-3 rounded-lg border border-border bg-card p-3 text-card-foreground"
                >
                  <img
                    src={item.url}
                    alt={item.alt || `Selected image ${index + 1}`}
                    className="size-24 shrink-0 rounded-md border border-border bg-muted object-cover"
                  />

                  <Field className="min-w-0 flex-1">
                    <Label htmlFor={`alt-${item.id}`}>Alt text</Label>
                    <Input
                      id={`alt-${item.id}`}
                      value={item.alt}
                      placeholder="Describe this image"
                      disabled={isPending}
                      onChange={(e) => setAlt(item.id, e.target.value)}
                    />
                    <FieldDescription className="truncate">
                      {item.file.name}
                    </FieldDescription>
                  </Field>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove image ${index + 1}`}
                    disabled={isPending}
                    onClick={() => removeItem(item.id)}
                  >
                    <X />
                  </Button>
                </li>
              ))}
            </ul>
          )}

          <Field>
            <Label htmlFor="post-caption">Caption</Label>
            <Textarea
              id="post-caption"
              value={caption}
              placeholder="Write a caption (optional)"
              disabled={isPending}
              onChange={(e) => setCaption(e.target.value)}
            />
          </Field>

          <Field orientation="horizontal">
            <Button type="submit" disabled={isPending || items.length === 0}>
              {isPending ? "Posting..." : "Post"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isPending || (items.length === 0 && caption === "")}
              onClick={reset}
            >
              Clear
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};
