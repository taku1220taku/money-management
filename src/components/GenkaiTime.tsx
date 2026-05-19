import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Share, Download, X } from 'lucide-react';

interface SurvivalCardProps {
  balance: number;
  dailyBudget: number;
  daysLeft: number;
  statusTitle: string;
  onClose: () => void;
}

export function GenkaiTime({ balance, dailyBudget, daysLeft, statusTitle, onClose }: SurvivalCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = async () => {
    if (cardRef.current === null) return;
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true,
        pixelRatio: 2, // Higher quality for sharing
      });
      setGeneratedImage(dataUrl);
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!generatedImage) return;

    try {
      // Convert Data URL to Blob
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const file = new File([blob], 'genkai-survival.png', { type: 'image/png' });

      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: 'GENKAI COUNTDOWN 生存報告',
          text: `僕の今の生存限界は1日 ¥${dailyBudget.toLocaleString()} です。 #限界カウントダウン #生存報告`,
        });
      } else {
        // Fallback: Copy text or just rely on the Download button
        alert('お使いのブラウザは直接シェアに対応していません。画像を保存してSNSに投稿してください！');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.98)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1rem',
      overflowY: 'auto'
    }}>
      <button 
        onClick={onClose}
        style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'white' }}
      >
        <X size={24} />
      </button>

      {!generatedImage ? (
        <>
          <h2 className="text-primary" style={{ fontSize: '1.8rem', marginBottom: '0.5rem', fontStyle: 'italic', marginTop: '2rem' }}>
            ⚠️ GENKAI TIME
          </h2>
          <p style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            今すぐ残高を申告して、生存証明を発行しろ。<br/>
            残り時間: <span className="text-primary" style={{ fontWeight: 900 }}>01:42</span>
          </p>

          <div 
            ref={cardRef}
            style={{
              width: '320px',
              height: '560px',
              background: 'linear-gradient(135deg, #111 0%, #000 100%)',
              border: '4px solid var(--primary)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              color: 'white'
            }}
          >
            <div style={{ 
              position: 'absolute', 
              top: '-50px', 
              right: '-50px', 
              width: '200px', 
              height: '200px', 
              background: 'var(--primary)', 
              opacity: 0.2, 
              borderRadius: '50%',
              filter: 'blur(50px)'
            }} />

            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, fontStyle: 'italic' }}>GENKAI COUNTDOWN</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>SURVIVAL CERTIFICATE // {new Date().toLocaleDateString()}</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', letterSpacing: '2px' }}>生存確率：{dailyBudget < 500 ? '12%' : '45%'}</div>
              <div style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1, margin: '0.5rem 0' }}>{statusTitle}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', background: 'var(--primary)', display: 'inline-block', padding: '2px 10px' }}>確定</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.7rem' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>残り日数</span>
                <span style={{ fontWeight: 'bold' }}>{daysLeft} 日</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.7rem' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>総残高</span>
                <span style={{ fontWeight: 'bold' }}>¥{balance.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>1日の限界</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>¥{dailyBudget.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ fontSize: '0.6rem', textAlign: 'center', opacity: 0.3, letterSpacing: '1px' }}>
              WWW.GENKAI-COUNTDOWN.APP
            </div>
          </div>

          <button 
            className="text-primary"
            disabled={isGenerating}
            style={{ 
              marginTop: '1.5rem', 
              width: '100%', 
              maxWidth: '320px', 
              padding: '1.2rem', 
              fontWeight: 900, 
              border: '2px solid var(--primary)',
              background: 'transparent',
              opacity: isGenerating ? 0.5 : 1
            }}
            onClick={generateImage}
          >
            {isGenerating ? '生成中...' : '生存証明を発行する'}
          </button>
        </>
      ) : (
        <>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', marginTop: '2rem' }}>生存証明発行完了</h2>
          <div style={{ position: 'relative' }}>
            <img src={generatedImage} alt="Survival Card" style={{ width: '280px', border: '2px solid #333', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }} />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '2rem', width: '100%', maxWidth: '280px' }}>
            <button 
              onClick={handleShare}
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.6rem', 
                background: 'var(--secondary)', 
                color: '#000',
                padding: '1rem',
                fontWeight: 'bold',
                borderRadius: '8px',
                border: 'none'
              }}
            >
              <Share size={20} /> SNSで煽る
            </button>
            <a 
              href={generatedImage} 
              download={`genkai-${new Date().getTime()}.png`} 
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.6rem', 
                background: '#222', 
                color: '#fff', 
                textDecoration: 'none', 
                padding: '1rem',
                fontWeight: 'bold',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              <Download size={20} /> 画像を保存
            </a>
          </div>
          <button 
            onClick={() => setGeneratedImage(null)}
            style={{ marginTop: '1.5rem', opacity: 0.5, background: 'transparent', border: 'none', color: 'white', textDecoration: 'underline' }}
          >
            作り直す
          </button>
        </>
      )}
    </div>
  );
}
