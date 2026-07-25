import { useEffect, useState } from 'react'
import { useScrollAnimation, useCountUp } from '../hooks/useAnimations'
import './GithubSection.css'

export default function GithubSection() {
    const [headerRef, headerVisible] = useScrollAnimation()
    const [contentRef, contentVisible] = useScrollAnimation()
    const [reposCount, setReposCount] = useState(15)

    useEffect(() => {
        const fetchGithubRepos = async () => {
            try {
                const res = await fetch('https://api.github.com/users/sandeepmeena0')
                if (res.ok) {
                    const data = await res.json()
                    if (data.public_repos !== undefined) {
                        setReposCount(data.public_repos)
                    }
                }
            } catch (err) {
                // Silently fallback to default value
            }
        }
        fetchGithubRepos()
    }, [])

    return (
        <section className="section github-section" id="github">
            <div className="container">
                <div ref={headerRef} className={`section-header animate-hidden ${headerVisible ? 'animate-visible' : ''}`}>
                    <span className="section-tag">&lt;github&gt;</span>
                    <h2 className="section-title">My <span className="gradient-text">GitHub</span></h2>
                    <p className="section-subtitle">Check out my open source repositories and activity</p>
                </div>
                
                <div ref={contentRef} className={`github-content-centered animate-hidden ${contentVisible ? 'animate-visible' : ''}`}>
                    <div className="github-profile-card">
                        <div className="github-avatar">
                            <i className="fab fa-github"></i>
                        </div>
                        <h3 className="github-username">@sandeepmeena0</h3>
                        <p className="github-bio">MERN Stack Developer | Building modern web applications</p>
                        
                        <div className="github-stats-container">
                            <GithubStat icon="fas fa-book" count={reposCount} label="Repositories" isActive={contentVisible} />
                        </div>
                        
                        <a href="https://github.com/sandeepmeena0" target="_blank" rel="noreferrer" className="btn btn-primary github-btn">
                            <i className="fab fa-github"></i>
                            <span>View GitHub Profile</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

function GithubStat({ icon, count, label, isActive }) {
    const animated = useCountUp(count, 2000, isActive)
    return (
        <div className="github-stat github-stat-single">
            <i className={icon}></i>
            <span className="github-stat-number">{animated}</span>
            <span className="github-stat-label">{label}</span>
        </div>
    )
}
