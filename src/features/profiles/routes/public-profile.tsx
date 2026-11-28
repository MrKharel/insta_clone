import { Navigate, useParams } from "react-router";
import { useUser, useUserWithId } from "../hooks";

import { Profile } from "../_components/profile";
import { ProfileMetadata } from "../_components/profile-metadata";
import { Button } from "@/components/ui/button";

export default function PublicProfile() {
  const { id } = useParams();
  if (!id) return <>Unexpected error occurred. Please try again later.</>;

  const { data: user, isPending, error } = useUserWithId(id);
  const me = useUser();

  if (isPending || me.isPending) return <>Loading...</>;
  if (error) return <pre>{error.message}</pre>;
  if (me.error) return <pre>{me.error.message}</pre>;
  if (!user) return <>No such user</>;
  if (!me.data) return <>No such user</>;
  if (me.data.id === user.id) return <Navigate to="/app/profile" replace />;

  return (
    <>
      <Profile
        avatar_url={user?.avatar_url}
        handle={user?.handle}
        isUserProfile={false}
      />
      <ProfileMetadata
        handle={user.handle}
        display_name={user.display_name}
        bio={user.bio}
        email={user.email}
        website={user.website}
        joined_at={user.created_at}
      />
      <Button>Follow</Button>
    </>
  );
}
