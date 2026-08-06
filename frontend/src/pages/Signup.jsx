import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const response = await axios.post('/api/auth/register', { name, email, password });
            console.log(response);
            navigate('/dashboard');
        }catch(error){
            console.log(error);
        }
    };

    const togglePassword = () => {
      setShowPassword((prev) => !prev);
    };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="signup-brand">
          <div className="signup-icon">✎</div>
          <h2 className="signup-title">Create your account</h2>
          <p className="signup-subtitle">Organize your notes with clarity and confidence.</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="signup-field">
            <label htmlFor="name">Full name</label>
            <input type="text" id="name" onChange={(e) => setName(e.target.value)} name="name" placeholder="Enter your name" required />
          </div>

          <div className="signup-field">
            <label htmlFor="email">Email address</label>
            <input type="email" id="email" onChange={(e) => setEmail(e.target.value)} name="email" placeholder="Enter your email" required />
          </div>

          <div className="signup-field">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePassword}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" className="signup-button">
            Create account
          </button>
        </form>

        <p className="signup-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
