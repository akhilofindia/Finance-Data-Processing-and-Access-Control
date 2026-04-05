import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  UserPlus, 
  ToggleLeft, 
  ToggleRight, 
} from 'lucide-react';

const UserManagement = () => {
  const { users, updateUser, user: currentUser, fetchAllUsers } = useAuth();

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleToggleStatus = async (targetUser) => {
    if (targetUser.id === currentUser.id) return;
    await updateUser(targetUser.id, { role: targetUser.role, active: !targetUser.active });
  };

  const handleChangeRole = async (id, role, active) => {
    await updateUser(id, { role, active });
  };

  return (
    <div className="animate-fade-in" style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>User Management</h1>
        <button style={styles.addButton} disabled>
          <UserPlus size={18} />
          <span>New User (API)</span>
        </button>
      </div>

      <div className="glass" style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={styles.tr}>
                <td style={styles.td}>
                   <div style={styles.userInfo}>
                      <div style={styles.avatar}>{u.name.charAt(0)}</div>
                      <div>
                        <p style={styles.userName}>{u.name} {u.id === currentUser.id && '(You)'}</p>
                        <p style={styles.userEmail}>{u.email}</p>
                      </div>
                   </div>
                </td>
                <td style={styles.td}>
                  <select 
                    value={u.role} 
                    onChange={(e) => handleChangeRole(u.id, e.target.value, u.active)}
                    style={styles.roleSelect}
                    disabled={u.id === currentUser.id}
                  >
                    <option value="admin">Admin</option>
                    <option value="analyst">Analyst</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </td>
                <td style={styles.td}>
                   <span style={{ 
                     ...styles.statusBadge, 
                     background: u.active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                     color: u.active ? '#10b981' : '#94a3b8'
                   }}>
                     {u.active ? 'Active' : 'Inactive'}
                   </span>
                </td>
                <td style={styles.td}>
                   <button 
                     onClick={() => handleToggleStatus(u)}
                     style={{ 
                       ...styles.toggleBtn, 
                       color: u.active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                       opacity: u.id === currentUser.id ? 0.3 : 1
                     }}
                     disabled={u.id === currentUser.id}
                   >
                     {u.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  pageTitle: { fontSize: '28px', margin: 0, fontWeight: '700' },
  addButton: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', color: 'black', fontWeight: '600', opacity: 0.5 },
  tableCard: { overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '16px 24px', textAlign: 'left', fontSize: '14px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--card-border)' },
  td: { padding: '16px 24px', borderBottom: '1px solid var(--card-border)' },
  tr: { transition: 'background 0.2s' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: { width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(34, 211, 238, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  userName: { margin: 0, fontSize: '14px', fontWeight: '600' },
  userEmail: { margin: 0, fontSize: '12px', color: 'var(--text-secondary)' },
  roleSelect: { background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '6px', padding: '6px 12px', color: 'white', fontSize: '13px' },
  statusBadge: { padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' },
  toggleBtn: { background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }
};

export default UserManagement;
