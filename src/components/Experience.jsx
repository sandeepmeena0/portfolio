import { useScrollAnimation } from '../hooks/useAnimations'
import './Experience.css'

const timeline = [
    {
        icon: 'fas fa-briefcase',
        title: 'Web Developer',
        company: 'Self Employed',
        date: '2024 - Present',
        desc: 'Building web applications for clients using the MERN stack. Delivering responsive, performant, and user-friendly solutions.',
        badge: 'Current',
    },
    {
        icon: 'fas fa-laptop-code',
        title: 'Personal Projects',
        company: 'Self Learning',
        date: '2023 - 2024',
        desc: 'Built multiple full-stack projects to strengthen my skills in React, Node.js, Express, and MongoDB. Contributed to open-source projects.',
    },
    {
        icon: 'fas fa-graduation-cap',
        title: 'Web Development Journey',
        company: 'Self-taught & Online Courses',
        date: '2022 - 2023',
        desc: 'Started learning web development through online platforms. Mastered HTML, CSS, JavaScript, and gradually moved to full-stack development.',
    },
]

export default function Experience() {
    const [headerRef, headerVisible] = useScrollAnimation()

    return (
        <section className="section experience" id="experience">
            <div className="container">
                <div ref={headerRef} className={`section-header animate-hidden ${headerVisible ? 'animate-visible' : ''}`}>
                    <span className="section-tag">&lt;experience&gt;</span>
                    <h2 className="section-title">My <span className="gradient-text">Journey</span></h2>
                    <p className="section-subtitle">Education and professional experience</p>
                </div>
                <div className="timeline">
                    {timeline.map((item, i) => (
                        <TimelineItem key={item.title} item={item} index={i} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function TimelineItem({ item, index }) {
    const [ref, visible] = useScrollAnimation()
    const direction = index % 2 === 0 ? 'fade-right' : 'fade-left'

    return (
        <div
            ref={ref}
            className={`timeline-item animate-hidden ${direction} ${visible ? 'animate-visible' : ''}`}
            style={{ transitionDelay: `${index * 150}ms` }}
        >
            <div className="timeline-dot">
                <i className={item.icon}></i>
            </div>
            <div className="timeline-content">
                {item.badge && <div className="timeline-badge">{item.badge}</div>}
                <h3>{item.title}</h3>
                <span className="timeline-company">{item.company}</span>
                <span className="timeline-date">{item.date}</span>
                <p>{item.desc}</p>
            </div>
        </div>
    )
}
