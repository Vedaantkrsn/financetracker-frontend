import api from '../api/axios';

function BudgetsList({budgets, onBudgetChanged}) {
    const handleDelete = async (id) => {
        await api.delete(`budgets/${id}/`);
        onBudgetChanged();
    };

    const monthly= budgets.filter((b) => b.period_type === 'monthly');
    const weekly= budgets.filter((b) => b.period_type === 'weekly');

    const renderBudget =(b) => {
        const percent=Math.min(b.percent_used, 100);
        const barColor= b.percent_used >= 100 ? 'red': b.percent_used >=80 ? 'orange' : 'green';
        const periodLabel = new Date(b.start_date).toLocaleDateString('en-IN', {
            month: 'long',
            year: 'numeric',
        });

        return (
            <li key={b.id} style={{ marginBottom: '12px' }}>
                <div>
                    <strong>{b.category_name}</strong> — {new Date(b.start_date).toLocaleDateString('en-IN', {
                    month: 'long',
                    year: 'numeric',
                    })}
                    <br />
                    ₹{b.spent} / ₹{b.effective_amount}

                    {b.rollover_amount > 0 && (
                    <span>
                        {' '}(base ₹{b.amount} + ₹{b.rollover_amount} rollover from{' '}
                        {new Date(b.rollover_from).toLocaleDateString('en-IN', {
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

                <button onClick={() => handleDelete(b.id)}>Delete</button>
            </li>
        );
    };
    return (
        <div>
        <h3>Monthly Budgets</h3>
        {monthly.length === 0 ? <p>No monthly budgets.</p> : <ul>{monthly.map(renderBudget)}</ul>}

        <h3>Weekly Budgets</h3>
        {weekly.length === 0 ? <p>No weekly budgets.</p> : <ul>{weekly.map(renderBudget)}</ul>}
        </div>
    );
}

export default BudgetsList;