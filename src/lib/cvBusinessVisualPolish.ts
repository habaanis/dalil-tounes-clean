const REVIEW_SECTION_ID = 'dt-section-reviews';

const applyCvBusinessVisualPolish = () => {
  const showcase = document.querySelector<HTMLElement>('.dt-showcase');
  if (!showcase) return;

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
        existingBadge.textContent = label;
      } else {
        const badge = document.createElement('small');
        badge.className = 'dt-section-badge dt-google-review-badge';
        badge.textContent = label;
        const chevron = reviewTrigger.querySelector('.dt-accordion-chevron');
        reviewTrigger.insertBefore(badge, chevron || null);
      }
    }
  }

  if (rating) rating.hidden = true;
};

let observer: MutationObserver | null = null;

export const enableCvBusinessVisualPolish = () => {
  applyCvBusinessVisualPolish();
  if (observer) return;

  observer = new MutationObserver(() => applyCvBusinessVisualPolish());
  observer.observe(document.body, { childList: true, subtree: true });
};
