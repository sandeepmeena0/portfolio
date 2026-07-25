import { useState, useEffect } from 'react'

export default function Analytics() {
    return (
        <div>
            <div style={{ background: 'var(--bg-card)', padding: '48px', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <i className="fas fa-tools" style={{ fontSize: '3rem', color: 'var(--accent-primary)', marginBottom: '16px' }}></i>
                <h2>Detailed Analytics</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                    This section is under construction. <br />
                    Basic stats are available on the Dashboard. Advanced features like geographic data and referrer tracking will be added here.
                </p>
            </div>
        </div>
    )
}
