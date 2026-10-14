import { useState } from 'react';
import api from '../api/axios';

const ACCOUNT_TYPES = [
  { value: 'bank', label: 'Bank Account' },
  { value: 'cash', label: 'Cash' },
  { value: 'wallet', label: 'Digital Wallet' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'investment', label: 'Investment' },
];

function AddAccount({ onAccountAdded }) {
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState('bank');
  const [institution, setInstitution] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('accounts/', {
        name,
        account_type: accountType,
        institution,
        current_balance: initialBalance || '0',
      });
      setName('');
      setAccountType('bank');
      setInstitution('');
      setInitialBalance('');
      onAccountAdded(response.data);
    } catch (err) {
      setError('Failed to create account');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Account</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <input
          type="text"
          placeholder="Account name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
          {ACCOUNT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div>
        <input
          type="text"
          placeholder="Institution (optional)"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
        />
      </div>
      <div>
        <input
          type="number"
          step="0.01"
          placeholder="Initial balance"
          value={initialBalance}
          onChange={(e) => setInitialBalance(e.target.value)}
        />
      </div>
      <button type="submit">Add Account</button>
    </form>
  );
}

export default AddAccount;