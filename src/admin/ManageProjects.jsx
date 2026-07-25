import { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'

export default function ManageProjects() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProject, setEditingProject] = useState(null)
    const [saving, setSaving] = useState(false)
    const [formError, setFormError] = useState('')
    const api = useApi()

    const emptyProject = {
        title: '', description: '', icon: 'fas fa-code',
        tech: '', category: 'mern-stack', live: '', github: '', image: ''
    }
    const [formData, setFormData] = useState(emptyProject)

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        setLoading(true)
        const res = await api.fetchProjects()
        if (res.success) setProjects(res.data)
        setLoading(false)
    }

    const handleOpenModal = (project = null) => {
        setFormError('')
        if (project) {
            setEditingProject(project)
            setFormData({
                ...project,
                tech: Array.isArray(project.tech) ? project.tech.join(', ') : (project.tech || ''),
                image: project.image || ''
            })
        } else {
            setEditingProject(null)
            setFormData(emptyProject)
        }
        setIsModalOpen(true)
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            await api.deleteProject(id)
            fetchProjects()
        }
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
                setFormData(prev => ({ ...prev, image: reader.result }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setFormError('')

        const projectData = {
            ...formData,
            tech: typeof formData.tech === 'string'
                ? formData.tech.split(',').map(t => t.trim()).filter(Boolean)
                : formData.tech
        }
        delete projectData.id;
        delete projectData._id;

        let res;
        if (editingProject) {
            res = await api.updateProject(editingProject.id, projectData)
        } else {
            res = await api.addProject(projectData)
        }

        setSaving(false)

        if (res && res.success) {
            setIsModalOpen(false)
            fetchProjects()
        } else {
            setFormError(res?.message || 'Failed to save project. Please check network connection.')
        }
    }

    if (loading) return <div>Loading projects...</div>

    return (
        <div>
            <div className="manage-projects-header">
                <p>Manage your portfolio projects</p>
                <button className="admin-btn btn-success" onClick={() => handleOpenModal()}>
                    <i className="fas fa-plus"></i> Add New
                </button>
            </div>

            {/* Desktop Table View */}
            <div className="admin-table-container desktop-only">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Icon</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Tech</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map(p => (
                            <tr key={p.id}>
                                <td>
                                    {p.image ? (
                                        <img src={p.image} alt={p.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                    ) : (
                                        <i className={p.icon} style={{ fontSize: '1.2rem', color: 'var(--accent-primary)' }}></i>
                                    )}
                                </td>
                                <td><strong style={{ color: 'var(--text-primary)' }}>{p.title}</strong></td>
                                <td><span className="badge badge-read">{p.category}</span></td>
                                <td>
                                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                        {p.tech.slice(0, 3).map(t => (
                                            <span key={t} style={{ fontSize: '0.75rem', background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: '4px' }}>{t}</span>
                                        ))}
                                        {p.tech.length > 3 && <span style={{ fontSize: '0.75rem' }}>+{p.tech.length - 3}</span>}
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="admin-btn btn-sm btn-edit" onClick={() => handleOpenModal(p)}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="admin-btn btn-sm btn-delete" onClick={() => handleDelete(p.id)}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {projects.length === 0 && (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>No projects found. Add one!</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="project-cards-mobile mobile-only">
                {projects.map(p => (
                    <div key={p.id} className="project-card-mobile">
                        <div className="project-card-mobile-header">
                            <div className="project-card-mobile-info">
                                {p.image ? (
                                    <img src={p.image} alt={p.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                ) : (
                                    <i className={p.icon} style={{ fontSize: '1.2rem', color: 'var(--accent-primary)' }}></i>
                                )}
                                <div>
                                    <strong>{p.title}</strong>
                                    <span className="badge badge-read" style={{ marginLeft: '8px' }}>{p.category}</span>
                                </div>
                            </div>
                            <div className="project-card-mobile-actions">
                                <button className="admin-btn btn-sm btn-edit" onClick={() => handleOpenModal(p)}>
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button className="admin-btn btn-sm btn-delete" onClick={() => handleDelete(p.id)}>
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div className="project-card-mobile-tech">
                            {p.tech.map(t => (
                                <span key={t}>{t}</span>
                            ))}
                        </div>
                    </div>
                ))}
                {projects.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>No projects found. Add one!</div>
                )}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 style={{ marginBottom: '24px', fontSize: '1.2rem' }}>{editingProject ? 'Edit Project' : 'Add Project'}</h2>

                        {formError && (
                            <div style={{
                                padding: '10px 14px',
                                borderRadius: '8px',
                                marginBottom: '16px',
                                background: 'hsla(0, 100%, 60%, 0.1)',
                                color: '#ff4d4f',
                                border: '1px solid #ff4d4f',
                                fontSize: '0.85rem'
                            }}>
                                <i className="fas fa-exclamation-circle" style={{ marginRight: '6px' }}></i>
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <input
                                type="text" placeholder="Project Title" className="admin-input" required
                                value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                            <textarea
                                placeholder="Description" className="admin-textarea" required rows="3"
                                value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>

                            <div className="modal-form-row">
                                <div style={{ flex: 1 }}>
                                    <label className="modal-label">Category</label>
                                    <select
                                        className="admin-input"
                                        value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="mern-stack">Mern Stack</option>
                                        <option value="frontend">Frontend</option>
                                        <option value="backend">Backend</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="modal-label">Icon (FA Class)</label>
                                    <input
                                        type="text" placeholder="fas fa-code" className="admin-input" required
                                        value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })}
                                    />
                                </div>
                            </div>

                            <label className="modal-label">Tech Stack (comma separated)</label>
                            <input
                                type="text" placeholder="React, Node.js, MongoDB" className="admin-input" required
                                value={formData.tech} onChange={e => setFormData({ ...formData, tech: e.target.value })}
                            />

                            <div className="modal-form-row">
                                <input
                                    type="text" placeholder="Live URL" className="admin-input" style={{ flex: 1 }}
                                    value={formData.live} onChange={e => setFormData({ ...formData, live: e.target.value })}
                                />
                                <input
                                    type="text" placeholder="GitHub URL" className="admin-input" style={{ flex: 1 }}
                                    value={formData.github} onChange={e => setFormData({ ...formData, github: e.target.value })}
                                />
                            </div>

                            <label className="modal-label">Project Photo / Screenshot</label>
                            <div style={{ marginBottom: '16px' }}>
                                <label className="admin-btn btn-edit" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                                    <i className="fas fa-upload" style={{ marginRight: '8px' }}></i> Upload Photo
                                    <input
                                        type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }}
                                    />
                                </label>
                            </div>

                            {formData.image && (
                                <div style={{ marginBottom: '16px', position: 'relative', display: 'inline-block', width: '100%' }}>
                                    <img
                                        src={formData.image}
                                        alt="Project Preview"
                                        style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, image: '' })}
                                        style={{
                                            position: 'absolute', top: '8px', right: '8px',
                                            background: 'rgba(0,0,0,0.7)', color: '#ff4d4f',
                                            border: '1px solid #ff4d4f', borderRadius: '50%',
                                            width: '30px', height: '30px', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                        title="Remove Photo"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            )}

                            <div className="modal-form-actions">
                                <button type="button" className="admin-btn" onClick={() => setIsModalOpen(false)} disabled={saving}>Cancel</button>
                                <button type="submit" className="admin-btn btn-success" disabled={saving}>
                                    {saving ? (
                                        <><i className="fas fa-spinner fa-spin"></i> Saving...</>
                                    ) : (
                                        <><i className="fas fa-save"></i> Save Project</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
