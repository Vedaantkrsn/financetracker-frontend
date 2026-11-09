import { useState } from 'react';
import AddTransaction from '../components/AddTransaction';
import TransactionFilters from '../components/TransactionFilters';
import TransactionsList from '../components/TransactionsList';

function TransactionsPage({ transactions, accounts, categories, onTransactionAdded, onFilterChange }) {
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSaved = () => {
        setEditingTransaction(null);
        onTransactionAdded
    }

    const query = searchTerm.trim().toLowerCase();

    const visibleTransactions = transactions.filter((transaction) => {
        const accountName =
            accounts.find((account) => String(account.id) === String(transaction.account))?.name || '';

        const categoryName =
            categories.find((category) => String(category.id) === String(transaction.category))?.name || '';

        const searchableText = [
            transaction.description,
            transaction.transaction_type,
            transaction.amount,
            transaction.date,
            accountName,
            categoryName,
        ].join(' ').toLowerCase();

        return searchableText.includes(query);
    });

    return (
        <main className="transactions-page">
            <header className="transactions-header">
                <div><p className="eyebrow">MONEY IN MOTION</p><h1>Transactions</h1><p className="transactions-subtitle">Track, filter, and manage every movement.</p></div>
                <span className="transactions-header-orb" aria-hidden="true">↗</span>
            </header>
            <AddTransaction accounts={accounts} categories={categories}
                editingTransaction={editingTransaction} onTransactionAdded={onTransactionAdded}
                onCancelEdit={() => setEditingTransaction(null)} />
            <TransactionFilters accounts={accounts} categories={categories} onFilterChange={onFilterChange} />
            <div className="transaction-search">
                <span aria-hidden="true">⌕</span>
                <input
                    type="search"
                    placeholder="Search description, account, category, amount…"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    aria-label="Search transactions"
                />
                {searchTerm && (
                    <button type="button" onClick={() => setSearchTerm('')}>
                        Clear
                    </button>
                )}
            </div>

            <TransactionsList transactions={visibleTransactions} accounts={accounts}
                onEdit={setEditingTransaction} onDeleted={onTransactionAdded} />
        </main>
    );
}

export default TransactionsPage;
