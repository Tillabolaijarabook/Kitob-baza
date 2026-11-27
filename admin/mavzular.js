/* VERSIYA: v31 · 🎨 RentBooks MAVZULARI — sayt (javon.html), Mini App va admin panel uchun BITTA fayl.
 * ⚠️ Bir xil nusxasi admin papkasida ham turadi (admin_sayt/mavzular.js) — o'zgartirsangiz ikkalasini ham yangilang.
 *
 * Mavzu = bir nechta asosiy rang. Qolgan hamma ranglar (kartalar, chiziqlar, ogohlantirishlar, yon panel…) shulardan
 * avtomatik hisoblanadi. Shuning uchun YANGI MAVZU qo'shish oson:
 *   1) shu fayldagi BUILTIN ro'yxatiga bitta qator, yoki
 *   2) admin panel → 🎨 Mavzu va fasl → «＋ Yangi mavzu» (superadmin; bazaga saqlanadi, hamma ko'radi, saytni yangilash shart emas).
 *
 * Kalitlar (tokens):
 *   dark   — tungi mavzumi (true/false)          bg, bg2, bg3 — fon (bg2/bg3 bo'lsa — rangli gradient fon)
 *   card   — karta rangi,  cardA — shaffofligi (1 = to'liq, 0.1 = deyarli shaffof «shisha»)
 *   ink    — matn,  muted — kulrang matn,  line — chiziq (bo'lmasa o'zi hisoblanadi)
 *   accent — urg'u (tugmalar),  accentInk — urg'u ustidagi matn (bo'lmasa o'zi tanlanadi)
 *   side   — admin yon paneli (bo'lmasa fondan),  blur — shisha xiraligi (px),  radius — burchak (px)
 *   style  — "flat" | "soft" (yumshoq soya) | "skeuo" (bo'rtma, haqiqiy tugmalardek)
 */
