import LeaderboardCard from '../LeaderboardCard';

export default function LeaderboardList({ teams }) {
  return (
    <div className="flex flex-col gap-2.5">
      {teams.map((team) => (
        <LeaderboardCard key={team.id} team={team} />
      ))}
    </div>
  );
}
