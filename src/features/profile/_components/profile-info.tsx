import { ProfileAvatar } from "./profile-avatar";

const DEFAULT_STATS = [
  { value: 0, label: "Posts" },
  { value: 0, label: "Followers" },
  { value: 0, label: "Following" },
];

type Props = {
  profile: { avatar_url: string | null; handle: string };
  stats: typeof DEFAULT_STATS;
};

export const ProfileInfo = ({ profile, stats }: Props) => {
  return (
    <div className="flex gap-6">
      <ProfileAvatar
        initials={profile.handle.slice(0, 2)}
        avatar_url={profile.avatar_url}
        size={1}
      />

      <div className="flex justify-between flex-wrap gap-2 w-full">
        {stats.map((stat, index) => (
          <div key={index} className="flex-1 w-full flex flex-col items-center">
            <p className="font-bold text-lg">{stat.value}</p>
            <span className="text-sm">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
