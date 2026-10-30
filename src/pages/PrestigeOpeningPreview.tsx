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
  return <main style={{minHeight:'100dvh',background:'#06172b',color:'#fff9e9',position:'relative',overflow:'hidden',display:'grid',placeItems:'center',fontFamily:'Georgia,serif'}}>
    {visible ? <section role="img" aria-label="Ouverture Prestige Dalil Tounes" style={{minHeight:'100dvh',width:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:28,padding:'55px 25px',background:'radial-gradient(ellipse at 50% 45%,#143452 0%,#061b32 60%,#030e1e 100%)',boxSizing:'border-box',border:'5px solid #cc9c47'}}>
      <div aria-hidden="true" style={{position:'absolute',inset:15,border:'1px solid #c7974f66',borderRadius:'45% 45% 12px 12px / 12% 12% 12px 12px',pointerEvents:'none'}}/>
      <div style={{position:'relative',border:'3px solid #e4ba67',borderRadius:'48% 48% 20px 20px / 25% 25% 20px 20px',padding:'38px 27px 25px',boxShadow:'0 0 24px #dbad6755',background:'#071f37',maxWidth:310,width:'90%',textAlign:'center'}}>
        <img src="/images/logo_dalil_tounes_crop.png" alt="Logo officiel Dalil Tounes" style={{width:140,height:140,objectFit:'contain',margin:'0 auto 16px',display:'block'}}/>
        <h1 style={{fontSize:'clamp(29px,7vw,43px)',margin:0,letterSpacing:'.02em'}}>Dalil Tounes</h1>
        <p style={{fontFamily:'Arial,sans-serif',fontSize:12,letterSpacing:'.18em',color:'#e6c27c'}}>DÉCOUVRIR · TROUVER · VIVRE</p>
      </div>
      <p style={{textAlign:'center',fontSize:21,lineHeight:1.5,margin:0}}>Votre guide en Tunisie</p>
      <div style={{height:3,width:150,background:'linear-gradient(90deg,transparent,#f3d68f,transparent)',boxShadow:'0 0 10px #e8b96b'}}/>
      <p style={{fontFamily:'Arial,sans-serif',fontSize:12,opacity:.72}}>Aperçu du nouvel écran d'ouverture</p>
      <button type="button" onClick={() => setVisible(false)} style={{background:'#d8ab5d',color:'#06172b',fontWeight:700,padding:'12px 22px',border:0,borderRadius:30,cursor:'pointer'}}>Voir Dalil Tounes</button>
    </section> : <div style={{padding:35,textAlign:'center'}}><p>Aperçu terminé</p><Link style={{color:'#f0cd86'}} to="/">Accéder à Dalil Tounes</Link><div><button onClick={()=>setVisible(true)} style={{marginTop:20,padding:12}}>Revoir l'ouverture</button></div></div>}
  </main>;
}
