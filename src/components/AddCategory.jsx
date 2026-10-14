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
        <form onSubmit={handleSubmit}>
            <h3>Add Category</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <input
                type="text"
                placeholder="Category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                />
            </div>
            <div>
                <select value={categoryType} onChange={(e) => setCategoryType(e.target.value)}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
                </select>
            </div>
            <button type="submit">Add Category</button>
        </form>
    );
}

export default AddCategory;