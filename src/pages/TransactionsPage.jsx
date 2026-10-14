import {useState} from 'react';
import AddTransaction from '../components/AddTransaction';
import TransactionFilters from '../components/TransactionFilters';
import TransactionsList from '../components/TransactionsList';

function TransactionsPage({ transactions, accounts, categories, onTransactionAdded, onFilterChange}) {
    const [editingTransaction, setEditingTransaction] = useState(null);
    const handleSaved = () => {
        setEditingTransaction(null);
        onTransactionAdded
    }
    
    return (
        <div>
            <h2>Transactions</h2>
            <AddTransaction accounts={accounts} categories={categories} 
                editingTransaction={editingTransaction} onTransactionAdded={onTransactionAdded} 
                onCancelEdit={() => setEditingTransaction(null)} />
            <TransactionFilters accounts={accounts} categories={categories} onFilterChange={onFilterChange} />
            <TransactionsList transactions={transactions} accounts={accounts} 
                onEdit={setEditingTransaction} onDeleted={onTransactionAdded}/>
        </div>
    );
}

export default TransactionsPage;