import useState from 'react';
import axios from 'axios';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const response = await axios.post('/api/auth/register', { name, email, password });
            console.log(response.data);
        }catch(error){
            console.log(error);
        }
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
            <input type="password" id="password" onChange={(e) => setPassword(e.target.value)} name="password" placeholder="Enter your password" required />
          </div>

          <button type="submit" className="signup-button">
            Create account
          </button>
        </form>

        <p className="signup-footer">
          Already have an account? <a href="#">Sign in</a>
        </p>
      </div>
    </div>
  )
}

export default Signup
