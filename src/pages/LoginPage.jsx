import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, ShieldCheck, Mail, Lock } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Sign in failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div className="glass animate-fade-in" style={styles.card}>
        <div style={styles.header}>
          <ShieldCheck size={40} color="var(--accent-primary)" />
          <h2 style={styles.title}>Finance Portal</h2>
          <p style={styles.subtitle}>Sign in to manage your records</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <Mail size={18} style={styles.icon} />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <Lock size={18} style={styles.icon} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button} disabled={submitting}>
            <LogIn size={18} style={{marginRight: 8}} />
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={styles.switch}>
          New here?{' '}
          <Link to="/signup" style={styles.link}>
            Create an account
          </Link>
        </p>

        <div style={styles.footer}>
          <p>Demo accounts:</p>
          <code>admin@finance.com / admin123</code><br/>
          <code>analyst@finance.com / analyst123</code><br/>
          <code>viewer@finance.com / viewer123</code>
          <p style={styles.credit}>Made by Akhil</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  title: {
    margin: '16px 0 8px',
    fontSize: '24px',
    letterSpacing: '1px',
    color: 'var(--text-primary)',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: '12px',
    color: 'var(--text-secondary)',
  },
  input: {
    width: '100%',
    padding: '12px 12px 12px 40px',
    borderRadius: '8px',
    border: '1px solid var(--card-border)',
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'border 0.3s',
  },
  button: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
    color: 'black',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s',
  },
  error: {
    color: 'var(--danger)',
    fontSize: '13px',
    textAlign: 'center',
    margin: '0',
  },
  switch: {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '14px',
    color: 'var(--text-secondary)',
  },
  link: {
    color: 'var(--accent-primary)',
    textDecoration: 'none',
    fontWeight: 600,
  },
  footer: {
    marginTop: '32px',
    textAlign: 'center',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    opacity: 0.7,
  },
  credit: {
    marginTop: '20px',
    marginBottom: 0,
    fontSize: '11px',
    letterSpacing: '0.04em',
    color: 'var(--text-secondary)',
    opacity: 0.55,
  },
};

export default LoginPage;
