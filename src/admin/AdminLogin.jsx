import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import ParticleCanvas from '../components/ParticleCanvas'
import './admin.css'

export default function AdminLogin() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const api = useApi()

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const res = await api.login(username, password)
        
        if (res.success) {
            navigate('/admin')
        } else {
            setError(res.message || 'Login failed')
            setLoading(false)
        }
    }

    return (
        <div className="login-page">
            <ParticleCanvas />
            <div className="login-card">
                <div className="login-logo">
                    <span className="gradient-text">&lt;Admin /&gt;</span>
                </div>
                <h2>Welcome Back</h2>
                <p className="section-subtitle" style={{marginBottom: '32px'}}>Sign in to manage your portfolio</p>
                
                {error && <div className="login-error">{error}</div>}
                
                <form onSubmit={handleLogin}>
                    <div style={{ textAlign: 'left', marginBottom: '8px' }}>
                        <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Username</label>
                    </div>
                    <input 
                        type="text" 
                        className="admin-input" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    
                    <div style={{ textAlign: 'left', marginBottom: '8px' }}>
                        <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Password</label>
                    </div>
                    <input 
                        type="password" 
                        className="admin-input" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                <div style={{ marginTop: '24px' }}>
                    <a href="/" style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>&larr; Back to Portfolio</a>
                </div>
            </div>
        </div>
    )
}
