import { useParams } from "react-router";
import {
  useQueryProfile,
  useFollowUser,
  useUnfollowUser,
  useFollowers,
  useFollowings,
} from "./hooks";

import { ProfileInfo } from "./_components/profile-info";
import { ProfileMetadata } from "./_components/profile-metadata";
import { ProfileLoading } from "./_components/profile-loading";
import { Button } from "@/components/ui/button";

export const PublicProfile = () => {
  const { id } = useParams();
  const { data: profile, isLoading } = useQueryProfile(id ?? "");
  // No argument: rows where follower_id = me, i.e. the people I follow.
  const { data: myFollowings, isLoading: followingsLoading } = useFollowers();
  const { data: followers } = useFollowers(id);
  const { data: followings } = useFollowings(id);
  const { mutate: follow, isPending: isFollowing } = useFollowUser();
  const { mutate: unfollow, isPending: isUnfollowing } = useUnfollowUser();

  if (!profile || isLoading) {
    return <ProfileLoading />;
  }

  // Derived from the query cache, so optimistic updates show up immediately.
  const isFollowedByUser =
    myFollowings?.some((f) => f.following_id === profile.id) ?? false;

  const handleFollowToggle = () => {
    if (isFollowedByUser) {
      unfollow(profile.id);
    } else {
      follow(profile.id);
    }
  };

  return (
    <>
      <ProfileInfo
        profile={{ ...profile }}
        stats={[
          { value: 0, label: "Posts" },
          { value: followers ? followers.length : 0, label: "Followers" },
          { value: followings ? followings.length : 0, label: "Following" },
        ]}
      />
      <ProfileMetadata metadata={{ ...profile }} />
      {!followingsLoading && (
        <div className="w-full mt-4 flex flex-col gap-2">
          <Button
            variant="default"
            className="w-full"
            disabled={isFollowing || isUnfollowing}
            onClick={handleFollowToggle}
          >
            {isFollowedByUser ? "Unfollow" : "Follow"}
          </Button>
          <Button variant="outline" className="w-full">
            Message
          </Button>
        </div>
      )}
    </>
  );
};
