import {useState} from 'react';
import api from '../api/axios';


function CategoriesList({ categories, onCategoryChanged }) {
  const [error, setError] = useState(null);
  const active = categories.filter((c) => c.is_active);
  const inactive = categories.filter((c) => !c.is_active);

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
  }

  const renderCategory = (cat) => (
    <li key={cat.id}>
      {cat.name} ({cat.category_type})
      {cat.is_active ? (
        cat.has_transactions ? (
          <button onClick={() => handleDeactivate(cat.id)}>Deactivate</button>
        ) : (
          <>
            <button onClick={() => handleDeactivate(cat.id)}>Deactivate</button>
            <button onClick={() => handleDelete(cat.id)}>Delete</button>
          </>
        )
      ) : (
        <button onClick={() => handleReactivate(cat.id)}>Reactivate</button>
      )}
    </li>
  );

  return (
    <div>
      <h2>Categories</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {active.length === 0 ? <p>No categories yet.</p> : <ul>{active.map(renderCategory)}</ul>}

      {inactive.length > 0 && (
        <details>
          <summary>Deactivated ({inactive.length})</summary>
          <ul>{inactive.map(renderCategory)}</ul>
        </details>
      )}
    </div>
  );
}

export default CategoriesList;