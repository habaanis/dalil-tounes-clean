/** Official UNESCO references. Do not confuse a heritage practice with certification of an individual business. */
export const UNESCO_TUNISIA_WORLD_HERITAGE = [
  { name: 'Amphithéâtre d’El Jem', year: 1979, region: 'Mahdia' },
  { name: 'Site archéologique de Carthage', year: 1979, region: 'Tunis' },
  { name: 'Djerba : témoignage d’un mode de peuplement insulaire', year: 2023, region: 'Médenine' },
  { name: 'Dougga / Thugga', year: 1997, region: 'Béja' },
  { name: 'Kairouan', year: 1988, region: 'Kairouan' },
  { name: 'Médina de Sousse', year: 1988, region: 'Sousse' },
  { name: 'Médina de Tunis', year: 1979, region: 'Tunis' },
  { name: 'Kerkouane et sa nécropole', year: 1985, region: 'Nabeul' },
  { name: 'Village de Sidi Bou Saïd', year: 2026, region: 'Tunis' },
  { name: 'Parc national de l’Ichkeul', year: 1980, region: 'Bizerte' },
] as const;
export const UNESCO_TUNISIA_INTANGIBLE = [
  { name: 'Poterie des femmes de Sejnane', year: 2018 },
  { name: 'Couscous : production et consommation', year: 2020 },
  { name: 'Pêche à la charfiya aux Kerkennah', year: 2020 },
  { name: 'Calligraphie arabe', year: 2021 },
  { name: 'Palmier dattier : savoirs et traditions', year: 2022 },
  { name: 'Harissa : savoir-faire et pratiques culinaires', year: 2022 },
  { name: 'Gravure sur métaux', year: 2023 },
  { name: 'Henné : rituels et pratiques', year: 2024 },
  { name: 'Arts des Twāyef de Ghbonten', year: 2024 },
  { name: 'Kohl arabe', year: 2025 },
] as const;
export const UNESCO_SOURCES = {
  world: 'https://whc.unesco.org/en/statesparties/tn',
  intangible: 'https://ich.unesco.org/en/state/tunisia-TN',
} as const;
