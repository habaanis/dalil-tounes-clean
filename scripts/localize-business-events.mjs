import fs from 'node:fs';
const p = 'src/pages/BusinessEvents.tsx';
let s = fs.readFileSync(p, 'utf8');
s = s.replace('placeholder="{pageT.searchLabel}, une ville, une entreprise..."', 'placeholder={pageT.searchPlaceholder}');
fs.writeFileSync(p, s);
