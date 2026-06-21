import { useState } from 'react'
import { IconMail, IconPhone, IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react'
import PageWrapper from '../../components/PageWrapper/PageWrapper'
import './Contact.css'

const CONTACT_DETAILS = [
  { Icon: IconMail,         label: 'Email',    href: 'mailto:hello@reorderly.app', text: 'hello@reorderly.app' },
  { Icon: IconPhone,        label: 'Phone',    href: 'tel:+15550001234',           text: '+1 (555) 000-1234' },
  { Icon: IconBrandGithub,  label: 'GitHub',   href: 'https://github.com/reorderly', text: 'github.com/reorderly' },
  { Icon: IconBrandLinkedin,label: 'LinkedIn', href: 'https://linkedin.com/company/reorderly', text: 'linkedin.com/company/reorderly' },
]

export default function Contact() {
  const [form, setForm]       = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors]   = useState({})

  function set(key) {
    return (e) => {
      setForm(prev => ({ ...prev, [key]: e.target.value }))
      if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required.'
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email.'
    if (!form.message.trim()) errs.message = 'Message can\'t be empty.'
    if (Object.keys(errs).length) { setErrors(errs); return }

    // No backend — form submission is acknowledged locally only
    setSubmitted(true)
  }

  return (
    <PageWrapper page="voltron">
      <div className="page-content">
        <h1 className="contact-title">Contact Us</h1>
        <p className="contact-intro">Got a problem? Let Voltron's support team handle it.</p>

        {/* Contact details */}
        <ul className="contact-details">
          {CONTACT_DETAILS.map(({ Icon, label, href, text }) => (
            <li key={label} className="contact-detail card">
              <Icon size={24} stroke={1.5} aria-hidden="true" color="#C9A84C" />
              <div>
                <span className="contact-detail__label">{label}</span>
                <a href={href} className="contact-detail__value" target="_blank" rel="noopener noreferrer">
                  {text}
                </a>
              </div>
            </li>
          ))}
        </ul>

        <hr className="voltron-stripe" aria-hidden="true" />

        {/* Contact form */}
        {submitted ? (
          <div className="contact-success card" role="status">
            <p>Got it! Voltron's support team is on it.</p>
            <button className="btn-secondary btn-sm" onClick={() => { setForm({ name:'', email:'', message:'' }); setSubmitted(false) }}>
              Send Another
            </button>
          </div>
        ) : (
          <form className="contact-form card" onSubmit={handleSubmit} noValidate>
            <h2 className="contact-form__heading">Send a Message</h2>

            <div className="contact-form__grid">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input id="name" type="text" value={form.name} onChange={set('name')}
                  className={errors.name ? 'has-error' : ''}
                  aria-describedby={errors.name ? 'err-name' : undefined} />
                {errors.name && <span className="field-error" id="err-name" role="alert">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={form.email} onChange={set('email')}
                  className={errors.email ? 'has-error' : ''}
                  aria-describedby={errors.email ? 'err-email' : undefined} />
                {errors.email && <span className="field-error" id="err-email" role="alert">{errors.email}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" rows={5} value={form.message} onChange={set('message')}
                className={errors.message ? 'has-error' : ''}
                aria-describedby={errors.message ? 'err-msg' : undefined} />
              {errors.message && <span className="field-error" id="err-msg" role="alert">{errors.message}</span>}
            </div>

            <button type="submit" className="btn-primary">Send It</button>
          </form>
        )}
      </div>
    </PageWrapper>
  )
}
