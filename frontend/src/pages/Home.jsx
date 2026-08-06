// import React from 'react'
import Navbar from '../components/Navbar'

const Home = () => {
  return (
    <div className="home-page">
      <Navbar />

      <section className="home-hero">
        <div className="home-hero-content">
          <p className="home-eyebrow">Smart note-taking for focused work</p>
          <h1>Capture ideas, stay organized, and move faster.</h1>
          <p className="home-description">
            Create a calm space for your thoughts, plans, and important reminders with a beautifully simple notes experience.
          </p>

          <div className="home-hero-actions">
            <a className="home-cta home-cta-primary" href="/register">Create account</a>
            <a className="home-cta home-cta-secondary" href="/login">Sign in</a>
          </div>
        </div>

        <div className="home-hero-card">
          <h3>Built for clarity</h3>
          <ul>
            <li>Organize notes in a calm, distraction-free workspace</li>
            <li>Keep your ideas searchable and easy to revisit</li>
            <li>Jump in quickly with a polished, modern interface</li>
          </ul>
        </div>
      </section>

      <section className="home-features">
        <article className="home-feature">
          <strong>Effortless writing</strong>
          <p>Create notes quickly and focus on what matters most.</p>
        </article>

        <article className="home-feature">
          <strong>Reliable organization</strong>
          <p>Group your thoughts and keep everything neatly structured.</p>
        </article>

        <article className="home-feature">
          <strong>Beautiful experience</strong>
          <p>Enjoy an interface designed to feel polished and professional.</p>
        </article>
      </section>
    </div>
  )
}

export default Home;
