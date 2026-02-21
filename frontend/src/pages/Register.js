import React, { useState } from 'react';

export default function Register({ setAuth, navigateTo }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem('user', JSON.stringify(data.user));
      setAuth(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-brand">
        <div className="brand-content">
          <div className="brand-logo-large">
            <i className="ri-brain-line"></i>
          </div>
          <h1 className="outfit-font">BRD Intelligence Agent</h1>
          <p>Instantly transform your messy project communications into structured, professional Business Requirements Documents.</p>
          
          <div className="auth-features">
            <div className="auth-feature">
              <i className="ri-flashlight-fill"></i>
              <span>AI-Powered Extraction</span>
            </div>
            <div className="auth-feature">
              <i className="ri-team-fill"></i>
              <span>Stakeholder Mapping</span>
            </div>
            <div className="auth-feature">
              <i className="ri-file-chart-fill"></i>
              <span>Automated Reports</span>
            </div>
          </div>
        </div>
        <div className="auth-brand-bg"></div>
      </div>

      <div className="auth-form-container">
        <div className="auth-form-wrapper">
          <div className="auth-header">
            <h2 className="outfit-font">Create an account</h2>
            <p>Start generating BRDs automatically today.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="auth-error">
                <i className="ri-error-warning-line"></i> {error}
              </div>
            )}

            <div className="form-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <i className="ri-user-line"></i>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <i className="ri-mail-line"></i>
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <i className="ri-lock-line"></i>
                <input 
                  type="password" 
                  placeholder="Create a strong password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required 
                  minLength={6}
                />
              </div>
            </div>

            <button type="submit" className="btn-accent auth-submit" disabled={loading}>
              {loading ? <i className="ri-loader-4-line ri-spin"></i> : 'Create Account'}
            </button>
          </form>

          <p className="auth-redirect">
            Already have an account? <a onClick={() => navigateTo('login')}>Sign in here</a>
          </p>
        </div>
      </div>
    </div>
  );
}
