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
    <form className="account-form" onSubmit={handleSubmit}>
      <div className="account-form-heading"><div><p className="eyebrow">ADD A PLACE TO TRACK</p><h2>New account</h2></div><span className="account-form-orb" aria-hidden="true">＋</span></div>
      {error && <p className="account-error">{error}</p>}
      <div className="account-fields">
      <div>
        <label htmlFor="account-name">Account name</label>
        <input
          id="account-name"
          type="text"
          placeholder="Account name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="account-type">Account type</label>
        <select id="account-type" value={accountType} onChange={(e) => setAccountType(e.target.value)}>
          {ACCOUNT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="account-institution">Institution <span>(optional)</span></label>
        <input
          id="account-institution"
          type="text"
          placeholder="Institution (optional)"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="account-balance">Starting balance</label>
        <input
          id="account-balance"
          type="number"
          step="0.01"
          placeholder="Initial balance"
          value={initialBalance}
          onChange={(e) => setInitialBalance(e.target.value)}
        />
      </div>
      </div>
      <button className="primary-action account-submit" type="submit">Add account <span aria-hidden="true">↗</span></button>
    </form>
  );
}

export default AddAccount;
