import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/** Test-only opening preview: keeps the public PWA launch untouched until approved. */
export default function PrestigeOpeningPreview() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const old = document.title;
    document.title = 'Aperçu ouverture Prestige — Dalil Tounes';
    return () => { document.title = old; };
  }, []);
  return <main style={{minHeight:'100dvh',background:'#06172b',color:'#fff9e9',position:'relative',display:'grid',placeItems:'center'}}>
    {visible ? <section aria-label="Ouverture Prestige Dalil Tounes" style={{position:'relative',width:'100%',maxWidth:600,minHeight:'100dvh',overflow:'hidden',background:'#06172b'}}>
      <img src="https://raw.githubusercontent.com/habaanis/dalil-tounes-clean/main/dalil-tounes-prestige.png" alt="Dalil Tounes — composition Prestige bleu nuit et or, monuments tunisiens" style={{display:'block',width:'100%',height:'100dvh',objectFit:'contain',objectPosition:'center'}} />
      <button type="button" onClick={() => setVisible(false)} style={{position:'absolute',bottom:'max(20px,env(safe-area-inset-bottom))',right:18,background:'#d8ab5d',color:'#06172b',fontWeight:700,padding:'10px 15px',border:0,borderRadius:30,cursor:'pointer',boxShadow:'0 3px 14px #0008'}}>Accéder au site</button>
    </section> : <div style={{padding:35,textAlign:'center'}}><p>Aperçu terminé</p><Link style={{color:'#f0cd86'}} to="/">Accéder à Dalil Tounes</Link><div><button onClick={()=>setVisible(true)} style={{marginTop:20,padding:12}}>Revoir l'ouverture</button></div></div>}
  </main>;
}
