import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCampaigns } from '../context/CampaignContext';
import StatsCard from '../components/StatsCard';
import CampaignModal from '../components/CampaignModal';
import useWebSocket from '../hooks/useWebSocket';
import LiveIndicator from '../components/LiveIndicator';

const STATUS_COLORS = {
  active: '#16a34a',
  paused: '#d97706',
  completed: '#6b7280'
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { campaigns, loading, error, addCampaign, editCampaign, removeCampaign } = useCampaigns();

  // subscribe to all active campaign rooms
  const activeCampaignIds = campaigns
    .filter(c => c.status === 'active')
    .map(c => c._id);

  useWebSocket(activeCampaignIds);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.metrics.clicks, 0);
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.metrics.impressions, 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;

  const handleSave = async (form) => {
    if (editTarget) {
      await editCampaign(editTarget._id, form);
    } else {
      await addCampaign(form);
    }
  };

  const openEdit = (campaign) => {
    setEditTarget(campaign);
    setModalOpen(true);
  };

  const openCreate = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this campaign?')) return;
    await removeCampaign(id);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>adpulse</h1>
        <div className="header-right">
          <LiveIndicator />
          <span className="user-name">Hi, {user.name}</span>
          <button className="btn-secondary" onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        {error && <p className="error">{error}</p>}

        <div className="stats-grid">
          <StatsCard label="Active Campaigns" value={activeCampaigns} />
          <StatsCard
            label="Total Budget"
            value={`₹${totalBudget.toLocaleString()}`}
            sub={`₹${totalSpent.toLocaleString()} spent`}
          />
          <StatsCard label="Total Clicks" value={totalClicks.toLocaleString()} />
          <StatsCard
            label="Impressions"
            value={totalImpressions.toLocaleString()}
          />
        </div>

        <div className="section-header">
          <h2>Campaigns</h2>
          <button onClick={openCreate}>+ New Campaign</button>
        </div>

        {campaigns.length === 0 ? (
          <div className="empty-state">
            <p>No campaigns yet.</p>
            <button onClick={openCreate}>Create your first campaign</button>
          </div>
        ) : (
          <div className="campaign-table-wrapper">
            <table className="campaign-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Budget</th>
                  <th>Spent</th>
                  <th>Clicks</th>
                  <th>Impressions</th>
                  <th>CTR</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(c => (
                  <tr key={c._id}>
                    <td>{c.name}</td>
                    <td>
                      <span
                        className="badge"
                        style={{ background: STATUS_COLORS[c.status] }}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td>₹{c.budget.toLocaleString()}</td>
                    <td>₹{c.spent.toLocaleString()}</td>
                    <td>{c.metrics.clicks.toLocaleString()}</td>
                    <td>{c.metrics.impressions.toLocaleString()}</td>
                    <td>{c.ctr}%</td>
                    <td className="table-actions">
                      <button className="btn-ghost" onClick={() => openEdit(c)}>Edit</button>
                      <button className="btn-ghost btn-danger" onClick={() => handleDelete(c._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {modalOpen && (
        <CampaignModal
          campaign={editTarget}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;