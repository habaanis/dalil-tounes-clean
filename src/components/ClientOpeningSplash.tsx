export type ClientOpeningStyle = 'photo' | 'framed';

type Props = {
  name: string; product: string; logo: string; cover: string;
  palette: { page: string; surface: string; border: string; text: string; accent: string };
  style: ClientOpeningStyle; onSkip: () => void;
};

/** Photo is unchanged. Framed is ported from Lienora's PwaSplash layout. */
export default function ClientOpeningSplash({ name, product, logo, cover, palette, style, onSkip }: Props) {
  const isFramed = style === 'framed';
  return <main className={`client-opening${isFramed ? ' client-opening-framed' : ' client-opening-photo'}`} style={{ backgroundColor: palette.page, color: palette.text }} aria-label={name}>
    {cover && <div className="client-opening-image" aria-hidden="true"><img src={cover} alt="" loading="eager" /></div>}
    <div className="client-opening-content">
      {logo && <div className="client-opening-logo" style={{backgroundColor: palette.surface, borderColor: isFramed ? '#e4b65b' : palette.border}}><img src={logo} alt="" /></div>}
      {!isFramed && <><h1>{name}</h1><p>{product}</p></>}
    </div>
    <button type="button" className="client-opening-skip" style={{background:palette.surface,color:palette.text,borderColor:palette.border}} onClick={onSkip}>Passer</button>
    <style>{`
      .client-opening{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;overflow:hidden}
      .client-opening-image{position:absolute;inset:0;pointer-events:none}
      .client-opening-image img{display:block;width:100%;height:100%;object-fit:cover;object-position:center}
      .client-opening-content{position:relative;z-index:3;display:flex;flex-direction:column;align-items:center;text-align:center;gap:15px;padding:28px}
      .client-opening-logo{display:grid;place-items:center;overflow:hidden;width:112px;height:112px;border:4px solid;border-radius:50%;box-shadow:0 8px 30px #00191165}
      .client-opening-logo img{display:block;width:100%;height:100%;object-fit:contain;border-radius:50%}
      .client-opening-content h1{font:bold 26px Georgia,serif;color:white;text-shadow:0 2px 7px #000}
      .client-opening-content p{color:#f6dca0;font:600 14px Arial,sans-serif}
      .client-opening-photo .client-opening-image:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,#0003,#000a)}
      .client-opening-framed .client-opening-image{inset:25% 0 25%;filter:brightness(1.13) contrast(1.07) saturate(1.13);clip-path:polygon(0 21%,8% 20%,18% 17%,28% 12%,40% 7%,52% 4%,64% 4%,76% 7%,88% 13%,100% 18%,100% 80%,90% 79%,80% 82%,70% 88%,58% 94%,46% 96%,34% 95%,22% 91%,10% 86%,0 82%)}
      .client-opening-framed:before,.client-opening-framed:after{content:'';position:absolute;left:-7%;right:-7%;height:12%;z-index:2;pointer-events:none;border-top:8px solid #e6bf68;border-radius:50%;filter:drop-shadow(0 1px 2px #ffe3a182) drop-shadow(0 0 7px #d9a43d80)}
      .client-opening-framed:before{top:22%;transform:rotate(-6deg)}
      .client-opening-framed:after{bottom:19%;transform:rotate(6deg)}
      .client-opening-framed .client-opening-logo{width:min(185px,49vw);height:185px;background:#fffdf6!important;border:4px solid #e4b65b;box-shadow:0 10px 30px #00191165}
      .client-opening-framed .client-opening-logo img{width:140px;height:140px;object-fit:contain}
      .client-opening-skip{position:absolute;right:18px;bottom:max(20px,env(safe-area-inset-bottom));z-index:5;border:1px solid;border-radius:25px;padding:8px 15px;font:600 12px Arial,sans-serif}
      @media(max-width:600px){.client-opening-framed .client-opening-image{inset:25% 0 27%}.client-opening-framed:before{top:22%}.client-opening-framed:after{bottom:21%}}
    `}</style>
  </main>;
}
