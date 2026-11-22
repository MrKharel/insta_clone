import { useState } from "react";

import { ProfileInfo } from "./_components/profile-info";
import { EditProfile } from "./_components/edit-profile";

export const Profile = () => {
  const [editMode, setEditMode] = useState(false);

  if (editMode) {
    return <EditProfile onCancel={() => setEditMode(false)} onSaved={() => setEditMode(false)} />;
  }
  return <ProfileInfo setEditMode={setEditMode} />;
};
