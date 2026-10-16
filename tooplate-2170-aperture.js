/*

    Tooplate 2170 Aperture

    https://www.tooplate.com/view/2170-aperture

    Free HTML CSS Template

*/

document.addEventListener('DOMContentLoaded', () => {

  // Reveal elements on scroll
  const revealTargets = document.querySelectorAll(
    '.lookbook__plate, .lookbook__diptych, .lookbook__interstitial, .lookbook__journal, .lookbook__close'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  revealTargets.forEach(el => revealObserver.observe(el));

  // Update plate counter on left sidebar
  const counterEl = document.getElementById('plateCounter');
  const plates = document.querySelectorAll('[data-plate]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const num = entry.target.getAttribute('data-plate');
        if (counterEl && num) {
          counterEl.textContent = num;
        }
      }
    });
  }, {
    threshold: 0.5
  });

  plates.forEach(el => counterObserver.observe(el));

  // Mobile nav active state
  const mobileLinks = document.querySelectorAll('.mobile-nav a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Journal panel — editorial slide-in
  const journalEntries = document.querySelectorAll('.lookbook__journal-entry');
  const journalContents = document.querySelectorAll('.lookbook__journal-content');
  const journalPanel = document.querySelector('.lookbook__journal-panel');
  const journalClose = document.querySelector('.lookbook__journal-close');
  let activeJournal = 0;
  let journalAnimating = false;

  function openJournalEntry(index) {
    if (index === activeJournal && journalPanel.classList.contains('has-content')) return;
    if (journalAnimating) return;
    journalAnimating = true;

    // Update entry active states
    journalEntries.forEach(e => e.classList.remove('is-active'));
    journalEntries[index].classList.add('is-active');

    // Show panel
    journalPanel.classList.add('has-content');

    // Find current active content
    const currentContent = document.querySelector('.lookbook__journal-content.is-active');
    const nextContent = document.querySelector(`[data-journal-content="${index}"]`);

    if (currentContent && currentContent !== nextContent) {
      // Phase 1: Fade out current
      currentContent.classList.add('is-exiting');
      currentContent.classList.remove('is-active');

      // Phase 2: After exit completes, fade in new
      setTimeout(() => {
        currentContent.classList.remove('is-exiting');
        nextContent.classList.add('is-active');
        activeJournal = index;
        journalAnimating = false;
      }, 320);
    } else if (!currentContent) {
      // No current content, just fade in
      nextContent.classList.add('is-active');
      activeJournal = index;
      journalAnimating = false;
    } else {
      // Same item clicked again
      journalAnimating = false;
    }
  }

  function closeJournalPanel() {
    const currentContent = document.querySelector('.lookbook__journal-content.is-active');
    if (currentContent) {
      currentContent.classList.add('is-exiting');
      currentContent.classList.remove('is-active');
      setTimeout(() => {
        currentContent.classList.remove('is-exiting');
      }, 320);
    }
    journalPanel.classList.remove('has-content');
    journalEntries.forEach(e => e.classList.remove('is-active'));
    journalAnimating = false;
  }

  journalEntries.forEach((entry, i) => {
    entry.addEventListener('click', () => openJournalEntry(i));
  });

  if (journalClose) {
    journalClose.addEventListener('click', closeJournalPanel);
  }
});