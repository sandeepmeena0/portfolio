import { useEffect, useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import './admin.css'

export default function AdminLayout() {
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const location = useLocation()
    const api = useApi()

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
            const res = await api.verifyAuth()
            if (!res.success) {
                navigate('/admin/login')
            } else {
                setLoading(false)
            }
        }
        checkAuth()
    }, [navigate])

    // Close sidebar when route changes on mobile
    useEffect(() => {
        setIsSidebarOpen(false)
    }, [location.pathname])

    const handleLogout = () => {
        api.logout()
        navigate('/admin/login')
    }

    const getPageTitle = () => {
        const path = location.pathname
        if (path === '/admin') return 'Dashboard'
        if (path.includes('projects')) return 'Manage Projects'
        if (path.includes('messages')) return 'Messages'
        if (path.includes('analytics')) return 'Analytics'
        if (path.includes('settings')) return 'Settings'
        return 'Admin'
    }

    if (loading) {
        return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>
    }

    return (
        <div className="admin-container">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
            )}
            
            <aside className={`admin-sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2><span className="gradient-text">&lt;Admin /&gt;</span></h2>
                    <button className="mobile-close-btn" onClick={() => setIsSidebarOpen(false)}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <nav className="sidebar-nav">
                    <NavLink to="/admin" end className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                        <i className="fas fa-chart-pie"></i> Dashboard
                    </NavLink>
                    <NavLink to="/admin/projects" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                        <i className="fas fa-project-diagram"></i> Projects
                    </NavLink>
                    <NavLink to="/admin/messages" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                        <i className="fas fa-envelope"></i> Messages
                    </NavLink>
                    <NavLink to="/admin/analytics" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                        <i className="fas fa-chart-line"></i> Analytics
                    </NavLink>
                    <NavLink to="/admin/settings" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                        <i className="fas fa-cog"></i> Settings
                    </NavLink>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="btn-logout">
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                    <div style={{ marginTop: '16px', textAlign: 'center' }}>
                        <a href="/" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', fontSize: '0.85rem' }}>View Live Site <i className="fas fa-external-link-alt"></i></a>
                    </div>
                </div>
            </aside>
            <main className="admin-main">
                <header className="admin-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
                            <i className="fas fa-bars"></i>
                        </button>
                        <h1>{getPageTitle()}</h1>
                    </div>
                </header>
                <div className="admin-content">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
