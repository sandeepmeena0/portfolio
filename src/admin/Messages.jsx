import { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'

export default function Messages() {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const api = useApi()

    useEffect(() => {
        fetchMessages()
    }, [])

    const fetchMessages = async () => {
        setLoading(true)
        const res = await api.getContacts()
        if (res.success) setMessages(res.data)
        setLoading(false)
    }

    const handleMarkRead = async (id) => {
        await api.markContactRead(id)
        fetchMessages()
    }

    const handleDelete = async (id) => {
        if (window.confirm('Delete this message permanently?')) {
            await api.deleteContact(id)
            fetchMessages()
        }
    }

    if (loading) return <div>Loading messages...</div>

    return (
        <div>
            <p style={{ marginBottom: '24px' }}>Inbox - Contact Form Submissions</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {messages.map(msg => (
                    <div key={msg.id} style={{ 
                        background: 'var(--bg-card)', 
                        padding: '24px', 
                        borderRadius: '12px', 
                        border: `1px solid ${msg.read ? 'var(--border-color)' : 'var(--accent-primary)'}`,
                        borderLeft: msg.read ? 'none' : '4px solid var(--accent-primary)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                                    {msg.subject} {!msg.read && <span className="badge badge-unread" style={{ marginLeft: '8px' }}>New</span>}
                                </h3>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    <strong>{msg.name}</strong> ({msg.email}) &bull; {new Date(msg.createdAt).toLocaleString()}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {!msg.read && (
                                    <button className="admin-btn btn-sm btn-success" onClick={() => handleMarkRead(msg.id)}>
                                        <i className="fas fa-check"></i> Mark Read
                                    </button>
                                )}
                                <button className="admin-btn btn-sm btn-delete" onClick={() => handleDelete(msg.id)}>
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div style={{ 
                            background: 'var(--bg-secondary)', 
                            padding: '16px', 
                            borderRadius: '8px',
                            color: 'var(--text-secondary)',
                            fontSize: '0.95rem',
                            lineHeight: '1.5',
                            whiteSpace: 'pre-wrap'
                        }}>
                            {msg.message}
                        </div>
                    </div>
                ))}

                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '48px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <i className="fas fa-inbox" style={{ fontSize: '3rem', color: 'var(--text-tertiary)', marginBottom: '16px' }}></i>
                        <p>No messages yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
