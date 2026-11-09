import { useState, useEffect } from 'react';
import api from '../api/axios';

function AddTransaction({ accounts, categories, editingTransaction, onTransactionAdded, onCancelEdit }) {
  const [account, setAccount] = useState('');
  const [category, setCategory] = useState('');
  const [transactionType, setTransactionType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [error, setError] = useState('');

  const isEditing = !!editingTransaction;
  useEffect(() => {
    if (editingTransaction) {
      setAccount(editingTransaction.account);
      setCategory(editingTransaction.category || '');
      setTransactionType(editingTransaction.transaction_type);
      setAmount(editingTransaction.amount);
      setDate(editingTransaction.date);
      setDescription(editingTransaction.description || '');
    } else {
      setAccount('');
      setCategory('');
      setTransactionType('expense');
      setAmount('');
      setDate('');
      setDescription('');
      setToAccount('');
    }
  }, [editingTransaction]);

  const relevantCategories = categories.filter(
      (cat) => cat.category_type === transactionType
  );

  const resetForm = () => {
    setAccount('');
    setCategory('');
    setTransactionType('expense');
    setAmount('');
    setDate('');
    setDescription('');
    setToAccount('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      account,
      transaction_type: transactionType,
      amount,
      date,
      description,
    };
    if (transactionType === 'transfer') {
      payload.to_account = toAccount;
    } else if (category) {
      payload.category = category;
    }

    try {
      if (isEditing) {
        await api.patch(`transactions/${editingTransaction.id}/`, payload);
      } else {
        await api.post('transactions/', payload);
      }
      resetForm();
      onTransactionAdded();
    } catch (err) {
      setError(isEditing ? 'Failed to update transaction' : 'Failed to add transaction');
    }
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <div className="transaction-form-heading"><div><p className="eyebrow">{isEditing ? 'UPDATE ENTRY' : 'NEW ENTRY'}</p><h2>{isEditing ? 'Edit transaction' : 'Add a transaction'}</h2></div><span className="form-orb" aria-hidden="true">＋</span></div>
      {error && <p className="transaction-error">{error}</p>}

      <div className="transaction-fields">
      <div className="transaction-type-field">
        <label htmlFor="transaction-type">Type</label>
        <select
          id="transaction-type"
          value={transactionType}
          onChange={(e) => { setTransactionType(e.target.value); setCategory(''); }}
          disabled={isEditing && transactionType === 'transfer'}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
          {!isEditing && <option value="transfer">Transfer</option>}
        </select>
      </div>

      <div>
        <label htmlFor="transaction-account">Account</label>
        <select id="transaction-account" value={account} onChange={(e) => setAccount(e.target.value)} required>
          <option value="">Select account</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>{acc.name}</option>
          ))}
        </select>
      </div>

      {transactionType === 'transfer' && !isEditing && (
        <div>
          <label htmlFor="transfer-account">Transfer to</label>
          <select id="transfer-account" value={toAccount} onChange={(e) => setToAccount(e.target.value)} required>
            <option value="">Transfer to...</option>
            {accounts.filter((acc) => acc.id !== Number(account)).map((acc) => (
              <option key={acc.id} value={acc.id}>{acc.name}</option>
            ))}
          </select>
        </div>
      )}

      {transactionType !== 'transfer' && (
        <div>
          <label htmlFor="transaction-category">Category</label>
          <select id="transaction-category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">No category</option>
            {relevantCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="transaction-amount">Amount</label>
        <input
          id="transaction-amount"
          type="number"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="transaction-date">Date</label>
        <input
          id="transaction-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="transaction-description">Description</label>
        <input
          id="transaction-description"
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      </div>

      <div className="transaction-form-actions">
        <button className="primary-action" type="submit">{isEditing ? 'Save Changes' : 'Add Transaction'} <span aria-hidden="true">↗</span></button>
        {isEditing && <button className="secondary-action" type="button" onClick={onCancelEdit}>Cancel</button>}
      </div>
    </form>
  );
}

export default AddTransaction;
