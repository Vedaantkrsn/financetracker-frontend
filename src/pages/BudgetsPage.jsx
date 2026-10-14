import AddBudget from '../components/AddBudget';
import BudgetsList from '../components/BudgetsList';

function BudgetsPage({ categories, budgets, onBudgetChanged }) {
  return (
    <div>
      <h2>Budgets</h2>
      <AddBudget categories={categories} onBudgetAdded={onBudgetChanged} />
      <BudgetsList budgets={budgets} onBudgetChanged={onBudgetChanged} />
    </div>
  );
}

export default BudgetsPage;