(function () {
  "use strict";
  var BUILTIN = [
    { id: "auto", name: "Avto", e: "🌗", desc: "Telefon (Telegram) kunduzgi/tungi rejimiga qarab — hozirgi ko'rinish" },
    { id: "kun", name: "Kunduzgi", e: "☀️", desc: "Klassik, doim yorug'", mode: "light" },
    { id: "tun", name: "Tungi", e: "🌙", desc: "Klassik, doim qorong'i", mode: "dark" },
    { id: "shisha", name: "Shisha", e: "🫧", desc: "Xira fon ustida shaffof kartalar",
      t: { dark: true, bg: "#14121d", bg2: "#3b2a63", bg3: "#0f4a52", card: "#ffffff", cardA: 0.08, ink: "#f3f1fa", muted: "#aaa5bd", line: "#ffffff", lineA: 0.13,
           accent: "#b9a2ff", accentInk: "#1a1230", side: "#ffffff", sideA: 0.06, blur: 18, radius: 18, style: "soft" } },
    { id: "okean", name: "Okean", e: "🌊", desc: "Ko'k-feruza shisha",
      t: { dark: false, bg: "#9fc3cf", bg2: "#2f6f8f", bg3: "#6fb7b0", card: "#ffffff", cardA: 0.55, ink: "#0f2a36", muted: "#43606c", line: "#ffffff", lineA: 0.5,
           accent: "#1f7fa8", accentInk: "#ffffff", side: "#0f3346", sideA: 0.55, blur: 16, radius: 18, style: "soft" } },
    { id: "apelsin", name: "Minimal apelsin", e: "🍊", desc: "Oq, toza, apelsin urg'u",
      t: { dark: false, bg: "#f4f4f2", card: "#ffffff", ink: "#1b1b1d", muted: "#76767c", line: "#ececea", accent: "#f2622e", accentInk: "#ffffff", side: "#ffffff", radius: 20, style: "soft" } },
    { id: "skevo", name: "Skevomorf", e: "🪵", desc: "Bej, bo'rtma tugmalar va yumshoq soyalar",
      t: { dark: false, bg: "#e9e2d6", card: "#f1ebe1", ink: "#3a3128", muted: "#857767", line: "#ddd3c4", accent: "#6b5440", accentInk: "#f7f1e8", side: "#3a3128", radius: 18, style: "skeuo" } },
    { id: "aurora", name: "Aurora", e: "🌌", desc: "To'q ko'k-binafsha, tungi osmon",
      t: { dark: true, bg: "#0b1022", bg2: "#1b2a5c", bg3: "#3a1f5c", card: "#ffffff", cardA: 0.06, ink: "#e8ecfb", muted: "#97a0c2", line: "#ffffff", lineA: 0.1,
           accent: "#f2c14e", accentInk: "#1b1606", side: "#0f1530", sideA: 0.7, blur: 14, radius: 16, style: "soft" } },
    { id: "yalpiz", name: "Yalpiz", e: "🌿", desc: "Och yashil, tinch",
      t: { dark: false, bg: "#eaf3ee", card: "#fbfdfb", ink: "#1d2a24", muted: "#5f7268", line: "#d6e6dc", accent: "#2f9e69", accentInk: "#ffffff", side: "#dcebe2", radius: 16, style: "soft" } },
    { id: "sakura", name: "Sakura", e: "🌸", desc: "Och pushti, nozik",
      t: { dark: false, bg: "#fbeff2", card: "#ffffff", ink: "#3a2128", muted: "#8c6b74", line: "#f1d9df", accent: "#d9577f", accentInk: "#ffffff", side: "#f6e1e7", radius: 18, style: "soft" } },
    { id: "qahva", name: "Qahva", e: "☕", desc: "Iliq jigarrang, tungi",
      t: { dark: true, bg: "#1c1612", card: "#2a211b", ink: "#f1e6da", muted: "#b09d8a", line: "#3a2f27", accent: "#d9a46a", accentInk: "#24180c", side: "#16110e", radius: 14, style: "flat" } },
    { id: "oled", name: "Qop-qora", e: "⚫", desc: "OLED ekran uchun, quvvat tejaydi",
      t: { dark: true, bg: "#000000", card: "#0e0e10", ink: "#f2f2f4", muted: "#8e8e96", line: "#1e1e22", accent: "#4f8cff", accentInk: "#ffffff", side: "#000000", radius: 14, style: "flat" } }
  ];
  var LS = "rb_mavzu", LSC = "rb_mavzu_custom";
  var custom = [];
  try { custom = JSON.parse(localStorage.getItem(LSC) || "[]") || []; } catch (e) { custom = []; }

  // ---------- ranglar ----------
  var HEX = /^#[0-9a-f]{6}$/i;
  function rgb(h) { h = HEX.test(h || "") ? h : "#808080"; return [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)]; }
  function hex(c) { return "#" + c.map(function (v) { v = Math.max(0, Math.min(255, Math.round(v))); return (v < 16 ? "0" : "") + v.toString(16); }).join(""); }
  function mix(a, b, t) { var x = rgb(a), y = rgb(b); return hex([x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t]); }
  function rgba(h, a) { var c = rgb(h); return a >= 1 ? hex(c) : "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + (+a).toFixed(3) + ")"; }
  function lum(h) { var c = rgb(h).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
  function contrast(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function num(v, d, lo, hi) { v = Number(v); return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : d; }

  // tokenlarni tozalash (bazadan kelganlari ham — ikki marta tekshiriladi)
  function clean(t) {
    t = t || {}; var o = {};
    ["bg", "bg2", "bg3", "card", "ink", "muted", "line", "accent", "accentInk", "side"].forEach(function (k) { if (HEX.test(t[k] || "")) o[k] = String(t[k]).toLowerCase(); });
    if (!o.bg || !o.card || !o.ink || !o.accent) return null;
    o.dark = t.dark === true || (t.dark !== false && lum(o.bg) < 0.2);
    o.cardA = num(t.cardA, 1, 0.05, 1); o.sideA = num(t.sideA, 1, 0.05, 1); o.lineA = num(t.lineA, 1, 0.05, 1);
    o.blur = num(t.blur, 0, 0, 30); o.radius = num(t.radius, -1, 0, 28);
    o.style = ["flat", "soft", "skeuo"].indexOf(t.style) >= 0 ? t.style : "flat";
    if (!o.muted) o.muted = mix(o.ink, o.bg, 0.45);
    if (!o.accentInk) o.accentInk = contrast(o.accent, "#ffffff") >= contrast(o.accent, "#111111") ? "#ffffff" : "#111111";
    return o;
  }
  function all() {
    var seen = {}, out = [];
    BUILTIN.concat(custom.map(function (c) { return { id: c.id, name: c.name, e: c.e || "🎨", desc: "Qo'shimcha mavzu", t: c.tokens, custom: true, active: c.active !== false }; }))
      .forEach(function (m) { if (!seen[m.id] && (!m.t || clean(m.t))) { seen[m.id] = 1; out.push(m); } });
    return out;
  }
  function get(id) { var l = all(); for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return null; }
  function currentId() { var id = ""; try { id = localStorage.getItem(LS) || ""; } catch (e) {} return get(id) ? id : "auto"; }

  // ---------- har sayt uchun o'zgaruvchilar ----------
  var HUES = ["#E0533A", "#2E8BC0", "#6DB257", "#F0B54A", "#8B7BE0"];
  function base(o) {
    var cardO = o.cardA < 1 ? mix(o.bg, o.card, Math.max(o.cardA, 0.12) * (o.dark ? 1.4 : 1)) : o.card;    // shaffof kartaning taxminiy «ko'rinadigan» rangi
    var line = o.line ? rgba(o.line, o.lineA) : mix(cardO, o.ink, o.dark ? 0.16 : 0.12);
    var lineO = o.line ? (o.lineA < 1 ? mix(cardO, o.line, o.lineA) : o.line) : line;
    return { cardO: cardO, line: line, lineO: lineO, card: rgba(o.card, o.cardA),
      red: o.dark ? "#F2A796" : "#B03A26", ok: o.dark ? "#8FD3A2" : "#2C7A45", warn: o.dark ? "#E3B672" : "#9A6E24", blue: o.dark ? "#8FA6EE" : "#3D5CB8",
      accentText: contrast(o.accent, cardO) >= 3.2 ? o.accent : mix(o.accent, o.dark ? "#ffffff" : "#000000", 0.42) };
  }
  function varsJavon(o) {
    var b = base(o), v = {
      "--bg": o.bg, "--card": b.card, "--card2": rgba(mix(b.cardO, o.accent, o.dark ? 0.16 : 0.12), Math.max(o.cardA, 0.5)), "--line": b.line, "--line2": mix(b.lineO, o.ink, 0.22),
      "--ink": o.ink, "--muted": o.muted, "--soft": mix(o.ink, o.muted, 0.45), "--accent": o.accent, "--accent-ink": o.accentInk, "--accent-text": b.accentText,
      "--red": b.red, "--red-line": rgba(b.red, 0.4), "--ok": b.ok, "--warm-line": rgba(o.accent, 0.45), "--warm-ink": mix(o.accent, o.dark ? "#ffffff" : "#000000", o.dark ? 0.5 : 0.55),
      "--cover-bg": mix(b.cardO, o.ink, 0.07), "--skel2": mix(b.cardO, o.ink, 0.05),
      "--hero-top": mix(o.bg, HUES[0], o.dark ? 0.16 : 0.1), "--hero-new": mix(o.bg, HUES[1], o.dark ? 0.16 : 0.1)
    };
    HUES.forEach(function (h, i) { var s = mix(b.cardO, h, o.dark ? 0.16 : 0.1); v["--s" + (i + 1)] = rgba(s, Math.max(o.cardA, 0.55)); v["--s" + (i + 1) + "b"] = mix(s, h, 0.35); });
    v["--s6"] = b.card; v["--s6b"] = b.lineO;
    return v;
  }
  function varsAdmin(o) {
    var b = base(o), side = o.side || mix(o.bg, o.ink, o.dark ? 0.03 : 0.04), sideDark = lum(side) < 0.25;
    var sInk = sideDark ? (o.dark ? o.ink : "#eef1f6") : (o.dark ? "#1d1f24" : o.ink), sMut = mix(sInk, side, 0.3);
    var hero = "linear-gradient(120deg, " + mix(o.bg, o.accent, o.dark ? 0.22 : 0.16) + " 0%, " + mix(o.bg, o.bg2 || HUES[1], o.dark ? 0.3 : 0.14) + " 100%)";
    return {
      "--side": rgba(side, o.sideA), "--side2": rgba(mix(side, sInk, 0.08), Math.max(o.sideA, 0.5)), "--side-ink": sInk, "--side-mut": sMut, "--side-line": rgba(mix(side, sInk, 0.14), Math.max(o.sideA, 0.6)),
      "--side-acc": contrast(o.accent, side) >= 3 ? o.accent : mix(o.accent, sideDark ? "#ffffff" : "#000000", 0.4), "--side-chip": rgba(sInk, 0.07),
      "--bg": o.bg, "--card": b.card, "--line": b.line, "--line2": b.line, "--hover": rgba(mix(b.cardO, o.ink, 0.05), Math.max(o.cardA, 0.6)),
      "--ink": o.ink, "--mut": o.muted, "--soft": mix(o.muted, b.cardO, 0.35), "--acc": o.accent, "--acc-ink": o.accentInk,
      "--blue": b.blue, "--blue-bg": rgba(b.blue, 0.14), "--ok": b.ok, "--ok-bg": rgba(b.ok, 0.14), "--warn": b.warn, "--warn-bg": rgba(b.warn, 0.14), "--red": b.red, "--red-bg": rgba(b.red, 0.13),
      "--shadow": o.dark ? "rgba(0,0,0,.4)" : "rgba(40,46,60,.10)", "--hc": b.accentText, "--hc2": mix(b.accentText, o.muted, 0.4),
      "--hero-l": hero, "--hero-dk": hero, "--hero": hero, "--hero-ink": o.ink, "--hero-btn": rgba(b.cardO, 0.6), "--hero-btn-b": rgba(o.ink, 0.12), "--hero-btn-h": rgba(b.cardO, 0.9)
    };
  }
  var KEYS = {};      // qo'yilgan o'zgaruvchilar (tozalash uchun)

  // ---------- umumiy CSS: gradient fon, shisha kartalar, soya uslubi, burchaklar ----------
  var CSS = "" +
    "html[data-mz-bg] body{background:var(--mz-bgimg) fixed!important;background-color:var(--bg)!important}" +
    "html[data-mz-glass] :is(.card,.list,.sheet,.nav,.tabs,.chip,.pill,.search,.iconbtn,.gchip,.readcard,.top,.modal,.umenu,.dpan,.paybtn,.tab,.hc,.sumbox,.side,.btn.ghost,.input,.field){" +
      "-webkit-backdrop-filter:blur(var(--mz-blur)) saturate(1.25);backdrop-filter:blur(var(--mz-blur)) saturate(1.25)}" +
    "html[data-mz-style=soft] :is(.card,.list,.modal,.hc,.sumbox,.readcard){box-shadow:0 8px 30px var(--mz-sh),0 1px 2px var(--mz-sh)}" +
    "html[data-mz-style=skeuo] :is(.card,.list,.modal,.hc,.sumbox,.readcard,.top,.umenu,.dpan){box-shadow:7px 7px 16px var(--mz-sh),-6px -6px 14px var(--mz-hl);border-color:transparent!important}" +
    "html[data-mz-style=skeuo] :is(.btn,.paybtn,.chip,.pill,.iconbtn,.gchip,.tab){box-shadow:3px 3px 8px var(--mz-sh),-3px -3px 7px var(--mz-hl)}" +
    "html[data-mz-style=skeuo] :is(.btn,.paybtn,.chip,.pill,.iconbtn,.tab):active,html[data-mz-style=skeuo] :is(.paybtn,.chip,.tab).on{box-shadow:inset 3px 3px 7px var(--mz-sh),inset -3px -3px 6px var(--mz-hl)}" +
    "html[data-mz-style=skeuo] :is(.field,.input,.search){box-shadow:inset 2px 2px 6px var(--mz-sh),inset -2px -2px 5px var(--mz-hl)}" +
    "html[data-mz-r] :is(.card,.list,.sheet,.modal,.hc,.sumbox,.readcard,.dpan,.umenu){border-radius:var(--mz-r)!important}" +
    "@media (prefers-reduced-transparency: reduce){html[data-mz-glass] *{-webkit-backdrop-filter:none!important;backdrop-filter:none!important}}" +
    "html.mz-lite *{-webkit-backdrop-filter:none!important;backdrop-filter:none!important}" +
    "html[data-mz-tok] :is(.brandcard,.k3d){background:var(--mz-hero)!important;box-shadow:0 14px 34px var(--mz-sh)!important;border-color:var(--mz-hero-line)!important}" +
    "html[data-mz-tok] .brandcard::after{border-color:var(--mz-hero-line)!important}" +
    "html[data-mz-tok][data-mz-glass] :is(.brandcard,.k3d){-webkit-backdrop-filter:blur(var(--mz-blur)) saturate(1.3);backdrop-filter:blur(var(--mz-blur)) saturate(1.3)}" +
    ".mz-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}" +
    ".mz-it{position:relative;display:flex;flex-direction:column;gap:6px;padding:8px;border-radius:16px;border:2px solid transparent;background:none;cursor:pointer;text-align:left;font:inherit;color:inherit}" +
    ".mz-it.on{border-color:var(--accent,var(--acc))}.mz-it b{font-size:13.5px}.mz-it small{font-size:11.5px;opacity:.7;line-height:1.3}" +
    ".mz-pv{height:78px;border-radius:12px;position:relative;overflow:hidden;border:1px solid rgba(127,127,127,.25)}" +
    ".mz-pv i{position:absolute;border-radius:7px}.mz-pv .c1{left:10px;top:10px;right:38%;height:22px}.mz-pv .c2{left:10px;top:38px;right:12px;bottom:10px}" +
    ".mz-pv .a{right:10px;top:12px;width:22%;height:16px;border-radius:9px}.mz-pv .t{left:18px;top:47px;width:46%;height:5px;border-radius:3px}.mz-pv .t2{left:18px;top:57px;width:30%;height:5px;border-radius:3px}";
  function ensureCss() {
    if (document.getElementById("mz-css")) return;
    var s = document.createElement("style"); s.id = "mz-css"; s.textContent = CSS; (document.head || document.documentElement).appendChild(s);
  }

  // mavzuni qo'llash. site: "javon" | "admin". el: o'zgaruvchilar qo'yiladigan element (javon — html, admin — body).
  // id — mavzu nomi yoki { id, t: {…} } obyekti (admin muharriridagi jonli ko'rinish uchun)
  // qaytaradi: { dark: true/false/null } — null bo'lsa sayt o'zi hal qiladi (Avto)
  function apply(site, el, id) {
    ensureCss();
    var h = document.documentElement, m = (id && typeof id === "object") ? id : (get(id || currentId()) || get("auto")), o = m.t ? clean(m.t) : null;
    el = el || h;
    (KEYS[site] || []).forEach(function (k) { el.style.removeProperty(k); });
    ["data-mz-bg", "data-mz-glass", "data-mz-style", "data-mz-r", "data-mz-tok"].forEach(function (a) { h.removeAttribute(a); });
    h.style.removeProperty("--mz-bgimg"); h.setAttribute("data-mavzu", m.id);
    if (!o) { KEYS[site] = []; return { dark: m.mode === "dark" ? true : m.mode === "light" ? false : null, id: m.id }; }
    var v = site === "admin" ? varsAdmin(o) : varsJavon(o);
    KEYS[site] = Object.keys(v);
    KEYS[site].forEach(function (k) { el.style.setProperty(k, v[k]); });
    el.style.setProperty("color-scheme", o.dark ? "dark" : "light"); KEYS[site].push("color-scheme");
    if (o.bg2) {
      h.setAttribute("data-mz-bg", "");
      h.style.setProperty("--mz-bgimg", "radial-gradient(ellipse 70% 60% at 15% 10%, " + rgba(o.bg2, 0.95) + ", transparent 70%), radial-gradient(ellipse 60% 55% at 90% 85%, " +
        rgba(o.bg3 || o.bg2, 0.9) + ", transparent 70%), linear-gradient(160deg, " + o.bg + ", " + mix(o.bg, o.bg2, 0.35) + ")");
    }
    if (o.blur > 0 && o.cardA < 1) { h.setAttribute("data-mz-glass", ""); h.style.setProperty("--mz-blur", o.blur + "px"); }
    // bosh karta (balans) va bannerlar — mavzu urg'u rangidan (matni doim och: fon to'q bo'ladi)
    h.setAttribute("data-mz-tok", "");
    var glow = "radial-gradient(120% 90% at 100% 0%, " + rgba(mix(o.accent, "#ffffff", 0.25), 0.42) + ", transparent 60%), radial-gradient(90% 80% at 0% 100%, " + rgba(o.bg3 || o.bg2 || o.accent, 0.3) + ", transparent 60%), ";
    h.style.setProperty("--mz-hero", o.cardA < 1 ? glow + rgba(mix(o.bg, "#000000", 0.35), 0.55)
      : glow + "linear-gradient(160deg, " + mix(o.accent, "#0b0b10", 0.66) + " 0%, " + mix(o.accent, "#0b0b10", 0.42) + " 100%)");
    h.style.setProperty("--mz-hero-line", rgba(mix(o.accent, "#ffffff", 0.4), 0.35));
    if (o.style !== "flat") h.setAttribute("data-mz-style", o.style);
    h.style.setProperty("--mz-sh", o.dark ? "rgba(0,0,0,.45)" : rgba(mix(o.bg, "#000000", 0.55), o.style === "skeuo" ? 0.35 : 0.1));
    h.style.setProperty("--mz-hl", o.dark ? "rgba(255,255,255,.05)" : "rgba(255,255,255,.85)");
    if (o.radius >= 0) { h.setAttribute("data-mz-r", ""); h.style.setProperty("--mz-r", o.radius + "px"); }
    var meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.setAttribute("content", o.bg);
    return { dark: o.dark, id: m.id, bg: o.bg };
  }

  // mavzu namunasi (tanlash oynasi uchun kichik rasm)
  function preview(m) {
    var o = m.t ? clean(m.t) : null;
    if (!o) {   // klassik: yarim yorug' / yarim qorong'i
      var L = { bg: "#F7F3EC", card: "#FFFFFF", ink: "#1F1A14", accent: "#F0B54A" }, D = { bg: "#13110F", card: "#1E1B18", ink: "#F4EFE6", accent: "#F0B54A" };
      var A = m.mode === "dark" ? D : L, B = m.mode === "light" ? L : D;
      return '<div class="mz-pv" style="background:linear-gradient(110deg,' + A.bg + ' 50%,' + B.bg + ' 50%)"><i class="c1" style="background:' + A.card + '"></i>' +
        '<i class="c2" style="background:linear-gradient(110deg,' + A.card + ' 50%,' + B.card + ' 50%)"></i><i class="a" style="background:' + A.accent + '"></i>' +
        '<i class="t" style="background:' + A.ink + ';opacity:.6"></i><i class="t2" style="background:' + B.ink + ';opacity:.4"></i></div>';
    }
    var b = base(o), bg = o.bg2 ? "radial-gradient(circle at 15% 10%," + o.bg2 + ",transparent 65%),radial-gradient(circle at 90% 90%," + (o.bg3 || o.bg2) + ",transparent 65%)," + o.bg : o.bg;
    var sh = o.style === "skeuo" ? "box-shadow:3px 3px 6px " + rgba(mix(o.bg, "#000000", 0.5), 0.35) + ",-2px -2px 5px rgba(255,255,255,.8);" : o.style === "soft" ? "box-shadow:0 3px 10px rgba(0,0,0,.12);" : "";
    return '<div class="mz-pv" style="background:' + bg + '"><i class="c1" style="background:' + b.card + ";" + sh + '"></i><i class="c2" style="background:' + b.card + ";" + sh +
      (o.cardA < 1 ? "border:1px solid " + b.line + ";" : "") + '"></i><i class="a" style="background:' + o.accent + '"></i><i class="t" style="background:' + o.ink + ';opacity:.75"></i>' +
      '<i class="t2" style="background:' + o.muted + '"></i></div>';
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  // tanlash panjarasi (HTML) — data-mz="id" tugmalari
  function gridHtml(cur, opts) {
    opts = opts || {};
    return '<div class="mz-grid">' + all().filter(function (m) { return opts.inactive || m.active !== false; }).map(function (m) {
      return '<button type="button" class="mz-it' + (m.id === cur ? " on" : "") + '" data-mz="' + esc(m.id) + '">' + preview(m) +
        "<b>" + esc(m.e) + " " + esc(m.name) + (m.active === false ? " (o'chiq)" : "") + "</b><small>" + esc(m.desc || "") + "</small></button>";
    }).join("") + "</div>";
  }

  window.RB_MAVZU = {
    list: all, get: get, current: currentId, clean: clean, preview: preview, gridHtml: gridHtml, apply: apply, mix: mix, contrast: contrast,
    set: function (id) { if (!get(id)) id = "auto"; try { localStorage.setItem(LS, id); } catch (e) {} return id; },
    // qo'shimcha mavzular (bazadan) — keyingi ochilishda ham darhol chiqishi uchun saqlanadi
    setCustom: function (list) {
      custom = (Array.isArray(list) ? list : []).filter(function (c) { return c && /^c_[a-z0-9_]{2,30}$/.test(c.id || "") && clean(c.tokens); })
        .map(function (c) { return { id: c.id, name: String(c.name || "Mavzu").slice(0, 40), e: String(c.e || "🎨").slice(0, 8), tokens: c.tokens, active: c.active !== false }; });
      try { localStorage.setItem(LSC, JSON.stringify(custom)); } catch (e) {}
    }
  };

  // =====================================================================================================
  // 🔐 UMUMIY UI: katakli tasdiqlash kodi (OTP) va «✓ Tasdiqlandi» oynasi — sayt va admin panel birga ishlatadi
  //   RB_UI.otp(host, { n: 6, name: "cd", onDone(code), onEnter() }) → { value, focus, clear, bad, ok, busy }
  //     • raqam yozilsa keyingi katakka o'tadi, Backspace — orqaga, joylashtirish (paste) va telefonning
  //       «SMS'dagi kod» taklifi butun kodni kataklarga taqsimlaydi; to'lishi bilan onDone chaqiriladi
  //     • name — yashirin <input id="name"> (eski kod o'sha maydondan o'qiydi)
  //   RB_UI.done(host, sarlavha, izoh) — yashil ✓ va konfetti
  // =====================================================================================================
  var UI_CSS = ".rb-otp{display:flex;gap:8px;justify-content:center;position:relative;margin:2px 0}" +
    ".rb-otp input{flex:1 1 0;min-width:0;max-width:52px;height:58px;padding:0;text-align:center;font-family:inherit;font-size:24px;font-weight:700;border-radius:14px;" +
      "border:1.5px solid var(--line);background:var(--card);color:var(--ink);caret-color:var(--accent,var(--acc));transition:border-color .15s,box-shadow .15s,transform .12s,background .2s;-webkit-appearance:none;appearance:none}" +
    ".rb-otp input:focus{outline:none;border-color:var(--accent,var(--acc));box-shadow:0 0 0 4px color-mix(in srgb,var(--accent,var(--acc)) 22%,transparent)}" +
    ".rb-otp input.f{border-color:color-mix(in srgb,var(--accent,var(--acc)) 55%,var(--line));transform:translateY(-1px)}" +
    ".rb-otp.busy input{opacity:.55}" +
    ".rb-otp.bad input{border-color:var(--red);color:var(--red);animation:rbShake .42s}" +
    ".rb-otp.ok input{border-color:var(--ok);color:var(--ok);background:color-mix(in srgb,var(--ok) 10%,var(--card))}" +
    "@keyframes rbShake{0%,100%{transform:none}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(3px)}}" +
    ".rb-done{display:flex;flex-direction:column;align-items:center;gap:8px;padding:26px 8px 18px;text-align:center;position:relative;overflow:hidden}" +
    ".rb-done .ck{width:78px;height:78px;border-radius:24px;display:grid;place-items:center;background:color-mix(in srgb,var(--ok) 15%,transparent);border:2px solid var(--ok);animation:rbPop .5s cubic-bezier(.2,1.6,.4,1)}" +
    ".rb-done .ck svg{width:40px;height:40px;stroke:var(--ok);stroke-width:3;fill:none;stroke-dasharray:30;stroke-dashoffset:30;animation:rbDraw .45s .2s forwards}" +
    ".rb-done b{font-size:20px;color:var(--ok)}.rb-done span{font-size:13.5px;opacity:.75}" +
    ".rb-done i{position:absolute;width:7px;height:7px;border-radius:2px;left:50%;top:64px;opacity:0;animation:rbConf 1.1s ease-out forwards}" +
    "@keyframes rbPop{from{transform:scale(.4);opacity:0}to{transform:none;opacity:1}}@keyframes rbDraw{to{stroke-dashoffset:0}}" +
    "@keyframes rbConf{0%{opacity:1;transform:translate(0,0) rotate(0)}100%{opacity:0;transform:translate(var(--x),var(--y)) rotate(260deg)}}" +
    ".rb-wait{display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--ok);margin-right:6px;vertical-align:1px;animation:rbPulse 1.2s ease-in-out infinite}" +
    "@keyframes rbPulse{0%,100%{box-shadow:0 0 0 0 color-mix(in srgb,var(--ok) 55%,transparent)}50%{box-shadow:0 0 0 7px transparent}}" +
    "@media (prefers-reduced-motion: reduce){.rb-otp.bad input,.rb-done .ck,.rb-done i,.rb-wait{animation:none}.rb-done .ck svg{stroke-dashoffset:0;animation:none}}";
  function uiCss() { if (document.getElementById("rb-ui-css")) return; var s = document.createElement("style"); s.id = "rb-ui-css"; s.textContent = UI_CSS; (document.head || document.documentElement).appendChild(s); }
  function otp(host, o) {
    uiCss(); o = o || {};
    var n = o.n || 6, h = "", fired = "";
    host.classList.add("rb-otp"); host.setAttribute("role", "group"); host.setAttribute("aria-label", o.label || "Tasdiqlash kodi");
    for (var i = 0; i < n; i++) h += '<input inputmode="numeric" pattern="[0-9]*" maxlength="' + (i ? 1 : n) + '" aria-label="' + (i + 1) + '-raqam" autocomplete="' + (i ? "off" : "one-time-code") + '">';
    host.innerHTML = h + (o.name ? '<input type="hidden" id="' + esc(o.name) + '">' : "");
    var ins = [].slice.call(host.querySelectorAll("input:not([type=hidden])")), hid = o.name ? host.querySelector('input[type="hidden"]') : null;
    function val() { return ins.map(function (x) { return x.value; }).join(""); }
    function sync() {
      var v = val(); ins.forEach(function (x) { x.classList.toggle("f", !!x.value); }); if (hid) hid.value = v;
      if (v.length === n && /^\d+$/.test(v)) { if (v !== fired) { fired = v; if (o.onDone) o.onDone(v); } } else fired = "";
    }
    function fill(from, d) { for (var k = 0; k < d.length && from + k < n; k++) ins[from + k].value = d.charAt(k); ins[Math.min(from + d.length, n - 1)].focus(); sync(); }
    ins.forEach(function (inp, i) {
      inp.addEventListener("input", function () { host.classList.remove("bad"); var d = inp.value.replace(/\D/g, ""); inp.value = ""; if (d.length) fill(i, d); else sync(); });
      inp.addEventListener("keydown", function (e) {
        if (e.key === "Backspace" && !inp.value && i > 0) { ins[i - 1].value = ""; ins[i - 1].focus(); sync(); e.preventDefault(); }
        else if (e.key === "ArrowLeft" && i > 0) ins[i - 1].focus(); else if (e.key === "ArrowRight" && i < n - 1) ins[i + 1].focus();
        else if (e.key === "Enter" && o.onEnter) o.onEnter();
      });
      inp.addEventListener("paste", function (e) { var t = ((e.clipboardData || window.clipboardData).getData("text") || "").replace(/\D/g, ""); if (t) { e.preventDefault(); fill(i, t); } });
      inp.addEventListener("focus", function () { try { inp.select(); } catch (e) {} });
    });
    return {
      value: val,
      focus: function () { var e = ins.filter(function (x) { return !x.value; })[0] || ins[n - 1]; e.focus(); },
      clear: function () { ins.forEach(function (x) { x.value = ""; }); host.classList.remove("ok", "bad"); fired = ""; sync(); ins[0].focus(); },
      bad: function () {
        host.classList.remove("ok", "bad"); void host.offsetWidth; host.classList.add("bad");
        try { if (navigator.vibrate) navigator.vibrate([30, 40, 30]); } catch (e) {}
        setTimeout(function () { ins.forEach(function (x) { x.value = ""; }); fired = ""; sync(); ins[0].focus(); }, 450);
      },
      ok: function () { host.classList.remove("bad"); host.classList.add("ok"); ins.forEach(function (x) { x.blur(); }); },
      busy: function (b) { host.classList.toggle("busy", !!b); ins.forEach(function (x) { x.disabled = !!b; }); }
    };
  }
  function done(host, title, sub) {
    uiCss();
    var cf = "", cols = ["var(--ok)", "var(--accent,var(--acc))", "#4F8CFF", "#F2C14E", "#E0533A"];
    for (var i = 0; i < 22; i++) { var a = (i / 22) * Math.PI * 2, r = 70 + (i % 4) * 26;
      cf += '<i style="--x:' + Math.round(Math.cos(a) * r) + "px;--y:" + Math.round(Math.sin(a) * r * 0.8 + 30) + "px;background:" + cols[i % cols.length] + ";animation-delay:" + (0.15 + (i % 5) * 0.03) + 's"></i>'; }
    host.innerHTML = '<div class="rb-done" role="status"><div class="ck"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
      "<b>" + esc(title || "Tasdiqlandi") + "</b>" + (sub ? "<span>" + esc(sub) + "</span>" : "") + cf + "</div>";
    try { if (navigator.vibrate) navigator.vibrate(40); } catch (e) {}
  }
  window.RB_UI = { otp: otp, done: done };
})();
