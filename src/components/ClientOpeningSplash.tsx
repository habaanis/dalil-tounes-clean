import type { CSSProperties } from 'react';

export type ClientOpeningStyle = 'photo' | 'framed';

type Props = {
  name: string;
  product: string;
  logo: string;
  cover: string;
  palette: { page: string; surface: string; border: string; text: string; accent: string };
  style: ClientOpeningStyle;
  onSkip: () => void;
};

export default function ClientOpeningSplash({ name, product, logo, cover, palette, style, onSkip }: Props) {
  const isFramed = style === 'framed';
  const surface: CSSProperties = {
    backgroundColor: palette.page,
    color: palette.text,
    backgroundImage: !isFramed ? `linear-gradient(180deg, rgba(0,0,0,.20), rgba(0,0,0,.68)), url("${cover.replace(/"/g, '%22')}")` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return <main className="fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden px-7 text-center" style={surface} aria-label={name}>
    {isFramed && <>
      <div className="absolute inset-0" style={{ background:`radial-gradient(ellipse at center, ${palette.surface} 0%, ${palette.page} 80%)` }} />
      <div className="relative mb-7 w-[min(76vw,325px)] overflow-hidden rounded-[44%_44%_12%_12%/24%_24%_12%_12%] border-[6px] shadow-2xl" style={{borderColor:palette.border,aspectRatio:'4/5'}}>
        <img src={cover} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 border-[3px] rounded-[44%_44%_12%_12%/24%_24%_12%_12%]" style={{borderColor:palette.accent}} />
      </div>
    </>}
    <div className="relative z-10 flex flex-col items-center">
      {logo && <div className="grid h-28 w-28 place-items-center overflow-hidden rounded-full border-[4px] p-1 shadow-2xl" style={{backgroundColor:palette.surface,borderColor:palette.border}}>
        <img src={logo} alt="" className="h-full w-full rounded-full object-contain" />
      </div>}
      <h1 className="mt-5 max-w-[90vw] font-serif text-2xl font-bold" style={!isFramed?{color:'#fff',textShadow:'0 2px 6px #000'}:undefined}>{name}</h1>
      <p className="mt-2 text-sm font-semibold" style={{color:isFramed?palette.accent:'#f6dca0'}}>{product}</p>
    </div>
    <button type="button" className="absolute bottom-7 right-6 z-20 rounded-full border px-4 py-2 text-xs font-semibold" style={{borderColor:palette.border,backgroundColor:palette.surface,color:palette.text}} onClick={onSkip}>Passer</button>
  </main>;
}
