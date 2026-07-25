import { useEffect, useRef } from 'react'
import { useScrollAnimation } from '../hooks/useAnimations'
import './Skills.css'

const skillCategories = [
    {
        title: 'Frontend',
        icon: 'fas fa-laptop-code',
        iconClass: 'frontend-icon',
        skills: [
            { icon: 'fab fa-react', name: 'React.js', level: 90 },
            { icon: 'fab fa-js-square', name: 'JavaScript', level: 85 },
            { icon: 'fab fa-html5', name: 'HTML5', level: 95 },
            { icon: 'fab fa-css3-alt', name: 'CSS3', level: 90 },
            { icon: 'fab fa-bootstrap', name: 'Tailwind CSS', level: 80 },
        ]
    },
    {
        title: 'Backend',
        icon: 'fas fa-server',
        iconClass: 'backend-icon',
        skills: [
            { icon: 'fab fa-node-js', name: 'Node.js', level: 85 },
            { icon: 'fas fa-route', name: 'Express.js', level: 85 },
            { icon: 'fas fa-database', name: 'MongoDB', level: 80 },
            { icon: 'fas fa-fire', name: 'Firebase', level: 70 },
            { icon: 'fas fa-key', name: 'REST APIs', level: 85 },
        ]
    },
    {
        title: 'Tools & Others',
        icon: 'fas fa-tools',
        iconClass: 'tools-icon',
        skills: [
            { icon: 'fab fa-git-alt', name: 'Git & GitHub', level: 85 },
            { icon: 'fab fa-npm', name: 'NPM', level: 80 },
            { icon: 'fas fa-terminal', name: 'VS Code', level: 90 },
            { icon: 'fab fa-figma', name: 'Figma', level: 65 },
            { icon: 'fas fa-cloud', name: 'Deployment', level: 75 },
        ]
    }
]

function SkillCategory({ category, delay }) {
    const [ref, visible] = useScrollAnimation(0.3)
    const barsRef = useRef([])

    useEffect(() => {
        if (visible) {
            barsRef.current.forEach((bar, i) => {
                if (bar) {
                    setTimeout(() => {
                        bar.style.setProperty('--level', category.skills[i].level + '%')
                        bar.classList.add('animated')
                    }, i * 100)
                }
            })
        }
    }, [visible, category.skills])

    return (
        <div
            ref={ref}
            className={`skill-category animate-hidden ${visible ? 'animate-visible' : ''}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className="skill-category-header">
                <div className={`skill-icon-wrapper ${category.iconClass}`}>
                    <i className={category.icon}></i>
                </div>
                <h3>{category.title}</h3>
            </div>
            <div className="skill-items">
                {category.skills.map((skill, i) => (
                    <div className="skill-item" key={skill.name}>
                        <i className={skill.icon}></i>
                        <span>{skill.name}</span>
                        <div
                            className="skill-level"
                            ref={el => barsRef.current[i] = el}
                            data-level={skill.level}
                        ></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function Skills() {
    const [headerRef, headerVisible] = useScrollAnimation()

    return (
        <section className="section skills" id="skills">
            <div className="container">
                <div ref={headerRef} className={`section-header animate-hidden ${headerVisible ? 'animate-visible' : ''}`}>
                    <span className="section-tag">&lt;skills&gt;</span>
                    <h2 className="section-title">My <span className="gradient-text">Skills</span></h2>
                    <p className="section-subtitle">Technologies and tools I work with</p>
                </div>
                <div className="skills-grid">
                    {skillCategories.map((cat, i) => (
                        <SkillCategory key={cat.title} category={cat} delay={i * 100} />
                    ))}
                </div>
            </div>
        </section>
    )
}
