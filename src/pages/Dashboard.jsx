import { Link } from 'react-router-dom';
import '../App.css';

function Dashboard({ accounts, transactions, recurring, budgets }) {

  const activeAccounts = accounts.filter((a) => a.is_active);
  const totalBalance = activeAccounts.reduce(
    (sum, acc) => sum + parseFloat(acc.current_balance), 0
  );

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthTransactions = transactions.filter((t) => {
    const tDate = new Date(t.date);
    return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
  });


  const totalIncome = thisMonthTransactions
    .filter((t) => t.transaction_type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalExpense = thisMonthTransactions
    .filter((t) => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);


  const netCashFlow = totalIncome - totalExpense;
  const recentTransactions = transactions.slice(0, 10);

  const getAccountName = (id) => {
    const acc = accounts.find((a) => a.id === id);
    return acc ? acc.name : 'Unknown';
  };

  const parse = (d) => new Date(`${d}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayISO = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');

  // Only check budgets whose date range includes today.
  const budgetAlerts = budgets
    .filter((budget) => budget.start_date <= todayISO && budget.end_date >= todayISO)
    .filter((budget) => Number(budget.percent_used) >= 80)
    .sort((a, b) => Number(b.percent_used) - Number(a.percent_used));

  const upcoming = recurring
    .filter((r) => r.is_active)
    .filter((r) => (parse(r.next_due_date) - today) / 86400000 <= 30)
    .sort((a, b) => a.next_due_date.localeCompare(b.next_due_date))
    .slice(0, 5);

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">YOUR MONEY, IN ORBIT</p>
          <h1>Dashboard</h1>
          <p className="dashboard-subtitle">A clear view of what’s coming in and going out.</p>
        </div>
        <div className="date-orb" aria-hidden="true"><span>{now.toLocaleDateString('en-IN', { month: 'short' })}</span><strong>{now.getDate()}</strong></div>
      </header>

      <section className="summary-grid" aria-label="Monthly summary">
        <article className="summary-card summary-card--balance">
          <p>Total Balance</p>
          <h3>₹{totalBalance.toFixed(2)}</h3>
          <span className="orbit orbit--one" aria-hidden="true" />
          <span className="orbit orbit--two" aria-hidden="true" />
        </article>
        <article className="summary-card summary-card--income">
          <p>Income <span>THIS MONTH</span></p>
          <h3>₹{totalIncome.toFixed(2)}</h3>
          <span className="mini-orb" aria-hidden="true">↗</span>
        </article>
        <article className="summary-card summary-card--expense">
          <p>Expense <span>THIS MONTH</span></p>
          <h3>₹{totalExpense.toFixed(2)}</h3>
          <span className="mini-orb" aria-hidden="true">↘</span>
        </article>
        <article className="summary-card">
          <p>Net cash flow <span>THIS MONTH</span></p>
          <h3 className={netCashFlow >= 0 ? 'positive' : 'negative'}>
            ₹{netCashFlow.toFixed(2)}
          </h3>
        </article>
      </section>

      <section className="dashboard-panel budget-alerts-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">KEEP AN EYE ON IT</p>
            <h2>Budget alerts</h2>
          </div>
          <Link className="manage-link" to="/budgets">
            View budgets <span aria-hidden="true">↗</span>
          </Link>
        </div>

        {budgetAlerts.length === 0 ? (
          <p className="empty-state">Your active budgets are below 80%.</p>
        ) : (
          <ul className="budget-alert-list">
            {budgetAlerts.map((budget) => {
              const percent = Number(budget.percent_used);
              const isOver = percent >= 100;

              return (
                <li className="budget-alert-row" key={budget.id}>
                  <span className={`budget-alert-orb ${isOver ? 'is-over' : ''}`} aria-hidden="true">
                    {isOver ? '!' : '↗'}
                  </span>

                  <span className="budget-alert-copy">
                    <strong>{budget.category_name}</strong>
                    <small>
                      ₹{budget.spent} spent of ₹{budget.effective_amount}
                    </small>
                  </span>

                  <span className={`budget-alert-status ${isOver ? 'is-over' : ''}`}>
                    {isOver ? 'Over budget' : 'Near limit'}
                  </span>

                  <strong className="budget-alert-percent">{percent}%</strong>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="dashboard-panel">
        <div className="section-heading"><div><p className="eyebrow">THE LATEST</p><h2>Recent transactions</h2></div><span className="count-pill">{recentTransactions.length} entries</span></div>
        {recentTransactions.length === 0 ? (
          <p className="empty-state">No transactions yet.</p>
        ) : (
          <ul className="activity-list">
            {recentTransactions.map((t) => (
              <li key={t.id}>
                <span className={`transaction-orb transaction-orb--${t.transaction_type}`} aria-hidden="true">{t.transaction_type === 'income' ? '↙' : '↗'}</span>
                <span className="transaction-main"><strong>{t.description || t.transaction_type}</strong><small>{getAccountName(t.account)} · {t.date}</small></span>
                <strong className={t.transaction_type === 'income' ? 'positive' : 'amount'}>{t.transaction_type === 'income' ? '+' : '−'}₹{t.amount}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="dashboard-panel upcoming-panel">
        <div className="section-heading"><div><p className="eyebrow">ON THE HORIZON</p><h2>Upcoming payments</h2></div><span className="count-pill">Next 30 days</span></div>
        {upcoming.length === 0 ? (
          <p className="empty-state">Nothing due in the next 30 days.</p>
        ) : (
          <ul className="activity-list">
            {upcoming.map((r) => {
              const days = Math.round((parse(r.next_due_date) - today) / 86400000);
              return (
                <li key={r.id}>
                  <span className="transaction-orb transaction-orb--due" aria-hidden="true">◷</span>
                  <span className="transaction-main"><strong>{r.name}</strong><small>{r.next_due_date}</small></span>
                  <strong className="amount">₹{r.amount}</strong>
                  <span className="due-pill">
                    {days < 0
                      ? `overdue ${-days}d`
                      : days === 0 ? 'today' : `in ${days}d`}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
        <Link className="manage-link" to="/recurring">Manage recurring <span aria-hidden="true">↗</span></Link>
      </section>
    </main>
  );
}

export default Dashboard;
