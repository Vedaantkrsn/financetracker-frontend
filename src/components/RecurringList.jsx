import { useState } from 'react';
import api from '../api/axios';

const parse = (d) => new Date(`${d}T00:00:00`);
const fmt = (d) =>
  parse(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

function RecurringList({ items, accounts, onEdit, onChanged, onPosted }) {
  const [busyId, setBusyId] = useState(null);
  const [overrides, setOverrides] = useState({});
  const [error, setError] = useState('');

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysUntil = (d) => Math.round((parse(d) - today) / 86400000);

  const getAccountName = (id) => accounts.find((a) => a.id === id)?.name || 'Unknown';

  const run = async (id, request) => {
    setBusyId(id);
    setError('');
    try {
      await request();
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong');
      return false;
    } finally {
      setBusyId(null);
    }
    return true;
  };

  const handlePost = async (item) => {
    const amount = overrides[item.id];
    const body = amount ? { amount } : {};
    if (await run(item.id, () => api.post(`recurring/${item.id}/post/`, body))) {
      setOverrides({ ...overrides, [item.id]: '' });
      onPosted();
    }
  };

  const handleSkip = async (item) => {
    if (await run(item.id, () => api.post(`recurring/${item.id}/skip/`))) onChanged();
  };

  const handleToggle = async (item) => {
    if (await run(item.id, () => api.patch(`recurring/${item.id}/`, { is_active: !item.is_active }))) onChanged();
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"? Transactions already posted from it are kept.`)) return;
    if (await run(item.id, () => api.delete(`recurring/${item.id}/`))) onChanged();
  };

  const active = items
    .filter((i) => i.is_active)
    .sort((a, b) => a.next_due_date.localeCompare(b.next_due_date));
  const paused = items.filter((i) => !i.is_active);

  const monthlyTotal = (type) =>
    active
      .filter((i) => i.transaction_type === type)
      .reduce((sum, i) => sum + parseFloat(i.monthly_cost), 0);

  const dueBadge = (item) => {
    const d = daysUntil(item.next_due_date);
    if (d < 0) return <strong style={{ color: 'red' }}> Overdue by {-d}d</strong>;
    if (d === 0) return <strong style={{ color: 'orange' }}> Due today</strong>;
    if (d <= 30) return <span style={{ color: 'orange' }}> Due in {d}d</span>;
    return null;
  };

  const renderItem = (item) => {
    const busy = busyId === item.id;
    return (
      <li key={item.id} style={{ marginBottom: '12px' }}>
        <div>
          <strong>{item.name}</strong> — {item.transaction_type} ₹{item.amount} {item.frequency} · {getAccountName(item.account)}
        </div>
        <div>
          Next: {fmt(item.next_due_date)}{item.is_active && dueBadge(item)}
          {' '}· ₹{item.monthly_cost}/mo · ₹{item.yearly_cost}/yr ·{' '}
          {item.transaction_type === 'income' ? 'received' : 'paid'} so far ₹{item.lifetime_total}
        </div>
        {item.is_active && (
          <>
            <input
              type="number" step="0.01" placeholder={`Amount (${item.amount})`}
              value={overrides[item.id] || ''}
              onChange={(e) => setOverrides({ ...overrides, [item.id]: e.target.value })}
            />
            <button type="button" disabled={busy} onClick={() => handlePost(item)}>Post</button>
            <button type="button" disabled={busy} onClick={() => handleSkip(item)}>Skip</button>
          </>
        )}
        <button type="button" disabled={busy} onClick={() => handleToggle(item)}>
          {item.is_active ? 'Pause' : 'Resume'}
        </button>
        <button type="button" onClick={() => onEdit(item)}>Edit</button>
        <button type="button" disabled={busy} onClick={() => handleDelete(item)}>Delete</button>
      </li>
    );
  };

  return (
    <div>
      <h3>Recurring items</h3>
      <p>
        Per month: ₹{monthlyTotal('expense').toFixed(2)} out · ₹{monthlyTotal('income').toFixed(2)} in
      </p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {active.length === 0 ? <p>No active recurring items.</p> : <ul>{active.map(renderItem)}</ul>}
      {paused.length > 0 && (
        <details>
          <summary>Paused or finished ({paused.length})</summary>
          <ul>{paused.map(renderItem)}</ul>
        </details>
      )}
    </div>
  );
}

export default RecurringList;