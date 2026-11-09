import { useState } from 'react';
import AddRecurring from '../components/AddRecurring';
import RecurringList from '../components/RecurringList';

function RecurringPage({ accounts, categories, recurring, onChanged, onPosted }) {
  const [editingItem, setEditingItem] = useState(null);

  const handleSaved = () => {
    setEditingItem(null);
    onChanged();
  };

  return (
    <main className="recurring-page">
      <header className="recurring-header"><div><p className="eyebrow">THE RHYTHM OF YOUR MONEY</p><h1>Recurring</h1><p className="recurring-subtitle">Stay ahead of the payments and deposits that repeat.</p></div><span className="recurring-header-orb" aria-hidden="true">⟳</span></header>
      <AddRecurring
        accounts={accounts}
        categories={categories}
        editingItem={editingItem}
        onSaved={handleSaved}
        onCancelEdit={() => setEditingItem(null)}
      />
      <RecurringList
        items={recurring}
        accounts={accounts}
        onEdit={setEditingItem}
        onChanged={onChanged}
        onPosted={onPosted}
      />
    </main>
  );
}

export default RecurringPage;
