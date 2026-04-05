import React from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';

const COLORS = ['#22d3ee', '#34d399', '#fbbf24', '#f43f5e', '#a855f7'];

const Dashboard = () => {
  const { stats } = useFinance();

  if (!stats) return <div style={{padding: '40px', textAlign: 'center'}}>Loading insights...</div>;

  const { summary, categoryData, trendData, recentActivity } = stats;

  return (
    <div className="animate-fade-in" style={styles.container}>
      <h1 style={styles.pageTitle}>Dashboard Overview</h1>

      {/* KPI Cards */}
      <div style={styles.kpiGrid}>
        <KPICard title="Net Balance" value={summary.balance} icon={<Wallet />} color="#a855f7" />
        <KPICard title="Total Income" value={summary.income} icon={<ArrowUpRight />} color="#34d399" trend="+12%" />
        <KPICard title="Total Expenses" value={summary.expenses} icon={<ArrowDownRight />} color="#f43f5e" trend="-5%" />
      </div>

      {/* Charts Row */}
      <div style={styles.chartRow}>
        <div className="glass" style={styles.chartCardLarge}>
          <div style={styles.cardHeader}>
            <TrendingUp size={20} color="var(--accent-primary)" />
            <h3 style={styles.cardTitle}>Earnings & Spending Trend</h3>
          </div>
          <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                   contentStyle={{ background: '#1e293b', border: '1px solid var(--card-border)', color: '#f8fafc' }}
                   itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="income" stroke="#34d399" fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass" style={styles.chartCardSmall}>
          <h3 style={styles.cardTitle}>Category Breakdown</h3>
          <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ background: '#1e293b', border: '1px solid var(--card-border)', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={styles.legend}>
             {categoryData.slice(0, 4).map((c, i) => (
               <div key={c.name} style={styles.legendItem}>
                 <div style={{ ...styles.legendDot, background: COLORS[i % COLORS.length] }}></div>
                 <span>{c.name}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass" style={styles.activityCard}>
        <div style={styles.cardHeader}>
          <Activity size={20} color="var(--accent-primary)" />
          <h3 style={styles.cardTitle}>Recent Activity</h3>
        </div>
        <div style={styles.activityList}>
          {recentActivity.map((r) => (
            <div key={r.id} style={styles.activityItem}>
              <div style={{ ...styles.activityIcon, color: r.type === 'income' ? '#34d399' : '#f43f5e' }}>
                {r.type === 'income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={styles.activityNote}>{r.notes}</p>
                <p style={styles.activityDate}>{r.date} • {r.category}</p>
              </div>
              <div style={{ fontWeight: '600', color: r.type === 'income' ? '#34d399' : '#f43f5e' }}>
                {r.type === 'income' ? '+' : '-'}${r.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, icon, color, trend }) => (
  <div className="glass" style={styles.kpiCard}>
    <div style={{ ...styles.kpiIcon, background: `${color}20`, color }}>
      {icon}
    </div>
    <div>
      <p style={styles.kpiTitle}>{title}</p>
      <h2 style={styles.kpiValue}>${Number(value).toLocaleString()}</h2>
      {trend && <span style={{ ...styles.kpiTrend, color: trend.startsWith('+') ? '#34d399' : '#f43f5e' }}>{trend} from last month</span>}
    </div>
  </div>
);

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '32px' },
  pageTitle: { fontSize: '28px', margin: 0, fontWeight: '700' },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' },
  kpiCard: { padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' },
  kpiIcon: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  kpiTitle: { margin: 0, fontSize: '14px', color: 'var(--text-secondary)' },
  kpiValue: { margin: '4px 0', fontSize: '24px', fontWeight: '700' },
  kpiTrend: { fontSize: '12px', fontWeight: '500' },
  chartRow: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' },
  chartCardLarge: { padding: '24px' },
  chartCardSmall: { padding: '24px', display: 'flex', flexDirection: 'column' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' },
  cardTitle: { margin: 0, fontSize: '16px', fontWeight: '600' },
  legend: { display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: 'auto', paddingTop: '20px' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' },
  legendDot: { width: '8px', height: '8px', borderRadius: '50%' },
  activityCard: { padding: '24px' },
  activityList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  activityItem: { display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' },
  activityIcon: { width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  activityNote: { margin: 0, fontSize: '14px', fontWeight: '500' },
  activityDate: { margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }
};

export default Dashboard;
