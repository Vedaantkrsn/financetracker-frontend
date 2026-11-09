import { NavLink } from 'react-router-dom';

function Sidebar({ onLogout }) {
    return (
        <nav className="sidebar">
            <div className="sidebar-brand">
                <span className="brand-orb" aria-hidden="true"><i /></span>
                <span className="brand-name">orbit<span>finance</span></span>
            </div>
            <p className="sidebar-label">WORKSPACE</p>
            <div className="sidebar-links">
                <NavLink to="/" end><span className="nav-icon">◉</span>Dashboard</NavLink>
                <NavLink to="/transactions"><span className="nav-icon">↗</span>Transactions</NavLink>
                <NavLink to="/accounts"><span className="nav-icon">◌</span>Accounts</NavLink>
                <NavLink to="/categories"><span className="nav-icon">▦</span>Categories</NavLink>
                <NavLink to="/budgets"><span className="nav-icon">◷</span>Budget</NavLink>
                <NavLink to="/recurring"><span className="nav-icon">⟳</span>Recurring</NavLink>
                <NavLink to="/reports"><span className="nav-icon">⌁</span>Reports</NavLink>
            </div>
            <div className="sidebar-bottom">
                <div className="sidebar-note"><span className="note-orb" />Your finances,<br />in a clearer orbit.</div>
                <button className="logout-button" onClick={onLogout}><span className="nav-icon">↪</span>Log out</button>
            </div>
        </nav>
    );
}

export default Sidebar;
