(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const setHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  setHeader();
  window.addEventListener('scroll', setHeader, { passive: true });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    revealItems.forEach(item => observer.observe(item));
  }

  const video = document.getElementById('heroVideo');
  const cinema = document.getElementById('cinema');
  const videoToggle = document.getElementById('videoToggle');
  const filmPlay = document.getElementById('filmPlay');
  const playIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7V5Z"/></svg>';
  const pauseIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
  const syncVideo = () => {
    if (!video || !cinema || !videoToggle) return;
    cinema.classList.toggle('is-playing', !video.paused);
    videoToggle.innerHTML = video.paused ? playIcon : pauseIcon;
    videoToggle.setAttribute('aria-label', video.paused ? 'تشغيل الفيديو' : 'إيقاف الفيديو مؤقتًا');
  };
  const toggleVideo = async () => {
    if (!video) return;
    if (video.paused) {
      try { await video.play(); } catch (_) {}
    } else video.pause();
    syncVideo();
  };
  videoToggle?.addEventListener('click', toggleVideo);
  filmPlay?.addEventListener('click', () => {
    cinema?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
    toggleVideo();
  });
  video?.addEventListener('play', syncVideo);
  video?.addEventListener('pause', syncVideo);
  video?.addEventListener('ended', syncVideo);
  syncVideo();

  const translations = {
    en: {
      navSystems: 'Two systems', navExperience: 'Experience', navFilm: 'Film', openApp: 'Open app',
      eyebrow: 'THE SKY KNOWS THE WAY', heroArabic: 'ASTRONOMICAL QIBLA COMPASS',
      heroLead: 'A precisely computed Qibla bearing. An independent celestial verification using the Sun or Moon. Two separate systems—and a result you can understand and trust.',
      tryApp: 'Try QiblaAstro', discover: 'Discover how it works', offline: 'Works offline', privacy: 'Privacy first', independent: 'Two independent systems',
      trueBearing: 'True Qibla bearing', computed: 'Computed', verification: 'Verification limit', visionKicker: 'Not another compass',
      visionTitle: 'We do not build software.<br><span>We build trust.</span>',
      visionBody: 'Accuracy before appearance, privacy before convenience, and evidence before opinion. QiblaAstro keeps astronomical computation separate from visual verification and makes every result clear.',
      principleAccuracy: 'Understandable accuracy', principleAccuracyBody: 'A true bearing, clear source, and visible deviation.',
      principlePrivacy: 'Privacy by design', principlePrivacyBody: 'Local computation and an experience that works offline.',
      principleEvidence: 'Evidence first', principleEvidenceBody: 'Independent verification through the Sun or Moon and camera geometry.',
      systemsTitle: 'Two independent paths.<br><span>One confidence.</span>',
      systemsIntro: 'Celestial verification never overwrites the computed Qibla. Each system keeps its own inputs and result, then shows you the comparison clearly.',
      computeTitle: 'Computational Qibla',
      computeBody: 'Calculates the true Qibla bearing from your geographic location using GNSS and spherical geometry—away from magnetic compass interference.',
      verifyTitle: 'Astronomical verification',
      verifyBody: 'Compares the phone heading with a trusted celestial target—the Sun or Moon—and shows its difference from the computed Qibla at capture time.',
      experienceTitle: 'Science and worship,<br><span>in one calm experience.</span>',
      bentoQibla: 'Live direction, without guesswork', bentoQiblaBody: 'Clear indicators for bearing, deviation, and reading quality.',
      bentoPrayer: 'Prayer times and Adhan', nextPrayer: 'Next prayer', fajr: 'Fajr', bentoQuran: 'The Holy Quran',
      bentoSky: 'Sun, Moon, and horizon', bentoSkyBody: 'Understandable educational astronomy—with no astrology.',
      bentoOffline: 'Works offline', bentoOfflineBody: 'After the first load, essential features stay with you.',
      filmTitle: 'From the sky…<br><span>to the most precise direction.</span>',
      filmBody: 'A short visual journey showing how astronomical computation becomes clear guidance—and then a verification you can see for yourself.',
      playFilm: 'Watch the film',
      finalTitle: 'Look to the sky…<br><span>and you will find your way.</span>',
      finalBody: 'Start by finding the Qibla, then verify the precision yourself.', launchNow: 'Launch the app now',
      privacyPolicy: 'Privacy', terms: 'Terms', contact: 'Contact', rights: 'All Rights Reserved.'
    }
  };

  const langToggle = document.getElementById('langToggle');
  let language = 'ar';
  const arabic = new Map([...document.querySelectorAll('[data-i18n]')].map(node => [node.dataset.i18n, node.innerHTML]));
  const applyLanguage = next => {
    language = next;
    const isEnglish = language === 'en';
    document.documentElement.lang = language;
    document.documentElement.dir = isEnglish ? 'ltr' : 'rtl';
    document.querySelectorAll('[data-i18n]').forEach(node => {
      const key = node.dataset.i18n;
      node.innerHTML = isEnglish ? (translations.en[key] || arabic.get(key)) : arabic.get(key);
    });
    if (langToggle) {
      langToggle.textContent = isEnglish ? 'AR' : 'EN';
      langToggle.setAttribute('aria-label', isEnglish ? 'التبديل إلى العربية' : 'Switch to English');
    }
  };
  langToggle?.addEventListener('click', () => applyLanguage(language === 'ar' ? 'en' : 'ar'));
})();
