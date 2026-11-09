import api from '../api/axios';

const parse = (date) => new Date(`${date}T00:00:00`);

const short = (date) => parse(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

const periodLabel = (budget) => budget.period_type === 'weekly'
  ? `${short(budget.start_date)} – ${short(budget.end_date)}`
  : parse(budget.start_date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

const monthsTouched = (budget) => {
  const [startYear, startMonth] = budget.start_date.split('-').map(Number);
  const [endYear, endMonth] = budget.end_date.split('-').map(Number);
  const keys = [];
  let year = startYear;
  let month = startMonth;
  while (year < endYear || (year === endYear && month <= endMonth)) {
    keys.push(`${year}-${String(month).padStart(2, '0')}`);
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  return keys;
};

const monthLabel = (key) => {
  const [year, month] = key.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
};

function BudgetsList({ budgets, selectedMonth, onMonthChange, onBudgetChanged, onEdit }) {
  const handleDelete = async (id) => {
    await api.delete(`budgets/${id}/`);
    onBudgetChanged();
  };

  const now = new Date();
  const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthKeys = [...new Set([
    currentKey,
    ...(selectedMonth !== 'all' ? [selectedMonth] : []),
    ...budgets.flatMap((budget) => monthsTouched(budget)),
  ])].sort((a, b) => a.localeCompare(b));

  const visibleBudgets = selectedMonth === 'all'
    ? [...budgets].sort((a, b) => b.start_date.localeCompare(a.start_date))
    : budgets.filter((budget) => monthsTouched(budget).includes(selectedMonth));
  const monthly = visibleBudgets.filter((budget) => budget.period_type === 'monthly');
  const weekly = visibleBudgets.filter((budget) => budget.period_type === 'weekly');
  const totalPlanned = visibleBudgets.reduce((sum, budget) => sum + Number.parseFloat(budget.effective_amount || 0), 0);
  const totalSpent = visibleBudgets.reduce((sum, budget) => sum + Number.parseFloat(budget.spent || 0), 0);
  const overallPercent = totalPlanned > 0 ? Math.round((totalSpent / totalPlanned) * 100) : 0;

  const renderBudget = (budget) => {
    const percent = Math.min(Number(budget.percent_used) || 0, 100);
    const status = budget.percent_used >= 100 ? 'over' : budget.percent_used >= 80 ? 'near' : 'good';
    return (
      <li className="budget-card" key={budget.id}>
        <div className="budget-card-heading">
          <span className={`budget-category-orb budget-category-orb--${status}`} aria-hidden="true">◷</span>
          <span className={`budget-status budget-status--${status}`}>{status === 'over' ? 'Over budget' : status === 'near' ? 'Near limit' : 'On track'}</span>
        </div>
        <div className="budget-card-title"><div><h3>{budget.category_name}</h3><p>{budget.period_type} · {periodLabel(budget)}</p></div><strong>{budget.percent_used}%</strong></div>
        <div className="budget-progress" role="progressbar" aria-valuenow={Math.min(Number(budget.percent_used) || 0, 100)} aria-valuemin="0" aria-valuemax="100" aria-label={`${budget.category_name} budget used`}>
          <span className={`budget-progress-fill budget-progress-fill--${status}`} style={{ width: `${percent}%` }} />
        </div>
        <div className="budget-amount-row"><span>₹{budget.spent} spent</span><strong>₹{budget.effective_amount}</strong></div>
        {budget.rollover_amount > 0 && (
          <p className="budget-rollover">Base ₹{budget.amount} + ₹{budget.rollover_amount} rollover from {budget.period_type === 'weekly' ? `week of ${short(budget.rollover_from)}` : parse(budget.rollover_from).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
        )}
        <div className="budget-card-actions"><button type="button" className="budget-action" onClick={() => onEdit(budget)}>Edit</button><button type="button" className="budget-action budget-action--delete" onClick={() => handleDelete(budget.id)}>Delete</button></div>
      </li>
    );
  };

  const renderGroup = (title, items, emptyMessage) => (
    <section className="budget-group">
      <div className="budget-group-heading"><h2>{title}</h2><span>{items.length}</span></div>
      {items.length === 0 ? <p className="budget-empty">{emptyMessage}</p> : <ul className="budget-grid">{items.map(renderBudget)}</ul>}
    </section>
  );

  return (
    <div className="budget-list-area">
      <section className="budget-overview">
        <div><p className="eyebrow">{selectedMonth === 'all' ? 'ALL PERIODS' : monthLabel(selectedMonth).toUpperCase()}</p><h2>Spending overview</h2><p>₹{totalSpent.toFixed(2)} <span>spent of ₹{totalPlanned.toFixed(2)} planned</span></p></div>
        <div className="overall-progress"><div><span>Overall pace</span><strong>{overallPercent}%</strong></div><div className="budget-progress"><span className={`budget-progress-fill ${overallPercent >= 100 ? 'budget-progress-fill--over' : overallPercent >= 80 ? 'budget-progress-fill--near' : 'budget-progress-fill--good'}`} style={{ width: `${Math.min(overallPercent, 100)}%` }} /></div></div>
      </section>
      <div className="budget-period-picker"><label htmlFor="budget-month">View period</label><select id="budget-month" value={selectedMonth} onChange={(event) => onMonthChange(event.target.value)}>
        <option value={currentKey}>Current ({monthLabel(currentKey)})</option>
        {monthKeys.filter((key) => key !== currentKey).map((key) => <option key={key} value={key}>{monthLabel(key)}</option>)}
        <option value="all">All periods</option>
      </select></div>
      {selectedMonth === 'all' ? renderGroup('All budgets', visibleBudgets, 'No budgets yet.') : <>
        {renderGroup('Monthly budgets', monthly, 'No monthly budgets for this period.')}
        {renderGroup('Weekly budgets', weekly, 'No weekly budgets for this period.')}
      </>}
    </div>
  );
}

export default BudgetsList;
