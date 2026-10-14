import {useState} from 'react';
import api from '../api/axios';

function TransactionsList({ transactions, accounts, onEdit, onDeleted }) {
  const [error, setError] = useState('');

  const getAccountName = (id) => {
    const acc = accounts.find((a) => a.id === id);
    return acc ? acc.name : 'Unknown';
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await api.delete(`/transactions/${id}/`);
      onDeleted(id);
    } catch (err) {
      setError('Failed to delete transaction.');
    }
  }

  return (
    <div>
      <h2>Recent Transactions</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <ul>
          {transactions.map((t) => (
            <li key={t.id}>
              {t.date} — {getAccountName(t.account)} — {t.transaction_type} — ₹{t.amount}
              {t.description && ` — ${t.description}`}
              {t.transaction_type !== 'transfer' && (
                <button onClick={() => onEdit(t)}>Edit</button>
              )}
              <button onClick={() => handleDelete(t.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TransactionsList;