import AddAccount from '../components/AddAccount';
import AccountsList from '../components/AccountsList';

function AccountsPage({ accounts, loading, error, onAccountAdded, onAccountsChanged }) {
  const activeAccounts = accounts.filter((account) => account.is_active);
  const activeBalance = activeAccounts.reduce(
    (total, account) => total + Number.parseFloat(account.current_balance || 0), 0
  );

  return (
    <main className="accounts-page">
      <header className="accounts-header">
        <div><p className="eyebrow">YOUR FINANCIAL UNIVERSE</p><h1>Accounts</h1><p className="accounts-subtitle">Keep every balance in one place.</p></div>
        <span className="accounts-header-orb" aria-hidden="true"><i /></span>
      </header>
      <section className="account-overview" aria-label="Account summary">
        <article className="account-overview-card account-overview-card--balance"><span className="overview-orbit" aria-hidden="true" /><p>Combined active balance</p><strong>₹{activeBalance.toFixed(2)}</strong><small>Across {activeAccounts.length} active {activeAccounts.length === 1 ? 'account' : 'accounts'}</small></article>
        <article className="account-overview-card"><span className="overview-icon">◌</span><p>Active accounts</p><strong>{activeAccounts.length}</strong><small>Ready to track</small></article>
      </section>
      <AddAccount onAccountAdded={onAccountAdded} />
      <AccountsList accounts={accounts} loading={loading} error={error} onAccountChanged={onAccountsChanged} />
    </main>
  );
}
export default AccountsPage;
