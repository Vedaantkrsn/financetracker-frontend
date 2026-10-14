import AddAccount from '../components/AddAccount';
import AccountsList from '../components/AccountsList';

function AccountsPage({ accounts, loading, error, onAccountAdded, onAccountsChanged }) {
  return (
    <div>
      <h2>Accounts</h2>
      <AddAccount onAccountAdded={onAccountAdded} />
      <AccountsList accounts={accounts} loading={loading} error={error} onAccountChanged={onAccountsChanged} />
    </div>
  );
}
export default AccountsPage;