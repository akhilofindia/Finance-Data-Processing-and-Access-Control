import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  LogOut,
  User as UserIcon,
  Landmark,
} from 'lucide-react';

const MainLayout = ({ children }) => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <aside className="glass" style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoMark} aria-hidden>
            <Landmark size={22} color="var(--accent-primary)" strokeWidth={2} />
          </div>
          <span style={styles.logoText}>FiniDash</span>
        </div>

        <nav style={styles.nav}>
          <SidebarLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <SidebarLink to="/records" icon={<FileText size={20} />} label="Records" />
          
          {hasRole(['admin']) && (
            <SidebarLink to="/admin/users" icon={<Users size={20} />} label="Users" />
          )}
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              <UserIcon size={16} />
            </div>
            <div style={styles.userDetails}>
              <p style={styles.userName}>{user?.name}</p>
              <p style={styles.userRole}>{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.content}>
        {children}
      </main>
    </div>
  );
};

const SidebarLink = ({ to, icon, label }) => (
  <NavLink 
    to={to} 
    style={({ isActive }) => ({
      ...styles.link,
      background: isActive ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
      color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
      borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
    })}
  >
    {icon}
    <span style={{ marginLeft: '12px' }}>{label}</span>
  </NavLink>
);

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
  },
  sidebar: {
    width: '260px',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 0',
    borderRadius: '0 16px 16px 0',
    borderRight: '1px solid var(--card-border)',
  },
  logo: {
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '40px',
  },
  logoMark: {
    width: 44,
    height: 44,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    background: 'rgba(34, 211, 238, 0.1)',
    border: '1px solid rgba(34, 211, 238, 0.22)',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
    background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 24px',
    textDecoration: 'none',
    fontSize: '15px',
    transition: 'all 0.2s ease',
  },
  sidebarFooter: {
    padding: '20px 16px',
    borderTop: '1px solid var(--card-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetails: {
    overflow: 'hidden',
  },
  userName: {
    fontSize: '13px',
    fontWeight: '600',
    margin: 0,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  userRole: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    margin: 0,
    textTransform: 'capitalize',
  },
  logoutBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    transition: 'background 0.2s',
  },
  content: {
    marginLeft: '260px',
    flex: 1,
    padding: '40px',
  }
};

export default MainLayout;
