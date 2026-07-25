import './Footer.css'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-logo">
                        <span className="logo-bracket">&lt;</span>SM<span className="logo-bracket">/&gt;</span>
                    </div>
                    <p className="footer-text">Designed & Built by <span className="gradient-text">Sandeep Meena</span></p>
                    <div className="footer-social">
                        <a href="https://github.com/sandeepmeena0" target="_blank" rel="noreferrer" aria-label="GitHub"><i className="fab fa-github"></i></a>
                        <a href="https://www.linkedin.com/in/sandeep-meena70/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                    <p className="footer-copyright">&copy; {new Date().getFullYear()} Sandeep Meena. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
