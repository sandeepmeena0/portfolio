import { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'

const DEFAULT_HEADING = "A passionate developer who loves turning ideas into reality"
const DEFAULT_TEXT1 = "I'm a MERN Stack Developer with a strong foundation in building full-stack web applications. I specialize in creating responsive, user-friendly interfaces with React and robust backend services with Node.js and Express."
const DEFAULT_TEXT2 = "My journey in web development started with curiosity and has grown into a deep passion for crafting elegant solutions to complex problems. I believe in writing clean, maintainable code and staying up-to-date with the latest technologies."

export default function ManageSettings() {
    const api = useApi()
    const [settings, setSettings] = useState({
        yearsExperience: 1,
        projectsBuilt: 10,
        technologies: 5,
        commits: 500,
        aboutHeading: DEFAULT_HEADING,
        aboutText1: DEFAULT_TEXT1,
        aboutText2: DEFAULT_TEXT2,
        isFresher: false,
        fresherText: "Aspiring Developer",
        aboutImage: ''
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        const loadSettings = async () => {
            const res = await api.getSettings()
            if (res.success && res.data) {
                setSettings({
                    yearsExperience: res.data.yearsExperience ?? 1,
                    projectsBuilt: res.data.projectsBuilt ?? 10,
                    technologies: res.data.technologies ?? 5,
                    commits: res.data.commits ?? 500,
                    aboutHeading: res.data.aboutHeading || DEFAULT_HEADING,
                    aboutText1: res.data.aboutText1 || DEFAULT_TEXT1,
                    aboutText2: res.data.aboutText2 || DEFAULT_TEXT2,
                    isFresher: res.data.isFresher || false,
                    fresherText: res.data.fresherText || "Aspiring Developer",
                    aboutImage: res.data.aboutImage || ''
                })
            }
            setLoading(false)
        }
        loadSettings()
    }, [])

    const handleChange = (e) => {
        const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value
        setSettings({
            ...settings,
            [e.target.name]: val
        })
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 3 * 1024 * 1024) {
                alert('Image file size should be less than 3MB.')
                return
            }
            const reader = new FileReader()
            reader.onloadend = () => {
                setSettings(prev => ({ ...prev, aboutImage: reader.result }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setMessage('')
        
        const res = await api.updateSettings(settings)
        setSaving(false)
        
        if (res.success) {
            setMessage('Settings updated successfully!')
            setTimeout(() => setMessage(''), 3000)
        } else {
            setMessage('Error updating settings.')
        }
    }

    if (loading) return <div style={{ padding: '24px' }}><i className="fas fa-spinner fa-spin"></i> Loading settings...</div>

    return (
        <div className="manage-settings">
            <div className="admin-card">
                <h2 style={{ marginBottom: '24px' }}>Edit About & Portfolio Settings</h2>
                
                {message && (
                    <div style={{ 
                        padding: '12px', 
                        borderRadius: '8px', 
                        marginBottom: '20px',
                        background: message.includes('success') ? 'hsla(160, 100%, 40%, 0.1)' : 'hsla(0, 100%, 60%, 0.1)',
                        color: message.includes('success') ? 'var(--accent-primary)' : '#ff4d4f',
                        border: `1px solid ${message.includes('success') ? 'var(--accent-primary)' : '#ff4d4f'}`
                    }}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Section 1: Statistics */}
                    <div className="settings-section">
                        <h3 className="settings-section-title">
                            <i className="fas fa-chart-bar"></i> Portfolio Statistics
                        </h3>
                        <div className="settings-grid">
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Years of Experience</label>
                                <input 
                                    type="number" 
                                    name="yearsExperience" 
                                    value={settings.yearsExperience} 
                                    onChange={handleChange} 
                                    className="admin-input" 
                                    min="0"
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Projects Built</label>
                                <input 
                                    type="number" 
                                    name="projectsBuilt" 
                                    value={settings.projectsBuilt} 
                                    onChange={handleChange} 
                                    className="admin-input" 
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Technologies Mastered</label>
                                <input 
                                    type="number" 
                                    name="technologies" 
                                    value={settings.technologies} 
                                    onChange={handleChange} 
                                    className="admin-input" 
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Total Commits</label>
                                <input 
                                    type="number" 
                                    name="commits" 
                                    value={settings.commits} 
                                    onChange={handleChange} 
                                    className="admin-input" 
                                    min="0"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: About Me Details */}
                    <div className="settings-section">
                        <h3 className="settings-section-title">
                            <i className="fas fa-user-edit"></i> About Me Details
                        </h3>
                        
                        <div className="form-group" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input 
                                type="checkbox" 
                                id="isFresher"
                                name="isFresher" 
                                checked={settings.isFresher} 
                                onChange={(e) => setSettings({ ...settings, isFresher: e.target.checked })} 
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <label htmlFor="isFresher" style={{ color: 'var(--text-secondary)', cursor: 'pointer', margin: 0 }}>I am a Fresher (Show custom text instead of Experience badge)</label>
                        </div>

                        {settings.isFresher && (
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Custom Fresher Badge Text</label>
                                <input 
                                    type="text" 
                                    name="fresherText" 
                                    value={settings.fresherText} 
                                    onChange={handleChange} 
                                    className="admin-input" 
                                    placeholder="e.g. Aspiring Developer"
                                    required
                                />
                            </div>
                        )}

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Profile Photo</label>
                            <label className="admin-btn btn-edit" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', marginBottom: '8px' }}>
                                <i className="fas fa-upload" style={{ marginRight: '8px' }}></i> Upload Photo
                                <input 
                                    type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} 
                                />
                            </label>
                            <div>
                                {settings.aboutImage && (
                                    <div style={{ position: 'relative', display: 'inline-block', marginTop: '12px' }}>
                                        <img 
                                            src={settings.aboutImage} 
                                            alt="Profile Preview" 
                                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', border: '2px solid var(--accent-primary)' }} 
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => setSettings({...settings, aboutImage: ''})}
                                            style={{ 
                                                position: 'absolute', top: '0', right: '0', 
                                                background: '#ff4d4f', color: '#fff', 
                                                border: 'none', borderRadius: '50%', 
                                                width: '24px', height: '24px', cursor: 'pointer', 
                                                display: 'flex', alignItems: 'center', justifyContent: 'center' 
                                            }}
                                            title="Remove Photo"
                                        >
                                            <i className="fas fa-times" style={{ fontSize: '12px' }}></i>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>About Heading / Tagline</label>
                            <input 
                                type="text" 
                                name="aboutHeading" 
                                value={settings.aboutHeading} 
                                onChange={handleChange} 
                                className="admin-input" 
                                placeholder="e.g. A passionate developer who loves turning ideas into reality"
                                required
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>About Paragraph 1 (Bio & Core Skills)</label>
                            <textarea 
                                name="aboutText1" 
                                value={settings.aboutText1} 
                                onChange={handleChange} 
                                className="admin-textarea" 
                                rows="4"
                                placeholder="Introduce yourself, your stack, and what you specialize in..."
                                required
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>About Paragraph 2 (Background & Passion)</label>
                            <textarea 
                                name="aboutText2" 
                                value={settings.aboutText2} 
                                onChange={handleChange} 
                                className="admin-textarea" 
                                rows="4"
                                placeholder="Share your coding journey, principles, and enthusiasm..."
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="admin-btn btn-success" disabled={saving} style={{ marginTop: '12px' }}>
                        {saving ? (
                            <><i className="fas fa-spinner fa-spin"></i> Saving...</>
                        ) : (
                            <><i className="fas fa-save"></i> Save Settings</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
