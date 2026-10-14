import api from '../api/axios';

function AccountsList({ accounts, loading, error, onAccountChanged }) {
  const active = accounts.filter((a) => a.is_active);
  const inactive = accounts.filter((a) => !a.is_active);

  const toggleActive = async (acc) => {
    await api.patch(`accounts/${acc.id}/`, { is_active: !acc.is_active });
    onAccountChanged();
  };

  const renderAccount = (acc) => (
    <li key={acc.id}>
      {acc.name} ({acc.account_type}) — ₹{acc.current_balance}
      <button onClick={() => toggleActive(acc)}>
        {acc.is_active ? 'Deactivate' : 'Reactivate'}
      </button>
    </li>
  );

  if (loading) return <p>Loading accounts...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Your Accounts</h2>
      {active.length === 0 ? <p>No active accounts.</p> : <ul>{active.map(renderAccount)}</ul>}

      {inactive.length > 0 && (
        <details>
          <summary>Deactivated ({inactive.length})</summary>
          <ul>{inactive.map(renderAccount)}</ul>
        </details>
      )}
    </div>
  );
}

export default AccountsList;