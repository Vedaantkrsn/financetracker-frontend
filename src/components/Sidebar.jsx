import {NavLink} from 'react-router-dom';

function Sidebar({onLogout}) {
    const linkStyle = ({isActive}) => ({
        display: 'block',
        padding: '8px',
        fontWeight: isActive ? 'bold' : 'normal',
    });
    return (
        <nav style={{ width: '180px', borderRight: '1px solid #ccc', padding: '16px'}}>
            <NavLink to="/" style={linkStyle} end>Dashboard</NavLink>
            <NavLink to="/transactions" style={linkStyle}>Transactions</NavLink>
            <NavLink to="/accounts" style={linkStyle}>Accounts</NavLink>
            <NavLink to="/categories" style={linkStyle}>Categories</NavLink>
            <NavLink to="/budgets" style={linkStyle}>Budget</NavLink>
            <button onClick={onLogout}>Logout</button>
        </nav>
    );
}

export default Sidebar;