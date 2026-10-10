/* Silhouettes pédagogiques (SVG) : poses, zones, effets (flèches, gouttes…) et scènes.
   Aucune image externe, aucun visuel graphique ou choquant. */
(function () {
  const D = (window.SECOURS = window.SECOURS || {});
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const r1 = n => Math.round(n * 10) / 10;
  const mid = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const J = (p, k) => p[k].join(",");

  /* Poses dans une boîte 100×100. gy = ligne de sol, cx = centre horizontal. */
  const POSES = {
    stand: { gy: 98, cx: 50, head: [50, 11], neck: [50, 21], sh: [50, 25], hip: [50, 58], eL: [39, 41], hL: [37, 56], eR: [61, 41], hR: [63, 56], kL: [45, 78], fL: [43, 97], kR: [55, 78], fR: [57, 97] },
    throat: { gy: 98, cx: 50, head: [50, 11], neck: [50, 21], sh: [50, 25], hip: [50, 58], eL: [38, 36], hL: [47, 23], eR: [62, 36], hR: [53, 23], kL: [45, 78], fL: [43, 97], kR: [55, 78], fR: [57, 97] },
    lean: { gy: 98, cx: 50, head: [36, 22], neck: [43, 29], sh: [46, 32], hip: [58, 58], eL: [52, 46], hL: [44, 58], eR: [60, 46], hR: [52, 60], kL: [57, 78], fL: [55, 97], kR: [65, 78], fR: [67, 97] },
    sit: { gy: 98, cx: 52, head: [46, 22], neck: [47, 32], sh: [47, 36], hip: [50, 66], eL: [58, 52], hL: [72, 62], eR: [60, 54], hR: [74, 64], kL: [76, 66], fL: [78, 96], kR: [80, 66], fR: [82, 96] },
    lie: { gy: 66, cx: 53, head: [12, 56], neck: [21, 56], sh: [25, 56], hip: [62, 56], eL: [40, 49], hL: [54, 47], eR: [40, 63], hR: [54, 65], kL: [78, 53], fL: [94, 55], kR: [78, 60], fR: [94, 61] },
    side: { gy: 66, cx: 53, head: [12, 58], neck: [21, 58], sh: [25, 58], hip: [62, 58], eL: [38, 50], hL: [26, 52], eR: [38, 64], hR: [52, 64], kL: [80, 48], fL: [88, 60], kR: [80, 63], fR: [94, 64] }
  };

  function zone(p, z) {
    switch (z) {
      case "head": return [p.head[0], p.head[1], 11];
      case "neck": return [p.neck[0], p.neck[1], 8];
      case "shoulder": return [p.sh[0], p.sh[1], 9];
      case "chest": { const m = mid(p.sh, p.hip, 0.3); return [m[0], m[1], 11]; }
      case "back": { const m = mid(p.sh, p.hip, 0.25); return [m[0], m[1], 11]; }
      case "abdomen": { const m = mid(p.sh, p.hip, 0.72); return [m[0], m[1], 11]; }
      case "arm": { const m = mid(p.eR, p.hR, 0.5); return [m[0], m[1], 8]; }
      case "hand": return [p.hR[0], p.hR[1], 7];
      case "leg": return [p.kR[0], p.kR[1], 9];
      default: return null;
    }
  }

  function fig(pose, tx, ty, s, cls) {
    const p = POSES[pose];
    return `<g class="${cls || ""}" transform="translate(${r1(tx)} ${r1(ty)}) scale(${s})">` +
      `<polyline class="f-leg" points="${J(p, "hip")} ${J(p, "kL")} ${J(p, "fL")}"/>` +
      `<polyline class="f-leg" points="${J(p, "hip")} ${J(p, "kR")} ${J(p, "fR")}"/>` +
      `<line class="f-torso" x1="${p.neck[0]}" y1="${p.neck[1]}" x2="${p.hip[0]}" y2="${p.hip[1]}"/>` +
      `<polyline class="f-arm" points="${J(p, "sh")} ${J(p, "eL")} ${J(p, "hL")}"/>` +
      `<polyline class="f-arm" points="${J(p, "sh")} ${J(p, "eR")} ${J(p, "hR")}"/>` +
      `<circle class="f-head" cx="${p.head[0]}" cy="${p.head[1]}" r="8"/></g>`;
  }

  function arr(x1, y1, x2, y2) {
    const a = Math.atan2(y2 - y1, x2 - x1), h = 6, s = 2.6;
    return `M${r1(x1)} ${r1(y1)}L${r1(x2)} ${r1(y2)}M${r1(x2 + h * Math.cos(a + s))} ${r1(y2 + h * Math.sin(a + s))}L${r1(x2)} ${r1(y2)}L${r1(x2 + h * Math.cos(a - s))} ${r1(y2 + h * Math.sin(a - s))}`;
  }

  function fx(kind, z) {
    const has = !!z;
    const [x, y, r] = z || [50, 50, 10];
    const P = d => `<path class="arrow" d="${d}"/>`;
    const Z = has ? `<circle class="zone" cx="${x}" cy="${y}" r="${r}"/>` : "";
    switch (kind) {
      case "press":
        return Z + `<g transform="translate(${x} ${y})"><g class="fx-press"><rect class="hand" x="-8" y="-17" width="16" height="9" rx="4"/>${P("M0 -31v9m-4 -4 4 4 4 -4")}</g></g>`;
      case "blows":
        return Z + [0, 1, 2].map(i => P(arr(x + 22, y - 16 + i * 8, x + 9, y - 4 + i * 4))).join("");
      case "thrust":
        return Z + P(`M${x - 22} ${y + 12}Q${x - 2} ${y + 16} ${x + 1} ${y - 5}`) + P(`M${x - 4} ${y + 1}L${x + 1} ${y - 5}L${x + 6} ${y + 1}`);
      case "drops":
        return Z + [-9, 0, 9].map((d, i) => `<g transform="translate(${x + d} ${y - 26})"><path class="drop" style="animation-delay:${i * 0.35}s" d="M0 0C4 5 6 8 0 12C-6 8-4 5 0 0z"/></g>`).join("");
      case "cover":
        return `<rect class="cover" x="${x - 13}" y="${y - 8}" width="26" height="16" rx="5"/>`;
      case "ice":
        return `<rect class="cover" x="${x - 12}" y="${y - 8}" width="24" height="16" rx="5"/><rect class="ice" x="${x - 8}" y="${y - 5}" width="7" height="7" rx="2"/><rect class="ice" x="${x + 1}" y="${y - 3}" width="7" height="7" rx="2"/>`;
      case "phone":
        return `<g transform="translate(76 8)"><rect class="ph" x="0" y="0" width="14" height="24" rx="3"/>${P("M18 6q5 5 0 10M22 3q8 8 0 16")}</g>`;
      case "breath":
        return Z + P(`M${x + 12} ${y - 3}q3 -4 6 0t6 0`) + P(`M${x + 12} ${y + 4}q3 -4 6 0t6 0`);
      case "warn":
        return `<g transform="translate(76 8)"><path class="alertic" d="M12 0L24 22H0z"/><path d="M12 7v8M12 18v2" stroke="var(--red-ink)" stroke-width="2.4" stroke-linecap="round"/></g>`;
      case "bolt":
        return Z + `<path class="bolt" d="M${x + 2} ${y - 24}l-9 14h7l-3 12 11-16h-7z"/>`;
      case "tap":
        return Z + P(`M${x - 14} ${y - 8}q-4 8 0 16`) + P(`M${x - 20} ${y - 12}q-7 12 0 24`);
      case "tilt":
        return Z + P(`M${x - 10} ${y - 16}A17 17 0 0 1 ${x + 12} ${y - 8}`) + P(`M${x + 5} ${y - 12}L${x + 12} ${y - 8}L${x + 6} ${y - 3}`);
      case "hold":
        return Z + P(arr(x - 24, y, x - 12, y)) + P(arr(x + 24, y, x + 12, y));
      case "snow":
        return `<g transform="translate(76 8)">${P("M10 0v20M0 10h20M3 3l14 14M17 3L3 17")}</g>`;
      case "sun":
        return `<g transform="translate(78 8)"><circle class="zone-static" cx="10" cy="10" r="5"/>${P("M10 0v3M10 17v3M0 10h3M17 10h3M3 3l2 2M15 15l2 2M17 3l-2 2M5 15l-2 2")}</g>`;
      case "pulse":
        return Z;
      default:
        return has && kind !== "none" ? Z : "";
    }
  }

  /* Illustration d'une étape. spec = [pose, zone, effet] */
  function visual(spec, label, cls) {
    const [pose, zn, kind] = spec;
    const p = POSES[pose];
    const z = zn ? zone(p, zn) : null;
    const a11y = label === null ? 'aria-hidden="true"' : `role="img" aria-label="${esc(label || "Illustration")}"`;
    return `<svg class="fig ${cls || ""}" viewBox="0 0 100 100" ${a11y}>` +
      `<line class="ground" x1="4" y1="${p.gy + 1}" x2="96" y2="${p.gy + 1}"/>` + fig(pose, 0, 0, 1) + fx(kind, z) + `</svg>`;
  }

  /* Fonds de scène */
  function bg(kind) {
    const floor = `<rect class="bg-floor" x="0" y="90" width="160" height="10"/>`;
    const B = (x, y, w, h) => `<rect class="bg-b" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
    const W = (x, y) => `<rect class="bg-w" x="${x}" y="${y}" width="5" height="6"/>`;
    switch (kind) {
      case "street": return B(0, 32, 40, 58) + B(46, 46, 32, 44) + B(112, 26, 48, 64) + W(8, 42) + W(20, 42) + W(8, 58) + W(20, 58) + W(122, 38) + W(136, 38) + W(122, 56) + W(136, 56) + `<line class="bg-l" x1="100" y1="40" x2="100" y2="90"/><circle class="bg-w" cx="100" cy="38" r="3"/>` + floor;
      case "work": return B(104, 60, 46, 4) + B(108, 64, 4, 26) + B(142, 64, 4, 26) + B(118, 44, 18, 16) + B(10, 30, 32, 40) + W(18, 40) + W(30, 40) + floor;
      case "home": return B(108, 22, 32, 30) + `<line class="bg-l" x1="124" y1="22" x2="124" y2="52"/><line class="bg-l" x1="108" y1="37" x2="140" y2="37"/>` + B(20, 66, 64, 4) + B(24, 70, 4, 20) + B(76, 70, 4, 20) + floor;
      case "school": return B(114, 36, 28, 54) + B(20, 72, 54, 4) + B(24, 76, 4, 14) + B(66, 76, 4, 14) + `<circle class="bg-b" cx="30" cy="34" r="14"/>` + B(28, 46, 4, 26) + floor;
      case "outdoor": return `<circle class="bg-w" cx="130" cy="22" r="9"/><path class="bg-b" d="M0 90Q40 50 80 76T160 66V90z"/><rect class="bg-b" x="16" y="52" width="4" height="38"/><circle class="bg-b" cx="18" cy="48" r="13"/>` + floor;
      case "road": return `<rect class="bg-b" x="0" y="80" width="160" height="20"/>` + [10, 50, 90, 130].map(x => `<rect class="bg-w" x="${x}" y="90" width="22" height="2"/>`).join("") + B(130, 30, 3, 50) + B(120, 30, 23, 10);
      case "water": return B(0, 54, 160, 6) + `<path class="bg-l" d="M0 66q10 -4 20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0" fill="none"/><rect class="water" x="0" y="60" width="160" height="40"/>`;
      default: return floor;
    }
  }

  function place(pose, x, s) {
    const p = POSES[pose];
    return { tx: x - p.cx * s, ty: 90 - p.gy * s, s };
  }

  /* Scène complète. sc = { bg, victim:{pose,x,s,fall}, others:[{pose,x,s}] } */
  function scene(sc, label) {
    const G = 90;
    let out = bg(sc.bg);
    (sc.others || []).forEach(o => {
      const q = place(o.pose, o.x, o.s || 0.75);
      out += fig(o.pose, q.tx, q.ty, q.s, "other");
    });
    const v = sc.victim, s = v.s || 0.85;
    if (v.fall) {
      const px = v.x + 41 * s;
      const st = place("stand", px, s);
      out += `<g class="sc-fall" style="transform-origin:${r1(px)}px ${G}px">${fig("stand", st.tx, st.ty, st.s, "victim")}</g>`;
      const l = place("lie", v.x, s);
      out += `<g class="sc-lie">${fig("lie", l.tx, l.ty, l.s, "victim")}</g>`;
    } else {
      const q = place(v.pose, v.x, s);
      out += fig(v.pose, q.tx, q.ty, q.s, "victim");
    }
    if (sc.bg === "water") out += `<rect class="water" x="0" y="64" width="160" height="36"/>`;
    const a11y = label === null ? 'aria-hidden="true"' : `role="img" aria-label="${esc(label || "Scène")}"`;
    return `<svg class="sc" viewBox="0 0 160 100" ${a11y}>${out}</svg>`;
  }

  /* Position (en %) d'un point d'observation */
  function hot(sc, o) {
    if (o.at) return o.at;
    const v = sc.victim, s = v.s || 0.85, p = POSES[v.pose];
    const q = place(v.pose, v.x, s);
    const pt = (pp, zn, qq) => { const z = zone(pp, zn); return [r1((qq.tx + z[0] * qq.s) / 1.6), r1(qq.ty + z[1] * qq.s)]; };
    switch (o.k) {
      case "victim": return pt(p, "chest", q);
      case "breath": return pt(p, "head", q);
      case "reaction": return pt(p, "hand", q);
      case "others": {
        const oo = (sc.others || [])[0];
        if (!oo) return [20, 50];
        const op = POSES[oo.pose], oq = place(oo.pose, oo.x, oo.s || 0.75);
        return pt(op, "chest", oq);
      }
      default: return [50, 40];
    }
  }

  D.fig = { visual, scene, hot, POSES };
})();
