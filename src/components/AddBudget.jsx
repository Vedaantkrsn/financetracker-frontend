import {useState} from 'react';
import api from '../api/axios';

function AddBudget({categories, onBudgetAdded}) {
    const [category, setCategory] = useState('');
    const [periodType, setPeriodType] = useState('monthly');
    const [amount, setAmount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [rolloverEnabled, setRolloverEnabled] = useState(false);
    const [error, setError] = useState('');

    const expenseCategories= categories.filter(
        (c) => c.category_type === 'expense' && c.is_active
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('budgets/', {
                category,
                period_type: periodType,
                amount,
                start_date: startDate,
                end_date: endDate,
                rollover_enabled: rolloverEnabled
            });
            setCategory('');
            setPeriodType('monthly');
            setAmount('');
            setStartDate('');
            setEndDate('');
            setRolloverEnabled(false);
            onBudgetAdded();
        } catch (err) {
            setError('Failed to add budget');
        }
    };
    return (
    <form onSubmit={handleSubmit}>
      <h3>Add Budget</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <select value={category} onChange={(e) => setCategory(e.target.value)} required>
        <option value="">Select category</option>
        {expenseCategories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <select value={periodType} onChange={(e) => setPeriodType(e.target.value)}>
        <option value="monthly">Monthly</option>
        <option value="weekly">Weekly</option>
      </select>

      <input
        type="number" step="0.01" placeholder="Amount"
        value={amount} onChange={(e) => setAmount(e.target.value)} required
      />

      <label>Start: <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required /></label>
      <label>End: <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required /></label>

      <label>
        <input type="checkbox" checked={rolloverEnabled} onChange={(e) => setRolloverEnabled(e.target.checked)} />
        Enable rollover
      </label>

      <button type="submit">Add Budget</button>
    </form>
  );
}

export default AddBudget;
