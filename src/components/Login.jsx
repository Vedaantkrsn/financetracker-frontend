import { useState } from 'react';
import api from '../api/axios';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isRegistering) {
        await api.post('register/', {
          username,
          email,
          password,
        });
      }

      const response = await api.post('token/', {
        username,
        password,
      });

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      onLoginSuccess();
    } catch (err) {
      const data = err.response?.data;

      // Django REST Framework can return field errors as arrays.
      const messages = data && typeof data === 'object'
        ? Object.entries(data).flatMap(([field, value]) =>
          (Array.isArray(value) ? value : [value]).map((message) => `${field}: ${message}`)
        )
        : [];

      setError(
        messages.join(' ') ||
        (isRegistering
          ? 'Could not create the account. Check your details and try again.'
          : 'Invalid username or password.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-visual" aria-label="Welcome to Orbit Finance">
        <div className="login-brand"><span className="brand-orb" aria-hidden="true"><i /></span><span className="brand-name">orbit<span>finance</span></span></div>
        <div className="login-globe" aria-hidden="true"><span className="login-globe-ring login-globe-ring--one" /><span className="login-globe-ring login-globe-ring--two" /><span className="login-globe-core" /><span className="login-satellite login-satellite--one" /><span className="login-satellite login-satellite--two" /></div>
        <div className="login-visual-copy"><p className="eyebrow">A CLEARER VIEW OF YOUR MONEY</p><h1>Everything<br />in its orbit.</h1><p>Bring your spending, saving, and plans into balance.</p></div>
        <span className="login-visual-caption">PERSONAL FINANCE · YOUR WAY</span>
      </section>

      <section className="login-main">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-mobile-brand"><span className="brand-orb" aria-hidden="true"><i /></span><span className="brand-name">orbit<span>finance</span></span></div>
          <p className="eyebrow">{isRegistering ? 'GET STARTED' : 'WELCOME BACK'}</p>
          <h2>{isRegistering ? 'Create account' : 'Sign in'}</h2>
          <p className="login-intro">
            {isRegistering
              ? 'Create your personal finance space.'
              : 'Pick up where you left off.'}
          </p>
          {error && <p className="login-error" role="alert">{error}</p>}
          <div className="login-field">
            <label htmlFor="login-username">Username</label>
            <input
              id="login-username"
              type="text"
              autoComplete="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          {isRegistering && (
            <div className="login-field">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}
          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="login-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Please wait…'
              : isRegistering
                ? 'Create account'
                : 'Continue'}
            <span aria-hidden="true">↗</span>
          </button>

          <p className="login-switch">
            {isRegistering ? 'Already have an account?' : 'New to Orbit Finance?'}
            {' '}
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
            >
              {isRegistering ? 'Sign in' : 'Create one'}
            </button>
          </p>
          <p className="login-footnote"><span aria-hidden="true">◉</span> Your financial space is ready when you are.</p>
        </form>
      </section>
    </main>
  );
}

export default Login;
