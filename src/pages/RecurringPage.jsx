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
    <div>
      <h2>Recurring</h2>
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
    </div>
  );
}

export default RecurringPage;