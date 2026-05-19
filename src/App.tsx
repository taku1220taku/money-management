import { useState } from 'react';
import { differenceInDays, startOfDay, addMonths, format, parseISO } from 'date-fns';
import { Skull, Users, Bell, Home, Settings, Save } from 'lucide-react';
import { Runway } from './components/Runway';
import { Leaderboard } from './components/Leaderboard';
import { GenkaiTime } from './components/GenkaiTime';
import './styles/global.css';

function App() {
  const [view, setView] = useState<'home' | 'league' | 'settings'>('home');
  const [showGenkaiTime, setShowGenkaiTime] = useState(false);
  
  // Financial State with localStorage persistence
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('genkai_balance');
    return saved ? Number(saved) : 5000;
  });
  
  const [paydayInput, setPaydayInput] = useState(() => {
    const saved = localStorage.getItem('genkai_payday');
    return saved || format(addMonths(new Date(), 1).setDate(25), 'yyyy-MM-25');
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('genkai_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('genkai_payday', paydayInput);
  }, [paydayInput]);

  const payday = startOfDay(parseISO(paydayInput));
  const daysLeft = Math.max(1, differenceInDays(payday, new Date()));
  const dailyBudget = Math.floor(balance / daysLeft);

  const getSurvivalStatus = () => {
    if (dailyBudget < 500) return { label: '限界確定', color: 'var(--primary)', title: 'もやし' };
    if (dailyBudget < 1000) return { label: '警告状態', color: '#ffa500', title: '自炊' };
    return { label: '生存圏内', color: 'var(--secondary)', title: '文明人' };
  };

  const status = getSurvivalStatus();

  return (
    <div className="container">
      <header style={{ padding: '1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: '40px' }} />
        <h1 style={{ fontSize: '1.5rem', fontStyle: 'italic', fontWeight: 900, margin: 0 }}>
          GENKAI <span className="text-primary">COUNTDOWN</span>
        </h1>
        <button 
          onClick={() => setView('settings')}
          style={{ background: 'transparent', border: 'none', padding: '10px' }}
        >
          <Settings size={20} className={view === 'settings' ? 'text-primary' : ''} />
        </button>
      </header>

      <main style={{ paddingBottom: '6rem' }}>
        {view === 'home' && (
          <>
            <Runway velocity={dailyBudget} />

            <div className="card" style={{ borderLeft: `4px solid ${status.color}`, position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="text-dim">残り {daysLeft} 日</span>
                <span style={{ color: status.color, fontWeight: 'bold' }}>{status.label}</span>
              </div>

              <div style={{ margin: '1rem 0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '0.2rem' }}>現在の総資産</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                  ¥{balance.toLocaleString()}
                </div>

                <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>1日あたりの限界</div>
                <div style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.1 }}>
                  ¥{dailyBudget.toLocaleString()}
                </div>
                <div style={{ color: status.color, fontWeight: 'bold', marginTop: '0.5rem' }}>
                  主食：{status.title}確定
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  style={{ flex: 1, height: '50px' }} 
                  onClick={() => setBalance(prev => Math.max(0, prev - 500))}
                >
                  -500
                </button>
                <button 
                  style={{ flex: 1, height: '50px', border: '1px solid #333' }} 
                  onClick={() => setBalance(prev => prev + 1000)}
                >
                  +1000
                </button>
              </div>
            </div>

            <div 
              className="card" 
              style={{ textAlign: 'center', cursor: 'pointer', border: '1px dashed #444' }}
              onClick={() => setShowGenkaiTime(true)}
            >
              <Bell size={24} className="text-primary" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 'bold' }}>GENKAI TIME</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>今すぐ生存申告しろ</div>
            </div>
          </>
        )}

        {view === 'league' && <Leaderboard />}

        {view === 'settings' && (
          <div className="card">
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>財務状況の修正</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                現在の総残高 (円)
              </label>
              <input 
                type="number"
                value={balance}
                onChange={(e) => setBalance(Number(e.target.value))}
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  background: '#222', 
                  border: '1px solid #444', 
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '1.2rem',
                  fontWeight: 'bold'
                }}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                次の給料日 / 仕送り日
              </label>
              <input 
                type="date"
                value={paydayInput}
                onChange={(e) => setPaydayInput(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  background: '#222', 
                  border: '1px solid #444', 
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '1.1rem'
                }}
              />
            </div>

            <button 
              onClick={() => setView('home')}
              style={{ 
                width: '100%', 
                padding: '1rem', 
                background: 'var(--primary)', 
                color: 'white', 
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Save size={20} /> 設定を反映して戻る
            </button>
          </div>
        )}
      </main>

      {showGenkaiTime && (
        <GenkaiTime 
          balance={balance}
          dailyBudget={dailyBudget}
          daysLeft={daysLeft}
          statusTitle={status.title}
          onClose={() => setShowGenkaiTime(false)}
        />
      )}

      <nav style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: '50%', 
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '480px',
        background: 'rgba(0,0,0,0.8)', 
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '1rem',
        borderTop: '1px solid #222',
        zIndex: 100
      }}>
        <button 
          style={{ background: 'transparent', border: 'none', color: view === 'home' ? 'var(--primary)' : 'var(--text-dim)' }}
          onClick={() => setView('home')}
        >
          <Home size={24} />
          <div style={{ fontSize: '0.6rem' }}>HOME</div>
        </button>
        <button 
          style={{ background: 'transparent', border: 'none', color: view === 'league' ? 'var(--secondary)' : 'var(--text-dim)' }}
          onClick={() => setView('league')}
        >
          <Users size={24} />
          <div style={{ fontSize: '0.6rem' }}>LEAGUE</div>
        </button>
      </nav>

      <footer style={{ textAlign: 'center', opacity: 0.3, paddingBottom: '2rem' }}>
        <Skull size={12} /> <span style={{ fontSize: '0.6rem' }}>DEATH OR SURVIVAL</span>
      </footer>
    </div>
  );
}

export default App;
