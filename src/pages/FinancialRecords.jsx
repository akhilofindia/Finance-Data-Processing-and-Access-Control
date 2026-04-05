import React, { useState, useEffect, useRef } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';

const CATEGORY_OPTIONS = [
  'Salary',
  'Freelance',
  'Rent',
  'Food',
  'Utilities',
  'Entertainment',
  'Transport',
  'Other',
].map((c) => ({ value: c, label: c }));

const TYPE_FILTER_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expenses' },
];

function DarkDropdown({ value, onChange, options, ariaLabel, listZIndex = 1200 }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value) ?? options[0];

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        style={styles.ddTrigger}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected.label}
        </span>
        <ChevronDown
          size={18}
          style={{
            flexShrink: 0,
            opacity: 0.75,
            transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'none',
          }}
        />
      </button>
      {open && (
        <ul role="listbox" style={{ ...styles.ddList, zIndex: listZIndex }}>
          {options.map((opt) => (
            <li key={String(opt.value)} role="presentation" style={{ listStyle: 'none', margin: 0 }}>
              <button
                type="button"
                role="option"
                aria-selected={opt.value === value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                style={{
                  ...styles.ddOption,
                  ...(opt.value === value ? styles.ddOptionActive : {}),
                }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const FinancialRecords = () => {
  const { records, addRecord, deleteRecord, fetchRecords, isLoading } = useFinance();
  const { hasRole } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: 'Other',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchRecords({ type: filterType });
  }, [filterType]);

  const filteredRecords = records.filter((r) => {
    return (
      r.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addRecord(formData);
    setIsModalOpen(false);
    setFormData({
      amount: '',
      type: 'expense',
      category: 'Other',
      notes: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const canMutateRecords = hasRole(['admin']);

  return (
    <div className="animate-fade-in" style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Financial Records</h1>
        {canMutateRecords && (
          <button onClick={() => setIsModalOpen(true)} style={styles.addButton}>
            <Plus size={18} />
            <span>Add Record</span>
          </button>
        )}
      </div>

      <div className="glass" style={styles.filterBar}>
        <div style={styles.searchBox}>
          <Search size={18} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.filterGroup}>
          <Filter size={18} color="var(--text-secondary)" />
          <div style={styles.filterDropdown}>
            <DarkDropdown
              value={filterType}
              onChange={setFilterType}
              options={TYPE_FILTER_OPTIONS}
              ariaLabel="Filter by transaction type"
              listZIndex={50}
            />
          </div>
        </div>
      </div>

      <div className="glass" style={styles.tableCard}>
        {isLoading ? (
          <p style={{ padding: '40px', textAlign: 'center' }}>Syncing with server...</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Notes</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Type</th>
                {canMutateRecords && <th style={styles.th}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} style={styles.tr}>
                  <td style={styles.td}>{r.date}</td>
                  <td style={styles.td}>
                    <span style={styles.categoryBadge}>{r.category}</span>
                  </td>
                  <td style={styles.td}>{r.notes}</td>
                  <td style={{ ...styles.td, fontWeight: '600' }}>
                    ${Number(r.amount).toLocaleString()}
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.typeBadge,
                        background:
                          r.type === 'income' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                        color: r.type === 'income' ? '#34d399' : '#f43f5e',
                      }}
                    >
                      {r.type}
                    </span>
                  </td>
                  {canMutateRecords && (
                    <td style={styles.td}>
                      <button
                        onClick={() => deleteRecord(r.id)}
                        style={styles.deleteBtn}
                        title="Delete Record"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!isLoading && filteredRecords.length === 0 && (
          <div style={styles.noData}>
            <AlertCircle size={40} color="var(--text-secondary)" opacity={0.5} />
            <p>No records found matching your criteria.</p>
          </div>
        )}
      </div>

      {canMutateRecords && isModalOpen && (
        <div style={styles.modalOverlay}>
          <div className="glass animate-fade-in" style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3>Add New Record</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} style={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Type</label>
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      value="income"
                      checked={formData.type === 'income'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    />{' '}
                    Income
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      value="expense"
                      checked={formData.type === 'expense'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    />{' '}
                    Expense
                  </label>
                </div>
              </div>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Amount ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    style={styles.input}
                    placeholder="0.00"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label} id="category-label">
                  Category
                </label>
                <DarkDropdown
                  value={formData.category}
                  onChange={(category) => setFormData({ ...formData, category })}
                  options={CATEGORY_OPTIONS}
                  ariaLabel="Category"
                  listZIndex={1100}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  style={{ ...styles.input, height: '80px', resize: 'none' }}
                  placeholder="What was this for?"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <button type="submit" style={styles.submitBtn}>
                <CheckCircle2 size={18} style={{ marginRight: 8 }} /> Save Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  pageTitle: { fontSize: '28px', margin: 0, fontWeight: '700' },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
    color: 'black',
    fontWeight: '600',
    cursor: 'pointer',
  },
  filterBar: {
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    flexWrap: 'wrap',
  },
  searchBox: {
    flex: 1,
    minWidth: '200px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(255,255,255,0.05)',
    padding: '0 16px',
    borderRadius: '8px',
    border: '1px solid var(--card-border)',
  },
  searchInput: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    width: '100%',
    padding: '10px 0',
    outline: 'none',
  },
  filterGroup: { display: 'flex', alignItems: 'center', gap: '12px' },
  filterDropdown: { minWidth: '160px' },
  ddTrigger: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid var(--card-border)',
    background: 'rgba(255,255,255,0.05)',
    color: '#f8fafc',
    fontSize: '14px',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'inherit',
  },
  ddList: {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    left: 0,
    right: 0,
    margin: 0,
    padding: '6px',
    borderRadius: '10px',
    background: '#0f172a',
    border: '1px solid var(--card-border)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
    maxHeight: '240px',
    overflowY: 'auto',
  },
  ddOption: {
    width: '100%',
    padding: '10px 12px',
    border: 'none',
    borderRadius: '6px',
    background: 'transparent',
    color: '#f8fafc',
    fontSize: '14px',
    textAlign: 'left',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  ddOptionActive: {
    background: 'rgba(34, 211, 238, 0.14)',
    color: 'var(--accent-primary)',
  },
  tableCard: { overflow: 'hidden', padding: '8px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '16px',
    fontSize: '14px',
    color: 'var(--text-secondary)',
    borderBottom: '1px solid var(--card-border)',
  },
  td: { padding: '16px', fontSize: '14px', borderBottom: '1px solid var(--card-border)' },
  tr: { transition: 'background 0.2s' },
  categoryBadge: {
    background: 'rgba(255,255,255,0.1)',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px',
  },
  typeBadge: {
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  deleteBtn: { background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' },
  noData: { padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: { width: '100%', maxWidth: '450px', padding: '32px', position: 'relative', zIndex: 1 },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  closeBtn: { background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  label: { fontSize: '13px', color: 'var(--text-secondary)' },
  input: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--card-border)',
    borderRadius: '8px',
    padding: '10px 12px',
    color: 'white',
  },
  radioGroup: { display: 'flex', gap: '20px' },
  radioLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' },
  submitBtn: {
    padding: '14px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
    color: 'black',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default FinancialRecords;
