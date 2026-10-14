function Dashboard({ accounts, transactions }) {

  const activeAccounts = accounts.filter((a) => a.is_active);
  const totalBalance = activeAccounts.reduce(
    (sum,acc) => sum + parseFloat(acc.current_balance), 0
  );

  const now=new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthTransactions = transactions.filter((t) => {
    const tDate = new Date(t.date);
    return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
  });


  const totalIncome = thisMonthTransactions
    .filter((t) => t.transaction_type === 'income')
    .reduce((sum,t) => sum + parseFloat(t.amount), 0);
  const totalExpense = thisMonthTransactions
    .filter((t) => t.transaction_type === 'expense')
    .reduce((sum,t) => sum + parseFloat(t.amount), 0);


  const netCashFlow = totalIncome - totalExpense;
  const recentTransactions = transactions.slice(0,10);

  const getAccountName = (id) => {
    const acc = accounts.find((a) => a.id === id);
    return acc ? acc.name : 'Unknown';
  };

  return (
    <div>
      <h2>Dashboard</h2>

      <div style={{ display:'flex', gap:'24px', marginBottom:'24px' }}>
        <div>
          <p>Total Balance</p>
          <h3>₹{totalBalance.toFixed(2)}</h3>
        </div>
        <div>
          <p>Income (this month)</p>
          <h3>₹{totalIncome.toFixed(2)}</h3>
        </div>
        <div>
          <p>Expense (this month)</p>
          <h3>₹{totalExpense.toFixed(2)}</h3>
        </div>
        <div>
          <p>Net Cash Flow</p>
          <h3 style={{ color: netCashFlow >= 0 ? 'green' : 'red' }}>
            ₹{netCashFlow.toFixed(2)}
          </h3>
        </div>
      </div>

      <h3>Recent Transactions</h3>
      {recentTransactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <ul>
          {recentTransactions.map((t) => (
            <li key={t.id}>
              {t.date} — {getAccountName(t.account)} — {t.transaction_type} — ₹{t.amount}
              {t.description && ` — ${t.description}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;