
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
    <main className="budgets-page">
      <header className="budgets-header"><div><p className="eyebrow">PLAN YOUR SPENDING</p><h1>Budgets</h1><p className="budgets-subtitle">Set a limit, track the pace, and adjust as life moves.</p></div><span className="budgets-header-orb" aria-hidden="true"><i /></span></header>

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
    </main>
  );
}

export default BudgetsPage;
