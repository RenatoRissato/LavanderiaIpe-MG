/* Lavanderia Ipê — interações da página.
   Sem dependências externas: tudo o que é animação contínua fica no CSS,
   e o JavaScript cuida apenas de estado, progresso de rolagem e conteúdo. */
(() => {
  'use strict';

  const data = window.businessData || {};
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  /* ---------- Cabeçalho ---------- */

  const header = $('.site-header');
  const menuButton = $('.menu-toggle');
  const nav = $('.main-nav');

  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    nav.classList.remove('is-open');
  };

  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
  });

  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('click', event => { if (!header.contains(event.target)) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });
  matchMedia('(min-width: 901px)').addEventListener('change', closeMenu);

  /* ---------- Rolagem: cabeçalho, seção ativa e tambores ---------- */

  const navLinks = $$('.main-nav a');
  const sections = navLinks.map(link => $(link.hash)).filter(Boolean);
  const drums = $$('[data-drum], [data-drum-scroll]');

  let ticking = false;

  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle('is-scrolled', y > 12);

    // Seção ativa na navegação.
    let active = null;
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= innerHeight * 0.35) active = section;
    });
    navLinks.forEach(link => {
      const isCurrent = active && link.hash === `#${active.id}`;
      if (isCurrent) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });

    if (!reduceMotion.matches) {
      // Tambores acompanham a rolagem, reforçando a ideia de ciclo.
      drums.forEach(drum => {
        const rect = drum.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > innerHeight + 200) return;
        const progress = (innerHeight - rect.top) / (innerHeight + rect.height);
        drum.style.setProperty('--scroll-spin', `${(progress * 100).toFixed(2)}deg`);
      });

    }

    ticking = false;
  };

  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onScroll);
  }, { passive: true });
  onScroll();

  /* ---------- Percurso entre as etapas: uma passagem, sem loop ---------- */

  const stepsList = $('[data-steps]');
  if (stepsList) {
    const steps = $$('.step', stepsList);
    const duration = 4800;
    let frame = 0;
    let elapsed = 0;
    let lastTime = null;
    let visible = false;
    let finished = false;

    const paint = progress => {
      const position = progress * (steps.length - 1);
      steps.forEach((step, index) => {
        const segment = Math.max(0, Math.min(1, position - index));
        step.style.setProperty('--connection-progress', segment.toFixed(4));
        step.classList.toggle('is-reached', position >= index);
        step.classList.toggle('is-connecting', segment > 0 && segment < 1);
      });
    };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; lastTime = null; };
    const tick = time => {
      if (lastTime !== null) elapsed += time - lastTime;
      lastTime = time;
      const progress = Math.min(elapsed / duration, 1);
      paint(progress);
      if (progress < 1) frame = requestAnimationFrame(tick);
      else { finished = true; stop(); }
    };
    const resume = () => {
      if (visible && !document.hidden && !finished && !reduceMotion.matches && !frame) frame = requestAnimationFrame(tick);
    };
    const settle = () => { stop(); finished = true; paint(1); };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        if (visible) resume(); else stop();
      }, { threshold: 0.15 });
      observer.observe(stepsList);
      if (reduceMotion.matches) settle();
    } else settle();

    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else resume(); });
    reduceMotion.addEventListener('change', event => {
      if (event.matches) settle();
    });
  }

  /* ---------- Faixa contínua ---------- */

  // A animação precisa do conteúdo duplicado para emendar sem intervalo vazio.
  // A cópia fica fora da árvore de acessibilidade para não repetir a leitura.
  const marqueeTrack = $('.marquee-track');
  if (marqueeTrack && !reduceMotion.matches) {
    const clone = marqueeTrack.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    marqueeTrack.after(clone);
  }

  /* ---------- Revelação de conteúdo ---------- */

  const revealTargets = $$('[data-reveal]');

  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const observer = new IntersectionObserver((entries, self) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        self.unobserve(entry.target);
      });
    }, { threshold: .15, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(target => observer.observe(target));
    reduceMotion.addEventListener('change', event => {
      if (!event.matches) return;
      observer.disconnect();
      revealTargets.forEach(target => target.classList.add('is-visible'));
    });
  } else {
    revealTargets.forEach(target => target.classList.add('is-visible'));
  }

  /* ---------- Vantagens: entrada por cartão e iluminação discreta ---------- */

  const benefits = $('.advantages');
  if (benefits) {
    const targets = $$('[data-benefit-reveal]', benefits);
    if ('IntersectionObserver' in window && !reduceMotion.matches) {
      // A cascata encadeia entre chamadas próximas no tempo: os cartões que surgem
      // na mesma chegada à seção entram em sequência, e quem aparece bem depois não espera.
      let passo = 0;
      let ultimo = 0;
      const observer = new IntersectionObserver((entries, self) => {
        const agora = performance.now();
        if (agora - ultimo > 420) passo = 0;
        entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top ||
            a.boundingClientRect.left - b.boundingClientRect.left)
          .forEach(entry => {
            entry.target.style.setProperty('--benefit-delay', `${Math.min(passo++, 5) * 80}ms`);
            entry.target.classList.add('benefit-visible');
            self.unobserve(entry.target);
            ultimo = agora;
          });
      }, { threshold: .18, rootMargin: '0px 0px -5% 0px' });
      benefits.classList.add('benefits-ready');
      targets.forEach(target => observer.observe(target));
      reduceMotion.addEventListener('change', event => {
        if (!event.matches) return;
        observer.disconnect();
        targets.forEach(target => target.classList.add('benefit-visible'));
      });
    }

    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    $$('[data-benefit-light]', benefits).forEach(card => {
      let frame = 0;
      let pointer = null;
      const clear = () => {
        cancelAnimationFrame(frame); frame = 0; pointer = null;
        card.style.removeProperty('--light-x'); card.style.removeProperty('--light-y');
      };
      card.addEventListener('pointermove', event => {
        if (reduceMotion.matches || !finePointer.matches) return;
        pointer = { x: event.clientX, y: event.clientY };
        if (frame) return;
        frame = requestAnimationFrame(() => {
          const bounds = card.getBoundingClientRect();
          card.style.setProperty('--light-x', `${pointer.x - bounds.left}px`);
          card.style.setProperty('--light-y', `${pointer.y - bounds.top}px`);
          frame = 0;
        });
      });
      card.addEventListener('pointerleave', clear);
      reduceMotion.addEventListener('change', clear);
      finePointer.addEventListener('change', clear);
    });
  }

  /* ---------- Profundidade do hero ---------- */

  const heroImage = $('.hero-image');
  const heroArt = $('.hero-art');

  if (heroImage && heroArt && !reduceMotion.matches && matchMedia('(pointer: fine)').matches) {
    let frame = 0;
    heroArt.addEventListener('pointermove', event => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const rect = heroArt.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        heroImage.style.transform = `translate3d(${(x * 14).toFixed(1)}px, ${(y * 10).toFixed(1)}px, 0)`;
        frame = 0;
      });
    });
    heroArt.addEventListener('pointerleave', () => { heroImage.style.transform = ''; });
  }

  /* ---------- Guia tocando na própria seção ---------- */

  const inlineBox = $('[data-inline-video]');
  const inlineVideo = inlineBox && $('video', inlineBox);
  const inlineToggle = inlineBox && $('[data-video-toggle]', inlineBox);
  // Em conexão lenta ou com economia de dados o vídeo espera o toque: são 3 MB.
  const link = navigator.connection || {};
  const linkLento = link.saveData === true || /(^|-)2g$/.test(link.effectiveType || '');
  // Quem pede menos movimento começa com o quadro parado e decide se quer ver.
  let inlineHeld = reduceMotion.matches || linkLento;
  let inlineVisible = false;

  const markInline = playing => {
    if (!inlineToggle) return;
    $('use', inlineToggle).setAttribute('href', playing ? '#i-pause' : '#i-play');
    $('[data-video-label]', inlineToggle).textContent = playing ? 'Pausar' : 'Reproduzir';
    inlineToggle.setAttribute('aria-label', playing ? 'Pausar o vídeo' : 'Reproduzir o vídeo');
  };

  const playInline = () => {
    if (!inlineVideo || inlineHeld) return;
    // O arquivo só começa a baixar aqui: até entrar na tela, o slot mostra apenas o pôster.
    inlineVideo.play().then(() => markInline(true)).catch(() => markInline(false));
  };

  const pauseInline = () => {
    if (!inlineVideo) return;
    inlineVideo.pause();
    markInline(false);
  };

  if (inlineVideo) {
    // Com JavaScript, os controles nativos saem de cena e ficam o autoplay mudo e o botão da marca.
    inlineVideo.removeAttribute('controls');
    inlineBox.classList.add('is-enhanced');
    markInline(false);

    inlineToggle.addEventListener('click', () => {
      inlineHeld = !inlineVideo.paused;
      if (inlineHeld) pauseInline(); else playInline();
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => entries.forEach(entry => {
        inlineVisible = entry.isIntersecting;
        if (inlineVisible) playInline(); else inlineVideo.pause();
      }), { threshold: .45 }).observe(inlineBox);
    } else {
      inlineVisible = true;
      playInline();
    }

    reduceMotion.addEventListener('change', event => {
      inlineHeld = event.matches;
      if (inlineHeld) pauseInline(); else if (inlineVisible) playInline();
    });
  }

  /* ---------- Vídeo da unidade ---------- */

  const dialog = $('#video-dialog');
  const video = $('video', dialog);
  let lastTrigger = null;

  $$('[data-video]').forEach(trigger => trigger.addEventListener('click', () => {
    lastTrigger = trigger;
    pauseInline();
    // O pôster só é atribuído na abertura: evita baixar a imagem no carregamento da página.
    if (!video.poster) video.poster = 'Assets/images/lavanderia-ipe-video-poster.webp';
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
      document.body.classList.add('dialog-open');
    } else {
      video.scrollIntoView({ block: 'center' });
    }
  }));

  $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (outside) dialog.close();
  });
  dialog.addEventListener('close', () => {
    video.pause();
    document.body.classList.remove('dialog-open');
    lastTrigger?.focus();
    if (inlineVisible) playInline();
  });

  /* ---------- Dados do negócio ---------- */

  // Links de WhatsApp com mensagem inicial por contexto.
  if (data.whatsapp) {
    $$('[data-wa]').forEach(link => {
      const message = data.whatsappMessages?.[link.dataset.wa] || data.whatsappMessages?.default;
      link.href = `https://wa.me/${data.whatsapp}` + (message ? `?text=${encodeURIComponent(message)}` : '');
    });
  }

  // Preços: só aparecem quando houver valor oficial confirmado no config.
  const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  $$('[data-price]').forEach(element => {
    const value = data.prices?.[element.dataset.price];
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return;
    element.textContent = currency.format(value);
    element.closest('[data-price-slot]')?.removeAttribute('hidden');
  });

  $('#year').textContent = String(new Date().getFullYear());

  // Com o domínio definido, completa canonical, og:url e o JSON-LD.
  if (data.siteUrl) {
    try {
      const url = new URL(data.siteUrl);
      if (url.protocol === 'https:') {
        const canonical = document.createElement('link');
        canonical.rel = 'canonical';
        canonical.href = url.href;
        document.head.append(canonical);

        const ogUrl = document.createElement('meta');
        ogUrl.setAttribute('property', 'og:url');
        ogUrl.content = url.href;
        document.head.append(ogUrl);

        const socialImage = new URL('Assets/images/social.jpg', url).href;
        $('[property="og:image"]').content = socialImage;
        $('[name="twitter:image"]').content = socialImage;

        const script = $('#business-data');
        const business = JSON.parse(script.textContent);
        business.url = url.href;
        business.image = socialImage;
        script.textContent = JSON.stringify(business);
      }
    } catch {
      /* Uma URL inválida no config não deve interromper o restante da página. */
    }
  }
})();
