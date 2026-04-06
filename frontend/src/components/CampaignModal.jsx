import { useState, useEffect } from 'react';

const EMPTY_FORM = {
  name: '',
  budget: '',
  status: 'active',
  startDate: '',
  endDate: ''
};

const CampaignModal = ({ campaign, onSave, onClose }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (campaign) {
      setForm({
        name: campaign.name,
        budget: campaign.budget,
        status: campaign.status,
        startDate: campaign.startDate?.slice(0, 10) || '',
        endDate: campaign.endDate?.slice(0, 10) || ''
      });
    }
  }, [campaign]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{campaign ? 'Edit Campaign' : 'New Campaign'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Campaign Name</label>
          <input
            name="name"
            placeholder="e.g. Summer Sale"
            value={form.name}
            onChange={handleChange}
            required
          />
          <label>Budget (₹)</label>
          <input
            name="budget"
            type="number"
            placeholder="5000"
            value={form.budget}
            onChange={handleChange}
            min="0"
            required
          />
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
          <label>Start Date</label>
          <input
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            required
          />
          <label>End Date</label>
          <input
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={handleChange}
          />
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampaignModal;