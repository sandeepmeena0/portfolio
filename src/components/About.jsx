import { useState, useEffect } from 'react'
import { useScrollAnimation, useCountUp } from '../hooks/useAnimations'
import { useApi } from '../hooks/useApi'
import './About.css'

function StatItem({ count, label }) {
    const [ref, visible] = useScrollAnimation(0.5)
    const animatedCount = useCountUp(count, 2000, visible)
    return (
        <div className="stat-item" ref={ref}>
            <span className="stat-number">{animatedCount}</span><span className="stat-plus">+</span>
            <span className="stat-label">{label}</span>
        </div>
    )
}

export default function About() {
    const [headerRef, headerVisible] = useScrollAnimation()
    const [imageRef, imageVisible] = useScrollAnimation()
    const [contentRef, contentVisible] = useScrollAnimation()
    
    const [stats, setStats] = useState({
        yearsExperience: 1,
        projectsBuilt: 10,
        technologies: 5,
        commits: 500
    })

    const [bio, setBio] = useState({
        aboutHeading: "A passionate developer who loves turning ideas into reality",
        aboutText1: "I'm a MERN Stack Developer with a strong foundation in building full-stack web applications. I specialize in creating responsive, user-friendly interfaces with React and robust backend services with Node.js and Express.",
        aboutText2: "My journey in web development started with curiosity and has grown into a deep passion for crafting elegant solutions to complex problems. I believe in writing clean, maintainable code and staying up-to-date with the latest technologies.",
        isFresher: false,
        fresherText: "Aspiring Developer",
        aboutImage: ""
    })

    const api = useApi()

    useEffect(() => {
        const loadSettingsAndStats = async () => {
            const res = await api.getSettings()
            let yearsExperience = 1
            let projectsBuiltCount = 10
            let technologiesCount = 5
            let commitsCount = 500

            if (res.success && res.data) {
                yearsExperience = res.data.yearsExperience ?? 1
                projectsBuiltCount = res.data.projectsBuilt ?? 10
                technologiesCount = res.data.technologies ?? 5
                commitsCount = res.data.commits ?? 500
                
                setBio({
                    aboutHeading: res.data.aboutHeading || "A passionate developer who loves turning ideas into reality",
                    aboutText1: res.data.aboutText1 || "",
                    aboutText2: res.data.aboutText2 || "",
                    isFresher: res.data.isFresher || false,
                    fresherText: res.data.fresherText || "Aspiring Developer",
                    aboutImage: res.data.aboutImage || ""
                })
            }

            // Fetch actual projects count dynamically
            try {
                const projectsRes = await api.fetchProjects()
                if (projectsRes.success && projectsRes.data) {
                    projectsBuiltCount = projectsRes.data.length
                }
            } catch (err) {
                // Fallback to settings if fetch fails
            }

            // Fetch commits directly from GitHub Search API for sandeepmeena0
            try {
                const gitRes = await fetch('https://api.github.com/search/commits?q=author:sandeepmeena0', {
                    headers: { 'Accept': 'application/vnd.github.cloak-preview' }
                })
                if (gitRes.ok) {
                    const gitData = await gitRes.json()
                    if (gitData.total_count !== undefined) {
                        commitsCount = gitData.total_count
                    }
                }
            } catch (err) {
                // Silently fallback to DB commits if API fails or rate limited
            }

            setStats({
                yearsExperience,
                projectsBuilt: projectsBuiltCount,
                technologies: technologiesCount,
                commits: commitsCount
            })
        }
        loadSettingsAndStats()
    }, [])

    const renderHeading = (text) => {
        if (!text) return "";
        const words = text.split(" ");
        if (words.length <= 1) return text;
        const lastWord = words.pop();
        return (
            <>
                {words.join(" ")}{" "}
                <span className="gradient-text">{lastWord}</span>
            </>
        )
    }

    return (
        <section className="section about" id="about">
            <div className="container">
                <div ref={headerRef} className={`section-header animate-hidden ${headerVisible ? 'animate-visible' : ''}`}>
                    <span className="section-tag">&lt;about&gt;</span>
                    <h2 className="section-title">About <span className="gradient-text">Me</span></h2>
                    <p className="section-subtitle">Get to know the developer behind the code</p>
                </div>
                <div className="about-grid">
                    <div ref={imageRef} className={`about-image-wrapper animate-hidden fade-right ${imageVisible ? 'animate-visible' : ''}`}>
                        <div className="about-image-container">
                            {bio.aboutImage ? (
                                <img 
                                    src={bio.aboutImage} 
                                    alt="Sandeep Meena" 
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '20px',
                                        position: 'relative',
                                        zIndex: 1,
                                        border: '1px solid var(--border-color)'
                                    }}
                                />
                            ) : (
                                <div className="about-image-placeholder">
                                    <i className="fas fa-code"></i>
                                    <span>SM</span>
                                </div>
                            )}
                            <div className="about-image-border"></div>
                        </div>
                        {bio.isFresher ? (
                            <div className="about-experience-badge">
                                <span className="experience-number"><i className="fas fa-rocket"></i></span>
                                <span className="experience-text" style={{ maxWidth: '100px', wordWrap: 'break-word' }}>{bio.fresherText}</span>
                            </div>
                        ) : (
                            <div className="about-experience-badge">
                                <span className="experience-number">{stats.yearsExperience}+</span>
                                <span className="experience-text">Years<br/>Experience</span>
                            </div>
                        )}
                    </div>
                    <div ref={contentRef} className={`about-content animate-hidden fade-left ${contentVisible ? 'animate-visible' : ''}`}>
                        <h3 className="about-heading">
                            {renderHeading(bio.aboutHeading)}
                        </h3>
                        <p className="about-text">{bio.aboutText1}</p>
                        {bio.aboutText2 && <p className="about-text">{bio.aboutText2}</p>}
                        <div className="about-stats">
                            <StatItem count={stats.projectsBuilt} label="Projects Built" />
                            <StatItem count={stats.technologies} label="Technologies" />
                            <StatItem count={stats.commits} label="Commits" />
                        </div>
                        <a href="#contact" className="btn btn-primary" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}>
                            <span>Let's Talk</span>
                            <i className="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
