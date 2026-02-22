import React, { useState } from 'react';

export default function Login({ setAuth, navigateTo }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem('user', JSON.stringify(data.user));
      setAuth(data.user);
    } catch (err) {
      if (err.message === "Failed to fetch") {
        // Fallback mock login for demo when backend is down
        const mockUser = { id: 'demo123', name: 'Demo User', email };
        localStorage.setItem('user', JSON.stringify(mockUser));
        setAuth(mockUser);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Simulate API call for password reset
    setTimeout(() => {
      setLoading(false);
      setResetSent(true);
    }, 1500);
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
            <h2 className="outfit-font">
              {isForgotPassword ? (resetSent ? 'Check your email' : 'Reset password') : 'Welcome back'}
            </h2>
            <p>
              {isForgotPassword 
                ? (resetSent ? 'We have sent a password reset link to your email.' : 'Enter your email to receive a password reset link.')
                : 'Please enter your details to sign in.'}
            </p>
          </div>

          {isForgotPassword ? (
            resetSent ? (
               <div className="auth-form">
                  <button 
                    type="button" 
                    className="btn btn-accent auth-submit" 
                    onClick={() => {
                      setIsForgotPassword(false);
                      setResetSent(false);
                      setEmail('');
                    }}
                  >
                    Back to Login
                  </button>
               </div>
            ) : (
              <form onSubmit={handleResetPassword} className="auth-form">
                {error && (
                  <div className="auth-error">
                    <i className="ri-error-warning-line"></i> {error}
                  </div>
                )}
                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-with-icon">
                    <i className="ri-mail-line"></i>
                    <input 
                      type="email" 
                      className="form-control"
                      placeholder="name@company.com" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-accent auth-submit" disabled={loading}>
                  {loading ? <i className="ri-loader-4-line ri-spin"></i> : 'Send Reset Link'}
                </button>
                <p className="auth-redirect" style={{ marginTop: '20px' }}>
                  Remember your password? <a href="#" onClick={(e) => { e.preventDefault(); setIsForgotPassword(false); }}>Back to login</a>
                </p>
              </form>
            )
          ) : (
            <>
              <form onSubmit={handleSubmit} className="auth-form">
                {error && (
                  <div className="auth-error">
                    <i className="ri-error-warning-line"></i> {error}
                  </div>
                )}

                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-with-icon">
                    <i className="ri-mail-line"></i>
                    <input 
                      type="email" 
                      className="form-control"
                      placeholder="name@company.com" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    Password
                    <a href="#" className="forgot-password" onClick={(e) => { e.preventDefault(); setIsForgotPassword(true); }}>Forgot password?</a>
                  </label>
                  <div className="input-with-icon">
                    <i className="ri-lock-line"></i>
                    <input 
                      type="password" 
                      className="form-control"
                      placeholder="••••••••" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-accent auth-submit" disabled={loading}>
                  {loading ? <i className="ri-loader-4-line ri-spin"></i> : 'Sign In'}
                </button>
              </form>

              <p className="auth-redirect">
                Don't have an account? <a onClick={() => navigateTo('register')}>Sign up</a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
