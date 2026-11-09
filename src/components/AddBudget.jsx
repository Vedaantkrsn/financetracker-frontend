import {useState,useEffect} from 'react';
import api from '../api/axios';

function AddBudget({categories, onBudgetAdded, editingBudget, onCancelEdit}) {
    const [category, setCategory] = useState('');
    const [periodType, setPeriodType] = useState('monthly');
    const [amount, setAmount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [rolloverEnabled, setRolloverEnabled] = useState(false);
    const [error, setError] = useState('');

    const expenseCategories= categories.filter(
      (c) =>
        c.category_type === 'expense' &&
        (c.is_active || Number(c.id) === Number(editingBudget?.category))
    );

    const isEditing = !!editingBudget;

    useEffect(() => {
      if (editingBudget) {
        setCategory(String(editingBudget.category));
        setPeriodType(editingBudget.period_type);
        setAmount(String(editingBudget.amount));
        setStartDate(editingBudget.start_date);
        setEndDate(editingBudget.end_date);
        setRolloverEnabled(editingBudget.rollover_enabled);
      } else {
        setCategory('');
        setPeriodType('monthly');
        setAmount('');
        setStartDate('');
        setEndDate('');
        setRolloverEnabled(false);
      }

      setError('');
    }, [editingBudget]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      try {
        if(isEditing) {
          await api.patch(`budgets/${editingBudget.id}/`, {
            amount,
            start_date: startDate,
            end_date: endDate,
            rollover_enabled: rolloverEnabled,
          });
        } else {
          await api.post('budgets/', {
            category,
            period_type: periodType,
            amount,
            start_date: startDate,
            end_date: endDate,
            rollover_enabled: rolloverEnabled,
          });
        }
      } catch (err) {
        const serverMessage = err.response?.data?.non_field_errors?.[0];
        setError(serverMessage || (isEditing ? 'Failed to update budget' : 'Failed to add budget'));
        return;
      }

      setCategory('');
      setPeriodType('monthly');
      setAmount('');
      setStartDate('');
      setEndDate('');
      setRolloverEnabled(false);
      onBudgetAdded(startDate);
    };
    return (
    <form className="budget-form" onSubmit={handleSubmit}>
      <div className="budget-form-heading"><div><p className="eyebrow">{isEditing ? 'ADJUST YOUR PLAN' : 'MAKE A SPENDING PLAN'}</p><h2>{isEditing ? 'Edit budget' : 'New budget'}</h2></div><span className="budget-form-orb" aria-hidden="true">◷</span></div>
      {error && <p className="budget-error">{error}</p>}

      <div className="budget-form-fields">
      <label>Category
      <select value={category} onChange={(e) => setCategory(e.target.value)} required disabled={isEditing}>
        <option value="">Select category</option>
        {expenseCategories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      </label>

      <label>Period
      <select value={periodType} onChange={(e) => setPeriodType(e.target.value)}  required disabled={isEditing}>
        <option value="monthly">Monthly</option>
        <option value="weekly">Weekly</option>
      </select>
      </label>

      <label>Budget amount
      <input
        type="number" step="0.01" placeholder="Amount"
        value={amount} onChange={(e) => setAmount(e.target.value)} required
      />
      </label>

      <label>Start date <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required /></label>
      <label>End date <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required /></label>

      <label className="rollover-toggle">
        <input type="checkbox" checked={rolloverEnabled} onChange={(e) => setRolloverEnabled(e.target.checked)} />
        <span><strong>Enable rollover</strong><small>Carry unused budget into the next period</small></span>
      </label>
      </div>

      <div className="budget-form-actions"><button className="primary-action" type="submit">{isEditing ? 'Save changes' : 'Add budget'} <span aria-hidden="true">↗</span></button>
      {isEditing && (
        <button className="secondary-action" type="button" onClick={onCancelEdit}>Cancel</button>
      )}
      </div>
    </form>
  );
}

export default AddBudget;
