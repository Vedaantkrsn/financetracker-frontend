import { useState } from 'react';

function TransactionFilters({ accounts, categories, onFilterChange }) {
  const [filters, setFilters] = useState({
    account: '',
    category: '',
    transaction_type: '',
    date_from: '',
    date_to: '',
  });

  const [quickFilter, setQuickFilter] = useState('all');

  const applyQuickFilter = (value) => {
    const updated = { ...filters };

    if (['income', 'expense', 'transfer'].includes(value)) {
      updated.transaction_type = value;
      setQuickFilter(value);
    } else if (value === 'this_month') {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const lastDay = new Date(year, today.getMonth() + 1, 0).getDate();

      updated.date_from = `${year}-${month}-01`;
      updated.date_to = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
      setQuickFilter(value);
    } else {
      updated.account = '';
      updated.category = '';
      updated.transaction_type = '';
      updated.date_from = '';
      updated.date_to = '';
      setQuickFilter('all');
    }

    setFilters(updated);
    onFilterChange(updated);
  };

  const handleChange = (field, value) => {
    const updated = { ...filters, [field]: value };
    setFilters(updated);
    onFilterChange(updated);
    setQuickFilter('');
  };

  const handleClear = () => {
    const cleared = { account: '', category: '', transaction_type: '', date_from: '', date_to: '' };
    setFilters(cleared);
    onFilterChange(cleared);
    setQuickFilter('all');
  };

  return (
    <section className="transaction-filters">
      <div className="filters-heading"><div><p className="eyebrow">FIND AN ENTRY</p><h2>Filters</h2></div><button className="clear-filters" onClick={handleClear}>Reset filters</button></div>
      <div className="quick-filters" aria-label="Quick filters">
        {[
          ['all', 'All'],
          ['expense', 'Expenses'],
          ['income', 'Income'],
          ['transfer', 'Transfers'],
          ['this_month', 'This month'],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={`quick-filter ${quickFilter === value ? 'is-active' : ''}`}
            onClick={() => applyQuickFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>
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

    </section>
  );
}

export default TransactionFilters;
