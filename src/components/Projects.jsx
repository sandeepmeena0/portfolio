import { useState, useEffect } from 'react'
import { useScrollAnimation } from '../hooks/useAnimations'
import { useApi } from '../hooks/useApi'
import './Projects.css'

const filters = [
    { label: 'All', value: 'all' },
    { label: 'Mern Stack', value: 'mern-stack' },
    { label: 'Frontend', value: 'frontend' },
    { label: 'Backend', value: 'backend' },
]

function SkeletonCard({ index }) {
    return (
        <div className="project-card skeleton-card" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="skeleton-image shimmer"></div>
            <div className="skeleton-body">
                <div className="skeleton-title shimmer"></div>
                <div className="skeleton-line shimmer"></div>
                <div className="skeleton-line short shimmer"></div>
                <div className="skeleton-tags">
                    <div className="skeleton-tag shimmer"></div>
                    <div className="skeleton-tag shimmer"></div>
                    <div className="skeleton-tag shimmer"></div>
                </div>
            </div>
        </div>
    )
}

export default function Projects() {
    const [activeFilter, setActiveFilter] = useState('all')
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [headerRef, headerVisible] = useScrollAnimation()
    const api = useApi()

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const res = await api.fetchProjects()
                if (res.success) {
                    setProjects(res.data)
                }
            } catch (e) {
                // fail silently
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
                    <div className="projects-grid">
                        {[0, 1, 2].map(i => <SkeletonCard key={i} index={i} />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="projects-empty">
                        <i className="fas fa-folder-open"></i>
                        <p>No projects found in this category.</p>
                    </div>
                ) : (
                    <div className="projects-grid">
                        {filtered.map((project, i) => (
                            <ProjectCard
                                key={project._id || project.id || project.title || i}
                                project={project}
                                index={i}
                            />
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
        if (e.target.closest('.project-link')) return
        const targetUrl = project.live || project.github
        if (targetUrl) window.open(targetUrl, '_blank', 'noopener,noreferrer')
    }

    const techList = Array.isArray(project.tech) ? project.tech : []

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
                        <i className={project.icon || 'fas fa-code'}></i>
                    </div>
                )}
                <div className="project-overlay">
                    <div className="project-links">
                        <a href={project.live || '#'} className="project-link" title="View Live" target="_blank" rel="noreferrer">
                            <i className="fas fa-external-link-alt"></i>
                        </a>
                        <a href={project.github || '#'} className="project-link" title="View Code" target="_blank" rel="noreferrer">
                            <i className="fab fa-github"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div className="project-info">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-tech">
                    {techList.map(t => <span key={t}>{t}</span>)}
                </div>
            </div>
        </div>
    )
}
