import { Skull } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  avatar: string;
  dailyBudget: number;
  status: string;
}

const DUMMY_MEMBERS: Member[] = [
  { id: '1', name: '自分', avatar: '😎', dailyBudget: 357, status: '限界確定' },
  { id: '2', name: 'タカシ', avatar: '👨‍🎓', dailyBudget: 1200, status: '生存圏内' },
  { id: '3', name: 'ケンタ', avatar: '🎮', dailyBudget: 420, status: '限界確定' },
  { id: '4', name: 'ユウキ', avatar: '🍜', dailyBudget: 850, status: '警告状態' },
];

export function Leaderboard() {
  // Sort by daily budget ascending (who is more "genkai")
  const sortedMembers = [...DUMMY_MEMBERS].sort((a, b) => a.dailyBudget - b.dailyBudget);

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Skull size={20} className="text-primary" />
        <h3 style={{ fontSize: '1.2rem' }}>PAUPER LEAGUE</h3>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {sortedMembers.map((member, index) => (
          <div 
            key={member.id} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              padding: '0.5rem', 
              background: index === 0 ? 'rgba(255, 62, 62, 0.1)' : 'transparent',
              borderRadius: '8px',
              border: index === 0 ? '1px solid var(--primary)' : '1px solid transparent'
            }}
          >
            <div style={{ fontWeight: 800, width: '1.5rem', color: index === 0 ? 'var(--primary)' : 'var(--text-dim)' }}>
              #{index + 1}
            </div>
            <div style={{ fontSize: '1.5rem' }}>{member.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold' }}>{member.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{member.status}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 900, fontSize: '0.9rem' }}>
                ¥{member.dailyBudget.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>/ DAY</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
