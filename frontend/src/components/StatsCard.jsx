const StatsCard = ({ label, value, sub }) => (
  <div className="stats-card">
    <span className="stats-label">{label}</span>
    <span className="stats-value">{value}</span>
    {sub && <span className="stats-sub">{sub}</span>}
  </div>
);

export default StatsCard;