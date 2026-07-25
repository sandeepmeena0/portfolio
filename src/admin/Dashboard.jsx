import { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'

export default function Dashboard() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const api = useApi()

    useEffect(() => {
        const fetchSummary = async () => {
            const res = await api.getAnalyticsSummary()
            if (res.success) {
                setData(res.data)
            }
            setLoading(false)
        }
        fetchSummary()
    }, [])

    if (loading) return <div>Loading dashboard...</div>
    if (!data) return <div>Failed to load data</div>

    return (
        <div>
            <div className="dashboard-grid">
                <div className="stat-card">
                    <div className="stat-icon"><i className="fas fa-eye"></i></div>
                    <div className="stat-info">
                        <h3>Total Views</h3>
                        <div className="stat-value">{data.totalViews}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon"><i className="fas fa-project-diagram"></i></div>
                    <div className="stat-info">
                        <h3>Projects</h3>
                        <div className="stat-value">{data.totalProjects}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon"><i className="fas fa-envelope"></i></div>
                    <div className="stat-info">
                        <h3>Messages</h3>
                        <div className="stat-value">{data.totalMessages}</div>
                        {data.unreadMessages > 0 && (
                            <span className="badge badge-unread" style={{ marginLeft: '8px' }}>
                                {data.unreadMessages} New
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="admin-table-container" style={{ padding: '24px' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Views (Last 7 Days)</h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '8px' }}>
                    {data.chartData.map((day, i) => {
                        const maxViews = Math.max(...data.chartData.map(d => d.views), 1);
                        const height = (day.views / maxViews) * 100;
                        return (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <div style={{ 
                                    width: '100%', 
                                    height: `${height}%`, 
                                    minHeight: day.views > 0 ? '4px' : '0',
                                    background: 'var(--gradient-primary)', 
                                    borderRadius: '4px 4px 0 0',
                                    transition: 'height 0.5s ease-out'
                                }}></div>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
