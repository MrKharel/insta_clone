import { useParams } from "react-router";
import { useQueryProfile } from "./hooks";

import { ProfileInfo } from "./_components/profile-info";
import { ProfileMetadata } from "./_components/profile-metadata";
import { ProfileLoading } from "./_components/profile-loading";
import { Button } from "@/components/ui/button";

export const PublicProfile = () => {
  const { id } = useParams();
  const { data: profile, isLoading } = useQueryProfile(id ?? "");

  if (!profile || isLoading) {
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
      <ProfileMetadata metadata={{ ...profile }} />
      <div className="w-full mt-4 flex flex-col gap-2">
        <Button variant={"default"} className="w-full">
          Follow
        </Button>
        <Button variant={"outline"} className="w-full">
          Message
        </Button>
      </div>
    </>
  );
};
