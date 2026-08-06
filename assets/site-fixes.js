(() => {
  'use strict';

  const formatTime = (value) => {
    if (!Number.isFinite(value)) return '0:00';
    const mins = Math.floor(value / 60);
    const secs = Math.floor(value % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const subtitles = [
    { start: 0, end: 4.5, text: 'منذ القدم، اهتدى البحّارة بالسماء والنجوم.' },
    { start: 4.5, end: 9.5, text: 'لكن معرفة اتجاه القبلة تحتاج إلى أكثر من التخمين.' },
    { start: 9.5, end: 15, text: 'تبدأ الرحلة بحساب الاتجاه الحقيقي من موقعك.' },
    { start: 15, end: 21, text: 'ثم يأتي التحقق الفلكي باستخدام الشمس أو القمر.' },
    { start: 21, end: 27.5, text: 'تُقارن القراءة الفعلية بالاتجاه المحسوب بدقة.' },
    { start: 27.5, end: 34, text: 'حتى يصبح الانحراف واضحًا ومفهومًا أمامك.' },
    { start: 34, end: 41, text: 'QiblaAstro Ultimate… ميزان الكعبة.' },
    { start: 41, end: 9999, text: 'انظر إلى السماء… تجد طريقك.' }
  ];

  const setupSplash = () => {
    const splash = document.getElementById('splash');
    const enter = document.getElementById('enterBtn');
    if (!splash) return;
    splash.classList.remove('hide');
    splash.style.display = 'grid';
    document.documentElement.style.overflow = 'hidden';
    let closed = false;
    const closeSplash = () => {
      if (closed) return;
      closed = true;
      splash.classList.add('hide');
      document.documentElement.style.overflow = '';
      setTimeout(() => { splash.style.display = 'none'; }, 950);
    };
    enter?.addEventListener('click', closeSplash, { once: true });
    setTimeout(closeSplash, 5500);
  };

  const setupVideo = () => {
    const video = document.getElementById('heroVideo');
    const background = document.getElementById('videoBg');
    const cinema = video?.closest('.cinema');
    const caption = document.getElementById('caption');
    if (!video || !cinema) return;

    document.getElementById('soundBtn')?.remove();
    cinema.querySelector('.qg-video-controls')?.remove();

    video.controls = false;
    video.muted = true;
    video.volume = 1;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    if (background) {
      background.muted = true;
      background.removeAttribute('controls');
      background.setAttribute('aria-hidden', 'true');
    }

    const controls = document.createElement('div');
    controls.className = 'qg-video-controls';
    controls.setAttribute('aria-label', 'أدوات التحكم في الفيديو');
    controls.innerHTML = `
      <button type="button" class="qg-play" aria-label="تشغيل الفيديو">▶</button>
      <button type="button" class="qg-mute" aria-label="تشغيل الصوت">🔇</button>
      <input class="qg-seek" type="range" min="0" max="1000" value="0" aria-label="التقدم في الفيديو">
      <span class="qg-video-time">0:00 / 0:00</span>
      <button type="button" class="qg-full" aria-label="ملء الشاشة">⛶</button>`;
    cinema.appendChild(controls);

    const play = controls.querySelector('.qg-play');
    const mute = controls.querySelector('.qg-mute');
    const seek = controls.querySelector('.qg-seek');
    const time = controls.querySelector('.qg-video-time');
    const full = controls.querySelector('.qg-full');

    const updateCaption = () => {
      if (!caption) return;
      const t = Number.isFinite(video.currentTime) ? video.currentTime : 0;
      const item = subtitles.find(entry => t >= entry.start && t < entry.end) || subtitles[subtitles.length - 1];
      caption.textContent = item.text;
      caption.setAttribute('lang', 'ar');
      caption.setAttribute('dir', 'rtl');
      caption.style.display = 'block';
    };

    const syncBackground = () => {
      if (!background) return;
      if (Math.abs((background.currentTime || 0) - (video.currentTime || 0)) > 0.3) {
        try { background.currentTime = video.currentTime; } catch (_) {}
      }
      if (video.paused) background.pause();
      else background.play().catch(() => {});
    };

    const update = () => {
      play.textContent = video.paused ? '▶' : '❚❚';
      mute.textContent = video.muted ? '🔇' : '🔊';
      play.setAttribute('aria-label', video.paused ? 'تشغيل الفيديو' : 'إيقاف الفيديو مؤقتًا');
      mute.setAttribute('aria-label', video.muted ? 'تشغيل الصوت' : 'كتم الصوت');
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      seek.value = duration ? String(Math.round((video.currentTime / duration) * 1000)) : '0';
      time.textContent = `${formatTime(video.currentTime)} / ${formatTime(duration)}`;
      updateCaption();
      syncBackground();
    };

    play.addEventListener('click', async (event) => {
      event.stopPropagation();
      if (video.paused) {
        try { await video.play(); } catch (_) {}
      } else video.pause();
      update();
    });

    mute.addEventListener('click', (event) => {
      event.stopPropagation();
      video.muted = !video.muted;
      update();
    });

    seek.addEventListener('input', (event) => {
      event.stopPropagation();
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      video.currentTime = (Number(seek.value) / 1000) * video.duration;
      update();
    });

    full.addEventListener('click', async (event) => {
      event.stopPropagation();
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else if (cinema.requestFullscreen) await cinema.requestFullscreen();
        else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
      } catch (_) {}
    });

    ['play','pause','timeupdate','durationchange','volumechange','loadedmetadata','ended','seeking','seeked']
      .forEach(name => video.addEventListener(name, update));

    video.addEventListener('click', () => play.click());

    if (caption) {
      const observer = new MutationObserver(() => {
        const t = Number.isFinite(video.currentTime) ? video.currentTime : 0;
        const item = subtitles.find(entry => t >= entry.start && t < entry.end) || subtitles[subtitles.length - 1];
        if (caption.textContent !== item.text) caption.textContent = item.text;
      });
      observer.observe(caption, { childList: true, characterData: true, subtree: true });
    }

    video.play().catch(() => {});
    background?.play().catch(() => {});
    setInterval(updateCaption, 300);
    update();
  };

  const boot = () => { setupSplash(); setupVideo(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
