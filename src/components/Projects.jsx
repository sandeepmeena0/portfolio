import { useState, useEffect } from 'react'
import { useScrollAnimation } from '../hooks/useAnimations'
import { useApi } from '../hooks/useApi'
import './Projects.css'

const filters = [
    { label: 'All', value: 'all' },
    { label: 'Mern Stack', value: 'fullstack' },
    { label: 'Frontend', value: 'frontend' },
    { label: 'Backend', value: 'backend' },
]

export default function Projects() {
    const [activeFilter, setActiveFilter] = useState('all')
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [headerRef, headerVisible] = useScrollAnimation()
    const api = useApi()

    useEffect(() => {
        const loadProjects = async () => {
            const res = await api.fetchProjects()
            if (res.success) {
                setProjects(res.data)
            }
            setLoading(false)
        }
        loadProjects()
    }, [])

    const filtered = activeFilter === 'all'
        ? projects
        : projects.filter(p => p.category === activeFilter)

    return (
        <section className="section projects" id="projects">
            <div className="container">
                <div ref={headerRef} className={`section-header animate-hidden ${headerVisible ? 'animate-visible' : ''}`}>
                    <span className="section-tag">&lt;projects&gt;</span>
                    <h2 className="section-title">Featured <span className="gradient-text">Projects</span></h2>
                    <p className="section-subtitle">Some of my recent work that I'm proud of</p>
                </div>
                <div className="projects-filter">
                    {filters.map(f => (
                        <button
                            key={f.value}
                            className={`filter-btn ${activeFilter === f.value ? 'active' : ''}`}
                            onClick={() => setActiveFilter(f.value)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
                {loading ? (
                    <div className="projects-loading">
                        <div className="projects-spinner"></div>
                        <p>Fetching projects from live server... (takes a few seconds if server is waking up)</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="projects-loading">
                        <p>No projects found. Add some from the admin panel!</p>
                    </div>
                ) : (
                    <div className="projects-grid">
                        {filtered.map((project, i) => (
                            <ProjectCard key={project.id || project.title || i} project={project} index={i} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

function ProjectCard({ project, index }) {
    const [ref, visible] = useScrollAnimation()

    const handleMouseMove = (e) => {
        const card = e.currentTarget
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const rotateX = (y - rect.height / 2) / 20
        const rotateY = (rect.width / 2 - x) / 20
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`
    }

    const handleMouseLeave = (e) => {
        e.currentTarget.style.transform = ''
    }

    const handleCardClick = (e) => {
        if (e.target.closest('.project-link')) {
            return
        }
        const targetUrl = project.live || project.github
        if (targetUrl) {
            window.open(targetUrl, '_blank', 'noopener,noreferrer')
        }
    }

    return (
        <div
            ref={ref}
            className={`project-card animate-hidden ${visible ? 'animate-visible' : ''}`}
            style={{ transitionDelay: `${index * 100}ms` }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
        >
            <div className="project-image">
                {project.image ? (
                    <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div className="project-image-placeholder">
                        <i className={project.icon}></i>
                    </div>
                )}
                <div className="project-overlay">
                    <div className="project-links">
                        <a href={project.live} className="project-link" title="View Live" target="_blank" rel="noreferrer">
                            <i className="fas fa-external-link-alt"></i>
                        </a>
                        <a href={project.github} className="project-link" title="View Code" target="_blank" rel="noreferrer">
                            <i className="fab fa-github"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div className="project-info">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-tech">
                    {project.tech.map(t => <span key={t}>{t}</span>)}
                </div>
            </div>
        </div>
    )
}
