import { useState, useRef, useEffect, useMemo } from "react";
import { useUserMutation } from "../hooks";

import { CameraIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Dispatch, SetStateAction } from "react";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  initials: string;
  avatar_url: string | null;
};

export const ChangeAvatar = ({
  open,
  setOpen,
  initials,
  avatar_url,
}: Props) => {
  const { mutate, isPending } = useUserMutation();

  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const preview = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );

  useEffect(() => {
    return () => {
      preview && URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (picked) setFile(picked);
  };

  const handleSave = async () => {
    if (!file) return;
    mutate({ avatar_url: file }, { onSuccess: () => handleOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Change profile picture</DialogTitle>
          <DialogDescription>
            Pick an image, check the preview, then save.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-2">
          <Avatar className="size-32">
            <AvatarImage
              src={preview ?? avatar_url ?? undefined}
              alt="Preview"
            />
            <AvatarFallback className="bg-muted text-4xl text-muted-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
          >
            <CameraIcon />
            {file ? "Choose a different image" : "Choose image"}
          </Button>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!file || isPending}
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
