import { useState } from 'react';
import api from '../api/axios';

function AddCategory({ onCategoryAdded }) {
    const [name, setName] = useState('');
    const [categoryType, setCategoryType] = useState('expense');    
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response= await api.post('categories/', {
                name,
                category_type: categoryType,
            });
            setName('');
            onCategoryAdded(response.data);
        } catch (err) {
            setError('Failed to add category');
        }
    };

    return (
        <form className="category-form" onSubmit={handleSubmit}>
            <div className="category-form-heading"><div><p className="eyebrow">CREATE A LABEL</p><h2>New category</h2></div><span className="category-form-orb" aria-hidden="true">＋</span></div>
            {error && <p className="category-error">{error}</p>}
            <div className="category-form-fields">
            <div>
                <label htmlFor="category-name">Category name</label>
                <input
                id="category-name"
                type="text"
                placeholder="Category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                />
            </div>
            <div>
                <label htmlFor="category-type">Category type</label>
                <select id="category-type" value={categoryType} onChange={(e) => setCategoryType(e.target.value)}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
                </select>
            </div>
            </div>
            <button className="primary-action category-submit" type="submit">Add category <span aria-hidden="true">↗</span></button>
        </form>
    );
}

export default AddCategory;
