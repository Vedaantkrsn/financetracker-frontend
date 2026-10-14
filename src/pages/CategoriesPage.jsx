import AddCategory from '../components/AddCategory';
import CategoriesList from '../components/CategoriesList';

function CategoriesPage({ categories, onCategoryAdded, onCategoryChanged }) {
  return (
    <div>
      <h2>Categories</h2>
      <AddCategory onCategoryAdded={onCategoryAdded} />
      <CategoriesList categories={categories} onCategoryChanged={onCategoryChanged}/>
    </div>
  );
}
export default CategoriesPage;