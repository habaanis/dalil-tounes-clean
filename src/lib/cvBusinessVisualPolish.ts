const REVIEW_SECTION_ID = 'dt-section-reviews';

const normalizeLabel = (value: string) => value
  .toLocaleLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9\u0600-\u06ff]+/g, ' ')
  .trim();

const hideDuplicateActivityLabel = (showcase: HTMLElement) => {
  const activity = showcase.querySelector<HTMLElement>('.dt-activity-pill');
  const slogan = showcase.querySelector<HTMLElement>('.dt-slogan');
  if (!activity || !slogan) return;

  const activityLabel = normalizeLabel(activity.textContent?.replace(/^⚒\s*/, '') || '');
  const sloganLabel = normalizeLabel(slogan.textContent || '');
  const isDuplicate = Boolean(activityLabel && sloganLabel && activityLabel === sloganLabel);

  if (slogan.hidden !== isDuplicate) {
    slogan.hidden = isDuplicate;
  }
};

const enhancePresentationAccordion = (showcase: HTMLElement, index: number) => {
  const intro = showcase.querySelector<HTMLElement>('.dt-intro');
  if (!intro || intro.dataset.presentationAccordion === 'true') return;

  intro.dataset.presentationAccordion = 'true';
  intro.classList.add('dt-presentation-accordion');

  const label = intro.querySelector<HTMLElement>('.dt-eyebrow')?.textContent?.trim() || 'Présentation';
  const panelId = `dt-presentation-panel-${index}`;

  const panel = document.createElement('div');
  panel.className = 'dt-presentation-content';
  panel.id = panelId;

  while (intro.firstChild) {
    panel.appendChild(intro.firstChild);
  }

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'dt-accordion-trigger dt-presentation-trigger';
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', panelId);

  const icon = document.createElement('span');
  icon.className = 'dt-presentation-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = 'i';

  const title = document.createElement('span');
  title.textContent = label;

  const spacer = document.createElement('span');
  spacer.className = 'dt-presentation-spacer';
  spacer.setAttribute('aria-hidden', 'true');

  const chevron = document.createElement('span');
  chevron.className = 'dt-accordion-chevron dt-presentation-chevron';
  chevron.setAttribute('aria-hidden', 'true');
  chevron.textContent = '›';

  trigger.append(icon, title, spacer, chevron);
  intro.append(trigger, panel);

  trigger.addEventListener('click', () => {
    const open = intro.classList.toggle('open');
    trigger.setAttribute('aria-expanded', String(open));
  });
};

const polishShowcase = (showcase: HTMLElement, index: number) => {
  hideDuplicateActivityLabel(showcase);
  enhancePresentationAccordion(showcase, index);

  const rating = showcase.querySelector<HTMLElement>('.dt-rating');
  const reviewTrigger = showcase.querySelector<HTMLButtonElement>(`#${REVIEW_SECTION_ID} .dt-accordion-trigger`);

  if (reviewTrigger) {
    const existingBadge = reviewTrigger.querySelector<HTMLElement>('.dt-google-review-badge');
    const ratingText = rating?.textContent?.replace(/\s+/g, ' ').trim() || '';

    if (ratingText) {
      const match = ratingText.match(/([\d.,]+)\s*\/\s*5(?:\s*\((\d+)\))?/);
      const score = match?.[1]?.replace(',', '.');
      const count = match?.[2];
      const label = score
        ? `${score} ★${count ? ` · ${count} avis` : ''}`
        : ratingText;

      if (existingBadge) {
        if (existingBadge.textContent !== label) {
          existingBadge.textContent = label;
        }
      } else {
        const badge = document.createElement('small');
        badge.className = 'dt-section-badge dt-google-review-badge';
        badge.textContent = label;
        const chevron = reviewTrigger.querySelector('.dt-accordion-chevron');
        reviewTrigger.insertBefore(badge, chevron || null);
      }
    }
  }

  if (rating && !rating.hidden) rating.hidden = true;
};

const applyCvBusinessVisualPolish = () => {
  document.querySelectorAll<HTMLElement>('.dt-showcase').forEach((showcase, index) => {
    polishShowcase(showcase, index);
  });
};

let observer: MutationObserver | null = null;

export const enableCvBusinessVisualPolish = () => {
  applyCvBusinessVisualPolish();
  if (observer) return;

  observer = new MutationObserver(() => applyCvBusinessVisualPolish());
  observer.observe(document.body, { childList: true, subtree: true });
};
