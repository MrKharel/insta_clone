type Props = {
  stats: { label: string; value: number }[];
};

export const ProfileStats = ({ stats }: Props) => {
  return (
    <div className="flex gap-2 items-center flex-1 text-lg px-4">
      {stats.map(({ label, value }, index) => (
        <div key={index} className="flex flex-col items-center">
          <span className="font-bold">{value}</span>
          <span className="text-foreground/80">{label}</span>
        </div>
      ))}
    </div>
  );
};
