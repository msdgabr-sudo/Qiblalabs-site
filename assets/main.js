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
  video?.addEventListener('timeupdate', () => {
    // The source file contains an editor end-card after the branded closing shot.
    // Loop before it so the public experience ends on Qibla Labs, not the editor mark.
    if (video.currentTime >= 59) video.currentTime = 0;
  });
  syncVideo();

  const translations = {
    en: {
      navSystems: 'Two systems', navExperience: 'Experience', navFilm: 'Film', openApp: 'Open app',
      eyebrow: 'THE SKY KNOWS THE WAY', heroArabic: 'ASTRONOMICAL QIBLA COMPASS',
      heroLead: 'A precisely computed Qibla bearing. An independent celestial verification using the Sun or Moon. Two separate systems—and a result you can understand and trust.',
      tryApp: 'Try QiblaAstro', discover: 'Discover how it works', offline: 'Works offline', privacy: 'Privacy first', independent: 'Two independent systems',
      trueBearing: 'True Qibla bearing', computed: 'Computed', verification: 'Verification limit', visionKicker: 'Not another compass',
      heroFilmLabel: 'FROM THE ORIGINAL FILM', heroFilmCaption: 'Technology follows the sky. It does not replace it.',
      realInterface: 'REAL APP INTERFACE', realInterfaceBody: 'Editorially reframed to explain the experience while preserving the original measurements.',
      tourTitle: 'Every screen has a purpose.<br><span>Every result has meaning.</span>',
      tourIntro: 'These are not repeated screenshots inside phone frames. Each interface becomes a chapter in the product story: measurement, verification, worship, and knowledge.',
      digitalTitle: 'A true bearing—not an ambiguous arrow.',
      digitalBody: 'QiblaAstro shows the phone heading, computed Qibla, angular deviation, and reading quality—then translates angular error into an understandable distance impact.',
      phoneHeading: 'Phone heading', qiblaBearing: 'Computed Qibla', deviationLabel: 'Deviation',
      distanceNote: 'In the distance model shown in the app, a 5° deviation is approximately 113 km at the current reference distance.',
      astroTitle: 'Observe a known celestial body.<br>Then verify the direction.',
      astroBody: 'The camera captures the Sun or Moon automatically after a stable observation. The engine combines the body position, image geometry, gravity, and time to solve the true camera heading and compare it with the computed Qibla.',
      gateTracking: 'Body tracking', gateStability: 'Phone stability', gateQuality: 'Observation quality',
      astroNote: 'The digital Qibla result is never copied into the astronomical measurement; every path keeps its own inputs and result record.',
      worshipTitle: 'From precise measurement to a calm spiritual experience.',
      quranVisualTitle: 'An olive Quran experience made for reading.', quranVisualBody: 'Surahs, Juz, search, bookmarks, and Khatmati—a plan that adapts to your actual reading.',
      prayerVisualTitle: 'Prayer times shaped around your day.', prayerVisualBody: 'Next prayer, countdown, advance reminder, and a muezzin voice you choose.',
      azkarVisualTitle: 'One remembrance. Full presence.', azkarVisualBody: 'A focused reading card, a calm counter, and a recurring audio reminder with your chosen dhikr and interval.',
      serenityVisualTitle: 'Rest and serenity.', serenityVisualBody: 'Choose the reciter, narration, and Surah in a simple, peaceful player.',
      knowledgeTitle: 'Understand the sky you use as a guide.', knowledgeBody: 'Falaki presents the Sun and Moon azimuth, altitude, state, and Arabic mansions, plus educational guidance about Polaris and navigation. GNSS makes the position source and accuracy clear.',
      languagesTitle: 'Five languages. One identity.', languagesBody: 'Arabic, English, French, Indonesian, and Urdu—with sensitive religious text and scientific interfaces kept protected.',
      visionTitle: 'We do not build software.<br><span>We build trust.</span>',
      visionBody: 'Accuracy before appearance, privacy before convenience, and evidence before opinion. QiblaAstro keeps astronomical computation separate from visual verification and makes every result clear.',
      principleAccuracy: 'Understandable accuracy', principleAccuracyBody: 'A true bearing, clear source, and visible deviation.',
      principlePrivacy: 'Privacy by design', principlePrivacyBody: 'Local computation and an experience that works offline.',
      principleEvidence: 'Evidence first', principleEvidenceBody: 'Independent verification through the Sun or Moon and camera geometry.',
      systemsTitle: 'Two independent paths.<br><span>One confidence.</span>',
      systemsIntro: 'Celestial verification never overwrites the computed Qibla. Each system keeps its own inputs and result, then shows you the comparison clearly.',
      storyTitle: 'One story.<br><span>Three quiet moments.</span>',
      storyIntro: 'Instead of an overloaded fantasy scene, the experience follows the film: the sky is the guide, the human is the seeker, and QiblaAstro is the instrument.',
      storySky: 'The sky was our first guide', storySkyBody: 'It shaped our first understanding of direction and time.',
      storySailor: 'Navigation is human knowledge', storySailorBody: 'People observed celestial bodies to find their way.',
      storyApp: 'Today, the guide is in your hand', storyAppBody: 'GNSS for computation; the Sun or Moon for verification.',
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
