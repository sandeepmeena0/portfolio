import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useApi } from './hooks/useApi'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import GithubSection from './components/GithubSection'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ParticleCanvas from './components/ParticleCanvas'
import CustomCursor from './components/CustomCursor'
import BackToTop from './components/BackToTop'

// Admin Components (To be created)
import AdminLayout from './admin/AdminLayout'
import AdminLogin from './admin/AdminLogin'
import Dashboard from './admin/Dashboard'
import ManageProjects from './admin/ManageProjects'
import Messages from './admin/Messages'
import Analytics from './admin/Analytics'
import ManageSettings from './admin/ManageSettings'

import './App.css'

function Portfolio() {
    const [isAppReady, setIsAppReady] = useState(false)
    const api = useApi()

    useEffect(() => {
        const initializeApp = async () => {
            // Ping the backend to wake it up and pre-load data
            await api.getSettings()
            
            // Brief smooth transition
            setTimeout(() => {
                setIsAppReady(true)
            }, 600)
        }
        initializeApp()
    }, [])

    if (!isAppReady) {
        return (
            <div style={{
                position: 'fixed', inset: 0,
                backgroundColor: 'var(--bg-primary)',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center',
                zIndex: 9999, color: 'var(--accent-primary)',
                fontFamily: 'var(--font-mono)'
            }}>
                <div className="projects-spinner" style={{ width: '50px', height: '50px', marginBottom: '20px', borderTopColor: 'var(--accent-primary)', borderRightColor: 'var(--accent-secondary)' }}></div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '8px' }}>Preparing Portfolio</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Waking up the server...</p>
            </div>
        )
    }

    return (
        <>
            <CustomCursor />
            <ParticleCanvas />
            <Navbar />
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <GithubSection />
            <Contact />
            <Footer />
            <BackToTop />
        </>
    )
}

function App() {
    const location = useLocation()
    const api = useApi()

    // Track page views
    useEffect(() => {
        // Don't track admin pages
        if (!location.pathname.startsWith('/admin')) {
            api.trackPageView(location.pathname)
        }
    }, [location.pathname])

    return (
        <Routes>
            {/* Public Portfolio Route */}
            <Route path="/" element={<Portfolio />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="projects" element={<ManageProjects />} />
                <Route path="messages" element={<Messages />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<ManageSettings />} />
            </Route>
        </Routes>
    )
}

export default App
