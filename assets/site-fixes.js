(() => {
  'use strict';

  const formatTime = (value) => {
    if (!Number.isFinite(value)) return '0:00';
    const mins = Math.floor(value / 60);
    const secs = Math.floor(value % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const setupSplash = () => {
    const splash = document.getElementById('splash');
    const enter = document.getElementById('enterBtn');
    if (!splash) return;

    splash.classList.remove('hide');
    splash.style.display = 'grid';
    splash.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';

    let closed = false;
    const closeSplash = () => {
      if (closed) return;
      closed = true;
      splash.classList.add('hide');
      splash.setAttribute('aria-hidden', 'true');
      document.documentElement.style.overflow = '';
      window.setTimeout(() => { splash.style.display = 'none'; }, 950);
    };

    enter?.addEventListener('click', closeSplash, { once: true });
    window.setTimeout(closeSplash, 5500);
  };

  const setupVideo = () => {
    const video = document.getElementById('heroVideo');
    const background = document.getElementById('videoBg');
    const cinema = video?.closest('.cinema');
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

    const syncBackground = () => {
      if (!background) return;
      if (Math.abs((background.currentTime || 0) - (video.currentTime || 0)) > 0.35) {
        try { background.currentTime = video.currentTime; } catch (_) {}
      }
      if (video.paused) background.pause();
      else background.play().catch(() => {});
    };

    const update = () => {
      play.textContent = video.paused ? '▶' : '❚❚';
      play.setAttribute('aria-label', video.paused ? 'تشغيل الفيديو' : 'إيقاف الفيديو مؤقتًا');
      mute.textContent = video.muted ? '🔇' : '🔊';
      mute.setAttribute('aria-label', video.muted ? 'تشغيل الصوت' : 'كتم الصوت');
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      seek.value = duration ? String(Math.round((video.currentTime / duration) * 1000)) : '0';
      time.textContent = `${formatTime(video.currentTime)} / ${formatTime(duration)}`;
      syncBackground();
    };

    play.addEventListener('click', async () => {
      if (video.paused) {
        try { await video.play(); } catch (_) {}
      } else {
        video.pause();
      }
      update();
    });

    mute.addEventListener('click', () => {
      video.muted = !video.muted;
      update();
    });

    seek.addEventListener('input', () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      video.currentTime = (Number(seek.value) / 1000) * video.duration;
      syncBackground();
      update();
    });

    full.addEventListener('click', async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else if (cinema.requestFullscreen) await cinema.requestFullscreen();
        else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
      } catch (_) {}
    });

    ['play','pause','timeupdate','durationchange','volumechange','loadedmetadata','ended','seeking','seeked']
      .forEach((eventName) => video.addEventListener(eventName, update));

    video.addEventListener('click', () => play.click());
    video.play().catch(() => {});
    background?.play().catch(() => {});
    update();
  };

  const boot = () => {
    setupSplash();
    setupVideo();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
