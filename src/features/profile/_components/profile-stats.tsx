const POSTS = 0;
const FOLLOWERS = 0;
const FOLLOWING = 0;

const STATS = [
  { label: "posts", value: POSTS },
  { label: "followers", value: FOLLOWERS },
  { label: "following", value: FOLLOWING },
];

export const ProfileStats = () => {
  return (
    <ul className="flex gap-6 md:gap-10">
      {STATS.map(({ label, value }) => (
        <li key={label} className="text-sm text-foreground md:text-base">
          <span className="font-semibold">{value.toLocaleString()}</span>{" "}
          <span className="text-muted-foreground">{label}</span>
        </li>
      ))}
    </ul>
  );
};
