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
    <section className="transactions-list-panel">
      <div className="transactions-list-heading"><div><p className="eyebrow">YOUR ACTIVITY</p><h2>Transactions</h2></div><span className="count-pill">{transactions.length} entries</span></div>
      {error && <p className="transaction-error">{error}</p>}
      {transactions.length === 0 ? (
        <p className="transaction-empty">No transactions found. Try adjusting your filters.</p>
      ) : (
        <ul className="transactions-table">
          {transactions.map((t) => (
            <li className="transaction-row" key={t.id}>
              <span className={`transaction-orb transaction-orb--${t.transaction_type}`} aria-hidden="true">{t.transaction_type === 'income' ? '↙' : t.transaction_type === 'transfer' ? '⟳' : '↗'}</span>
              <span className="transaction-row-main"><strong>{t.description || t.transaction_type}</strong><small>{getAccountName(t.account)} · {t.date}</small></span>
              <span className={`transaction-kind transaction-kind--${t.transaction_type}`}>{t.transaction_type}</span>
              <strong className={`transaction-value ${t.transaction_type === 'income' ? 'is-income' : ''}`}>{t.transaction_type === 'income' ? '+' : t.transaction_type === 'expense' ? '−' : ''}₹{t.amount}</strong>
              <span className="transaction-row-actions">{t.transaction_type !== 'transfer' && (
                <button className="row-action" onClick={() => onEdit(t)}>Edit</button>
              )}
              <button className="row-action row-action--delete" onClick={() => handleDelete(t.id)}>Delete</button></span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default TransactionsList;
