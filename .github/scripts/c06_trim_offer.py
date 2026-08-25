from pathlib import Path
p = Path('src/pages/Subscription.tsx')
s = p.read_text()
replacements = [
    ("      'Des mises en avant au fil du temps — Ton entreprise peut apparaître dans des sélections et pages thématiques.',\n", ""),
    (", 'Ongoing highlights'", ""),
    (", 'إبراز مستمر'", ""),
    (", 'Visibilità nel tempo'", ""),
    (", 'Регулярное продвижение'", ""),
]
for old, new in replacements:
    if old not in s:
        raise SystemExit(f'Offer trim target not found: {old}')
    s = s.replace(old, new, 1)
p.write_text(s)
