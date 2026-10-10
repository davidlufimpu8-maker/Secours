/* SECOURS — application front-end (JS vanilla, aucun backend, aucune donnée envoyée). */
(function () {
  "use strict";
  const D = window.SECOURS, F = D.fig, C = D.config;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const n2 = n => String(n).padStart(2, "0");
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* Stockage local uniquement (préférences), jamais transmis. */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    sget(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    sset(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };

  const app = $("#app");
  const autoLite = () => { try { const n = navigator; return !!((n.connection && n.connection.saveData) || (n.hardwareConcurrency && n.hardwareConcurrency <= 2) || (n.deviceMemory && n.deviceMemory <= 2)); } catch (e) { return false; } };
  const savedLite = store.get("secours.lite", null);
  const state = {
    country: C.defaultCountry || store.get("secours.country", null),
    sound: store.get("secours.sound", "0") === "1",
    lite: savedLite !== null ? savedLite === "1" : autoLite()
  };

  let timers = [];
  const later = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); return id; };
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
  const sfx = k => { if (state.sound && D.audio) D.audio.play(k); };
  const topicById = id => D.topics.find(t => t.id === id);

  const IDK = "Ne pas être sûr est courant, et c'est une vraie réponse. En situation réelle, ne restez pas passif : approchez-vous si c'est sûr, parlez à la personne, demandez de l'aide autour de vous et appelez les secours — ils vous guident pas à pas. En cas de doute, on demande de l'aide.";
  const VERDICT = { ok: ["✓", "BON RÉFLEXE"], nuance: ["~", "À NUANCER"], no: ["✕", "À ÉVITER"], idk: ["?", "PAS SÛR"] };

  /* ───────── Dialogues ───────── */
  const openDlg = d => { try { d.showModal(); } catch (e) { d.setAttribute("open", ""); } };
  const closeDlg = d => { try { d.close(); } catch (e) { d.removeAttribute("open"); } };
  const dw = $("#dlg-warning"), de = $("#dlg-emergency");
  let mandatory = false;

  function showWarning(m) { mandatory = m; openDlg(dw); }
  dw.addEventListener("cancel", e => { if (mandatory) e.preventDefault(); });
  $("#w-ok").addEventListener("click", () => { closeDlg(dw); if (mandatory) { mandatory = false; ack(); } });

  function ack() {
    store.sset("secours.ack", "1");
    const i = $("#intro");
    if (i) { i.classList.add("out"); setTimeout(() => i.remove(), 650); }
    app.focus({ preventScroll: true });
  }

  function renderNumbers() {
    const box = $("#urg-numbers");
    const c = D.countries.find(x => x.id === state.country);
    if (c) {
      box.innerHTML = `<a class="btn btn-red callbig" href="tel:${c.primary}">APPELER LE ${esc(c.primary)}</a>` +
        `<ul class="numlist">${c.numbers.map(n => `<li>${n.call ? `<a href="tel:${n.n}">${esc(n.n)}</a>` : `<b>${esc(n.n)}</b>`}<span>${esc(n.l)}</span></li>`).join("")}</ul>` +
        (c.verified ? "" : `<p class="note">Numéros à confirmer par le responsable du site avant publication.</p>`);
    } else if (state.country === "other") {
      box.innerHTML = `<p><strong>Composez le numéro d'urgence de votre pays.</strong></p><p>Le 112 est reconnu par de nombreux réseaux mobiles, sans garantie partout.</p><a class="btn btn-red callbig" href="tel:112">ESSAYER LE 112</a>`;
    } else {
      box.innerHTML = `<p class="note">Choisissez votre pays pour afficher les numéros d'urgence locaux. Aucun numéro n'est supposé.</p>`;
    }
  }
  function openEmergency() {
    const sel = $("#ctry");
    sel.innerHTML = `<option value="">— Choisir —</option>` + D.countries.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join("") + `<option value="other">Autre pays / je ne sais pas</option>`;
    sel.value = state.country || "";
    renderNumbers();
    openDlg(de);
  }
  $("#ctry").addEventListener("change", e => { state.country = e.target.value || null; store.set("secours.country", state.country || ""); if (!state.country) state.country = null; renderNumbers(); });
  $("#e-close").addEventListener("click", () => closeDlg(de));

  /* ───────── Préférences (son, mode allégé) ───────── */
  function updSound() {
    ["#sound", "#intro-sound"].forEach(s => {
      const b = $(s); if (!b) return;
      b.textContent = state.sound ? "🔊 SON" : "🔇 MUET";
      b.setAttribute("aria-pressed", String(state.sound));
      b.setAttribute("aria-label", state.sound ? "Son activé. Cliquer pour couper" : "Son coupé. Cliquer pour activer");
    });
  }
  function toggleSound() { state.sound = !state.sound; store.set("secours.sound", state.sound ? "1" : "0"); updSound(); if (state.sound) sfx($("#intro") ? "breath" : "soft"); }
  function updLite() {
    document.documentElement.classList.toggle("lite", state.lite);
    const b = $("#lite"); b.textContent = "Mode allégé : " + (state.lite ? "oui" : "non"); b.setAttribute("aria-pressed", String(state.lite));
  }
  $("#sound").addEventListener("click", toggleSound);
  $("#intro-sound").addEventListener("click", toggleSound);

  document.addEventListener("click", e => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const a = b.dataset.act;
    if (a === "urgence") { $("#nav").classList.remove("open"); openEmergency(); }
    else if (a === "warning") showWarning(false);
    else if (a === "lite") { state.lite = !state.lite; store.set("secours.lite", state.lite ? "1" : "0"); updLite(); }
  });
  $("#menu").addEventListener("click", () => { const o = $("#nav").classList.toggle("open"); $("#menu").setAttribute("aria-expanded", String(o)); });

  /* ───────── Composants ───────── */
  function helpBlock(t) {
    return `<section class="help" aria-labelledby="help-t"><h2 id="help-t">BESOIN D'AIDE ?</h2>` +
      `<p>Appelez les services d'urgence dans ces situations :</p>` +
      `<ul class="ticks">${t.emergency.when.map(w => `<li>${esc(w)}</li>`).join("")}</ul>` +
      (t.emergency.note ? `<p>${esc(t.emergency.note)}</p>` : "") +
      `<button class="btn btn-red" type="button" data-act="urgence">APPELER LES SERVICES D'URGENCE</button></section>`;
  }

  function mountStepper(box, steps, onDone, doneLabel) {
    let i = 0;
    function draw(focus) {
      const s = steps[i], last = i === steps.length - 1;
      box.innerHTML = `<div class="step-head"><span>ÉTAPE ${n2(i + 1)}</span><span class="step-of">sur ${n2(steps.length)}</span></div>` +
        `<div class="step-body"><div class="step-vis">${F.visual(s[2], "Illustration : " + s[0])}</div><div class="step-txt"><p class="q">Que faire maintenant ?</p><h3 id="stp-t" tabindex="-1">${esc(s[0])}</h3><p>${esc(s[1])}</p>` +
        (s[3] && topicById(s[3]) ? `<p><a class="link" href="#/apprendre/${s[3]}">Voir la fiche : ${esc(topicById(s[3]).title)}</a></p>` : "") + `</div></div>` +
        `<div class="dots" aria-hidden="true">${steps.map((_, k) => `<i class="${k <= i ? "on" : ""}"></i>`).join("")}</div>` +
        `<div class="step-nav">${i > 0 ? `<button class="btn btn-ghost" type="button" data-s="prev">ÉTAPE PRÉCÉDENTE</button>` : ""}<button class="btn btn-primary" type="button" data-s="next">${last ? (doneLabel || "TERMINER") : "ÉTAPE SUIVANTE"}</button></div>`;
      if (focus) $("#stp-t", box).focus();
    }
    box.addEventListener("click", e => {
      const b = e.target.closest("[data-s]"); if (!b) return;
      sfx("tap");
      if (b.dataset.s === "prev" && i > 0) { i--; draw(true); }
      else if (b.dataset.s === "next") { if (i < steps.length - 1) { i++; draw(true); } else if (onDone) onDone(); }
    });
    draw(false);
  }

  /* Décision : une question, options mélangées + « Je ne sais pas ». */
  function decisionUI(host, q, cb, noIdk) {
    const w = document.createElement("div"); host.appendChild(w);
    const list = shuffle(q.o).concat(noIdk ? [] : [{ t: "JE NE SAIS PAS", r: "idk", w: IDK }]);
    const best = list.find(x => x.r === "ok");
    w.innerHTML = `<div class="opts">${list.map((o, i) => `<button class="opt ${o.r === "idk" ? "idk" : ""}" type="button" data-i="${i}"><span>${esc(o.t)}</span></button>`).join("")}</div><div class="fb" aria-live="polite"></div>`;
    w.addEventListener("click", e => {
      const b = e.target.closest(".opt"); if (!b || b.disabled) return;
      const o = list[+b.dataset.i], fb = $(".fb", w);
      $$(".opt", w).forEach((el, k) => {
        el.disabled = true;
        const it = list[k];
        if (el === b) { el.classList.add("picked"); el.insertAdjacentHTML("beforeend", `<span class="tag">${VERDICT[o.r][0]} ${VERDICT[o.r][1]}</span>`); }
        else if (it === best && o.r !== "ok") { el.classList.add("best"); el.insertAdjacentHTML("beforeend", `<span class="tag">✓ BON RÉFLEXE</span>`); }
      });
      fb.innerHTML = `<div class="why"><p class="why-h">Regardons pourquoi.</p><p>${esc(o.w)}</p></div>` +
        (o.r !== "ok" && best ? `<div class="why alt"><p><strong>Ce que recommandent les principes</strong></p><p>${esc(best.t)}</p><p>${esc(best.w)}</p></div>` : "");
      sfx(o.r === "ok" ? "ok" : "soft");
      cb(o, fb);
    });
  }

  const sceneCard = s => `<div class="thumb">${F.scene(s.scene, null)}</div>`;

  /* ───────── Vues ───────── */
  const V = {};
  const page = (title, html, bind) => ({ title, html, bind });

  V.accueil = () => page("", `
    <section class="hero">
      <p class="eyebrow">SECOURS · Les bons gestes. Au bon moment.</p>
      <h1>Quelqu'un a besoin d'aide.</h1>
      <p class="q">Que faites-vous ?</p>
      <div class="paths">
        <a class="path" href="#/apprendre"><b>APPRENDRE</b><span>Découvrir les premiers secours à son rythme.</span>${F.visual(["lie", "chest", "press"], null)}</a>
        <a class="path" href="#/simuler"><b>SIMULER</b><span>Entrer dans des situations interactives.</span>${F.visual(["stand", null, "phone"], null)}</a>
      </div>
      <h2>Aller plus loin</h2>
      <div class="more">
        <a class="card" href="#/quiz/situations"><h3>Quiz</h3><p>Des mini-situations, pas des questions de mémoire.</p></a>
        <a class="card" href="#/quiz/mythes"><h3>Mythe ou bon réflexe ?</h3><p>Testez ce que vous croyez savoir.</p></a>
        <a class="card" href="#/secondes"><h3>Les premières secondes</h3><p>Une situation, dans le temps.</p></a>
        <a class="card" href="#/trousse"><h3>La trousse</h3><p>Ce qu'elle contient, ce qu'elle ne fait pas.</p></a>
      </div>
      <p class="note" style="margin-top:2rem">Sensibilisation uniquement. Aucune formation en ligne ne remplace une formation pratique.</p>
    </section>`);

  V.apprendre = id => {
    if (!id) {
      return page("Apprendre", `<h1>Apprendre</h1><p class="lead">Choisissez une situation. Chaque fiche se lit pas à pas.</p>` +
        D.cats.map(c => `<section aria-labelledby="c-${c.id}"><h2 id="c-${c.id}">${c.title}</h2><p class="cat-sub">${esc(c.sub)}</p><div class="grid">` +
          D.topics.filter(t => t.cat === c.id).map(t => `<a class="card" href="#/apprendre/${t.id}"><div class="thumb">${F.visual(t.thumb, null)}</div><h3>${esc(t.title)}</h3><p>${esc(t.intro)}</p></a>`).join("") + `</div></section>`).join(""));
    }
    const t = topicById(id);
    if (!t) return V.introuvable();
    const sc = D.scenarios.find(s => s.topic === id);
    const ver = t.lastVerified || C.contentReview.date;
    return page(t.title, `<article>
      <p class="crumb"><a href="#/apprendre">← APPRENDRE</a></p>
      <h1>${esc(t.title)}</h1><p class="lead">${esc(t.intro)}</p>
      <section aria-labelledby="sg"><h2 id="sg">Reconnaître</h2><ul class="chips">${t.signs.map(s => `<li>${esc(s)}</li>`).join("")}</ul></section>
      <section aria-labelledby="pp"><h2 id="pp">Que faire ?</h2><div id="stepper" class="stepper" aria-live="polite"></div>
        ${t.warnings.map(w => `<p class="warnbox">${esc(w)}</p>`).join("")}</section>
      <section aria-labelledby="av"><h2 id="av" tabindex="-1">À ÉVITER</h2><ul class="avoid">${t.avoid.map(a => `<li><span class="x" aria-hidden="true">✕</span><div><strong>${esc(a[0])}</strong><details><summary>Pourquoi ?</summary><p>${esc(a[1])}</p></details></div></li>`).join("")}</ul></section>
      ${helpBlock(t)}
      <section aria-labelledby="sr"><h2 id="sr">Sources</h2><ul class="srcs">${t.sources.map(s => { const x = D.sources.find(y => y.id === s); return x ? `<li>${esc(x.org)}<small>${esc(x.title)}</small></li>` : ""; }).join("")}</ul>
        <p class="note">${ver ? "Dernière vérification : " + esc(ver) : "Dernière vérification : non renseignée (version de démonstration)."} <a href="#/sources">Toutes les sources</a></p></section>
      ${sc ? `<p><a class="btn btn-primary" href="#/simuler/${sc.id}">SIMULER CETTE SITUATION</a></p>` : ""}
    </article>`, root => mountStepper($("#stepper", root), t.steps, () => { const a = $("#av", root); a.scrollIntoView({ behavior: "smooth" }); a.focus(); }, "VOIR À ÉVITER"));
  };

  V.simuler = id => {
    if (id) { const sc = D.scenarios.find(s => s.id === id); if (sc) return playScenario(sc); return V.introuvable(); }
    return page("Simuler", `<h1>Simuler</h1><p class="lead">Observez. Décidez. Comprenez. Choisissez un environnement ou parcourez tout.</p>
      <div class="chips" role="group" aria-label="Filtrer par environnement"><button class="chip" type="button" aria-pressed="true" data-env="all">TOUS</button>${D.envs.map(e => `<button class="chip" type="button" aria-pressed="false" data-env="${e.id}">${e.label}</button>`).join("")}</div>
      <div class="grid" id="scgrid">${D.scenarios.map(s => `<a class="card" href="#/simuler/${s.id}" data-env="${s.env.join(" ")}">${sceneCard(s)}<span class="num">SCÉNARIO ${s.n}</span><h3>${esc(s.title)}</h3><p>« ${esc(s.place)} »</p></a>`).join("")}</div>
      <p id="scnone" class="note" hidden>Aucun scénario pour cet environnement.</p>`, root => {
      $$(".chip[data-env]", root).forEach(b => b.addEventListener("click", () => {
        $$(".chip[data-env]", root).forEach(x => x.setAttribute("aria-pressed", String(x === b)));
        const env = b.dataset.env; let n = 0;
        $$("#scgrid .card", root).forEach(c => { const show = env === "all" || c.dataset.env.split(" ").includes(env); c.hidden = !show; if (show) n++; });
        $("#scnone", root).hidden = n > 0;
      }));
    });
  };

  function playScenario(sc) {
    const t = topicById(sc.topic), idx = D.scenarios.indexOf(sc), nxt = D.scenarios[idx + 1];
    const PH = ["OBSERVATION", "ALERTE", "ACTION", "SURVEILLANCE"];
    const phaseOf = { context: 0, observe: 0, d0: 0, d1: 1, help: 1, d2: 2, steps: 2, surv: 3, end: 4 };
    return page(`Scénario ${sc.n} — ${sc.title}`, `<p class="crumb"><a href="#/simuler">← SIMULER</a></p><div id="sim"></div>`, root => {
      const box = $("#sim", root);
      const scene = (anim, extra) => `<div class="scene ${anim ? "" : "static"} ${extra || ""}">${F.scene(sc.scene, "Scène : " + sc.place)}</div>`;
      const progress = ph => `<ol class="progress" aria-label="Progression">${PH.map((p, i) => `<li class="${i < ph ? "done" : i === ph ? "cur" : ""}" ${i === ph ? 'aria-current="step"' : ""}>${i < ph ? "✓ " : ""}${p}</li>`).join("")}</ol>`;

      function decision(st, qi, nextStage) {
        const q = sc.decisions[qi];
        st.innerHTML = `<p class="eyebrow">DÉCIDER</p><h2 id="stg-t" tabindex="-1">${esc(q.q)}</h2>${q.ctx ? `<p>${esc(q.ctx)}</p>` : ""}${scene(false, "mini")}<div id="dz"></div><div class="btn-row" id="nx" hidden><button class="btn btn-primary" type="button" data-go="${nextStage}">CONTINUER</button></div>`;
        decisionUI($("#dz", st), q, () => { const nx = $("#nx", st); nx.hidden = false; nx.scrollIntoView({ behavior: "smooth", block: "nearest" }); });
      }

      const stages = {
        context(st) {
          st.innerHTML = `<p class="eyebrow">SCÉNARIO ${sc.n} — « ${esc(sc.place)} »</p><h1 id="stg-t" tabindex="-1">${esc(sc.title)}</h1>${scene(true)}<div class="ctx">${sc.context.map((l, i) => `<p class="ln" style="animation-delay:${(i * 1.1 + 0.4).toFixed(1)}s">${esc(l)}</p>`).join("")}</div><div class="btn-row"><button class="btn btn-primary" type="button" data-go="observe">OBSERVER LA SCÈNE</button></div>`;
        },
        observe(st) {
          const n = sc.observe.length, seen = new Set();
          st.innerHTML = `<p class="eyebrow">SCÉNARIO ${sc.n}</p><h2 class="obs-title" id="stg-t" tabindex="-1">OBSERVEZ</h2><div class="timer" id="tm"><i></i></div>` +
            `<div class="scene static" style="position:relative">${F.scene(sc.scene, "Scène : " + sc.place)}${sc.observe.map((o, i) => { const p = F.hot(sc.scene, o); return `<button class="hot wait" type="button" tabindex="-1" aria-hidden="true" data-k="${i}" style="left:${p[0]}%;top:${p[1]}%" disabled>${i + 1}</button>`; }).join("")}</div>` +
            `<p id="hint" class="note" style="margin-top:.8rem">Prenez quelques secondes pour regarder la scène…</p>` +
            `<div class="chips" id="chips">${sc.observe.map((o, i) => `<button class="chip" type="button" data-k="${i}" disabled>${esc(o.label)}</button>`).join("")}</div>` +
            `<div class="info" id="info" aria-live="polite"><p></p></div><div class="btn-row"><button class="btn btn-primary" type="button" data-go="d0" id="obs-next" disabled>CONTINUER</button></div>`;
          later(() => {
            $$("[data-k]", st).forEach(b => { b.disabled = false; });
            $$(".hot", st).forEach(h => { h.classList.remove("wait"); h.classList.add("on"); });
            $("#tm", st).classList.add("done"); $("#obs-next", st).disabled = false;
            $("#hint", st).textContent = "Touchez les éléments importants de la scène.";
          }, 3000);
          st.addEventListener("click", e => {
            const b = e.target.closest("[data-k]"); if (!b || b.disabled) return;
            const k = +b.dataset.k, o = sc.observe[k]; seen.add(k); sfx("tap");
            $$(`[data-k="${k}"]`, st).forEach(x => x.classList.add("seen"));
            const chip = $(`.chip[data-k="${k}"]`, st); if (!chip.textContent.startsWith("✓")) chip.textContent = "✓ " + chip.textContent;
            $("#info", st).innerHTML = `<p><strong>${esc(o.label)}</strong></p><p>${esc(o.text)}</p>`;
            $("#hint", st).textContent = `${seen.size} / ${n} éléments observés`;
          });
        },
        d0(st) { decision(st, 0, "d1"); },
        d1(st) { decision(st, 1, "help"); },
        help(st) {
          st.innerHTML = `<p class="eyebrow">ALERTE</p><h2 id="stg-t" tabindex="-1">Alertez les secours</h2>${helpBlock(t)}<h3>Pendant l'appel</h3><ul><li>Parlez clairement et donnez le lieu précis.</li><li>Décrivez ce que vous voyez, sans deviner.</li><li>Suivez les instructions. Ne raccrochez pas avant qu'on vous le dise.</li></ul><div class="btn-row"><button class="btn btn-primary" type="button" data-go="d2">PASSER À L'ACTION</button></div>`;
        },
        d2(st) { decision(st, 2, "steps"); },
        steps(st) {
          st.innerHTML = `<p class="eyebrow">ACTION</p><h2 id="stg-t" tabindex="-1">Les gestes, pas à pas</h2><div id="stepper" class="stepper" aria-live="polite"></div>${t.warnings.map(w => `<p class="warnbox">${esc(w)}</p>`).join("")}`;
          mountStepper($("#stepper", st), t.steps, () => go("surv"), "PASSER À LA SURVEILLANCE");
        },
        surv(st) {
          st.innerHTML = `<p class="eyebrow">SURVEILLANCE</p><h2 id="stg-t" tabindex="-1">Jusqu'à l'arrivée des secours</h2><ul class="ticks">${sc.surv.map(s => `<li>${esc(s)}</li>`).join("")}</ul><div class="btn-row"><button class="btn btn-primary" type="button" data-go="end">TERMINER LA SITUATION</button></div>`;
        },
        end(st) {
          st.innerHTML = `<p class="eyebrow">FIN</p><h2 id="stg-t" tabindex="-1">Situation terminée.</h2><p>Vous venez de vivre une situation en quelques minutes. Dans la réalité, savoir réaliser ces gestes demande une formation pratique.</p><p class="note">Ces scénarios sensibilisent, ils ne certifient pas.</p><div class="btn-row"><a class="btn btn-primary" href="#/apprendre/${t.id}">REVOIR LA FICHE</a>${nxt ? `<a class="btn" href="#/simuler/${nxt.id}">SCÉNARIO SUIVANT</a>` : ""}<a class="btn btn-ghost" href="#/quiz/situations">FAIRE LE QUIZ</a></div>`;
        }
      };
      function go(s) {
        clearTimers();
        const ph = phaseOf[s];
        box.innerHTML = progress(ph) + `<div id="stage"></div>`;
        const st = $("#stage", box); stages[s](st);
        const h = $("#stg-t", st); if (h) h.focus({ preventScroll: true });
        window.scrollTo(0, 0);
      }
      box.addEventListener("click", e => { const g = e.target.closest("[data-go]"); if (g) { sfx("tap"); go(g.dataset.go); } });
      go("context");
    });
  }

  V.quiz = sub => {
    if (sub === "situations") return page("Quiz", `<p class="crumb"><a href="#/quiz">← QUIZ</a></p><div id="qz"></div>`, quizPlay);
    if (sub === "mythes") return page("Mythe ou bon réflexe ?", `<p class="crumb"><a href="#/quiz">← QUIZ</a></p><div id="mz"></div>`, mythPlay);
    return page("Quiz", `<h1>Quiz</h1><p class="lead">Pour vous questionner, pas pour vous noter.</p><div class="grid">
      <a class="card" href="#/quiz/situations"><span class="num">${D.quiz.length} SITUATIONS</span><h3>Quiz de situations</h3><p>Vous arrivez sur les lieux. Que faites-vous ?</p></a>
      <a class="card" href="#/quiz/mythes"><span class="num">${D.myths.length} AFFIRMATIONS</span><h3>Mythe ou bon réflexe ?</h3><p>Une affirmation. À vous de trancher.</p></a>
      <a class="card" href="#/secondes"><span class="num">TIMELINE</span><h3>Les premières secondes</h3><p>Voir une situation évoluer dans le temps.</p></a></div>`);
  };

  function quizPlay(root) {
    const box = $("#qz", root), qs = D.quiz, res = []; let i = 0;
    function ask() {
      if (i >= qs.length) return end();
      const q = qs[i];
      box.innerHTML = `<div class="qhead"><span>SITUATION ${n2(i + 1)} / ${n2(qs.length)}</span></div><h1 id="qt" tabindex="-1" style="font-size:clamp(1.5rem,4vw,2.2rem)">${esc(q.q)}</h1><div id="qd"></div><div class="btn-row" id="qn" hidden><button class="btn btn-primary" type="button" id="qnb">${i === qs.length - 1 ? "VOIR LE BILAN" : "SITUATION SUIVANTE"}</button></div>`;
      $("#qt", box).focus({ preventScroll: true });
      decisionUI($("#qd", box), q, (o, fb) => {
        res.push({ q, o });
        const tp = topicById(q.topic);
        if (tp) fb.insertAdjacentHTML("beforeend", `<p><a class="link" href="#/apprendre/${tp.id}">Revoir la fiche : ${esc(tp.title)}</a></p>`);
        $("#qn", box).hidden = false;
        $("#qnb", box).addEventListener("click", () => { i++; ask(); window.scrollTo(0, 0); }, { once: true });
      });
    }
    function end() {
      const good = res.filter(r => r.o.r === "ok").length;
      box.innerHTML = `<h1 id="qt" tabindex="-1">Vous avez terminé.</h1>
        <p class="lead">Connaître les bons réflexes est utile. Savoir les réaliser correctement nécessite une véritable formation pratique.</p>
        <p>Dans ${good} situation${good > 1 ? "s" : ""} sur ${qs.length}, votre choix rejoignait les recommandations. Ce n'est ni une note, ni une évaluation de compétence, ni une certification.</p>
        <h2>Votre parcours</h2>
        <ul class="recap">${res.map(r => `<li><span class="x" aria-hidden="true">${VERDICT[r.o.r][0]}</span><div><strong>${esc(r.q.q)}</strong><br>Votre choix : ${esc(r.o.t)} — ${VERDICT[r.o.r][1]}${r.o.r !== "ok" && topicById(r.q.topic) ? ` · <a class="link" href="#/apprendre/${r.q.topic}">à revoir</a>` : ""}</div></li>`).join("")}</ul>
        <div class="btn-row"><button class="btn btn-primary" type="button" id="train-btn" aria-expanded="false" aria-controls="train">TROUVER UNE FORMATION</button><button class="btn" type="button" id="again">REFAIRE LE QUIZ</button></div>
        <div id="train" class="why alt" hidden><h3>Comment trouver une formation</h3><ul><li>Renseignez-vous auprès de la Croix-Rouge ou du Croissant-Rouge de votre pays, de la protection civile ou des sapeurs-pompiers.</li><li>Vérifiez que l'organisme est reconnu et que la formation comprend une pratique sur mannequin, avec un formateur.</li><li>Vérifiez que le contenu suit des recommandations à jour.</li></ul><p class="note">Ce site ne propose pas de formation.</p></div>`;
      $("#qt", box).focus({ preventScroll: true }); window.scrollTo(0, 0);
      $("#train-btn", box).addEventListener("click", e => { const tr = $("#train", box); tr.hidden = !tr.hidden; e.currentTarget.setAttribute("aria-expanded", String(!tr.hidden)); });
      $("#again", box).addEventListener("click", () => { i = 0; res.length = 0; ask(); });
    }
    ask();
  }

  function mythPlay(root) {
    const box = $("#mz", root), ms = D.myths, res = []; let i = 0;
    function ask() {
      if (i >= ms.length) return end();
      const m = ms[i];
      box.innerHTML = `<div class="qhead"><span>AFFIRMATION ${n2(i + 1)} / ${n2(ms.length)}</span></div><h1 id="mt" tabindex="-1" style="font-size:clamp(1.5rem,4vw,2.2rem)">« ${esc(m.s)} »</h1>
        <div class="two"><button class="btn" type="button" data-a="myth">MYTHE</button><button class="btn" type="button" data-a="good">BON RÉFLEXE</button></div>
        <button class="btn btn-ghost" type="button" data-a="idk" style="width:100%">JE NE SAIS PAS</button><div id="mfb" aria-live="polite"></div>
        <div class="btn-row" id="mn" hidden><button class="btn btn-primary" type="button" id="mnb">${i === ms.length - 1 ? "VOIR LE BILAN" : "AFFIRMATION SUIVANTE"}</button></div>`;
      $("#mt", box).focus({ preventScroll: true });
      $$("[data-a]", box).forEach(b => b.addEventListener("click", () => {
        const a = b.dataset.a, right = a === m.a, tp = topicById(m.topic);
        $$("[data-a]", box).forEach(x => { x.disabled = true; });
        const tag = a === "idk" ? "? PAS SÛR" : right ? "✓ BIEN VU" : "~ À REVOIR";
        $("#mfb", box).innerHTML = `<div class="why"><p class="why-h">Regardons pourquoi.</p><p><span class="tag">${tag}</span></p><p><strong>C'est ${m.a === "myth" ? "un mythe" : "un bon réflexe"}.</strong> ${esc(m.w)}</p>${tp ? `<p><a class="link" href="#/apprendre/${tp.id}">Voir la fiche : ${esc(tp.title)}</a></p>` : ""}</div>`;
        sfx(right ? "ok" : "soft"); res.push(right);
        $("#mn", box).hidden = false;
        $("#mnb", box).addEventListener("click", () => { i++; ask(); window.scrollTo(0, 0); }, { once: true });
      }));
    }
    function end() {
      const good = res.filter(Boolean).length;
      box.innerHTML = `<h1 id="mt" tabindex="-1">Terminé.</h1><p class="lead">${good} affirmation${good > 1 ? "s" : ""} sur ${ms.length} bien identifiée${good > 1 ? "s" : ""}.</p><p>Ce n'est pas une évaluation de compétence. Les fiches expliquent chaque geste et ses limites.</p><div class="btn-row"><a class="btn btn-primary" href="#/apprendre">APPRENDRE</a><button class="btn" type="button" id="again">RECOMMENCER</button></div>`;
      $("#mt", box).focus({ preventScroll: true });
      $("#again", box).addEventListener("click", () => { i = 0; res.length = 0; ask(); });
    }
    ask();
  }

  V.secondes = () => page("Les premières secondes", `<p class="crumb"><a href="#/quiz">← QUIZ</a></p><h1>Les premières secondes</h1>
    <p class="lead">Un arrêt cardiaque, dans le temps.</p>
    <div class="clock" id="clk" aria-hidden="true">00:00</div>
    <ol class="tl" id="tl">${D.timeline.map((s, i) => `<li data-i="${i}"><b>${esc(s.t)}</b> — <strong>${esc(s.title)}</strong> <span class="tag">${s.kind === "reco" ? "RECOMMANDATION" : "REPÈRE"}</span><br>${esc(s.text)}</li>`).join("")}</ol>
    <div class="btn-row"><button class="btn btn-primary" type="button" id="tl-next">AVANCER</button><button class="btn btn-ghost" type="button" id="tl-reset">RECOMMENCER</button></div>
    <p class="note" style="margin-top:1.5rem">Les horaires illustrent l'enchaînement des gestes : ce ne sont pas des délais garantis. Seuls les éléments marqués RECOMMANDATION correspondent à des recommandations (par exemple 10 secondes maximum pour vérifier la respiration).</p>
    <p><a class="link" href="#/apprendre/arret-cardiaque">Voir la fiche Arrêt cardiaque</a></p>
    <div class="note" id="tl-live" aria-live="polite"></div>`, root => {
    let cur = -1, shown = 0, raf = 0;
    const clk = $("#clk", root), items = $$("#tl li", root);
    const toSec = t => { const m = /^(\d\d):(\d\d)$/.exec(t); return m ? +m[1] * 60 + +m[2] : null; };
    const fmt = s => n2(Math.floor(s / 60)) + ":" + n2(Math.floor(s % 60));
    const still = () => state.lite || matchMedia("(prefers-reduced-motion: reduce)").matches;
    function tween(to) {
      cancelAnimationFrame(raf);
      if (still()) { shown = to; clk.textContent = fmt(to); return; }
      const from = shown, t0 = performance.now();
      const step = now => { const p = Math.min(1, (now - t0) / 700); shown = from + (to - from) * p; clk.textContent = fmt(shown); if (p < 1) raf = requestAnimationFrame(step); };
      raf = requestAnimationFrame(step);
    }
    function upd() {
      items.forEach((li, i) => li.classList.toggle("on", i <= cur));
      if (cur >= 0) { const s = D.timeline[cur], sec = toSec(s.t); if (sec !== null) tween(sec); $("#tl-live", root).textContent = `${s.t} — ${s.title}. ${s.text}`; }
      else { tween(0); $("#tl-live", root).textContent = ""; }
      $("#tl-next", root).disabled = cur >= items.length - 1;
    }
    $("#tl-next", root).addEventListener("click", () => { cur++; sfx("tap"); upd(); });
    $("#tl-reset", root).addEventListener("click", () => { cur = -1; upd(); });
    cur = 0; upd();
  });

  V.trousse = () => page("Trousse", `<h1>La trousse</h1><p class="lead">Ouvrez-la. Chaque objet a une fonction… et des limites.</p>
    <div class="kit" id="kit"><svg viewBox="0 0 200 140" role="img" aria-label="Trousse de premiers secours fermée"><path class="kh" d="M75 40v-12a8 8 0 0 1 8-8h34a8 8 0 0 1 8 8v12"/><rect class="kbody" x="20" y="70" width="160" height="60" rx="12"/><g class="klid"><rect class="klid" x="20" y="40" width="160" height="30" rx="10"/><path class="kcross" d="M95 41h10v9h9v10h-9v9h-10v-9h-9V50h9z"/></g></svg></div>
    <div class="btn-row" style="justify-content:center"><button class="btn btn-primary" type="button" id="kit-open">OUVRIR</button></div>
    <div id="kit-items" hidden><h2 id="kit-h" tabindex="-1">Que contient-elle ?</h2><div class="kitgrid">${D.kit.map((k, i) => `<button class="kitem" type="button" aria-pressed="false" data-id="${k.id}" style="animation-delay:${(i * 0.05).toFixed(2)}s"><svg viewBox="0 0 24 24" aria-hidden="true">${k.icon}</svg>${esc(k.name)}</button>`).join("")}</div>
      <div id="kit-detail" class="info" aria-live="polite"><p>Touchez un objet pour voir sa fonction, ses limites et ses précautions.</p></div></div>
    <p class="note">La composition d'une trousse varie selon les pays et les recommandations locales : vérifiez-la auprès d'un organisme reconnu. Les médicaments ne figurent pas dans cette présentation générale : leur usage dépend de la personne et de l'avis d'un professionnel de santé. Un auto-injecteur d'adrénaline est personnel et prescrit.</p>`, root => {
    const kit = $("#kit", root), btn = $("#kit-open", root), items = $("#kit-items", root);
    btn.addEventListener("click", () => { kit.classList.add("open"); btn.parentElement.hidden = true; items.hidden = false; sfx("soft"); $("#kit-h", root).focus(); });
    items.addEventListener("click", e => {
      const b = e.target.closest(".kitem"); if (!b) return;
      $$(".kitem", items).forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      const k = D.kit.find(x => x.id === b.dataset.id); sfx("tap");
      $("#kit-detail", root).innerHTML = `<h3>${esc(k.name)}</h3><dl class="kdetail"><dt>Fonction</dt><dd>${esc(k.fn)}</dd><dt>Limites</dt><dd>${esc(k.limits)}</dd><dt>Précautions</dt><dd>${esc(k.cautions)}</dd></dl>`;
    });
  });

  V.sources = () => {
    const d = C.contentReview.date;
    return page("Sources médicales", `<h1>Sources médicales</h1>
      <p class="lead">Les contenus s'appuient sur des recommandations reconnues, jamais sur une opinion personnelle.</p>
      <p class="warnbox">${d ? "Dernière vérification du contenu : " + esc(d) : "Version de démonstration : le contenu doit être relu et validé par un formateur ou un professionnel de santé avant publication. Chapitres, éditions et liens exacts à confirmer lors de cette relecture."}</p>
      <ul class="srcs">${D.sources.map(s => { const ts = D.topics.filter(t => t.sources.includes(s.id)); return `<li><strong>${esc(s.org)}</strong><small>${esc(s.title)}</small><small>Site : ${esc(s.where)}</small>${ts.length ? `<small>Utilisée pour : ${ts.map(t => `<a class="link" href="#/apprendre/${t.id}">${esc(t.title)}</a>`).join(", ")}</small>` : ""}</li>`; }).join("")}</ul>
      <p class="note">Pour la réanimation et les premiers secours, ce site se réfère notamment aux recommandations ERC 2025 et à l'ILCOR. Les recommandations peuvent évoluer.</p>`);
  };

  V.infos = () => page("Informations & limites", `<div class="doc"><h1>Informations &amp; limites</h1>
    <p>Les informations présentes sur ce site sont destinées à la sensibilisation et à l'éducation générale.</p>
    <p>Elles ne constituent pas un diagnostic ou une consultation médicale.</p>
    <p>Elles ne remplacent pas les services d'urgence, un professionnel de santé ou une formation pratique.</p>
    <p>Les recommandations peuvent évoluer.</p>
    <p class="warnbox">${C.contentReview.date ? "Dernière vérification du contenu : " + esc(C.contentReview.date) : "Dernière vérification du contenu : non renseignée (version de démonstration, relecture requise)."}</p>
    <h2>Ce que ce site fait</h2><ul><li>Aide à reconnaître certaines situations d'urgence.</li><li>Présente les premières priorités et quand demander de l'aide.</li><li>Rappelle les erreurs à éviter et les limites d'une personne non formée.</li></ul>
    <h2>Ce que ce site ne fait pas</h2><ul><li>Il ne pose aucun diagnostic.</li><li>Il ne certifie aucune compétence : réussir un quiz ne rend pas apte à secourir.</li><li>Il ne remplace pas une formation pratique avec un formateur.</li></ul>
    <p><a class="btn btn-primary" href="#/sources">VOIR LES SOURCES</a></p></div>`);

  V.confidentialite = () => page("Politique de confidentialité", `<div class="doc"><h1>Politique de confidentialité</h1>
    <p class="lead">En bref : ce site ne collecte aucune donnée personnelle.</p>
    <h2>Ce qui n'est pas collecté</h2><p>Aucun compte, nom, e-mail, téléphone, formulaire, profil ou historique distant. Les résultats des quiz restent dans votre navigateur pendant la visite et ne sont pas enregistrés.</p>
    <h2>Ce qui reste sur votre appareil</h2><p>Trois préférences peuvent être enregistrées dans le stockage local de votre navigateur : le pays choisi pour afficher les numéros d'urgence, votre choix son / muet, le mode allégé. Elles ne sont jamais envoyées. Le fait d'avoir lu l'avertissement est mémorisé le temps de la session. Vous pouvez les effacer depuis les réglages de votre navigateur.</p>
    <h2>Cookies et services tiers</h2><p>Ce site ne dépose aucun cookie et n'utilise ni outil d'analyse, ni police ou script externe. Si un tel service est ajouté un jour, cette page devra être mise à jour.</p>
    <h2>Hébergeur</h2><p>L'hébergeur peut enregistrer des journaux techniques (par exemple adresse IP, date, page consultée) pour assurer la sécurité et le fonctionnement du service. Hébergeur : ${esc(C.host)}</p>
    <h2>Durée de conservation et droits</h2><p>Le site ne traite pas de données personnelles. Pour les journaux de l'hébergeur, vos droits dépendent de la juridiction applicable : ${esc(C.jurisdiction)}</p>
    <h2>Contact</h2><p>${esc(C.contact)}</p>
    <p class="note">Cette page décrit le fonctionnement réel de la version livrée. Le texte final doit être adapté à la juridiction d'exploitation et, si nécessaire, relu par un professionnel du droit. Elle ne constitue pas une exonération de responsabilité médicale.</p></div>`);

  V.introuvable = () => page("Introuvable", `<h1>Page introuvable</h1><p><a class="btn btn-primary" href="#/">RETOUR À L'ACCUEIL</a></p>`);

  /* ───────── Routeur ───────── */
  function route() {
    clearTimers();
    const parts = (location.hash || "#/").replace(/^#\/?/, "").split("/").filter(Boolean);
    const name = parts[0] || "accueil";
    const fn = V[name] || V.introuvable;
    const p = fn(...parts.slice(1));
    app.innerHTML = p.html;
    document.title = (p.title ? p.title + " — " : "") + "SECOURS";
    if (p.bind) p.bind(app);
    $$("#nav a").forEach(a => { if (a.dataset.r === name) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    $("#nav").classList.remove("open"); $("#menu").setAttribute("aria-expanded", "false");
    const h = $("h1", app) || $("h2", app);
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);

  /* ───────── Démarrage ───────── */
  updSound(); updLite();
  if (store.sget("secours.ack")) { const i = $("#intro"); if (i) i.remove(); }
  else { $("#intro-go").addEventListener("click", () => showWarning(true)); }
  route();
})();
