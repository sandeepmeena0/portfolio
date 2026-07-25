import { useState, useEffect } from 'react'
import './Navbar.css'

const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'github', label: 'GitHub' },
    { id: 'contact', label: 'Contact' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [activeSection, setActiveSection] = useState('hero')
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)

            const sections = navItems.map(n => document.getElementById(n.id)).filter(Boolean)
            let current = 'hero'
            for (const section of sections) {
                if (window.scrollY >= section.offsetTop - 150) {
                    current = section.id
                }
            }
            setActiveSection(current)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        setMobileOpen(false)
    }

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="nav-container">
                <a href="#hero" className="nav-logo" onClick={(e) => { e.preventDefault(); scrollTo('hero') }}>
                    <span className="logo-bracket">&lt;</span>SM<span className="logo-bracket">/&gt;</span>
                </a>
                <ul className={`nav-links ${mobileOpen ? 'active' : ''}`}>
                    {navItems.map(item => (
                        <li key={item.id}>
                            <a
                                href={`#${item.id}`}
                                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                                onClick={(e) => { e.preventDefault(); scrollTo(item.id) }}
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
                <button
                    className={`nav-toggle ${mobileOpen ? 'active' : ''}`}
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle navigation"
                >
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>
            </div>
        </nav>
    )
}
