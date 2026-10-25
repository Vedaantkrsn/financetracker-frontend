
import { useState } from 'react';
import AddBudget from '../components/AddBudget';
import BudgetsList from '../components/BudgetsList';

function BudgetsPage({ categories, budgets, onBudgetChanged }) {
  const [editingBudget, setEditingBudget] = useState(null);

  const now=new Date();
  const currentKey=`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const [selectedMonth, setSelectedMonth] = useState(currentKey);

  const handleCancelEdit = () => {
    setEditingBudget(null);
  };

  const handleBudgetSaved = (startDate) => {
    setEditingBudget(null);
    if(startDate) {
      setSelectedMonth(startDate.slice(0, 7));
    }

    onBudgetChanged();
  };

  return (
    <div>
      <h2>Budgets</h2>

      <AddBudget
        categories={categories}
        editingBudget={editingBudget}
        onCancelEdit={handleCancelEdit}
        onBudgetAdded={handleBudgetSaved}
      />

      <BudgetsList
        budgets={budgets}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        onBudgetChanged={onBudgetChanged}
        onEdit={setEditingBudget}
      />
    </div>
  );
}

export default BudgetsPage;
