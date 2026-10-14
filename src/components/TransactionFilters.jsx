import { useState } from 'react';

function TransactionFilters({ accounts, categories, onFilterChange }) {
  const [filters, setFilters] = useState({
    account: '',
    category: '',
    transaction_type: '',
    date_from: '',
    date_to: '',
  });

  const handleChange = (field, value) => {
    const updated = { ...filters, [field]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handleClear = () => {
    const cleared = { account: '', category: '', transaction_type: '', date_from: '', date_to: '' };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  return (
    <div>
      <h3>Filters</h3>
      <select value={filters.account} onChange={(e) => handleChange('account', e.target.value)}>
        <option value="">All accounts</option>
        {accounts.map((acc) => (
          <option key={acc.id} value={acc.id}>{acc.name}</option>
        ))}
      </select>

      <select value={filters.category} onChange={(e) => handleChange('category', e.target.value)}>
        <option value="">All categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <select value={filters.transaction_type} onChange={(e) => handleChange('transaction_type', e.target.value)}>
        <option value="">All types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
        <option value="transfer">Transfer</option>
      </select>

      <input
        type="date"
        value={filters.date_from}
        onChange={(e) => handleChange('date_from', e.target.value)}
      />
      <input
        type="date"
        value={filters.date_to}
        onChange={(e) => handleChange('date_to', e.target.value)}
      />

      <button onClick={handleClear}>Clear Filters</button>
    </div>
  );
}

export default TransactionFilters;