import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import { UserPlus, ShieldCheck, Mail, Lock, User, Eye, LineChart } from 'lucide-react';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('viewer');
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
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setSubmitting(true);
    try {
      await api('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
      });
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Could not create account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div className="glass animate-fade-in" style={styles.card}>
        <div style={styles.header}>
          <ShieldCheck size={40} color="var(--accent-primary)" />
          <h2 style={styles.title}>Create account</h2>
          <p style={styles.subtitle}>Pick a role, then enter your details below</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.roleBlock}>
            <span style={styles.roleBlockLabel} id="signup-role-label">
              Sign up as
            </span>
            <div
              style={styles.roleCards}
              role="group"
              aria-labelledby="signup-role-label"
            >
              <button
                type="button"
                aria-pressed={role === 'viewer'}
                onClick={() => setRole('viewer')}
                style={{
                  ...styles.roleCard,
                  ...(role === 'viewer' ? styles.roleCardSelectedPrimary : styles.roleCardIdle),
                }}
              >
                <div
                  style={{
                    ...styles.roleCardIcon,
                    color:
                      role === 'viewer'
                        ? 'var(--accent-primary)'
                        : 'var(--text-secondary)',
                  }}
                >
                  <Eye size={22} strokeWidth={1.75} />
                </div>
                <span style={styles.roleCardTitle}>Viewer</span>
                <span style={styles.roleCardHint}>Read dashboard &amp; records</span>
              </button>
              <button
                type="button"
                aria-pressed={role === 'analyst'}
                onClick={() => setRole('analyst')}
                style={{
                  ...styles.roleCard,
                  ...(role === 'analyst' ? styles.roleCardSelectedSecondary : styles.roleCardIdle),
                }}
              >
                <div
                  style={{
                    ...styles.roleCardIcon,
                    color:
                      role === 'analyst'
                        ? 'var(--accent-secondary)'
                        : 'var(--text-secondary)',
                  }}
                >
                  <LineChart size={22} strokeWidth={1.75} />
                </div>
                <span style={styles.roleCardTitle}>Analyst</span>
                <span style={styles.roleCardHint}>Insights &amp; reporting role</span>
              </button>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <User size={18} style={styles.icon} />
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
              autoComplete="name"
            />
          </div>

          <div style={styles.inputGroup}>
            <Mail size={18} style={styles.icon} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
              autoComplete="email"
            />
          </div>

          <div style={styles.inputGroup}>
            <Lock size={18} style={styles.icon} />
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <div style={styles.inputGroup}>
            <Lock size={18} style={styles.icon} />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button} disabled={submitting}>
            <UserPlus size={18} style={{ marginRight: 8 }} />
            {submitting ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p style={styles.switch}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>
            Sign in
          </Link>
        </p>

        <p style={styles.credit}>Made by Akhil</p>
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
    maxWidth: '440px',
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
  roleBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  roleBlockLabel: {
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
  },
  roleCards: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  roleCard: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '8px',
    padding: '18px 12px 16px',
    borderRadius: '12px',
    cursor: 'pointer',
    font: 'inherit',
    color: 'var(--text-primary)',
    transition: 'border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
    outline: 'none',
  },
  roleCardIdle: {
    border: '1px solid var(--card-border)',
    background: 'rgba(255, 255, 255, 0.03)',
    boxShadow: 'none',
  },
  roleCardSelectedPrimary: {
    border: '2px solid var(--accent-primary)',
    background: 'rgba(34, 211, 238, 0.08)',
    boxShadow: '0 0 20px rgba(34, 211, 238, 0.12)',
  },
  roleCardSelectedSecondary: {
    border: '2px solid var(--accent-secondary)',
    background: 'rgba(52, 211, 153, 0.08)',
    boxShadow: '0 0 20px rgba(52, 211, 153, 0.1)',
  },
  roleCardIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.06)',
    marginBottom: '2px',
  },
  roleCardTitle: {
    fontSize: '15px',
    fontWeight: 700,
    letterSpacing: '0.02em',
  },
  roleCardHint: {
    fontSize: '11px',
    lineHeight: 1.35,
    color: 'var(--text-secondary)',
    maxWidth: '140px',
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
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '14px',
    color: 'var(--text-secondary)',
  },
  link: {
    color: 'var(--accent-primary)',
    textDecoration: 'none',
    fontWeight: 600,
  },
  credit: {
    marginTop: '24px',
    marginBottom: 0,
    textAlign: 'center',
    fontSize: '11px',
    letterSpacing: '0.04em',
    color: 'var(--text-secondary)',
    opacity: 0.55,
  },
};

export default SignUpPage;
