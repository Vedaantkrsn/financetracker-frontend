import {useState, useEffect} from 'react'; 
import api from '../api/axios';

const EMPTY = {
    name:'', transaction_type:'expense', account:'', category:'',
    amount: '', start_date:'', end_date:'', frequency:'monthly',  
}

function AddRecurring({accounts, categories, editingItem, onSaved, onCancelEdit}) {
    const [form, setForm] = useState(EMPTY);
    const [error, setError] = useState('');
    const isEditing = !!editingItem;

    useEffect(() => {
        setForm(editingItem ? {
            name: editingItem.name,
            transaction_type: editingItem.transaction_type,
            account: String(editingItem.account),
            category: editingItem.category ? String(editingItem.category) : '',
            amount: String(editingItem.amount),
            frequency: editingItem.frequency,
            start_date: editingItem.start_date,
            end_date: editingItem.end_date || '',
        } : {...EMPTY});
        setError('');
    }, [editingItem]);

    const set=(field) => (e) => setForm({...form, [field]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const payload = {
            name: form.name,
            transaction_type: form.transaction_type,
            account: form.account,
            category: form.category || null,
            amount: form.amount,
            frequency: form.frequency,
            end_date: form.end_date || null,
        };
        try {
            if (isEditing) {
                await api.patch(`recurring/${editingItem.id}/`, payload);
            } else {
                await api.post('recurring/', {...payload, start_date: form.start_date });
            }
        } catch (err) {
            const data = err.response?.data;
            const firstError= data ? Object.values(data).flat()[0] : null;
            setError(firstError || 'Failed to save recurring item');
            return;
        }
        setForm({...EMPTY});
        onSaved();
    };
    const accountOptions = accounts.filter((a) => a.is_active || String(a.id) === form.account);
    const categoryOptions = categories.filter(
        (c) => c.category_type === form.transaction_type && (c.is_active || String(c.id) === form.category)
    );

    return (
        <form className="recurring-form" onSubmit={handleSubmit}>
        <div className="recurring-form-heading"><div><p className="eyebrow">{isEditing ? 'UPDATE A ROUTINE' : 'ADD A ROUTINE'}</p><h2>{isEditing ? 'Edit recurring item' : 'New recurring item'}</h2></div><span className="recurring-form-orb" aria-hidden="true">⟳</span></div>
        {error && <p className="recurring-error">{error}</p>}

        <div className="recurring-form-fields">
        <label>Name<input placeholder="e.g. Rent, Netflix" value={form.name} onChange={set('name')} required /></label>

        <label>Type
        <select value={form.transaction_type}
            onChange={(e) => setForm({ ...form, transaction_type: e.target.value, category: '' })}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
        </select>
        </label>

        <label>Account
        <select value={form.account} onChange={set('account')} required>
            <option value="">Select account</option>
            {accountOptions.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        </label>

        <label>Category
        <select value={form.category} onChange={set('category')}>
            <option value="">No category</option>
            {categoryOptions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        </label>

        <label>Amount<input type="number" step="0.01" placeholder="Amount" value={form.amount} onChange={set('amount')} required /></label>

        <label>Frequency
        <select value={form.frequency} onChange={set('frequency')}>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
        </select>
        </label>

        <label>Start date<input type="date" value={form.start_date} onChange={set('start_date')} required disabled={isEditing} /></label>
        <label>End date <span>(optional)</span><input type="date" value={form.end_date} onChange={set('end_date')} /></label>
        </div>

        <div className="recurring-form-actions"><button className="primary-action" type="submit">{isEditing ? 'Save changes' : 'Add recurring item'} <span aria-hidden="true">↗</span></button>
        {isEditing && <button className="secondary-action" type="button" onClick={onCancelEdit}>Cancel</button>}</div>
        </form>
    );
}

export default AddRecurring;

