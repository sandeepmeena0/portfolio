import { useState, useEffect } from 'react'
import { useScrollAnimation } from '../hooks/useAnimations'
import './Hero.css'

const phrases = [
    'Full-Stack Applications',
    'React Interfaces',
    'Node.js APIs',
    'Modern Websites',
    'Scalable Solutions',
    'Beautiful UIs'
]

export default function Hero() {
    const [text, setText] = useState('')
    const [phraseIdx, setPhraseIdx] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const currentPhrase = phrases[phraseIdx]
        let timeout

        if (!isDeleting) {
            if (text.length < currentPhrase.length) {
                timeout = setTimeout(() => setText(currentPhrase.slice(0, text.length + 1)), 80)
            } else {
                timeout = setTimeout(() => setIsDeleting(true), 2000)
            }
        } else {
            if (text.length > 0) {
                timeout = setTimeout(() => setText(text.slice(0, -1)), 40)
            } else {
                setIsDeleting(false)
                setPhraseIdx((phraseIdx + 1) % phrases.length)
            }
        }
        return () => clearTimeout(timeout)
    }, [text, phraseIdx, isDeleting])

    const [badgeRef, badgeVisible] = useScrollAnimation()
    const [titleRef, titleVisible] = useScrollAnimation()

    return (
        <section className="hero" id="hero">
            <div className="hero-content">
                <div ref={badgeRef} className={`hero-badge animate-hidden ${badgeVisible ? 'animate-visible' : ''}`}>
                    <span className="badge-dot"></span>
                    Available for opportunities
                </div>
                <h1 className="hero-title">
                    Hi, I'm <span className="gradient-text">Sandeep Meena</span>
                </h1>
                <div className="hero-subtitle-wrapper">
                    <span className="hero-subtitle-prefix">I build</span>
                    <span className="typewriter">{text}</span>
                    <span className="typewriter-cursor">|</span>
                </div>
                <p className="hero-description">
                    MERN Stack Developer passionate about crafting modern, scalable web applications
                    with clean code and stunning user experiences.
                </p>
                <div className="hero-cta">
                    <a href="#projects" className="btn btn-primary" onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) }}>
                        <span>View My Work</span>
                        <i className="fas fa-arrow-right"></i>
                    </a>
                    <a href="#contact" className="btn btn-outline" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}>
                        <span>Get In Touch</span>
                        <i className="fas fa-paper-plane"></i>
                    </a>
                </div>
                <div className="hero-social">
                    <a href="https://github.com/sandeepmeena" target="_blank" rel="noreferrer" className="social-link" aria-label="GitHub"><i className="fab fa-github"></i></a>
                    <a href="https://linkedin.com/in/sandeepmeena" target="_blank" rel="noreferrer" className="social-link" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                    <a href="mailto:sandeepmeena1136@gmail.com" className="social-link" aria-label="Email"><i className="fas fa-envelope"></i></a>
                </div>
            </div>
            <div className="hero-visual">
                <div className="code-window">
                    <div className="code-header">
                        <div className="code-dots">
                            <span className="dot dot-red"></span>
                            <span className="dot dot-yellow"></span>
                            <span className="dot dot-green"></span>
                        </div>
                        <span className="code-title">developer.js</span>
                    </div>
                    <pre className="code-body"><code>{`const `}<span className="code-variable">developer</span>{` = {\n`}
                        {`  `}<span className="code-property">name</span>{`: `}<span className="code-string">"Sandeep Meena"</span>{`,\n`}
                        {`  `}<span className="code-property">role</span>{`: `}<span className="code-string">"MERN Stack Developer"</span>{`,\n`}
                        {`  `}<span className="code-property">skills</span>{`: [\n`}
                        {`    `}<span className="code-string">"React"</span>{`, `}<span className="code-string">"Node.js"</span>{`,\n`}
                        {`    `}<span className="code-string">"Express"</span>{`, `}<span className="code-string">"MongoDB"</span>{`\n`}
                        {`  ],\n`}
                        {`  `}<span className="code-method">sayHello</span>{`() {\n`}
                        {`    return `}<span className="code-string">"Let's build something!"</span>{`;\n`}
                        {`  }\n`}
                        {`};`}</code></pre>
                </div>
            </div>
            <div className="scroll-indicator">
                <div className="scroll-mouse"><div className="scroll-wheel"></div></div>
                <span>Scroll Down</span>
            </div>
        </section>
    )
}
