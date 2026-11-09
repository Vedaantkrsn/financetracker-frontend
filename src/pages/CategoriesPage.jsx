import AddCategory from '../components/AddCategory';
import CategoriesList from '../components/CategoriesList';

function CategoriesPage({ categories, onCategoryAdded, onCategoryChanged }) {
  const activeCategories = categories.filter((category) => category.is_active);
  const incomeCount = activeCategories.filter((category) => category.category_type === 'income').length;
  const expenseCount = activeCategories.filter((category) => category.category_type === 'expense').length;
  return (
    <main className="categories-page">
      <header className="categories-header"><div><p className="eyebrow">GIVE EVERY DOLLAR A PLACE</p><h1>Categories</h1><p className="categories-subtitle">Organize the flow in and out of your accounts.</p></div><span className="categories-header-orb" aria-hidden="true"><i /></span></header>
      <section className="category-overview" aria-label="Category summary">
        <article><span className="category-overview-icon category-overview-icon--expense">↗</span><div><small>Expense categories</small><strong>{expenseCount}</strong></div></article>
        <article><span className="category-overview-icon category-overview-icon--income">↙</span><div><small>Income categories</small><strong>{incomeCount}</strong></div></article>
      </section>
      <AddCategory onCategoryAdded={onCategoryAdded} />
      <CategoriesList categories={categories} onCategoryChanged={onCategoryChanged}/>
    </main>
  );
}
export default CategoriesPage;
