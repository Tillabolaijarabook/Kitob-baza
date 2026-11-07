/* VERSIYA: v24
 * til.js — 🌐 RentBooks interfeys tili: lotin (asl) · yangi lotin · kirill · rus tili.
 * Sahifa kodiga tegmaydi: ekranga chiqqan matnni (DOM) o'zi o'giradi. Kitob nomi, muallif, ismlar, kodlar,
 * raqamlar va havolalar O'GIRILMAYDI. Qidiruv uchun TIL.key() — «Ўткан» = «O'tkan» = «Ötkan» = «Откан».
 * Bu fayl javon.html, kuryer.html, zona.html (Mini App) va admin/index.html (sayt) yonida turishi kerak.
 */
(function () {
  "use strict";
  var CODES = ["lat", "yl", "cyr", "ru"];
  var NAMES = { lat: "O'zbekcha (lotin)", yl: "Özbekçe (yangi lotin)", cyr: "Ўзбекча (кирилл)", ru: "Русский" };
  var APO = "'ʻʼ‘’`´";
  var APO_RE = "['ʻʼ‘’`´]";

  // ------------------------------------------------------------ yozuvlar
  var L2C = { a: "а", b: "б", d: "д", e: "е", f: "ф", g: "г", h: "ҳ", i: "и", j: "ж", k: "к", l: "л", m: "м", n: "н", o: "о",
    p: "п", q: "қ", r: "р", s: "с", t: "т", u: "у", v: "в", x: "х", y: "й", z: "з", c: "с", w: "в" };
  var STEMS = [["aksiya", "акция"], ["funksiya", "функция"], ["kolleksiya", "коллекция"], ["seksiya", "секция"], ["reaksiya", "реакция"],
    ["inspeksiya", "инспекция"], ["korreksiya", "коррекция"], ["sanksiya", "санкция"], ["instruksiya", "инструкция"],
    ["kuryer", "курьер"], ["yanvar", "январь"], ["fevral", "февраль"], ["aprel", "апрель"], ["iyun", "июнь"], ["iyul", "июль"],
    ["sentyabr", "сентябрь"], ["oktyabr", "октябрь"], ["noyabr", "ноябрь"], ["dekabr", "декабрь"], ["kompyuter", "компьютер"]];
  var KEEP = { rentbooks: 1, telegram: 1, instagram: 1, mini: 1, app: 1, sos: 1, qr: 1, pin: 1, pdf: 1, excel: 1, xlsx: 1, click: 1,
    payme: 1, uzcard: 1, humo: 1, visa: 1, mastercard: 1, supabase: 1, ai: 1, id: 1, api: 1, sms: 1, apk: 1, cvv: 1, ok: 1, test: 1,
    vip: 1, gps: 1, url: 1, bot: 1, google: 1, youtube: 1, android: 1, iphone: 1, ios: 1, windows: 1, f2: 1, f3: 1, premium: 1, open: 1, meteo: 1,
    rent: 1, read: 1, "return": 1, stories: 1, story: 1, tiktok: 1, facebook: 1, whatsapp: 1, openstreetmap: 1 };
  var isApo = function (ch) { return !!ch && APO.indexOf(ch) >= 0; };
  var isUp = function (ch) { return ch !== ch.toLowerCase(); };

  function caseLike(src, out) {
    if (src.length > 1 && src === src.toUpperCase() && src !== src.toLowerCase()) return out.toUpperCase();
    if (isUp(src.charAt(0))) return out.charAt(0).toUpperCase() + out.slice(1);
    return out;
  }
  function cyrCore(w, after) {
    var out = "", i = 0, n = w.length, prev = after || "";
    var letters = w.replace(/[^A-Za-zÖöĞğŞşÇç]/g, "");
    var allcaps = letters.length > 1 && letters === letters.toUpperCase();
    while (i < n) {
      var ch = w.charAt(i), lo = ch.toLowerCase(), nx = (w.charAt(i + 1) || "").toLowerCase(), nx2 = w.charAt(i + 2) || "";
      var r = null, step = 1;
      if ((lo === "o" || lo === "g") && isApo(w.charAt(i + 1))) { r = lo === "o" ? "ў" : "ғ"; step = 2; }
      else if (lo === "s" && nx === "h") { r = "ш"; step = 2; }
      else if (lo === "c" && nx === "h") { r = "ч"; step = 2; }
      else if (lo === "y" && nx && "oaue".indexOf(nx) >= 0 && !(nx === "o" && isApo(nx2))) { r = { o: "ё", a: "я", u: "ю", e: "е" }[nx]; step = 2; }
      else if (lo === "t" && nx === "s" && w.substr(i + 2, 3).toLowerCase() === "iya") { r = "ц"; step = 2; }
      else if (lo === "e") r = (!prev || "aeiouö".indexOf(prev.toLowerCase()) >= 0 || isApo(prev)) ? "э" : "е";
      else if (isApo(ch)) r = (prev && /[A-Za-zÖöĞğŞşÇç]/.test(prev) && /[A-Za-zÖöĞğŞşÇç]/.test(w.charAt(i + 1))) ? "ъ" : ch;
      else if (lo === "ö") r = "ў"; else if (lo === "ğ") r = "ғ"; else if (lo === "ş") r = "ш"; else if (lo === "ç") r = "ч";
      else r = L2C[lo] || null;
      if (r === null) out += ch;
      else out += allcaps ? r.toUpperCase() : (isUp(ch) ? r.charAt(0).toUpperCase() + r.slice(1) : r);
      prev = step === 1 ? ch : w.charAt(i);
      i += step;
    }
    return out;
  }
  function cyrWord(w) {
    var low = w.toLowerCase();
    if (KEEP[low]) return w;
    var m = w.match(new RegExp("^([A-Za-z]+)(" + APO_RE + ")(\\w+)$"));
    if (m && KEEP[m[1].toLowerCase()]) return m[1] + m[2] + cyrCore(m[3], "a");
    for (var k = 0; k < STEMS.length; k++) {
      var st = STEMS[k][0];
      if (low.indexOf(st) === 0) { var rest = w.slice(st.length), cy = STEMS[k][1]; if (rest && /ь$/.test(cy)) cy = cy.slice(0, -1);
        return caseLike(w.slice(0, st.length), cy) + (rest ? cyrCore(rest, st.slice(-1)) : ""); }
    }
    return cyrCore(w);
  }
  var WORD_RE = new RegExp("[A-Za-zÖöĞğŞşÇç]+(?:" + APO_RE + "[A-Za-zÖöĞğŞşÇç]+)*" + APO_RE + "?", "g");
  function lat2cyr(t) { return t.replace(WORD_RE, cyrWord); }
  function ylWord(w) {
    if (KEEP[w.split(new RegExp(APO_RE))[0].toLowerCase()]) return w;
    var letters = w.replace(/[^A-Za-z]/g, ""), allcaps = letters.length > 1 && letters === letters.toUpperCase();
    return w.replace(new RegExp("[OoGg]" + APO_RE + "|[Ss][Hh]|[Cc][Hh]", "g"), function (s) {
      var base = { o: "ö", g: "ğ", s: "ş", c: "ç" }[s.charAt(0).toLowerCase()];
      return (allcaps || isUp(s.charAt(0))) ? base.toUpperCase() : base;
    });
  }
  function lat2yl(t) { return t.replace(WORD_RE, ylWord); }

  // ------------------------------------------------------------ 🔍 qidiruv kaliti (bot va bazadagi bilan bir xil qoida)
  var C2L = { "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "yo", "ж": "j", "з": "z", "и": "i", "й": "y", "к": "k",
    "л": "l", "м": "m", "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u", "ф": "f", "х": "x", "ц": "ts", "ч": "ch",
    "ш": "sh", "щ": "sh", "ъ": "", "ы": "i", "ь": "", "э": "e", "ю": "yu", "я": "ya", "ў": "o", "қ": "k", "ғ": "g", "ҳ": "x", "і": "i" };
  function key(s) {
    s = String(s == null ? "" : s).toLowerCase();
    var o = "";
    for (var i = 0; i < s.length; i++) { var c = s.charAt(i); o += (C2L[c] != null ? C2L[c] : c); }
    o = o.replace(/ö/g, "o").replace(/ğ/g, "g").replace(/ş/g, "sh").replace(/ç/g, "ch").replace(new RegExp(APO_RE, "g"), "");
    o = o.replace(/q/g, "k").replace(/h/g, "x").replace(/w/g, "v").replace(/sx/g, "sh").replace(/cx/g, "ch");
    o = o.replace(/(^|[^a-z])ye/g, "$1e").replace(/yo/g, "o").replace(/iy/g, "i");
    o = o.replace(/[^0-9a-z]+/g, " ").replace(/(.)\1+/g, "$1");
    return o.trim().replace(/\s+/g, " ");
  }
  // kirill yoki yangi lotinda yozilgan so'zni asl lotinga (saytdagi qidiruv bazaga shu ko'rinishda boradi)
  var C2U = { "ш": "sh", "ч": "ch", "ғ": "g'", "ў": "o'", "ё": "yo", "ю": "yu", "я": "ya", "ц": "ts", "щ": "sh", "ъ": "'", "ь": "",
    "ы": "i", "э": "e", "ҳ": "h", "қ": "q", "х": "x", "й": "y", "е": "e" };
  function toLat(s) {
    s = String(s == null ? "" : s);
    if (!/[\u0400-\u04FFÖöĞğŞşÇç]/.test(s)) return s;
    var o = "";
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i), lo = c.toLowerCase(), up = c !== lo, r;
      if (lo === "е" && (i === 0 || /[\s\-«"(]/.test(s.charAt(i - 1)))) r = "ye";
      else r = C2U[lo] != null ? C2U[lo] : (C2L[lo] != null ? C2L[lo] : null);
      if (r === null) { r = { "ö": "o'", "ğ": "g'", "ş": "sh", "ç": "ch" }[lo]; }
      if (r == null) { o += c; continue; }
      o += up ? r.charAt(0).toUpperCase() + r.slice(1) : r;
    }
    return o;
  }
  function match(q) {
    var k = key(q); if (!k) return true;
    var hay = []; for (var i = 1; i < arguments.length; i++) if (arguments[i]) hay.push(key(arguments[i]));
    hay = hay.join(" ");
    return k.split(" ").every(function (w) { return hay.indexOf(w) >= 0; });
  }

  // ------------------------------------------------------------ himoyalangan bo'laklar
  var PROT_SRC = "https?:\\/\\/\\S+|t\\.me\\/\\S+|www\\.\\S+|[\\w.+-]+@[\\w-]+\\.[\\w.]+|@\\w+|U-[A-Z0-9]{3,12}|[A-Z]{2,}-\\d+" +
    "|[^\\s<>&()«»\"'.,:;!?]*\\d(?:[^\\s<>&()«»\"]*[^\\s<>&()«»\"'.,:;!?…])?";
  var protNames = Object.create(null), protCount = 0, namesRe = null, namesDirty = false;
  var PROT_KEYS = { title: 1, author: 1, book: 1, book_title: 1, full_name: 1, name: 1, user_name: 1, courier: 1, courier_name: 1,
    customer: 1, ism: 1, nomi: 1, store: 1, address: 1, org: 1, kod: 1, code: 1, user_code: 1, description: 1, themes: 1,
    note: 1, text: 1, comment: 1, review: 1 };
  function protect(v) {
    if (typeof v !== "string") return;
    v = v.trim();
    if (v.length < 3 || v.length > 3000 || protNames[v]) return;
    protNames[v] = 1; protCount++; namesDirty = true;
  }
  function collect(d, depth) {
    if (!d || depth > 6) return;
    if (Array.isArray(d)) { for (var i = 0; i < d.length && i < 5000; i++) collect(d[i], depth + 1); return; }
    if (typeof d === "object") for (var k in d) {
      var v = d[k];
      if (typeof v === "string") { if (PROT_KEYS[k]) protect(v); }
      else if (v && typeof v === "object") collect(v, depth + 1);
    }
  }
  function namesRegex() {
    if (namesDirty) {
      namesDirty = false;
      var arr = Object.keys(protNames).sort(function (a, b) { return b.length - a.length; });
      namesRe = arr.length ? new RegExp(arr.map(function (x) { return x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("|"), "g") : null;
    }
    return namesRe;
  }
  function split(text) {          // [[o'giriladimi, bo'lak], ...]
    var spans = [], m, re;
    var nr = namesRegex();
    if (nr) { nr.lastIndex = 0; while ((m = nr.exec(text))) { spans.push([m.index, m.index + m[0].length]); if (!m[0].length) nr.lastIndex++; } }
    re = new RegExp(PROT_SRC, "g");
    while ((m = re.exec(text))) { if (m[0].length) spans.push([m.index, m.index + m[0].length]); else re.lastIndex++; }
    if (!spans.length) return [[true, text]];
    spans.sort(function (a, b) { return a[0] - b[0]; });
    var merged = [];
    spans.forEach(function (s) { var last = merged[merged.length - 1]; if (last && s[0] < last[1]) last[1] = Math.max(last[1], s[1]); else merged.push([s[0], s[1]]); });
    var out = [], pos = 0;
    merged.forEach(function (s) { if (s[0] > pos) out.push([true, text.slice(pos, s[0])]); out.push([false, text.slice(s[0], s[1])]); pos = s[1]; });
    if (pos < text.length) out.push([true, text.slice(pos)]);
    return out;
  }

  // ------------------------------------------------------------ rus tili lug'ati
  var RU = window.TIL_RU || {}, RU_MAP = null, RU_FIRST = null;
  function norm(s) { return String(s).replace(new RegExp(APO_RE, "g"), "'").replace(/\s+/g, " ").trim(); }
  function ruLoad() {
    if (RU_MAP) return;
    RU_MAP = Object.create(null); RU_FIRST = Object.create(null);
    var src = window.TIL_RU || RU;
    for (var k in src) {
      var kk = norm(k); if (!kk || !src[k]) continue;
      RU_MAP[kk] = src[k];
      var w = kk.split(" ");
      (RU_FIRST[w[0]] = RU_FIRST[w[0]] || []).push([w.length, kk]);
    }
    for (var f in RU_FIRST) RU_FIRST[f].sort(function (a, b) { return b[0] - a[0]; });
  }
  function ruPiece(seg) {
    ruLoad();
    var lead = seg.match(/^\s*/)[0], tail = seg.match(/\s*$/)[0], core = norm(seg);
    if (!core) return seg;
    if (RU_MAP[core]) return lead + RU_MAP[core] + tail;
    var m0 = core.match(/^([,.;:—–\-+·)\s]+)(.+)$/);
    if (m0 && RU_MAP[m0[2]]) return lead + m0[1] + RU_MAP[m0[2]] + tail;
    var words = core.split(" "), out = [], i = 0, done = 0, miss = 0;
    while (i < words.length) {
      var hit = null, cand = RU_FIRST[words[i]] || [];
      for (var c = 0; c < cand.length; c++) {
        var ln = cand[c][0];
        if (ln <= words.length - i && words.slice(i, i + ln).join(" ") === cand[c][1]) { hit = [ln, RU_MAP[cand[c][1]]]; break; }
      }
      if (!hit) { var mm = words[i].match(/^(.*?)([.,:;!?)…»]+)$/); if (mm && RU_MAP[mm[1]]) hit = [1, RU_MAP[mm[1]] + mm[2]]; }
      if (hit) { out.push(hit[1]); done += hit[0]; i += hit[0]; } else { out.push(words[i]); if (/[A-Za-z]{2}/.test(words[i])) miss++; i++; }
    }
    if (miss > done) return seg;           // asosan o'girilmadi (kitob tavsifi va h.k.) — aralashtirmaymiz
    return lead + out.join(" ") + tail;
  }

  // ------------------------------------------------------------ o'girish
  var lang = "lat";
  function tr(text, lg) {
    lg = lg || lang;
    if (!text || lg === "lat" || typeof text !== "string" || !/[A-Za-z]/.test(text)) return text;
    return split(text).map(function (p) {
      if (!p[0] || !/[A-Za-z]/.test(p[1])) return p[1];
      if (lg === "cyr") return lat2cyr(p[1]);
      if (lg === "yl") return lat2yl(p[1]);
      return p[1].split("\n").map(ruPiece).join("\n");
    }).join("");
  }

  // ------------------------------------------------------------ ekran (DOM) — o'zi kuzatib o'giradi
  var ORIG = new WeakMap(), LAST = new WeakMap(), ATTR = new WeakMap();
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, CODE: 1, PRE: 1, NOSCRIPT: 1, svg: 1, SVG: 1 };
  var ATTRS = ["placeholder", "title", "aria-label"];
  function skipEl(el) {
    for (var e = el; e && e.nodeType === 1; e = e.parentNode) {
      if (SKIP[e.nodeName] || e.isContentEditable || (e.hasAttribute && (e.hasAttribute("data-nt") || e.getAttribute("translate") === "no"))) return true;
      if (e.classList && (e.classList.contains("nt") || e.classList.contains("leaflet-control-attribution"))) return true;
    }
    return false;
  }
  function doText(node) {
    var cur = node.data;
    if (LAST.get(node) === cur) return;              // o'zimiz yozgan matn
    if (!/[A-Za-z]/.test(cur) && !ORIG.has(node)) return;
    if (!(LAST.has(node) && LAST.get(node) === cur)) ORIG.set(node, cur);
    var orig = ORIG.get(node), out = tr(orig);
    LAST.set(node, out);
    if (out !== cur) node.data = out;
  }
  function doAttrs(el) {
    var store = ATTR.get(el); if (!store) { store = {}; ATTR.set(el, store); }
    ATTRS.forEach(function (a) {
      if (!el.hasAttribute(a)) return;
      var v = el.getAttribute(a), s = store[a];
      if (s && s.last === v) { var out0 = tr(s.orig); if (out0 !== v) { s.last = out0; el.setAttribute(a, out0); } return; }
      var out = tr(v); store[a] = { orig: v, last: out };
      if (out !== v) el.setAttribute(a, out);
    });
    if (el.nodeName === "INPUT" && /^(button|submit|reset)$/i.test(el.type || "")) {
      var s2 = store.__v;
      if (!s2 || s2.last !== el.value) store.__v = s2 = { orig: el.value, last: el.value };
      var o2 = tr(s2.orig); s2.last = o2; if (o2 !== el.value) el.value = o2;
    }
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { if (root.parentNode && !skipEl(root.parentNode)) doText(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    if (root.nodeType === 1 && skipEl(root)) return;
    if (root.nodeType === 1) doAttrs(root);
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode: function (n) {
        if (n.nodeType === 1) return SKIP[n.nodeName] || n.isContentEditable || (n.hasAttribute("data-nt")) || n.getAttribute("translate") === "no" ||
          (n.classList && n.classList.contains("nt")) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        return NodeFilter.FILTER_ACCEPT;
      } });
    var n;
    while ((n = tw.nextNode())) { if (n.nodeType === 3) doText(n); else doAttrs(n); }
  }
  var obs = null;
  function observe() {
    if (obs || !window.MutationObserver) return;
    obs = new MutationObserver(function (list) {
      if (lang === "lat") return;
      for (var i = 0; i < list.length; i++) {
        var r = list[i];
        if (r.type === "characterData") { if (r.target.parentNode && !skipEl(r.target.parentNode)) doText(r.target); }
        else if (r.type === "attributes") { if (!skipEl(r.target)) doAttrs(r.target); }
        else for (var j = 0; j < r.addedNodes.length; j++) walk(r.addedNodes[j]);
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS.concat(["value"]) });
  }
  function retranslateAll() {
    var tw = document.createTreeWalker(document.body || document.documentElement, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT), n;
    while ((n = tw.nextNode())) {
      if (n.nodeType === 3) {
        if (n.parentNode && skipEl(n.parentNode)) continue;
        if (ORIG.has(n) && LAST.get(n) === n.data) { var out = tr(ORIG.get(n)); LAST.set(n, out); if (out !== n.data) n.data = out; }
        else doText(n);
      } else if (!skipEl(n)) doAttrs(n);
    }
    document.title = tr(TITLE0);
  }
  var TITLE0 = document.title;

  // ------------------------------------------------------------ dialoglar (alert / confirm / Telegram oynalari)
  function wrapDialogs() {
    var oa = window.alert, oc = window.confirm, op = window.prompt;
    window.alert = function (m) { return oa.call(window, tr(String(m))); };
    window.confirm = function (m) { return oc.call(window, tr(String(m))); };
    window.prompt = function (m, d) { return op.call(window, tr(String(m)), d); };
    var tg = window.Telegram && window.Telegram.WebApp;
    if (tg) {
      ["showAlert", "showConfirm"].forEach(function (f) { if (tg[f]) { var o = tg[f].bind(tg); tg[f] = function (m, cb) { return o(tr(String(m)), cb); }; } });
      if (tg.showPopup) { var op2 = tg.showPopup.bind(tg); tg.showPopup = function (p, cb) {
        try { p = Object.assign({}, p, { title: p.title && tr(p.title), message: tr(p.message), buttons: (p.buttons || []).map(function (b) { return b.text ? Object.assign({}, b, { text: tr(b.text) }) : b; }) }); } catch (e) {}
        return op2(p, cb); }; }
      ["MainButton", "SecondaryButton"].forEach(function (k) { var b = tg[k]; if (b && b.setText) { var o = b.setText.bind(b); b.setText = function (t) { return o(tr(t)); }; } });
    }
  }
  // 🗃 baza javoblaridan kitob nomi, muallif va ismlarni yig'amiz (ular o'girilmaydi)
  function wrapJson() {
    if (!window.Response || !Response.prototype.json) return;
    var oj = Response.prototype.json;
    Response.prototype.json = function () {
      return oj.call(this).then(function (d) { try { collect(d, 0); } catch (e) {} return d; });
    };
  }

  // ------------------------------------------------------------ til tanlash
  var listeners = [];
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function setLang(code, opts) {
    opts = opts || {};
    if (CODES.indexOf(code) < 0) code = "lat";
    var changed = code !== lang;
    lang = code;
    if (!opts.noStore) store("rb_til", code);
    document.documentElement.setAttribute("lang", code === "ru" ? "ru" : code === "cyr" ? "uz-Cyrl" : "uz");
    if (code !== "lat") observe();
    if (changed || opts.force) { if (document.body) retranslateAll(); listeners.forEach(function (f) { try { f(code, opts); } catch (e) {} }); }
    return code;
  }
  var qs = new URLSearchParams(location.search);
  var fromUrl = qs.get("l") || qs.get("lang");
  var tgLang = (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user &&
    window.Telegram.WebApp.initDataUnsafe.user.language_code) || "";
  var initial = (CODES.indexOf(fromUrl) >= 0 && fromUrl) || store("rb_til") || "lat";

  window.TIL = {
    codes: CODES, names: NAMES, key: key, match: match, toLat: toLat, tr: function (t, l) { return tr(t, l); }, lat2cyr: lat2cyr, lat2yl: lat2yl,
    protect: protect, collect: function (d) { collect(d, 0); },
    get lang() { return lang; }, fromUrl: CODES.indexOf(fromUrl) >= 0, saved: !!store("rb_til"), tgLang: tgLang,
    set: setLang, onChange: function (f) { listeners.push(f); },
    /** til tanlash tugmalari (HTML) — data-til="kod" */
    buttons: function (cls) {
      return CODES.map(function (c) {
        return '<button type="button" class="' + (cls || "") + (c === lang ? " on" : "") + '" data-til="' + c + '" translate="no">' +
          (c === "ru" ? "🇷🇺 " : "🇺🇿 ") + NAMES[c] + (c === lang ? " ✓" : "") + "</button>";
      }).join("");
    }
  };
  wrapJson();
  lang = CODES.indexOf(initial) >= 0 ? initial : "lat";
  document.documentElement.setAttribute("lang", lang === "ru" ? "ru" : lang === "cyr" ? "uz-Cyrl" : "uz");
  function boot() { wrapDialogs(); if (lang !== "lat") { observe(); retranslateAll(); } }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
