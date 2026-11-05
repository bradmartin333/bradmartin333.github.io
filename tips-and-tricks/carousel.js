(() => {
  'use strict';

  // ---------- setup ----------

  const SOURCE = typeof CARDS !== 'undefined' && Array.isArray(CARDS) ? CARDS : [];
  const ALL = SOURCE.filter(c => c && document.getElementById('tpl-' + c.type));
  // every card needs a unique id for its share link. Hand-written ids win; generated ones
  // ("card-3") skip any id already in use, and a repeated hand-written id gets a suffix.
  const written = new Set(ALL.filter(c => c.id).map(c => c.id));
  const seen = new Set();
  ALL.forEach((c, i) => {
    let id = c.id;
    if (!id || seen.has(id)) {
      if (id) console.warn('tips-and-tricks: duplicate card id "' + id + '"');
      const base = id || 'card-' + (i + 1);
      id = base;
      for (let k = 2; seen.has(id) || (id !== c.id && written.has(id)); k++) id = base + '-' + k;
    }
    seen.add(id);
    c.id = id;
  });

  const $ = s => document.querySelector(s);
  const stage = $('#stage'), deck = $('#deck'), counter = $('#counter');

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const calm = () => reduce.matches;

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const mod = (a, m) => ((a % m) + m) % m;
  const ease = (dt, rate) => 1 - Math.exp(-dt * rate);

  // the card id from the URL hash; a mangled link (e.g. a stray '%') must not break the page
  const hashId = () => {
    const raw = location.hash.slice(1);
    try { return decodeURIComponent(raw); } catch (_) { return raw; }
  };

  // move o[k] toward o[k + 'T']; returns true while still moving
  function approach(o, k, rate, dt) {
    const t = o[k + 'T'];
    o[k] += (t - o[k]) * ease(dt, rate);
    if (Math.abs(t - o[k]) < 1e-3) { o[k] = t; return false; }
    return true;
  }

  // ---------- building cards from templates ----------

  const esc = s => String(s).replace(/[&<>"']/g, ch =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
  const rich = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');

  function derive(card) {
    const d = Object.assign({}, card);
    if (card.url) {
      try { d.host = new URL(card.url).hostname.replace(/^www\./, ''); } catch (_) { d.host = ''; }
      if (!d.linkText) d.linkText = (d.host || 'link') + ' ↗';
    }
    return d;
  }

  function fill(root, card) {
    root.querySelectorAll('[data-slot]').forEach(el => {
      const v = card[el.dataset.slot];
      if (v == null || v === '' || (Array.isArray(v) && !v.length)) { el.remove(); return; }
      if (Array.isArray(v)) el.innerHTML = v.map(x => '<li>' + rich(x) + '</li>').join('');
      else if (el.hasAttribute('data-rich')) el.innerHTML = rich(v);
      else el.textContent = v;
    });
    root.querySelectorAll('[data-href]').forEach(el => {
      const v = card[el.dataset.href];
      if (v) el.href = v;
      else el.remove();
    });
    root.querySelectorAll('.actions').forEach(a => { if (!a.children.length) a.remove(); });
  }

  function build(card) {
    const el = document.createElement('article');
    el.className = 'card';
    el.dataset.type = card.type;
    el.setAttribute('aria-roledescription', 'card');
    const tilt = document.createElement('div');
    tilt.className = 'tilt';
    const face = document.createElement('div');
    face.className = 'face';
    face.append(document.getElementById('tpl-' + card.type).content.cloneNode(true));
    fill(face, derive(card));
    tilt.append(face);
    el.append(tilt);
    el._card = card;
    el._tilt = tilt;
    el._face = face;
    el._hover = 0;
    el._hoverT = 0;
    el._vis = true;
    return el;
  }

  // ---------- state ----------

  let els = [], n = 0, W = 340;
  let pos = 0, vel = 0, target = 0;
  let lastActive = -1, interacted = false;
  // ox/oy: the pointer's spot on the card; the tilt pivots there so whatever is under the pointer stays put
  const tilt = { el: null, x: 0, xT: 0, y: 0, yT: 0, ox: 0, oy: 0 };
  const par = { x: 0, xT: 0, y: 0, yT: 0 };

  const wrap = d => (n ? d - n * Math.round(d / n) : 0); // shortest signed distance on the ring
  const active = () => (n ? mod(Math.round(target), n) : -1);
  const pxPerCard = () => W * 0.72;

  function goTo(i) {
    if (!n) return;
    interacted = true;
    const base = Math.round(target);
    target = base + wrap(i - mod(base, n));
    kick();
  }

  function step(dir) {
    if (!n) return;
    interacted = true;
    target = Math.round(target) + dir;
    kick();
  }

  function measure() { W = (els[0] && els[0].offsetWidth) || 340; }

  function render(startId) {
    els = ALL.map(build);
    n = els.length;
    deck.replaceChildren(...els);
    if (!n) deck.innerHTML = '<p class="empty">no cards yet</p>';
    measure();
    const start = Math.max(0, ALL.findIndex(c => c.id === startId));
    target = start;
    vel = 0;
    pos = !calm() && n > 1 ? start - Math.min(3, n) : start; // gentle slide-in
    kick();
  }

  function onActive(ai) {
    lastActive = ai;
    els.forEach((el, i) => {
      const on = i === ai;
      el.classList.toggle('is-front', on);
      el.setAttribute('aria-label', (i + 1) + ' of ' + n + ': ' + el._card.title);
      el.querySelectorAll('a, button').forEach(x => { x.tabIndex = on ? 0 : -1; });
      // a scrollable face is keyboard-focusable in recent browsers; keep side cards out of Tab
      if (on) el._face.removeAttribute('tabindex'); else el._face.tabIndex = -1;
    });
    counter.textContent = (ai + 1) + ' / ' + n;
    const id = ALL[ai] && ALL[ai].id;
    if (interacted && id && hashId() !== id) {
      try { history.replaceState(null, '', '#' + encodeURIComponent(id)); } catch (_) { /* file:// etc */ }
    }
  }

  // ---------- animation loop ----------

  let raf = 0, lastT = 0;

  function kick() {
    if (raf) return;
    lastT = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function frame(t) {
    const dt = clamp((t - lastT) / 1000, 0, 0.05);
    lastT = t;
    const fx = !calm();
    let busy = false;

    // carousel spring (critically damped, fixed sub-steps)
    if (!drag.active) {
      if (!fx) { pos = target; vel = 0; }
      else {
        const k = 180, c = 2 * Math.sqrt(k);
        for (let rem = dt; rem > 0; rem -= 1 / 240) {
          const h = Math.min(rem, 1 / 240);
          vel += (k * (target - pos) - c * vel) * h;
          pos += vel * h;
        }
        if (Math.abs(target - pos) < 5e-4 && Math.abs(vel) < 5e-3) { pos = target; vel = 0; }
        else busy = true;
      }
      // keep the numbers small once settled
      if (pos === target && n && mod(target, n) !== target) pos = target = mod(target, n);
    }

    if (fx) {
      busy = approach(par, 'x', 4, dt) || busy;
      busy = approach(par, 'y', 4, dt) || busy;
    } else {
      par.x = par.y = 0;
    }

    // lay out the ring. Each card gets its own perspective (same origin: the stage centre) and
    // cards are stacked by z-index, so neighbours overlap cleanly instead of slicing through
    // each other in a shared 3D space mid-swipe. The mouse parallax is folded in here too.
    const ai = active();
    const view = 'perspective(1300px)' + (fx
      ? ' rotateX(' + (-par.y * 3).toFixed(2) + 'deg) rotateY(' + (par.x * 5).toFixed(2) + 'deg) '
      : ' ');
    for (let i = 0; i < n; i++) {
      const el = els[i];
      if (fx) {
        el._hover += (el._hoverT - el._hover) * ease(dt, 12);
        if (Math.abs(el._hoverT - el._hover) > 1e-3) busy = true; else el._hover = el._hoverT;
      } else el._hover = 0;

      const d = wrap(i - pos), a = Math.abs(d);
      let fade = a > 3 ? 1 - (a - 3) / 0.6 : 1;
      if (n >= 3 && n < 8) fade = Math.min(fade, (n / 2 - a) / 0.5); // hide the wrap-around jump
      if (fade <= 0) {
        if (el._vis) { el.style.visibility = 'hidden'; el._vis = false; }
        continue;
      }
      if (!el._vis) { el.style.visibility = ''; el._vis = true; }

      const s = Math.sign(d), h = el._hover;
      const x = s * (a < 1 ? a * 0.72 : 0.72 + (a - 1) * 0.3) * W - s * h * 26;
      const y = a * 10 - h * 16;
      const z = -a * 150 + h * 50;
      const ry = clamp(d, -1, 1) * 40 * (1 - h * 0.35);
      const sc = 1 - Math.min(a, 3) * 0.05;
      el.style.transform = view + 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,' + z.toFixed(1) + 'px) rotateY(' + ry.toFixed(2) + 'deg) scale(' + sc.toFixed(3) + ')';
      el.style.zIndex = String(10000 - Math.round(a * 1000));
      el.style.opacity = fade < 1 ? fade.toFixed(3) : '';
      el._tilt.style.setProperty('--dim', (Math.min(a * 0.35, 0.85) * (1 - h * 0.5)).toFixed(3));
    }

    // hover tilt on the front card
    const fel = els[ai] || null;
    if (tilt.el && tilt.el !== fel) {
      const ts = tilt.el._tilt.style;
      ts.transform = ts.transformOrigin = '';
      tilt.x = tilt.y = 0;
    }
    tilt.el = fel;
    if (fel && !fx) {
      fel._tilt.style.transform = fel._tilt.style.transformOrigin = '';
      tilt.x = tilt.y = 0;
    } else if (fel) {
      busy = approach(tilt, 'x', 10, dt) || busy;
      busy = approach(tilt, 'y', 10, dt) || busy;
      const ts = fel._tilt.style;
      ts.transformOrigin = tilt.ox.toFixed(1) + 'px ' + tilt.oy.toFixed(1) + 'px';
      ts.transform = 'rotateX(' + (-tilt.y * 10).toFixed(2) + 'deg) rotateY(' + (tilt.x * 12).toFixed(2) + 'deg)';
    }

    if (n && ai !== lastActive) onActive(ai);

    raf = busy ? requestAnimationFrame(frame) : 0;
  }

  // ---------- drag / swipe / tap ----------

  const drag = { id: null, active: false, x0: 0, y0: 0, pos0: 0, samples: [] };
  let suppressClick = false, downOnCode = false;

  stage.addEventListener('pointerdown', e => {
    if (!n || drag.id !== null || (e.pointerType === 'mouse' && e.button !== 0)) return;
    Object.assign(drag, { id: e.pointerId, active: false, x0: e.clientX, y0: e.clientY, pos0: pos, samples: [] });
    suppressClick = false;
    // remembered here because the hover tilt can move the card between press and release
    downOnCode = !!e.target.closest('[data-copy]');
  });

  addEventListener('pointermove', e => {
    if (e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
    if (!drag.active) {
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) return;
      drag.active = true;
      suppressClick = true;
      interacted = true;
      drag.x0 = e.clientX;
      drag.pos0 = pos;
      vel = 0;
      try { stage.setPointerCapture(e.pointerId); } catch (_) { /* pointer already gone */ }
      document.body.classList.add('dragging');
    }
    let d = -(e.clientX - drag.x0) / pxPerCard();
    const ad = Math.abs(d);
    if (ad > 1) d = Math.sign(d) * (1 + (ad - 1) * 0.55); // rubber band past one card
    pos = drag.pos0 + d;
    drag.samples.push({ t: e.timeStamp, p: pos });
    if (drag.samples.length > 10) drag.samples.shift();
    kick();
  });

  function endDrag(e) {
    if (e.pointerId !== drag.id) return;
    if (drag.active) {
      let v = 0;
      const s = drag.samples, last = s[s.length - 1];
      if (last && e.timeStamp - last.t < 90) {
        let first = last;
        for (let i = s.length - 1; i >= 0 && last.t - s[i].t <= 100; i--) first = s[i];
        const span = (last.t - first.t) / 1000;
        if (span > 0.01) v = (last.p - first.p) / span;
      }
      v = calm() ? 0 : clamp(v, -30, 30);
      const base = Math.round(drag.pos0);
      let t = Math.round(pos + v * 0.22);
      if (t === base && Math.abs(pos - drag.pos0) > 0.15) t = base + Math.sign(pos - drag.pos0);
      target = clamp(t, base - 10, base + 10);
      vel = v;
      document.body.classList.remove('dragging');
    }
    drag.id = null;
    drag.active = false;
    kick();
  }

  addEventListener('pointerup', endDrag);
  addEventListener('pointercancel', endDrag);

  stage.addEventListener('dragstart', e => e.preventDefault());

  // taps and clicks: side card -> bring forward, code -> copy
  stage.addEventListener('click', e => {
    if (suppressClick) {
      e.preventDefault();
      e.stopPropagation();
      suppressClick = false;
      return;
    }
    const card = e.target.closest('.card');
    if (!card) return;
    const i = els.indexOf(card);
    if (i !== active()) {
      e.preventDefault();
      goTo(i);
      return;
    }
    if ((downOnCode || e.target.closest('[data-copy]')) && !String(getSelection())) copyCard(card);
  }, true);

  // ---------- mouse hover: tilt, magnet, parallax ----------

  stage.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    const r = stage.getBoundingClientRect();
    par.xT = clamp(((e.clientX - r.left) / r.width - 0.5) * 2, -1, 1);
    par.yT = clamp(((e.clientY - r.top) / r.height - 0.5) * 2, -1, 1);

    const card = drag.active ? null : e.target.closest('.card');
    const ai = active();
    els.forEach((el, i) => { el._hoverT = el === card && i !== ai ? 1 : 0; });
    if (card && card === els[ai] && e.target.closest('a, button')) {
      // hold the tilt still over links/buttons so they don't slide out from under the pointer
      tilt.xT = tilt.x;
      tilt.yT = tilt.y;
    } else if (card && card === els[ai]) {
      const cr = card.getBoundingClientRect();
      tilt.xT = clamp(((e.clientX - cr.left) / cr.width - 0.5) * 2, -1, 1);
      tilt.yT = clamp(((e.clientY - cr.top) / cr.height - 0.5) * 2, -1, 1);
      tilt.ox = clamp(e.clientX - cr.left, 0, cr.width);
      tilt.oy = clamp(e.clientY - cr.top, 0, cr.height);
    } else {
      tilt.xT = tilt.yT = 0;
    }
    kick();
  });

  stage.addEventListener('pointerleave', e => {
    if (e.pointerType !== 'mouse' || drag.active) return;
    par.xT = par.yT = 0;
    tilt.xT = tilt.yT = 0;
    els.forEach(el => { el._hoverT = 0; });
    kick();
  });

  // ---------- keyboard ----------

  addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    switch (e.key) {
      case 'ArrowRight': step(1); break;
      case 'ArrowLeft': step(-1); break;
      case 'Home': goTo(0); break;
      case 'End': goTo(n - 1); break;
      case 'ArrowDown':
      case 'ArrowUp': {
        // scroll within the front card; if it can't scroll that way, leave the key to the page
        const el = els[active()], face = el && el._face, down = e.key === 'ArrowDown';
        const room = face && (down ? face.scrollHeight - face.clientHeight - face.scrollTop : face.scrollTop);
        if (!(room > 1)) return;
        face.scrollBy({ top: down ? 64 : -64, behavior: calm() ? 'auto' : 'smooth' });
        break;
      }
      case 'c': if (els[active()]) copyCard(els[active()]); break;
      default: return;
    }
    e.preventDefault();
  });

  // ---------- copy ----------

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {
      // http on a LAN address or file://: fall back to the old way
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.body.append(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (__) { ok = false; }
      ta.remove();
      return ok;
    }
  }

  // quiet feedback: "copied" fades in on the code block and its border lights up briefly
  async function copyCard(cardEl) {
    const c = cardEl && cardEl._card;
    const code = cardEl && cardEl.querySelector('.code');
    if (!c || !c.code || !code) return;
    if (!(await copyText(c.code))) return;
    clearTimeout(cardEl._copyTimer);
    code.classList.add('copied');
    cardEl._copyTimer = setTimeout(() => code.classList.remove('copied'), 1400);
  }

  // ---------- boot ----------

  addEventListener('hashchange', () => {
    const i = ALL.findIndex(c => c.id === hashId());
    if (i >= 0) goTo(i);
  });

  if (reduce.addEventListener) reduce.addEventListener('change', kick);

  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(() => { measure(); kick(); }).observe(stage);
  else addEventListener('resize', () => { measure(); kick(); });

  render(hashId());
})();
