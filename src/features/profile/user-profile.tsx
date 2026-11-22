import { useState } from "react";
import { useProfile } from "./hooks";

import { Button } from "@/components/ui/button";
import { ProfileMetadata } from "./_components/profile-metadata";
import { ProfileInfo } from "./_components/profile-info";
import { EditProfile } from "./_components/edit-profile";
import { ProfileLoading } from "./_components/profile-loading";

export const UserProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const { isLoading, data: profile } = useProfile();

  if (isLoading || !profile) {
    return <ProfileLoading />;
  }

  return (
    <>
      <ProfileInfo
        profile={{ ...profile }}
        stats={[
          { value: 0, label: "Posts" },
          { value: 0, label: "Followers" },
          { value: 0, label: "Following" },
        ]}
      />

      {editMode ? (
        <EditProfile
          onCancel={() => setEditMode(false)}
          onSaved={() => setEditMode(false)}
        />
      ) : (
        <>
          <ProfileMetadata metadata={{ ...profile }} />
          <Button
            variant={"outline"}
            onClick={() => setEditMode(true)}
            className={"mt-6"}
          >
            Edit Profile
          </Button>
        </>
      )}
    </>
  );
};
