import React from 'react';
import { useStore } from '../context/StoreContext';

export const VideoModal = () => {
  const { activeVideo, setActiveVideo } = useStore();
  if (!activeVideo) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}>
      <div style={{ background: '#000', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '800px', overflow: 'hidden', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', background: 'var(--secondary-blue)', color: '#FFFFFF' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{activeVideo.title}</h4>
          <button onClick={() => setActiveVideo(null)} style={{ color: '#FFFFFF', fontSize: '1.2rem', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <iframe src={activeVideo.youtubeUrl} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} allowFullScreen title={activeVideo.title}></iframe>
        </div>
      </div>
    </div>
  );
};
