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
      <div className="absolute inset-x-0 top-[25%] bottom-[25%] overflow-hidden" style={{clipPath:'polygon(0 21%,8% 20%,18% 17%,28% 12%,40% 7%,52% 4%,64% 4%,76% 7%,88% 13%,100% 18%,100% 80%,90% 79%,80% 82%,70% 88%,58% 94%,46% 96%,34% 95%,22% 91%,10% 86%,0 82%)',filter:'brightness(1.13) contrast(1.07) saturate(1.13)'}}><img src={cover} alt="" className="h-full w-full object-cover"/></div>
      <div className="absolute left-[-7%] right-[-7%] top-[22%] h-[12%] rounded-[50%] border-t-[8px] border-[#e6bf68] -rotate-[6deg]" style={{filter:'drop-shadow(0 1px 2px #ffe3a182) drop-shadow(0 0 7px #d9a43d80)'}} />
      <div className="absolute left-[-7%] right-[-7%] bottom-[19%] h-[12%] rounded-[50%] border-t-[8px] border-[#e6bf68] rotate-[6deg]" style={{filter:'drop-shadow(0 1px 2px #ffe3a182) drop-shadow(0 0 7px #d9a43d80)'}} />
    </>}
    <div className="relative z-10 flex flex-col items-center">
      {logo && <div className={`grid place-items-center overflow-hidden rounded-full border-[4px] shadow-2xl ${isFramed ? "h-[185px] w-[185px] max-w-[49vw] bg-[#fffdf6] p-4" : "h-28 w-28 p-1"}`} style={{backgroundColor:palette.surface,borderColor:palette.border}}>
        <img src={logo} alt="" className="h-full w-full rounded-full object-contain" />
      </div>}
      <h1 className={`mt-5 max-w-[90vw] font-serif text-2xl font-bold ${isFramed ? "sr-only" : ""}`} style={!isFramed?{color:'#fff',textShadow:'0 2px 6px #000'}:undefined}>{name}</h1>
      <p className={`mt-2 text-sm font-semibold ${isFramed ? "sr-only" : ""}`} style={{color:isFramed?palette.accent:'#f6dca0'}}>{product}</p>
    </div>
    <button type="button" className="absolute bottom-7 right-6 z-20 rounded-full border px-4 py-2 text-xs font-semibold" style={{borderColor:palette.border,backgroundColor:palette.surface,color:palette.text}} onClick={onSkip}>Passer</button>
  </main>;
}
