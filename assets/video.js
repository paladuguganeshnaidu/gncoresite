(() => {
  'use strict';
  const frame = document.querySelector('#demo-player');
  const play = frame?.querySelector('.landing-video-play');
  if (!play) return;
  play.addEventListener('click', () => {
    const player = document.createElement('iframe');
    player.src = 'https://www.youtube-nocookie.com/embed/bo6wQHvEId8?start=0&autoplay=1&rel=0';
    player.title = 'GNCore demo: website, VS Code and ChatGPT';
    player.width = '1280';
    player.height = '720';
    player.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
    player.allowFullscreen = true;
    player.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.replaceChildren(player);
    player.focus();
  }, { once: true });
})();
