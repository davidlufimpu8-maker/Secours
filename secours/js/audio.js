/* Sons synthétisés, très discrets. Facultatifs : désactivés par défaut, jamais indispensables. */
(function () {
  const D = (window.SECOURS = window.SECOURS || {});
  let ctx = null;

  function ensure() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { ctx = new AC(); } catch (e) { ctx = null; }
    return ctx;
  }

  function tone(freq, dur, vol, delay) {
    const c = ensure(); if (!c) return;
    const t = c.currentTime + (delay || 0);
    const o = c.createOscillator(), g = c.createGain();
    o.type = "sine"; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + dur + 0.05);
  }

  function breath() {
    const c = ensure(); if (!c) return;
    const len = c.sampleRate * 4, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource(); src.buffer = buf;
    const f = c.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 500;
    const g = c.createGain(), t = c.currentTime;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.03, t + 1.8);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 3.8);
    src.connect(f); f.connect(g); g.connect(c.destination);
    src.start(t); src.stop(t + 4);
  }

  D.audio = {
    play(kind) {
      switch (kind) {
        case "tap": tone(440, 0.09, 0.03); break;
        case "ok": tone(523, 0.18, 0.035); tone(659, 0.22, 0.03, 0.12); break;
        case "soft": tone(330, 0.25, 0.03); break;
        case "breath": breath(); break;
      }
    }
  };
})();
