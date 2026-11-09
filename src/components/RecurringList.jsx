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
    if (d < 0) return <strong className="due-badge due-badge--overdue">Overdue by {-d}d</strong>;
    if (d === 0) return <strong className="due-badge due-badge--today">Due today</strong>;
    if (d <= 30) return <span className="due-badge due-badge--soon">Due in {d}d</span>;
    return null;
  };

  const renderItem = (item) => {
    const busy = busyId === item.id;
    return (
      <li className={`recurring-card ${item.is_active ? '' : 'recurring-card--paused'}`} key={item.id}>
        <div className="recurring-card-top"><span className={`recurring-item-orb recurring-item-orb--${item.transaction_type}`} aria-hidden="true">{item.transaction_type === 'income' ? '↙' : '↗'}</span><span className={`recurring-item-status ${item.is_active ? '' : 'recurring-item-status--paused'}`}>{item.is_active ? 'Active' : 'Paused'}</span></div>
        <div className="recurring-item-title"><div><h3>{item.name}</h3><p>{item.frequency} · {getAccountName(item.account)}</p></div>{item.is_active && dueBadge(item)}</div>
        <strong className={`recurring-amount recurring-amount--${item.transaction_type}`}>{item.transaction_type === 'income' ? '+' : '−'}₹{item.amount}<small> / {item.frequency === 'monthly' ? 'month' : item.frequency === 'weekly' ? 'week' : 'year'}</small></strong>
        <div className="recurring-next"><span>Next {item.transaction_type === 'income' ? 'deposit' : 'payment'}</span><strong>{fmt(item.next_due_date)}</strong></div>
        <div className="recurring-metrics"><span>₹{item.monthly_cost}<small>/mo</small></span><span>₹{item.yearly_cost}<small>/yr</small></span><span>₹{item.lifetime_total}<small> {item.transaction_type === 'income' ? 'received' : 'paid'}</small></span></div>
        {item.is_active && (
          <div className="recurring-post-controls">
            <input
              type="number" step="0.01" aria-label={`Override amount for ${item.name}`} placeholder={`Amount (${item.amount})`}
              className="recurring-override"
              value={overrides[item.id] || ''}
              onChange={(e) => setOverrides({ ...overrides, [item.id]: e.target.value })}
            />
            <button className="recurring-action recurring-action--post" type="button" disabled={busy} onClick={() => handlePost(item)}>Post now</button>
            <button className="recurring-action" type="button" disabled={busy} onClick={() => handleSkip(item)}>Skip</button>
          </div>
        )}
        <div className="recurring-card-actions"><button className="recurring-action" type="button" disabled={busy} onClick={() => handleToggle(item)}>
          {item.is_active ? 'Pause' : 'Resume'}
        </button>
        <button className="recurring-action" type="button" onClick={() => onEdit(item)}>Edit</button>
        <button className="recurring-action recurring-action--delete" type="button" disabled={busy} onClick={() => handleDelete(item)}>Delete</button></div>
      </li>
    );
  };

  return (
    <section className="recurring-list-panel">
      <div className="recurring-summary">
        <article className="recurring-summary-card"><span className="recurring-summary-icon recurring-summary-icon--expense">↗</span><div><small>Monthly outflow</small><strong>₹{monthlyTotal('expense').toFixed(2)}</strong></div></article>
        <article className="recurring-summary-card"><span className="recurring-summary-icon recurring-summary-icon--income">↙</span><div><small>Monthly inflow</small><strong>₹{monthlyTotal('income').toFixed(2)}</strong></div></article>
      </div>
      <div className="recurring-list-heading"><div><p className="eyebrow">REPEATING ACTIVITY</p><h2>Recurring items</h2></div><span className="count-pill">{active.length} active</span></div>
      {error && <p className="recurring-error">{error}</p>}
      {active.length === 0 ? <p className="recurring-empty">No active recurring items.</p> : <ul className="recurring-grid">{active.map(renderItem)}</ul>}
      {paused.length > 0 && (
        <details className="paused-recurring">
          <summary>Paused items <span>{paused.length}</span></summary>
          <ul className="recurring-grid">{paused.map(renderItem)}</ul>
        </details>
      )}
    </section>
  );
}

export default RecurringList;
