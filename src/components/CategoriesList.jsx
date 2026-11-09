import { useState } from 'react';
import api from '../api/axios';

function CategoriesList({ categories, onCategoryChanged }) {
  const [error, setError] = useState(null);
  const active = categories.filter((category) => category.is_active);
  const inactive = categories.filter((category) => !category.is_active);

  const handleDelete = async (id) => {
    setError('');
    try {
      await api.delete(`categories/${id}/`);
      onCategoryChanged();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete category');
    }
  };

  const handleDeactivate = async (id) => {
    await api.patch(`categories/${id}/`, { is_active: false });
    onCategoryChanged();
  };

  const handleReactivate = async (id) => {
    await api.patch(`categories/${id}/`, { is_active: true });
    onCategoryChanged();
  };

  const renderCategory = (category) => (
    <li className={`category-card category-card--${category.category_type} ${category.is_active ? '' : 'category-card--inactive'}`} key={category.id}>
      <div className="category-card-top">
        <span className={`category-icon category-icon--${category.category_type}`} aria-hidden="true">
          {category.category_type === 'income' ? '↙' : '↗'}
        </span>
        <span className={`category-type-pill category-type-pill--${category.category_type}`}>{category.category_type}</span>
      </div>
      <h3>{category.name}</h3>
      <p>{category.has_transactions ? 'Used in your transaction history' : 'Ready to use'}</p>
      <div className="category-card-actions">
        {category.is_active ? (
          <>
            <button className="category-action" onClick={() => handleDeactivate(category.id)}>Deactivate</button>
            {!category.has_transactions && <button className="category-action category-action--delete" onClick={() => handleDelete(category.id)}>Delete</button>}
          </>
        ) : (
          <button className="category-action" onClick={() => handleReactivate(category.id)}>Reactivate</button>
        )}
      </div>
    </li>
  );

  return (
    <section className="category-list-panel">
      <div className="category-list-heading"><div><p className="eyebrow">YOUR ORGANIZATION</p><h2>Active categories</h2></div><span className="count-pill">{active.length} active</span></div>
      {error && <p className="category-error">{error}</p>}
      {active.length === 0 ? <p className="category-empty">No categories yet. Add one above to get started.</p> : <ul className="category-grid">{active.map(renderCategory)}</ul>}

      {inactive.length > 0 && (
        <details className="inactive-categories">
          <summary>Archived categories <span>{inactive.length}</span></summary>
          <ul className="category-grid">{inactive.map(renderCategory)}</ul>
        </details>
      )}
    </section>
  );
}

export default CategoriesList;
