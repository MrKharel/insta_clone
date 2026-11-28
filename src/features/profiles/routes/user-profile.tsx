import { useUser } from "../hooks";

import { Profile } from "../_components/profile";
import { ProfileMetadata } from "../_components/profile-metadata";

export default function UserProfile() {
  const { data: profile, isFetching } = useUser();
  if (!profile || isFetching) return null;

  return (
    <>
      <Profile
        avatar_url={profile?.avatar_url}
        handle={profile?.handle}
        isUserProfile={true}
      />
      <ProfileMetadata
        handle={profile.handle}
        display_name={profile.display_name}
        bio={profile.bio}
        email={profile.email}
        website={profile.website}
        joined_at={profile.created_at}
      />
    </>
  );
}
