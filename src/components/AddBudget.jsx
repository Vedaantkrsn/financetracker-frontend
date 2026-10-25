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
    <form onSubmit={handleSubmit}>
      <h3>{isEditing ? 'Edit Budget' : 'Add Budget'}</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <select value={category} onChange={(e) => setCategory(e.target.value)} required disabled={isEditing}>
        <option value="">Select category</option>
        {expenseCategories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <select value={periodType} onChange={(e) => setPeriodType(e.target.value)}  required disabled={isEditing}>
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

      <button type="submit">{isEditing ? 'Save Changes' : 'Add Budget'}</button>
      {isEditing && (
        <button type="button" onClick={onCancelEdit}>Cancel</button>
      )}
    </form>
  );
}

export default AddBudget;
