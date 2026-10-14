import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import TransactionsPage from './pages/TransactionsPage';
import AccountsPage from './pages/AccountsPage';
import CategoriesPage from './pages/CategoriesPage';
import BudgetsPage from './pages/BudgetsPage';
import api from './api/axios';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({});
  const [budgets, setBudgets] = useState([]);

  const fetchAccounts = () => {
    api.get('accounts/')
      .then((response) => setAccounts(response.data))
      .catch(() => setError('Failed to load accounts'));
  };

  const fetchCategories = () => {
    api.get('categories/')
      .then((response) => setCategories(response.data))
      .catch(() => setError('Failed to load categories'));
  };

  const fetchTransactions = () => {
    api.get('transactions/')
      .then((response) => {
        setTransactions(response.data);
        setFilteredTransactions(response.data);
      })
      .catch(() => setError('Failed to load transactions'));
  };

  const fetchFilteredTransactions = (activeFilters) => {
    const params = {};
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    api.get('transactions/', { params })
      .then((response) => setFilteredTransactions(response.data))
      .catch(() => setError('Failed to load transactions'));
  };

  const fetchBudgets = () => {
    api.get('budgets/')
      .then((response) => setBudgets(response.data))
      .catch(() => setError('Failed to load budgets'));
  };


  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      api.get('accounts/'),
      api.get('transactions/'),
      api.get('categories/'),
      api.get('transactions/', { params: filters }),
      api.get('budgets/'),
    ])
      .then(([accountsRes, transactionsRes, categoriesRes, filteredTransactionsRes, budgetsRes]) => {
        setAccounts(accountsRes.data);
        setTransactions(transactionsRes.data);
        setCategories(categoriesRes.data);
        setFilteredTransactions(filteredTransactionsRes.data);
        setBudgets(budgetsRes.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load data');
        setLoading(false);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setAccounts([]);
    setTransactions([]);
    setCategories([]);
    setFilteredTransactions([]);
    setIsLoggedIn(false);
  };

  const handleTransactionAdded = () => {
    fetchAccounts();
    fetchTransactions();
    fetchFilteredTransactions(filters);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchFilteredTransactions(newFilters);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchAll();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        <Sidebar onLogout={handleLogout} />
        <div style={{ flex: 1, padding: '16px' }}>
          <Routes>
            <Route path="/" element={<Dashboard accounts={accounts} transactions={transactions} />} />
            <Route
              path="/transactions"
              element={
                <TransactionsPage
                  accounts={accounts}
                  categories={categories}
                  transactions={filteredTransactions}
                  onTransactionAdded={handleTransactionAdded}
                  onFilterChange={handleFilterChange}
                />
              }
            />
            <Route
              path="/accounts"
              element={
                <AccountsPage
                  accounts={accounts}
                  loading={loading}
                  error={error}
                  onAccountAdded={fetchAccounts}
                  onAccountsChanged={fetchAccounts}
                />
              }
            />
            <Route
              path="/categories"
              element={<CategoriesPage categories={categories} onCategoryAdded={fetchCategories} 
              onCategoryChanged={fetchCategories} />}
            />
            <Route path="/budgets" element={
              <BudgetsPage categories={categories} budgets={budgets} onBudgetChanged={fetchBudgets} />} 
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;