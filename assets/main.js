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
  const videoBg = document.getElementById('videoBg');
  const cinema = document.getElementById('cinema');
  const videoToggle = document.getElementById('videoToggle');
  const filmPlay = document.getElementById('filmPlay');
  const soundToggle = document.getElementById('soundToggle');
  const videoSeek = document.getElementById('videoSeek');
  const videoTime = document.getElementById('videoTime');
  const fullscreenToggle = document.getElementById('fullscreenToggle');
  const videoCaption = document.getElementById('videoCaption');
  const playIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7V5Z"/></svg>';
  const pauseIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
  const subtitles = [
    { start: 0, end: 4.5, text: 'منذ القدم، اهتدى البحّارة بالسماء والنجوم.' },
    { start: 4.5, end: 9.5, text: 'لكن معرفة اتجاه القبلة تحتاج إلى أكثر من التخمين.' },
    { start: 9.5, end: 15, text: 'تبدأ الرحلة بحساب الاتجاه الحقيقي من موقعك.' },
    { start: 15, end: 21, text: 'ثم يأتي التحقق الفلكي باستخدام الشمس أو القمر.' },
    { start: 21, end: 27.5, text: 'تُقارن القراءة الفعلية بالاتجاه المحسوب بدقة.' },
    { start: 27.5, end: 34, text: 'حتى يصبح الانحراف واضحًا ومفهومًا أمامك.' },
    { start: 34, end: 41, text: 'QiblaAstro Ultimate… ميزان الكعبة.' },
    { start: 41, end: 59, text: 'انظر إلى السماء… تجد طريقك.' }
  ];
  if (video?.textTracks?.[0]) video.textTracks[0].mode = 'hidden';
  const formatTime = seconds => {
    const safe = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
    return `${Math.floor(safe / 60)}:${Math.floor(safe % 60).toString().padStart(2, '0')}`;
  };
  const syncBackdrop = () => {
    if (!video || !videoBg) return;
    if (Math.abs(videoBg.currentTime - video.currentTime) > .22) videoBg.currentTime = video.currentTime;
    if (video.paused) videoBg.pause();
    else videoBg.play().catch(() => {});
  };
  const syncVideo = () => {
    if (!video || !cinema || !videoToggle) return;
    cinema.classList.toggle('is-playing', !video.paused);
    cinema.classList.toggle('is-muted', video.muted);
    videoToggle.innerHTML = video.paused ? playIcon : pauseIcon;
    videoToggle.setAttribute('aria-label', video.paused ? 'تشغيل الفيديو بالصوت' : 'إيقاف الفيديو مؤقتًا');
    if (soundToggle) {
      soundToggle.innerHTML = `<span aria-hidden="true">${video.muted ? '🔇' : '🔊'}</span>`;
      soundToggle.setAttribute('aria-label', video.muted ? 'تشغيل الصوت' : 'كتم الصوت');
    }
    const duration = Math.min(Number.isFinite(video.duration) ? video.duration : 62, 59);
    if (videoSeek) videoSeek.value = duration ? String(Math.round((video.currentTime / duration) * 1000)) : '0';
    if (videoTime) videoTime.textContent = `${formatTime(video.currentTime)} / ${formatTime(duration)}`;
    if (videoCaption) {
      const cue = subtitles.find(item => video.currentTime >= item.start && video.currentTime < item.end) || subtitles[subtitles.length - 1];
      videoCaption.textContent = cue.text;
    }
    syncBackdrop();
  };
  const toggleVideo = async () => {
    if (!video) return;
    if (video.paused) {
      if (video.currentTime >= 58.7) video.currentTime = 0;
      video.muted = false;
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
    // Stop on the branded closing shot so the editor mark is never shown.
    if (video.currentTime >= 58.9) {
      video.pause();
      video.currentTime = 58.8;
    }
    syncVideo();
  });
  soundToggle?.addEventListener('click', () => {
    if (!video) return;
    video.muted = !video.muted;
    syncVideo();
  });
  videoSeek?.addEventListener('input', () => {
    if (!video) return;
    const duration = Math.min(Number.isFinite(video.duration) ? video.duration : 59, 59);
    video.currentTime = (Number(videoSeek.value) / 1000) * duration;
    syncVideo();
  });
  fullscreenToggle?.addEventListener('click', async () => {
    if (!cinema) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (cinema.requestFullscreen) await cinema.requestFullscreen();
      else if (video?.webkitEnterFullscreen) video.webkitEnterFullscreen();
    } catch (_) {}
  });
  video?.addEventListener('loadedmetadata', syncVideo);
  video?.addEventListener('volumechange', syncVideo);
  syncVideo();

  const translations = {
    en: {
      navSystems: 'Two systems', navExperience: 'Experience', navFilm: 'Film', openApp: 'Open app',
      eyebrow: 'THE SKY KNOWS THE WAY', heroArabic: 'ASTRONOMICAL QIBLA COMPASS',
      heroLead: 'A precisely computed Qibla bearing. An independent celestial verification using the Sun or Moon. Two separate systems—and a result you can understand and trust.',
      tryApp: 'Open QiblaAstro app', discover: 'Discover how it works', offline: 'Works offline', privacy: 'Privacy first', independent: 'Two independent systems',
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
      comfortIntro: 'The colors are not decoration. Velvet olive, restrained gold, and warm text tones reduce glare and keep long reading comfortable—so the interface recedes and the words remain present.',
      quranVisualTitle: 'An olive Quran experience made for reading.', quranVisualBody: 'A low-glare velvet olive ground, warm ivory text, and restrained gold for headings and markers. Every detail is tuned for eye comfort and a calm reading presence.',
      quranPoint1: 'Gentle contrast for extended reading', quranPoint2: 'Clear Quran typography with generous breathing room', quranPoint3: 'Surahs, Juz, search, and Khatmati in one system',
      quranTabRead: 'Reading', quranTabSurahs: 'Surahs', quranTabJuz: 'Juz', quranTabSearch: 'Search', quranTabKhatma: 'Khatmati',
      prayerVisualTitle: 'Prayer times shaped around your day.', prayerVisualBody: 'Next prayer, countdown, advance reminder, and a muezzin voice you choose.',
      prayerTimesCaption: 'Prayer times and next prayer', prayerSettingsCaption: 'Adhan, reminders, and location',
      azkarVisualTitle: 'One remembrance. Full presence.', azkarVisualBody: 'One clear card, generous Arabic type, and calm whitespace prevent crowded reading. A gentle counter follows your progress, with an audio reminder for the dhikr and interval you choose.',
      azkarTabRead: 'Dhikr & counter', azkarTabHome: 'Categories', azkarTabDua: 'Supplications', azkarTabReminder: 'Audio reminder',
      serenityVisualTitle: 'Rest and serenity.', serenityVisualBody: 'Choose the reciter, narration, and Surah in a simple, peaceful player.',
      knowledgeTitle: 'The sky, as it is now.', knowledgeBody: 'Falaki does not present isolated numbers. It explains the Sun and Moon position and when they can guide, then places Polaris, celestial navigation, and GNSS in one clear educational context—with no astrology or predictions.',
      falakiSun: 'The Sun now', falakiSunBody: 'Azimuth, altitude, state, and Arabic solar mansion.', falakiMoon: 'The Moon now', falakiMoonBody: 'Phase, illumination, azimuth, and altitude.',
      falakiGuide: 'How can the sky indicate Qibla?', falakiGuideBody: 'A reference appears only when its observation is practical.', falakiPolaris: 'Polaris', falakiPolarisBody: 'A celestial reference for north and the Qibla relative to it.', falakiNavigation: 'From sky to modern navigation', falakiNavigationBody: 'The sextant, stars, and GNSS in one educational story.',
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
      filmBody: 'Start with the short film, then explore every screen as it truly works. Sound is available on play, with Arabic subtitles throughout the journey.',
      playFilm: 'Watch with sound and subtitles',
      finalTitle: 'Look to the sky…<br><span>and you will find your way.</span>',
      finalBody: 'Start by finding the Qibla, then verify the precision yourself.', launchNow: 'Open the app now',
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
    syncGalleryCaptions();
  };

  const galleryEnglishCaptions = {
    'quran-reader.webp': 'Reading', 'quran-home.webp': 'Surahs', 'quran-juz.webp': 'Juz', 'quran-search.webp': 'Search', 'quran-khatma.webp': 'Khatmati',
    'azkar-reading.webp': 'Dhikr & counter', 'azkar-home.webp': 'Categories', 'azkar-dua.webp': 'Supplications', 'azkar-reminder.webp': 'Audio reminder'
  };
  function syncGalleryCaptions() {
    document.querySelectorAll('.showcase-tabs button.active').forEach(button => {
      const image = document.getElementById(`${button.dataset.gallery}GalleryImage`);
      const caption = document.getElementById(`${button.dataset.gallery}GalleryCaption`);
      if (!image || !caption) return;
      const file = button.dataset.src.split('/').pop();
      caption.textContent = language === 'en' ? galleryEnglishCaptions[file] : button.dataset.caption;
    });
  }
  document.querySelectorAll('.showcase-tabs button[data-gallery]').forEach(button => {
    button.addEventListener('click', () => {
      const group = button.dataset.gallery;
      const image = document.getElementById(`${group}GalleryImage`);
      const caption = document.getElementById(`${group}GalleryCaption`);
      if (!image || !caption) return;
      document.querySelectorAll(`.showcase-tabs button[data-gallery="${group}"]`).forEach(item => {
        const selected = item === button;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-selected', String(selected));
      });
      const frame = image.closest('.screen-frame');
      frame?.classList.add('switching');
      const swap = () => {
        image.onload = () => frame?.classList.remove('switching');
        image.src = button.dataset.src;
        image.alt = button.dataset.alt;
        const file = button.dataset.src.split('/').pop();
        caption.textContent = language === 'en' ? galleryEnglishCaptions[file] : button.dataset.caption;
        if (image.complete) frame?.classList.remove('switching');
      };
      window.setTimeout(swap, reducedMotion ? 0 : 120);
    });
  });
  langToggle?.addEventListener('click', () => applyLanguage(language === 'ar' ? 'en' : 'ar'));
})();
