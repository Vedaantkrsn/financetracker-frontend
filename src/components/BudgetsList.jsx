import api from '../api/axios';

const parse = (d) => new Date(`${d}T00:00:00`);

const short = (d) =>
  parse(d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });

const periodLabel = (b) =>
  b.period_type === 'weekly'
    ? `${short(b.start_date)} - ${short(b.end_date)}`
    : parse(b.start_date).toLocaleDateString('en-IN', {
        month: 'long',
        year: 'numeric',
      });

const monthsTouched = (b) => {
    const [sy,sm]=b.start_date.split('-').map(Number);
    const [ey,em]=b.end_date.split('-').map(Number);
    const keys=[];
    let year=sy,month=sm;
    while(year<ey || (year===ey && month<=em)) {
        keys.push(`${year}-${String(month).padStart(2,'0')}`);
        month++;
        if(month>12) {
            month=1;
            year++;
        }
    }
    return keys;
};

const monthLabel = (key) => {
    const [year, month] = key.split('-').map(Number);
    return new Date(year, month - 1,1).toLocaleDateString('en-IN', {
        month: 'long',
        year: 'numeric',
    });
}

function BudgetsList({budgets, selectedMonth, onMonthChange, onBudgetChanged, onEdit}) {
    const handleDelete = async (id) => {
        await api.delete(`budgets/${id}/`);
        onBudgetChanged();
    };

    const now=new Date();
    const currentKey=`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const monthKeys=[
        ...new Set([
            currentKey,
            ...(selectedMonth !== 'all' ? [selectedMonth] : []),
            ...budgets.flatMap((b) => monthsTouched(b)),
        ]),
    ].sort((a,b) => a.localeCompare(b));

    const visibleBudgets= 
        selectedMonth === 'all' 
            ? [...budgets].sort((a,b) => b.start_date.localeCompare(a.start_date))
            : budgets.filter((b) => monthsTouched(b).includes(selectedMonth)); 

    const monthly = visibleBudgets.filter(
        (b) => b.period_type === 'monthly'
    );

    const weekly = visibleBudgets.filter(
        (b) => b.period_type === 'weekly'
    );

    const renderBudget =(b) => {
        const percent=Math.min(b.percent_used, 100);
        const barColor= b.percent_used >= 100 ? 'red': b.percent_used >=80 ? 'orange' : 'green';

        return (
            <li key={b.id} style={{ marginBottom: '12px' }}>
                <div>
                    <strong>{b.category_name}</strong> — {periodLabel(b)}
                    <br />
                    ₹{b.spent} / ₹{b.effective_amount}

                    {b.rollover_amount > 0 && (
                    <span>
                        {' '}(base ₹{b.amount} + ₹{b.rollover_amount} rollover from{' '}
                        {b.period_type === 'weekly'
                        ? `week of ${short(b.rollover_from)}`
                        : parse(b.rollover_from).toLocaleDateString('en-IN', {
                            month: 'long',
                            year: 'numeric',
                        })})
                    </span>
                    )}
                </div>

                <div style={{ background: '#eee', height: '10px', width: '300px' }}>
                    <div style={{
                    background: barColor,
                    height: '100%',
                    width: `${percent}%`,
                    }} />
                </div>

                <span>{b.percent_used}% used</span>

                {b.percent_used >= 100 && (
                    <strong style={{ color: 'red' }}> Over budget</strong>
                )}

                {b.percent_used >= 80 && b.percent_used < 100 && (
                    <strong style={{ color: 'orange' }}> Near limit</strong>
                )}

                <button type="button" onClick={() => onEdit(b)}>Edit</button>
                <button type="button" onClick={() => handleDelete(b.id)}>Delete</button>
            </li>
        );
    };
    return (
       <div>
        <label htmlFor="budget-month">View budgets: </label>

        <select
            id="budget-month"
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
        >
            <option value={currentKey}>
            Current ({monthLabel(currentKey)})
            </option>

            {monthKeys
            .filter((key) => key !== currentKey)
            .map((key) => (
                <option key={key} value={key}>
                {monthLabel(key)}
                </option>
            ))}

            <option value="all">All</option>
        </select>

        {selectedMonth === 'all' ? (
            <>
            <h3>All Budgets</h3>

            {visibleBudgets.length === 0 ? (
                <p>No budgets yet.</p>
            ) : (
                <ul>{visibleBudgets.map(renderBudget)}</ul>
            )}
            </>
        ) : (
            <>
            <h3>Monthly Budgets</h3>

            {monthly.length === 0 ? (
                <p>No monthly budgets.</p>
            ) : (
                <ul>{monthly.map(renderBudget)}</ul>
            )}

            <h3>Weekly Budgets</h3>

            {weekly.length === 0 ? (
                <p>No weekly budgets.</p>
            ) : (
                <ul>{weekly.map(renderBudget)}</ul>
            )}
            </>
        )}
        </div>
    );
}

export default BudgetsList;