// import React from 'react'

const Home = () => {
  return (
    <div className="home-page">
      <div className="home-card">
        <div className="home-header">
          <h1 className="home-title">Welcome to your Notes dashboard</h1>
          <p className="home-description">
            Your account is ready. Start creating notes, organizing ideas, and staying productive.
          </p>
        </div>

        <div className="home-features">
          <div className="home-feature">
            <strong>Quick notes</strong>
            <p>Easily save thoughts and ideas as they come.</p>
          </div>
          <div className="home-feature">
            <strong>Organized space</strong>
            <p>Keep your important notes in one clean, simple interface.</p>
          </div>
          <div className="home-feature">
            <strong>Secure storage</strong>
            <p>Your information is stored safely and ready whenever you need it.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
