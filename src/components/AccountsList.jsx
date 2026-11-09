import api from '../api/axios';

function AccountsList({ accounts, loading, error, onAccountChanged }) {
  const active = accounts.filter((a) => a.is_active);
  const inactive = accounts.filter((a) => !a.is_active);

  const toggleActive = async (acc) => {
    await api.patch(`accounts/${acc.id}/`, { is_active: !acc.is_active });
    onAccountChanged();
  };

  const renderAccount = (acc) => (
    <li className={`account-card ${acc.is_active ? '' : 'account-card--inactive'}`} key={acc.id}>
      <div className="account-card-top"><span className={`account-type-orb account-type-orb--${acc.account_type}`} aria-hidden="true">{acc.account_type === 'cash' ? '₹' : acc.account_type === 'investment' ? '⌁' : acc.account_type === 'credit_card' ? '▤' : acc.account_type === 'wallet' ? '◉' : '◌'}</span><span className={`account-status ${acc.is_active ? '' : 'account-status--inactive'}`}>{acc.is_active ? 'Active' : 'Paused'}</span></div>
      <div className="account-card-copy"><small>{acc.account_type.replace('_', ' ')}</small><h3>{acc.name}</h3>{acc.institution && <p>{acc.institution}</p>}</div>
      <div className="account-balance-row"><span>Current balance</span><strong>₹{Number.parseFloat(acc.current_balance || 0).toFixed(2)}</strong></div>
      <button className="account-toggle" onClick={() => toggleActive(acc)}>
        {acc.is_active ? 'Deactivate' : 'Reactivate'}
      </button>
    </li>
  );

  if (loading) return <section className="account-list-panel"><p className="account-empty">Loading accounts...</p></section>;
  if (error) return <section className="account-list-panel"><p className="account-error">{error}</p></section>;

  return (
    <section className="account-list-panel">
      <div className="account-list-heading"><div><p className="eyebrow">CONNECTED POCKETS</p><h2>Your accounts</h2></div><span className="count-pill">{active.length} active</span></div>
      {active.length === 0 ? <p className="account-empty">No active accounts yet. Add one above to get started.</p> : <ul className="account-grid">{active.map(renderAccount)}</ul>}

      {inactive.length > 0 && (
        <details className="inactive-accounts">
          <summary>Paused accounts <span>{inactive.length}</span></summary>
          <ul className="account-grid">{inactive.map(renderAccount)}</ul>
        </details>
      )}
    </section>
  );
}

export default AccountsList;
