import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell,
} from 'recharts';

const COLORS = ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc948', '#b07aa1', '#ff9da7'];

const periodLabel = (period, granularity) => {
    const d = new Date(`${period}T00:00:00`);
    return granularity === 'day'
        ? d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
        : d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
};

const pad = (n) => String(n).padStart(2, '0');
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const inr = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

const getRange = (preset) => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    if (preset === 'this_month') return [new Date(y, m, 1), new Date(y, m + 1, 0)];
    if (preset === 'last_month') return [new Date(y, m - 1, 1), new Date(y, m, 0)];
    if (preset === 'last_3_months') return [new Date(y, m - 2, 1), new Date(y, m + 1, 0)];
    return [new Date(y, 0, 1), new Date(y, 11, 31)]; // this_year
};

function ReportsPage({ accounts, categories }) {
    const [preset, setPreset] = useState('this_month');
    const [customFrom, setCustomFrom] = useState('');
    const [customTo, setCustomTo] = useState('');
    const [account, setAccount] = useState('');
    const [category, setCategory] = useState('');
    const [kind, setKind] = useState('expense');
    const [sortDir, setSortDir] = useState('desc');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [from, to] =
        preset === 'custom' ? [customFrom, customTo] : getRange(preset).map(toISO);

    useEffect(() => {
        if (!from || !to) return;
        let ignore = false;
        setLoading(true);

        const params = { date_from: from, date_to: to };
        if (account) params.account = account;
        if (category) params.category = category;

        api.get('reports/', { params })
            .then((res) => {
                if (!ignore) {
                    setData(res.data);
                    setError('');
                }
            })
            .catch(() => {
                if (!ignore) setError('Failed to load report');
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });

        return () => {
            ignore = true;
        };
    }, [from, to, account, category]);

    const summary = data?.summary;
    const rows = data
        ? [...data.by_category[kind]].sort((a, b) =>
            sortDir === 'desc'
                ? parseFloat(b.total) - parseFloat(a.total)
                : parseFloat(a.total) - parseFloat(b.total)
        )
        : [];

    const trendData = data
        ? data.trend.map((t) => ({
            label: periodLabel(t.period, data.range.granularity),
            income: parseFloat(t.income),
            expense: parseFloat(t.expense),
            net: parseFloat(t.net),
        }))
        : [];

    const base = data ? data.by_category[kind] : [];
    const colorFor = Object.fromEntries(
        base.map((r, i) => [r.category, COLORS[i % COLORS.length]])
    );
    const pieData = base.map((r) => ({ name: r.category, value: parseFloat(r.total) }));

    return (
    <main className="reports-page">
            <header className="reports-header"><div><p className="eyebrow">SEE THE BIG PICTURE</p><h1>Reports</h1><p className="reports-subtitle">Follow the patterns behind your money.</p></div><span className="reports-header-orb" aria-hidden="true"><i /></span></header>

            <section className="report-filters">
                <div className="report-filter-heading"><div><p className="eyebrow">REPORT PARAMETERS</p><h2>Choose a view</h2></div>{loading && data && <span className="report-updating">Updating…</span>}</div>
                <div className="report-filter-controls">
                <select value={preset} onChange={(e) => setPreset(e.target.value)}>
                    <option value="this_month">This month</option>
                    <option value="last_month">Last month</option>
                    <option value="last_3_months">Last 3 months</option>
                    <option value="this_year">This year</option>
                    <option value="custom">Custom</option>
                </select>

                {preset === 'custom' && (
                    <>
                        <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
                        <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} />
                    </>
                )}

                <select value={account} onChange={(e) => setAccount(e.target.value)}>
                    <option value="">All accounts</option>
                    {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>

                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">All categories</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>

                </div>
            </section>

            {error && <p className="report-error">{error}</p>}

            {!data ? (
                <p className="report-empty">{preset === 'custom' ? 'Pick a start and end date.' : 'Loading…'}</p>
            ) : summary.transaction_count === 0 ? (
                <p className="report-empty">No transactions in this range.</p>
            ) : (
                <>
                    <section className="report-summary-grid">
                        <article className="report-summary-card report-summary-card--income"><span className="report-stat-orb">↙</span><p>Income</p><h3>{inr(summary.income)}</h3></article>
                        <article className="report-summary-card report-summary-card--expense"><span className="report-stat-orb">↗</span><p>Expenses</p><h3>{inr(summary.expenses)}</h3></article>
                        <article className="report-summary-card">
                            <span className="report-stat-orb">⌁</span>
                            <p>Net</p>
                            <h3 className={parseFloat(summary.net) >= 0 ? 'report-positive' : 'report-negative'}>
                                {inr(summary.net)}
                            </h3>
                        </article>
                        <article className="report-summary-card">
                            <span className="report-stat-orb">◌</span>
                            <p>Savings rate</p>
                            <h3>{summary.savings_rate === null ? 'N/A' : `${parseFloat(summary.savings_rate)}%`}</h3>
                        </article>
                        <article className="report-summary-card"><span className="report-stat-orb">▤</span><p>Transactions</p><h3>{summary.transaction_count}</h3></article>
                    </section>

                    <section className="report-chart-panel"><div className="report-section-heading"><div><p className="eyebrow">OVER TIME</p><h2>Income vs expenses</h2></div><span className="report-chart-orb" aria-hidden="true">↗</span></div>
                    <div className="report-chart">
                        <ResponsiveContainer>
                            <BarChart data={trendData} margin={{ top: 10, right: 12, left: 4, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 5" stroke="#314137" vertical={false} />
                                <XAxis dataKey="label" tick={{ fill: '#92a398', fontSize: 11 }} axisLine={{ stroke: '#34463a' }} tickLine={false} />
                                <YAxis tickFormatter={(v) => v.toLocaleString('en-IN')} tick={{ fill: '#92a398', fontSize: 10 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: '#1b2820', border: '1px solid #3a5140', borderRadius: 14, color: '#e5eee7' }} formatter={(v) => inr(v)} />
                                <Legend wrapperStyle={{ color: '#a7b6aa', fontSize: 11 }} />
                                <Bar dataKey="income" name="Income" fill="#8adba0" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="expense" name="Expenses" fill="#d98778" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    </section>

                    <section className="report-chart-panel"><div className="report-section-heading"><div><p className="eyebrow">NET MOVEMENT</p><h2>Cash flow</h2></div><span className="report-chart-orb" aria-hidden="true">⌁</span></div>
                    <div className="report-chart">
                        <ResponsiveContainer>
                            <BarChart data={trendData} margin={{ top: 10, right: 12, left: 4, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 5" stroke="#314137" vertical={false} />
                                <XAxis dataKey="label" tick={{ fill: '#92a398', fontSize: 11 }} axisLine={{ stroke: '#34463a' }} tickLine={false} />
                                <YAxis tickFormatter={(v) => v.toLocaleString('en-IN')} tick={{ fill: '#92a398', fontSize: 10 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: '#1b2820', border: '1px solid #3a5140', borderRadius: 14, color: '#e5eee7' }} formatter={(v) => inr(v)} />
                                <Bar dataKey="net" name="Net" radius={[6, 6, 0, 0]}>
                                    {trendData.map((d, i) => (
                                        <Cell key={i} fill={d.net >= 0 ? '#8adba0' : '#d98778'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    </section>

                    <section className="report-category-panel"><div className="report-section-heading"><div><p className="eyebrow">WHERE IT GOES</p><h2>By category</h2></div><div className="report-category-controls">
                    <select value={kind} onChange={(e) => setKind(e.target.value)}>
                        <option value="expense">Spending</option>
                        <option value="income">Income</option>
                    </select>
                    <button type="button" onClick={() => setSortDir(sortDir === 'desc' ? 'asc' : 'desc')}>
                        Sort: {sortDir === 'desc' ? 'high to low' : 'low to high'}
                    </button>
                    </div></div>

                    {pieData.length > 0 && (
                        <div className="report-chart report-pie-chart">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100}>
                                        {pieData.map((d) => (
                                            <Cell key={d.name} fill={colorFor[d.name]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: '#1b2820', border: '1px solid #3a5140', borderRadius: 14, color: '#e5eee7' }} formatter={(v) => inr(v)} />
                                    <Legend wrapperStyle={{ color: '#a7b6aa', fontSize: 11 }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {rows.length === 0 ? (
                        <p className="report-empty">None in this range.</p>
                    ) : (
                        <div className="report-table-wrap"><table className="report-table">
                            <thead>
                                <tr><th>Category</th><th>Transactions</th><th>Total</th><th>Share</th></tr>
                            </thead>
                            <tbody>
                                {rows.map((r) => (
                                    <tr key={r.category_id ?? 'uncategorized'}>
                                        <td>
                                            <span style={{
                                                display: 'inline-block', width: 10, height: 10,
                                                background: colorFor[r.category], marginRight: 6,
                                            }} />
                                            {r.category}
                                        </td>
                                        <td>{r.count}</td>
                                        <td>{inr(r.total)}</td>
                                        <td>{r.percent}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table></div>
                    )}
                    </section>

                    <section className="report-table-panel"><div className="report-section-heading"><div><p className="eyebrow">WHERE IT MOVES</p><h2>By account</h2></div></div>
                    <div className="report-table-wrap"><table className="report-table">
                        <thead>
                            <tr><th>Account</th><th>Income</th><th>Expenses</th><th>Net</th></tr>
                        </thead>
                        <tbody>
                            {data.by_account.map((a) => (
                                <tr key={a.account_id}>
                                    <td>{a.account}</td>
                                    <td>{inr(a.income)}</td>
                                    <td>{inr(a.expense)}</td>
                                    <td>{inr(parseFloat(a.income) - parseFloat(a.expense))}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table></div>
                    </section>
                </>
            )}
        </main>
    );
}

export default ReportsPage;
