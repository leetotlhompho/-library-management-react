export default function StatCard({ title, value, caption }) {
  return (
    <div className="dashboard-card">
      <div className="card-content">
        <h2>{title}</h2>
        <p>{value}</p>
        <span>{caption}</span>
      </div>
    </div>
  );
}
