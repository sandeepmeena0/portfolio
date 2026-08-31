import { useState, useEffect, useCallback } from 'react'
import { useApi } from '../hooks/useApi'

// Parse referrer to a friendly name
function parseReferrer(ref) {
    if (!ref) return 'Direct'
    try {
        const host = new URL(ref).hostname.replace('www.', '')
        if (host.includes('google')) return '🔍 Google'
        if (host.includes('linkedin')) return '💼 LinkedIn'
        if (host.includes('github')) return '🐙 GitHub'
        if (host.includes('twitter') || host.includes('x.com')) return '🐦 Twitter/X'
        if (host.includes('facebook')) return '📘 Facebook'
        if (host.includes('instagram')) return '📸 Instagram'
        return '🌐 ' + host
    } catch {
        return ref.length > 30 ? ref.slice(0, 30) + '…' : ref
    }
}

// Time ago formatter
function timeAgo(dateStr) {
    const now = new Date()
    const date = new Date(dateStr)
    const diff = Math.floor((now - date) / 1000)
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })
}

// Device icon
function DeviceIcon({ device }) {
    const icons = { Mobile: 'fas fa-mobile-alt', Tablet: 'fas fa-tablet-alt', Desktop: 'fas fa-desktop' }
    return <i className={icons[device] || 'fas fa-question'} title={device} />
}

// Browser icon
function BrowserIcon({ browser }) {
    const map = {
        Chrome: 'fab fa-chrome',
        Firefox: 'fab fa-firefox',
        Safari: 'fab fa-safari',
        Edge: 'fab fa-edge',
        Opera: 'fab fa-opera',
        IE: 'fab fa-internet-explorer'
    }
    return <i className={map[browser] || 'fas fa-globe'} title={browser} />
}

export default function Analytics() {
    const [logs, setLogs] = useState([])
    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)
    const [clearing, setClearing] = useState(false)
    const api = useApi()

    const fetchData = useCallback(async (pg = 1) => {
        setLoading(true)
        const [logsRes, summaryRes] = await Promise.all([
            api.getVisitorLogs(pg, 20),
            api.getAnalyticsSummary()
        ])
        if (logsRes.success) {
            setLogs(logsRes.data)
            setTotal(logsRes.total)
            setTotalPages(logsRes.pages)
            setPage(pg)
        }
        if (summaryRes.success) {
            setSummary(summaryRes.data)
        }
        setLoading(false)
    }, [])

    useEffect(() => { fetchData(1) }, [fetchData])

    const handleClear = async () => {
        if (!window.confirm('Are you sure you want to clear all visitor logs? This cannot be undone.')) return
        setClearing(true)
        await api.clearVisitorLogs()
        setClearing(false)
        fetchData(1)
    }

    const deviceBreakdown = summary?.deviceData || []
    const browserBreakdown = summary?.browserData || []

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Top Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
                <StatCard icon="fas fa-eye" label="Total Visits" value={summary?.totalViews ?? '—'} color="hsl(160,100%,40%)" />
                <StatCard icon="fas fa-calendar-day" label="Today" value={summary?.todayViews ?? '—'} color="hsl(220,100%,60%)" />
                <StatCard icon="fas fa-list" label="Log Records" value={total} color="hsl(280,100%,65%)" />
            </div>

            {/* Device & Browser Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <BreakdownCard title="Devices" icon="fas fa-mobile-alt" items={deviceBreakdown} total={summary?.totalViews || 1} />
                <BreakdownCard title="Browsers" icon="fas fa-globe" items={browserBreakdown} total={summary?.totalViews || 1} />
            </div>

            {/* Visitor Logs Table */}
            <div className="admin-table-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>
                            <i className="fas fa-list" style={{ color: 'var(--accent-primary)', marginRight: '10px' }} />
                            Visitor Logs
                        </h3>
                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>
                            {total} total records — showing {logs.length}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button onClick={() => fetchData(page)} className="admin-btn admin-btn-outline" style={{ fontSize: '0.82rem', padding: '7px 14px' }}>
                            <i className="fas fa-sync-alt" /> Refresh
                        </button>
                        <button onClick={handleClear} className="admin-btn" style={{ background: 'hsla(0,80%,55%,0.15)', color: 'hsl(0,80%,65%)', border: '1px solid hsla(0,80%,55%,0.25)', fontSize: '0.82rem', padding: '7px 14px' }} disabled={clearing}>
                            <i className="fas fa-trash" /> {clearing ? 'Clearing…' : 'Clear All'}
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-tertiary)' }}>
                        <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '12px' }} />
                        <p>Loading logs…</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-tertiary)' }}>
                        <i className="fas fa-ghost" style={{ fontSize: '2.5rem', marginBottom: '16px', display: 'block', opacity: 0.4 }} />
                        <p>No visitor logs yet.</p>
                        <p style={{ fontSize: '0.82rem', marginTop: '6px' }}>Logs will appear as visitors visit your portfolio.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="admin-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 4px' }}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Time</th>
                                    <th>Device</th>
                                    <th>Browser</th>
                                    <th>OS</th>
                                    <th>Page</th>
                                    <th>Referrer</th>
                                    <th>IP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log, i) => (
                                    <tr key={log._id} className="log-row">
                                        <td style={{ color: 'var(--text-tertiary)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
                                            {(page - 1) * 20 + i + 1}
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                                                {timeAgo(log.timestamp)}
                                            </span>
                                            <br />
                                            <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                                                {new Date(log.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                                <DeviceIcon device={log.device} />
                                                <span style={{ color: 'var(--text-secondary)' }}>{log.device}</span>
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                                <BrowserIcon browser={log.browser} />
                                                <span style={{ color: 'var(--text-secondary)' }}>{log.browser}</span>
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{log.os}</span>
                                        </td>
                                        <td>
                                            <span className="badge badge-primary" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                                                {log.path || '/'}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                                {parseReferrer(log.referrer)}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                                                {log.ip ? log.ip.replace('::ffff:', '') : '—'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
                        <button
                            onClick={() => fetchData(page - 1)}
                            disabled={page <= 1}
                            className="admin-btn admin-btn-outline"
                            style={{ padding: '7px 16px', fontSize: '0.85rem' }}
                        >
                            <i className="fas fa-chevron-left" /> Prev
                        </button>
                        <span style={{ padding: '7px 16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            Page {page} / {totalPages}
                        </span>
                        <button
                            onClick={() => fetchData(page + 1)}
                            disabled={page >= totalPages}
                            className="admin-btn admin-btn-outline"
                            style={{ padding: '7px 16px', fontSize: '0.85rem' }}
                        >
                            Next <i className="fas fa-chevron-right" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

function StatCard({ icon, label, value, color }) {
    return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: `2px solid ${color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>
                <i className={icon} style={{ color }} />
                {label}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', background: `linear-gradient(135deg, ${color}, hsl(220,100%,60%))`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {value}
            </div>
        </div>
    )
}

function BreakdownCard({ title, icon, items, total }) {
    return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className={icon} style={{ color: 'var(--accent-primary)' }} /> {title}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {items.length === 0 ? (
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>No data yet</p>
                ) : items.sort((a, b) => b.count - a.count).map(item => {
                    const pct = Math.round((item.count / total) * 100)
                    return (
                        <div key={item._id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                                <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{item._id || 'Unknown'}</span>
                                <span style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{item.count} ({pct}%)</span>
                            </div>
                            <div style={{ height: '5px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${pct}%`, background: 'var(--gradient-primary)', borderRadius: '3px', transition: 'width 0.6s ease' }} />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
