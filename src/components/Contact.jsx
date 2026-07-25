import { useState } from 'react'
import { useScrollAnimation } from '../hooks/useAnimations'
import { useApi } from '../hooks/useApi'
import './Contact.css'

export default function Contact() {
    const [headerRef, headerVisible] = useScrollAnimation()
    const [infoRef, infoVisible] = useScrollAnimation()
    const [formRef, formVisible] = useScrollAnimation()
    const [submitted, setSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const api = useApi()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        const formData = {
            name: e.target.name.value,
            email: e.target.email.value,
            subject: e.target.subject.value,
            message: e.target.message.value
        }

        const res = await api.submitContact(formData)
        setIsSubmitting(false)

        if (res.success) {
            setSubmitted(true)
            setTimeout(() => {
                setSubmitted(false)
                e.target.reset()
            }, 3000)
        } else {
            alert('Failed to send message. Please try again.')
        }
    }

    return (
        <section className="section contact" id="contact">
            <div className="container">
                <div ref={headerRef} className={`section-header animate-hidden ${headerVisible ? 'animate-visible' : ''}`}>
                    <span className="section-tag">&lt;contact&gt;</span>
                    <h2 className="section-title">Get In <span className="gradient-text">Touch</span></h2>
                    <p className="section-subtitle">Have a project in mind? Let's work together!</p>
                </div>
                <div className="contact-grid">
                    <div ref={infoRef} className={`contact-info animate-hidden fade-right ${infoVisible ? 'animate-visible' : ''}`}>
                        <h3>Let's talk about your next project</h3>
                        <p>I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.</p>
                        <div className="contact-details">
                            <div className="contact-detail-item">
                                <div className="contact-icon"><i className="fas fa-envelope"></i></div>
                                <div>
                                    <span className="contact-label">Email</span>
                                    <a href="sandeepmeena1137@gmail.com">sandeepmeena1137@gmail.com</a>
                                </div>
                            </div>
                            <div className="contact-detail-item">
                                <div className="contact-icon"><i className="fas fa-map-marker-alt"></i></div>
                                <div>
                                    <span className="contact-label">Location</span>
                                    <span>India</span>
                                </div>
                            </div>
                            <div className="contact-detail-item">
                                <div className="contact-icon"><i className="fas fa-phone"></i></div>
                                <div>
                                    <span className="contact-label">Phone</span>
                                    <a href="tel:+917024781632">+91 7024781632</a>
                                </div>
                            </div>
                        </div>
                        <div className="contact-social">
                            <a href="https://github.com/sandeepmeena0" target="_blank" rel="noreferrer" className="social-link"><i className="fab fa-github"></i></a>
                            <a href="https://www.linkedin.com/in/sandeep-meena70/" target="_blank" rel="noreferrer" className="social-link"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                    </div>
                    <div ref={formRef} className={`contact-form-wrapper animate-hidden fade-left ${formVisible ? 'animate-visible' : ''}`}>
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input type="text" id="name" name="name" required placeholder=" " />
                                <label htmlFor="name">Your Name</label>
                                <span className="form-highlight"></span>
                            </div>
                            <div className="form-group">
                                <input type="email" id="email" name="email" required placeholder=" " />
                                <label htmlFor="email">Your Email</label>
                                <span className="form-highlight"></span>
                            </div>
                            <div className="form-group">
                                <input type="text" id="subject" name="subject" required placeholder=" " />
                                <label htmlFor="subject">Subject</label>
                                <span className="form-highlight"></span>
                            </div>
                            <div className="form-group">
                                <textarea id="message" name="message" rows="5" required placeholder=" "></textarea>
                                <label htmlFor="message">Your Message</label>
                                <span className="form-highlight"></span>
                            </div>
                            <button
                                type="submit"
                                className={`btn btn-primary btn-submit ${submitted ? 'submitted' : ''}`}
                            >
                                {submitted ? (
                                    <><i className="fas fa-check"></i><span>Message Sent!</span></>
                                ) : isSubmitting ? (
                                    <><span>Sending...</span><i className="fas fa-spinner fa-spin"></i></>
                                ) : (
                                    <><span>Send Message</span><i className="fas fa-paper-plane"></i></>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
