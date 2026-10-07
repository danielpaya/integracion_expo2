/* ==========================================================================
   app.js — Navegación, modos (exposición / dashboard), componentes y
   diapositivas. Todas las cifras salen de RA_DATA (data.js) vía RACalc.
   ========================================================================== */
(function () {
  "use strict";
  var D = window.RA_DATA, K = window.RACalc;
  var P = K.PROVS;
  var PV = {}; D.proveedores.forEach(function (p) { PV[p.id] = p; });
  var CN = {}; D.componentes.forEach(function (c) { CN[c.id] = c.nombre; });
  /* Paleta categórica de componentes (validada, modo oscuro) */
  var CC = { storage: "#3987e5", ingest: "#d95926", proc: "#199e70", query: "#c98500", gov: "#d55181", sec: "#008300", orch: "#9085e9", ai: "#e66767" };
  var ST = { ok: { t: "Atendida", i: "ok" }, mit: { t: "Con mitigación", i: "mit" }, no: { t: "Sin atender", i: "no" } };
  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ORIG = { corregidas: false, normSec: false };
  var TRM = D.meta.trm;

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function f2(v) { return K.fmt(v, 2); }
  function f1(v) { return K.fmt(v, 1); }
  function f0(v) { return K.fmt(v, 0); }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function assign() { var o = {}; for (var i = 0; i < arguments.length; i++) for (var k in arguments[i]) o[k] = arguments[i][k]; return o; }

  /* ---------------- Íconos propios (no son logotipos de marcas) ---------------- */
  var ICONS = {
    store: "M3 9l1.5-5h15L21 9M3 9h18M3 9a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0M5 12v8h14v-8M10 20v-5h4v5",
    cart: "M3 4h2l2.4 11h11l2-8H6.3M9 20.5a1 1 0 100-2 1 1 0 000 2zM18 20.5a1 1 0 100-2 1 1 0 000 2z",
    boxes: "M4 13h7v7H4zM13 13h7v7h-7zM8.5 4h7v7h-7z",
    sensor: "M12 21v-8M12 13a2 2 0 100-4 2 2 0 000 4zM7.8 7.3a6 6 0 018.4 0M5 4.5a10 10 0 0114 0",
    chat: "M4 5h16v11H9l-5 4zM9 10.5h.01M12 10.5h.01M15 10.5h.01",
    db: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
    file: "M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6",
    sheet: "M4 4h16v16H4zM4 9h16M4 14h16M10 4v16",
    split: "M12 3v6M12 9l-6 6M12 9l6 6M6 15v6M18 15v6",
    gov: "M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 5v16M8 7h7M8 11h7",
    lineage: "M6 7a2 2 0 100-4 2 2 0 000 4zM6 21a2 2 0 100-4 2 2 0 000 4zM18 14a2 2 0 100-4 2 2 0 000 4zM6 7v10M6 12h10",
    clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2",
    cloud: "M7 18h10a4 4 0 00.5-8 6 6 0 00-11.5 1.5A3.5 3.5 0 007 18z",
    bolt: "M13 2L4 14h7l-1 8 9-12h-7z",
    gear: "M12 15a3 3 0 100-6 3 3 0 000 6zM12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1",
    search: "M11 18a7 7 0 100-14 7 7 0 000 14zM16 16l5 5",
    chart: "M4 20V10M10 20V4M16 20v-7M2 20h20",
    chip: "M7 7h10v10H7zM10 10h4v4h-4zM9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4",
    shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4",
    lock: "M6 11h12v10H6zM8 11V7a4 4 0 018 0v4",
    user: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0",
    users: "M9 11a4 4 0 100-8 4 4 0 000 8zM2 21a7 7 0 0114 0M16 3.5a4 4 0 010 7.5M18 14a6 6 0 014 7",
    check: "M5 12l5 5L20 7",
    x: "M6 6l12 12M18 6L6 18",
    ok: "M12 21a9 9 0 100-18 9 9 0 000 18zM8 12l3 3 5-6",
    mit: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 3v18M12 8h7M12 12h9M12 16h7",
    no: "M12 21a9 9 0 100-18 9 9 0 000 18zM9 9l6 6M15 9l-6 6",
    warn: "M12 3l10 18H2zM12 10v5M12 18h.01",
    flag: "M5 21V4M5 4h11l-2 4 2 4H5",
    coin: "M12 21a9 9 0 100-18 9 9 0 000 18zM14.5 9.2c-.4-1-1.3-1.6-2.5-1.6-1.4 0-2.5.7-2.5 1.8 0 2.6 5 1.3 5 3.9 0 1.1-1.1 1.8-2.5 1.8-1.3 0-2.2-.6-2.6-1.6M12 6v1.6M12 16.4V18",
    calendar: "M4 6h16v15H4zM4 10h16M8 3v4M16 3v4",
    target: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 17a5 5 0 100-10 5 5 0 000 10zM12 13a1 1 0 100-2 1 1 0 000 2z",
    layers: "M12 3l9 5-9 5-9-5zM3 12.5l9 5 9-5M3 16.5l9 5 9-5",
    pin: "M12 21s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12zM12 11a2 2 0 100-4 2 2 0 000 4z",
    globe: "M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18",
    key: "M8 15a4 4 0 100-8 4 4 0 000 8zM11 11h10M18 11v3M15 11v2",
    scale: "M12 4v17M6 21h12M4 8h16M7 8l-3 6a3 3 0 006 0zM17 8l-3 6a3 3 0 006 0z",
    arrow: "M5 12h14M13 6l6 6-6 6",
    building: "M4 21V5l8-3v19M12 8h8v13M8 8h.01M8 12h.01M8 16h.01M16 12h.01M16 16h.01M2 21h20",
    eye: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z",
    down: "M3 7l6 6 4-4 8 8M21 11v6h-6",
    flow: "M4 6h6v4H4zM14 14h6v4h-6zM7 10v4a2 2 0 002 2h5",
    book: "M4 19V5a2 2 0 012-2h14v14H6a2 2 0 00-2 2zm0 0a2 2 0 002 2h14",
    prev: "M15 6l-6 6 6 6", next: "M9 6l6 6-6 6"
  };
  function icon(n, cls) { return '<svg class="ic ' + (cls || "") + '" viewBox="0 0 24 24" aria-hidden="true"><path d="' + (ICONS[n] || "") + '"/></svg>'; }

  /* ---------------- Estado ---------------- */
  function simDefaults() { var r = D.sim.rangos; return { tbAlmacenados: r.tbAlmacenados.def, tbEscaneados: r.tbEscaneados.def, vcpuH: r.vcpuH.def, ociHorasDia: r.ociHorasDia.def, airflow: false }; }
  var state = {
    mode: "deck", idx: 0, step: 0, corregidas: false, normSec: false,
    sim: simDefaults(), selProv: "gcp", weights: K.defaultWeights(D),
    notes: false, hideTeam: false, tabs: {}, sel: { asis: null, tobe: "alm", gap: 0 }, capture: /capture/.test(location.search)
  };
  try { if (localStorage.getItem("ra-hideTeam") === "1") state.hideTeam = true; } catch (e) { /* sin almacenamiento */ }

  function scn() { return { corregidas: state.corregidas, normSec: state.normSec }; }
  function simParams() { return assign(state.sim, scn()); }
  function activeIds() { var a = []; if (state.corregidas) a.push("E-01", "E-04"); if (state.normSec) a.push("E-03"); return a; }

  /* ---------------- Distintivos de corrección ---------------- */
  /* compact: true = solo el código · "m" = código y valor anterior · falso = completo */
  function badge(ids, before, compact) {
    if (!ids || !ids.length) return "";
    var est = ids.indexOf("E-04") >= 0 && compact !== "m" ? " (estimación)" : "";
    var txt = compact === "icon" ? "" : ids.join("·") + (compact === true ? "" : est + (before != null ? " · antes " + before : ""));
    var tip = ids.map(function (id) { var c = D.correcciones[id]; return id + " — " + c.titulo + ": " + c.motivo; }).join(" | ") + (before != null ? " | Valor original: " + before : "");
    return '<span class="badge" data-tip="' + esc(tip) + '">' + esc(txt) + "</span>";
  }
  /* Cifra de costo con su distintivo si alguna corrección activa la cambia */
  function cv(params, prov, comp, compact) {
    var c = K.costs(D, params), o = K.costs(D, assign(params, ORIG));
    var ids = K.correccionesAplicadas(D, params)[prov][comp];
    return '<span class="num">' + f2(c[prov][comp]) + "</span>" + (ids ? badge(ids, f2(o[prov][comp]), compact) : "");
  }
  /* Cifra derivada (porcentajes, puntajes, rankings): distintivo si cambió */
  function dv(newV, oldV, fmtFn, compact, ids) {
    fmtFn = fmtFn || f2;
    if (fmtFn(newV) === fmtFn(oldV)) return "";
    return badge(ids || activeIds(), fmtFn(oldV), compact);
  }
  /* Correcciones que afectan el total de uno o varios proveedores */
  function idsTot(params, provs) {
    var ap = K.correccionesAplicadas(D, params), out = [];
    provs.forEach(function (p) { (ap[p].total || []).forEach(function (id) { if (out.indexOf(id) < 0) out.push(id); }); });
    return out.sort();
  }
  function provLabel(p, short) { var v = PV[p]; return '<span class="prov-chip"><i class="dot" style="background:' + v.color + '"></i>' + esc(short && p === "gcp" ? "GCP" : v.nombre) + (v.elegido ? ' <span class="star" aria-label="recomendado">★</span>' : "") + "</span>"; }
  function tbd(t) { return '<span class="tbd" data-tip="' + esc(t || "Pendiente del equipo") + '">Por definir</span>'; }
  function team(t) { return '<div class="team">' + icon("eye") + "<div><b>Para el equipo:</b> " + t + "</div></div>"; }
  function stIcon(s, label) { return '<span class="st ' + s + '" data-tip="' + ST[s].t + '">' + icon(ST[s].i) + (label ? ST[s].t : "") + "</span>"; }

  /* ---------------- Gráficos SVG ---------------- */
  function hbars(rows, o) {
    o = o || {};
    var max = o.max || Math.max.apply(null, rows.map(function (r) { return Math.abs(r.value); })) * 1.04 || 1;
    return '<div class="hbars" style="--lw:' + (o.lw || "7.5em") + ";--vw:" + (o.vw || "8em") + '">' + rows.map(function (r) {
      var w = Math.max(0.4, r.value / max * 100);
      return '<div class="hb-row ' + (r.hi ? "hi" : "") + '"' + (r.tip ? ' data-tip="' + esc(r.tip) + '"' : "") + (r.prov ? ' data-prov="' + r.prov + '"' : "") + ">" +
        '<div class="hb-label">' + (r.labelHtml || esc(r.label)) + "</div>" +
        '<svg class="hb-track" preserveAspectRatio="none" aria-hidden="true"><rect class="bg" x="0" y="12%" width="100%" height="76%" rx="4"/>' +
        '<rect x="0" y="12%" width="' + w.toFixed(2) + '%" height="76%" rx="4" fill="' + r.color + '"/>' +
        (r.marker != null ? '<line class="marker" x1="' + (r.marker / max * 100).toFixed(2) + '%" x2="' + (r.marker / max * 100).toFixed(2) + '%" y1="0" y2="100%"/>' : "") +
        "</svg>" + '<div class="hb-val">' + (r.valueHtml != null ? r.valueHtml : f2(r.value)) + "</div></div>";
    }).join("") + "</div>";
  }
  function provBars(vals, o) {
    o = assign({ lw: "9.4em" }, o || {});
    return hbars(P.map(function (p) {
      return { prov: p, labelHtml: provLabel(p, o.short), value: vals[p], color: PV[p].color, hi: p === "gcp", valueHtml: o.valueHtml ? o.valueHtml(p) : (o.prefix || "") + f2(vals[p]), tip: o.tip ? o.tip(p) : null, marker: o.marker ? o.marker[p] : null };
    }), o);
  }
  function costBars(params, comp, o) {
    var c = K.costs(D, params), vals = {};
    P.forEach(function (p) { vals[p] = c[p][comp]; });
    var ap = K.correccionesAplicadas(D, params), any = P.some(function (p) { return ap[p][comp]; });
    var mode = (o || {}).compact === undefined ? "m" : o.compact;
    return provBars(vals, assign({ valueHtml: function (p) { return "US$ " + cv(params, p, comp, mode); }, vw: any ? (mode === true ? "10em" : "16.5em") : "6.5em", lw: "9.4em" }, o || {}));
  }
  function legendComps() {
    return '<div class="legend">' + K.COMPS.map(function (k) { return '<span><i class="dot" style="background:' + CC[k] + '"></i>' + esc(CN[k]) + "</span>"; }).join("") + "</div>";
  }
  function stacked(params, o) {
    o = o || {};
    var c = K.costs(D, params), max = Math.max.apply(null, P.map(function (p) { return c[p].total; })) * 1.01;
    var ap = K.correccionesAplicadas(D, params), multi = P.some(function (p) { return (ap[p].total || []).length > 1; }), any = P.some(function (p) { return ap[p].total; });
    return '<div class="stk" style="--lw:' + (o.lw || "8.8em") + ";--vw:" + (o.vw || (multi ? "12.5em" : any ? "11em" : "9.5em")) + '">' + P.map(function (p) {
      var x = 0, rects = K.COMPS.map(function (k) {
        var w = c[p][k] / max * 100, r = '<rect x="' + x.toFixed(3) + '%" y="8%" width="' + w.toFixed(3) + '%" height="84%" fill="' + CC[k] + '" data-tip="' + esc(PV[p].nombre + " · " + CN[k] + ": US$ " + f2(c[p][k])) + '"/>';
        x += w; return r;
      }).join("");
      return '<div class="stk-row ' + (p === "gcp" ? "hi " : "") + (o.sel === p ? "sel" : "") + '" data-prov="' + p + '">' + provLabel(p) + '<svg preserveAspectRatio="none" role="img" aria-label="' + esc(PV[p].nombre + ": US$ " + f2(c[p].total)) + '">' + rects + '</svg><div class="hb-val">US$ ' + cv(params, p, "total", true) + "</div></div>";
    }).join("") + "</div>";
  }
  function pairedBars(rows, o) { // rows: {labelHtml, a, b, colorB, txt}
    var max = o.max;
    return '<div class="hbars" style="--lw:' + (o.lw || "7.6em") + ";--vw:" + (o.vw || "11em") + '">' + rows.map(function (r) {
      return '<div class="hb-row ' + (r.hi ? "hi" : "") + '" data-tip="' + esc(r.tip || "") + '"><div class="hb-label">' + r.labelHtml + '</div><svg class="hb-track" style="height:1.7em" preserveAspectRatio="none" aria-hidden="true">' +
        '<rect x="0" y="4%" width="' + (r.a / max * 100).toFixed(2) + '%" height="42%" rx="4" fill="#7D8AA0"/>' +
        '<rect x="0" y="54%" width="' + (r.b / max * 100).toFixed(2) + '%" height="42%" rx="4" fill="' + r.colorB + '"/></svg><div class="hb-val">' + r.txt + "</div></div>";
    }).join("") + "</div>";
  }
  function vbars(items, o) {
    var W = o.w || 900, H = o.h || 400, pt = 44, pb = 54, max = Math.max.apply(null, items.map(function (i) { return i.value; })) * 1.08, bw = W / items.length;
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" width="100%" role="img" aria-label="' + esc(o.label || "") + '"><line x1="0" x2="' + W + '" y1="' + (H - pb) + '" y2="' + (H - pb) + '" stroke="#2A3953" stroke-width="2"/>';
    items.forEach(function (it, i) {
      var h = it.value / max * (H - pt - pb), x = i * bw + bw * 0.2, y = H - pb - h;
      s += '<rect x="' + x + '" y="' + y + '" width="' + bw * 0.6 + '" height="' + Math.max(2, h) + '" rx="4" fill="' + (it.color || "#3987e5") + '" data-tip="' + esc(it.tip || "") + '"/>';
      s += '<text x="' + (x + bw * 0.3) + '" y="' + (y - 10) + '" text-anchor="middle" font-size="24" font-weight="650" style="fill:#EAF0F8">' + esc(it.valueTxt) + "</text>";
      s += '<text x="' + (x + bw * 0.3) + '" y="' + (H - pb + 34) + '" text-anchor="middle" font-size="24">' + esc(it.label) + "</text>";
    });
    return s + "</svg>";
  }
  function divergingBars(items, o) { // items {label, value}
    var max = o.max;
    return '<div class="hbars" style="--lw:' + (o.lw || "9em") + ";--vw:" + (o.vw || "6em") + '">' + items.map(function (it) {
      var w = Math.abs(it.value) / max * 50, x = it.value >= 0 ? 50 : 50 - w;
      return '<div class="hb-row ' + (it.hi ? "hi" : "") + '" data-tip="' + esc(it.label + ": VPN COP " + f0(it.value) + " M") + '"><div class="hb-label">' + esc(it.label) + '</div><svg class="hb-track" preserveAspectRatio="none" aria-hidden="true"><line x1="50%" x2="50%" y1="0" y2="100%" stroke="#9FB0C8" stroke-width="2"/><rect x="' + x.toFixed(2) + '%" y="14%" width="' + Math.max(0.4, w).toFixed(2) + '%" height="72%" rx="4" fill="' + (it.value >= 0 ? "#3987e5" : "#e66767") + '"/></svg><div class="hb-val">' + f0(it.value) + "</div></div>";
    }).join("") + "</div>";
  }

  /* ---------------- Tabla de costos ---------------- */
  function costTable(params, o) {
    o = o || {};
    var c = K.costs(D, params), oc = K.costs(D, assign(params, ORIG));
    var rk = K.ranking(c), rko = K.ranking(oc);
    var th = "<tr><th>Componente (USD/mes)</th>" + P.map(function (p) { return '<th class="n ' + (p === "gcp" ? "gcpcol" : "") + '">' + provLabel(p, true) + "</th>"; }).join("") + "</tr>";
    var body = K.COMPS.map(function (k) {
      return "<tr><td>" + esc(CN[k]) + "</td>" + P.map(function (p) { return '<td class="n ' + (p === "gcp" ? "gcpcol" : "") + '">' + cv(params, p, k, true) + "</td>"; }).join("") + "</tr>";
    }).join("");
    body += '<tr class="tot"><td>Total mensual (USD)</td>' + P.map(function (p) { return '<td class="n ' + (p === "gcp" ? "gcpcol" : "") + '">' + cv(params, p, "total", true) + "</td>"; }).join("") + "</tr>";
    if (!o.short) {
      body += '<tr class="sub"><td>Total mensual (COP millones)</td>' + P.map(function (p) { var v = c[p].total * TRM / 1e6, w = oc[p].total * TRM / 1e6; return '<td class="n ' + (p === "gcp" ? "gcpcol" : "") + '">' + f2(v) + dv(v, w, f2, true, idsTot(params, [p])) + "</td>"; }).join("") + "</tr>";
      body += '<tr class="sub"><td>Total a 36 meses (USD)</td>' + P.map(function (p) { var v = c[p].total * 36, w = oc[p].total * 36; return '<td class="n ' + (p === "gcp" ? "gcpcol" : "") + '">' + f0(v) + dv(v, w, f0, true, idsTot(params, [p])) + "</td>"; }).join("") + "</tr>";
    }
    if (o.clase9) body += '<tr class="sub"><td>Ref. Clase 9, diap. 18 (alm. + consulta)</td>' + P.map(function (p) { return '<td class="n ' + (p === "gcp" ? "gcpcol" : "") + '">~' + f0(D.clase9.ref[p]) + "</td>"; }).join("") + "</tr>";
    body += '<tr class="sub"><td>Posición por costo</td>' + P.map(function (p) { var a = rk.indexOf(p) + 1, b = rko.indexOf(p) + 1; return '<td class="n ' + (p === "gcp" ? "gcpcol" : "") + '">' + a + "°" + (a !== b ? badge(activeIds(), b + "°", true) : "") + "</td>"; }).join("") + "</tr>";
    return '<table class="t">' + th + body + "</table>";
  }

  /* ---------------- Simulador ---------------- */
  var SIMFMT = {
    tbAlmacenados: function (v) { return f0(v) + " TB"; },
    tbEscaneados: function (v) { return f1(v) + " TB"; },
    vcpuH: function (v) { return f0(v) + " vCPU-h"; },
    ociHorasDia: function (v) { return f0(v) + " h/día"; }
  };
  function simControls() {
    var R = D.sim.rangos, s = state.sim;
    function sl(k, label) { return '<label class="ctl"><span class="ctl-top"><span>' + label + '</span><b data-simval="' + k + '">' + SIMFMT[k](s[k]) + '</b></span><input type="range" min="' + R[k].min + '" max="' + R[k].max + '" step="' + R[k].step + '" value="' + s[k] + '" data-sim="' + k + '" aria-label="' + esc(label) + '"></label>'; }
    function tg(attr, k, label, on, corr) { return '<label class="tog"><input type="checkbox" ' + attr + '="' + k + '"' + (on ? " checked" : "") + '><span class="sw' + (corr ? " corr" : "") + '"></span>' + label + "</label>"; }
    return sl("tbAlmacenados", "TB almacenados") + sl("tbEscaneados", "TB escaneados al mes") + sl("vcpuH", "Cómputo Spark") + sl("ociHorasDia", "SQL de OCI encendido") +
      tg("data-sim", "airflow", "Airflow gestionado", s.airflow) + tg("data-global", "normSec", "Normalizar seguridad", state.normSec, true) + tg("data-global", "corregidas", "Cifras corregidas", state.corregidas, true) +
      '<button type="button" class="hbtn" data-act="simreset" style="align-self:flex-start">Restablecer</button>';
  }
  var RANK_H = 1.6;
  function rankHTML() {
    return '<div class="rank" data-simout="rank" style="height:' + (4 * RANK_H) + 'em">' + P.map(function (p) {
      return '<div class="rank-row ' + (p === "gcp" ? "gcp" : "") + '" data-prov="' + p + '" style="height:' + (RANK_H - 0.3) + 'em"><span class="pos"></span>' + provLabel(p) + '<span class="tv"></span><span class="sc"></span></div>';
    }).join("") + "</div>";
  }
  function updateRank(el, params) {
    var c = K.costs(D, params), m = K.matrixScores(D, c, state.weights), order = K.ranking(c);
    P.forEach(function (p) {
      var row = el.querySelector('[data-prov="' + p + '"]'), i = order.indexOf(p);
      row.style.top = (i * RANK_H) + "em";
      row.querySelector(".pos").textContent = "#" + (i + 1);
      row.querySelector(".tv").innerHTML = cv(params, p, "total", "icon");
      row.querySelector(".sc").textContent = f2(m.scores[p]) + " pts";
      row.classList.toggle("sel", state.selProv === p);
    });
  }
  function simAlert(params) {
    var c = K.costs(D, params), ch = K.cheapest(c), m = K.matrixScores(D, c, state.weights), win = K.winner(m.scores), out = "";
    if (ch !== "gcp") out += "El más barato deja de ser GCP: ahora es <b>" + esc(PV[ch].nombre) + "</b> (US$ " + f2(c[ch].total) + "); GCP queda #" + (K.ranking(c).indexOf("gcp") + 1) + ". ";
    if (win !== "gcp") out += "La matriz ya no elige a GCP: gana <b>" + esc(PV[win].nombre) + "</b>.";
    return out ? icon("warn") + "<span>" + out + "</span>" : "";
  }
  function simDetail(params) {
    var c = K.costs(D, params), p = state.selProv, t = c[p].total, g = c.gcp.total, diff = t - g, pct = K.pctDiff(t, g);
    return '<div style="margin-bottom:4px">' + provLabel(p) + '</div><table class="t mini"><tr><th></th><th class="n">US$</th><th class="n">COP</th></tr>' +
      '<tr><td>Mes</td><td class="n">' + f2(t) + '</td><td class="n">' + f2(t * TRM / 1e6) + " M</td></tr>" +
      '<tr><td>36 meses</td><td class="n">' + f0(t * 36) + '</td><td class="n">' + f1(t * 36 * TRM / 1e6) + " M</td></tr></table>" +
      '<div style="margin-top:6px">Frente a GCP: <b>' + (p === "gcp" ? "—" : (diff >= 0 ? "+" : "−") + "US$ " + f2(Math.abs(diff)) + " (" + (pct >= 0 ? "+" : "−") + f1(Math.abs(pct)) + "%)") + "</b></div>";
  }
  function simNote() { return '<div class="note-fixed">' + icon("calendar") + " " + esc(D.meta.notaPrecios) + ".</div>"; }

  /* ---------------- Brechas ---------------- */
  function provsel() { return '<div class="provsel" role="group" aria-label="Proveedor">' + P.map(function (p) { return '<button type="button" data-prov="' + p + '" class="' + (state.selProv === p ? "on" : "") + '">' + provLabel(p) + "</button>"; }).join("") + "</div>"; }
  function gapCost(g) { if (g.costoUSD) return "US$ " + f2(g.costoUSD) + "/mes"; if (g.costoCOPM) return "COP " + f0(g.costoCOPM) + " M"; if (g.costo) return esc(g.costo); return tbd("Costo de mitigar no estimado en el informe"); }
  function gapFallas(g) { return g.falla.length ? g.falla.map(function (n) { return '<span class="chip f" data-tip="' + esc(D.fallas[n - 1].corto) + '">Falla ' + n + "</span>"; }).join(" ") : '<span class="chip">' + esc(g.tema) + "</span>"; }
  function semaf(compact) {
    var h = '<div class="semaf"><div class="h l">Falla</div>' + P.map(function (p) { return '<div class="h ' + (state.selProv === p ? "selc" : "") + '">' + esc(p === "gcp" ? "GCP" : PV[p].nombre) + "</div>"; }).join("");
    D.fallas.forEach(function (f) {
      h += '<div class="l" data-tip="' + esc(f.corto + ": " + f.detalle) + '">' + f.id + ". " + esc(compact ? f.mini : f.corto) + "</div>" + P.map(function (p) { return '<div class="' + (state.selProv === p ? "selc" : "") + '">' + stIcon(D.semaforo[p][f.id]) + "</div>"; }).join("");
    });
    return h + "</div>";
  }
  function semafLegend() { return '<div class="legend">' + ["ok", "mit", "no"].map(function (s) { return "<span>" + stIcon(s, true) + "</span>"; }).join("") + "</div>"; }
  function gapDetail() {
    var list = D.brechas[state.selProv], g = list[Math.min(state.sel.gap, list.length - 1)];
    return '<h4 style="font-size:26px">' + icon("warn") + esc(g.brecha) + '</h4><dl class="kv" style="grid-template-columns:auto 1fr"><dt>Impacto</dt><dd style="text-align:left;font-weight:500">' + esc(g.impacto) + '</dd><dt>Mitigación</dt><dd style="text-align:left;font-weight:500">' + esc(g.mitigacion) + '</dd><dt>Costo</dt><dd style="text-align:left">' + gapCost(g) + "</dd></dl>";
  }
  function gapsSlideOut() {
    var list = D.brechas[state.selProv];
    return '<div class="row" style="height:100%"><div class="col grow"><div class="gaps">' + list.map(function (g, i) {
      return '<div class="gap ' + (i === state.sel.gap ? "sel" : "") + '" data-gap="' + i + '"><span>' + esc(g.brecha) + "</span><span>" + gapFallas(g) + '</span><span class="lbl-sm">' + gapCost(g) + "</span></div>";
    }).join("") + '</div><div class="callout"><b>A favor:</b> ' + esc(D.aFavor[state.selProv]) + "</div>" + semafLegend() + '</div><div class="col" style="width:600px">' + semaf(true) + '<div class="detail">' + gapDetail() + "</div></div></div>";
  }
  function gapsDashOut() {
    var list = D.brechas[state.selProv];
    return '<div class="gapcards">' + list.map(function (g) {
      return '<div class="gapcard"><b>' + esc(g.brecha) + '</b><dl class="flow"><dt>Falla</dt><dd>' + gapFallas(g) + "</dd><dt>Impacto</dt><dd>" + esc(g.impacto) + "</dd><dt>Mitiga</dt><dd>" + esc(g.mitigacion) + "</dd><dt>Costo</dt><dd>" + gapCost(g) + "</dd></dl></div>";
    }).join("") + '</div><p class="muted" style="margin:10px 0 6px"><b>A favor:</b> ' + esc(D.aFavor[state.selProv]) + "</p>" + semaf(false) + '<div style="margin-top:8px">' + semafLegend() + "</div>";
  }

  /* ---------------- Matriz con pesos ---------------- */
  function matrixOut(params) {
    var c = K.costs(D, params), m = K.matrixScores(D, c, state.weights), win = K.winner(m.scores), mo = K.matrixScores(D, c, K.defaultWeights(D));
    var alert = win !== "gcp" ? '<div class="callout warn" style="margin-bottom:10px">' + icon("warn") + " Cambia el ganador: <b>" + esc(PV[win].nombre) + "</b> supera a GCP con estos pesos.</div>" : '<div class="callout" style="margin-bottom:10px">' + icon("check") + " Ganador: <b>" + esc(PV[win].nombre) + "</b></div>";
    return alert + provBars(m.scores, { max: 5, lw: "8em", vw: "7em", valueHtml: function (p) { return f2(m.scores[p]) + dv(m.scores[p], mo.scores[p], f2, true); } });
  }
  function weightSliders() {
    var w = K.normalizeWeights(state.weights);
    return D.matriz.criterios.map(function (cr) {
      return '<label class="wsl"><span>' + esc(cr.nombre) + '</span><input type="range" min="0" max="40" step="1" value="' + state.weights[cr.id] + '" data-w="' + cr.id + '" aria-label="Peso ' + esc(cr.nombre) + '"><b class="num" data-wval="' + cr.id + '">' + f1(w[cr.id]) + "%</b></label>";
    }).join("");
  }

  /* ---------------- Actualización en vivo ---------------- */
  function refreshDynamic() {
    var sp = simParams();
    $$("[data-simval]").forEach(function (el) { el.textContent = SIMFMT[el.dataset.simval](state.sim[el.dataset.simval]); });
    $$('input[data-sim]').forEach(function (el) { var k = el.dataset.sim; if (el.type === "checkbox") el.checked = !!state.sim[k]; else if (document.activeElement !== el) el.value = state.sim[k]; });
    $$('[data-simout="alert"]').forEach(function (el) { var h = simAlert(sp); el.innerHTML = h; el.classList.toggle("on", !!h); });
    $$('[data-simout="bars"]').forEach(function (el) { el.innerHTML = stacked(sp, { sel: state.selProv }); });
    $$('[data-simout="rank"]').forEach(function (el) { updateRank(el, sp); });
    $$('[data-simout="detail"]').forEach(function (el) { el.innerHTML = simDetail(sp); });
    $$('[data-simout="matrix"]').forEach(function (el) { el.innerHTML = matrixOut(sp); });
    $$('[data-simout="table"]').forEach(function (el) { el.innerHTML = costTable(sp, { short: false }); });
    $$('[data-simout="kpis"]').forEach(function (el) { el.innerHTML = dashKpis(sp); });
    $$("[data-wval]").forEach(function (el) { el.textContent = f1(K.normalizeWeights(state.weights)[el.dataset.wval]) + "%"; });
    $$("[data-gapsout]").forEach(function (el) { el.innerHTML = el.dataset.gapsout === "dash" ? gapsDashOut() : gapsSlideOut(); });
    $$(".provsel button").forEach(function (b) { b.classList.toggle("on", b.dataset.prov === state.selProv); });
  }

  /* ======================================================================
     DIAPOSITIVAS
     ====================================================================== */
  function tabs(id, list) { // list: [{k, label, html}]
    var cur = state.tabs[id] || list[0].k;
    return '<div class="tabs" role="tablist">' + list.map(function (t) { return '<button type="button" role="tab" class="tab ' + (t.k === cur ? "on" : "") + '" data-tab="' + id + ":" + t.k + '">' + esc(t.label) + "</button>"; }).join("") + "</div>" +
      list.map(function (t) { return '<div class="panel ' + (t.k === cur ? "on" : "") + '" data-panel="' + id + ":" + t.k + '">' + t.html + "</div>"; }).join("");
  }
  function ref() { return K.costs(D, scn()); }
  function refO() { return K.costs(D, ORIG); }
  function scoresRef() { return K.matrixScores(D, ref()).scores; }
  function scoresO() { return K.matrixScores(D, refO()).scores; }
  function scoreRow(id) { var c = D.matriz.criterios.filter(function (x) { return x.id === id; })[0]; return '<div class="h">Puntaje (1–5)</div>' + P.map(function (p) { return '<div class="' + (p === "gcp" ? "g" : "") + '"><b>' + c.s[p] + "</b></div>"; }).join(""); }
  function featGrid(rows) { // rows: [{label, v:{prov:html}}]
    return '<div class="feat"><div class="h"></div>' + P.map(function (p) { return '<div class="h ' + (p === "gcp" ? "g" : "") + '">' + provLabel(p, true) + "</div>"; }).join("") +
      rows.map(function (r) { return r.raw ? r.raw : '<div class="h">' + esc(r.label) + "</div>" + P.map(function (p) { return '<div class="' + (p === "gcp" ? "g" : "") + '">' + r.v[p] + "</div>"; }).join(""); }).join("") + "</div>";
  }
  function yesno(v, txt) { return v ? '<span class="st ok">' + icon("ok") + esc(txt || "Sí") + "</span>" : '<span class="st no">' + icon("no") + esc(txt || "No") + "</span>"; }

  var SLIDES = [
  /* 1 ─ Portada */
  { id: "s1", noHead: true, cite: "(Clase 4 · Comparativa, diap. 18)", src: "Informe v2 · Resumen ejecutivo",
    render: function () {
      var c = ref(), o = refO(), s = scoresRef(), so = scoresO();
      var art = '<svg viewBox="0 0 560 470" width="100%" aria-hidden="true">' +
        D.tobe.fuentes.map(function (f, i) { var y = 60 + i * 80; return '<circle cx="40" cy="' + y + '" r="16" fill="#1C2940" stroke="#9FB0C8" stroke-width="3"/><path d="M60 ' + y + ' C 140 ' + y + ', 140 235, 200 235" stroke="#2A3953" stroke-width="3" fill="none"/>'; }).join("") +
        '<g><path d="M210 140 L540 140 L510 200 L180 200 Z" fill="#9ec5f4"/><text x="360" y="180" text-anchor="middle" font-size="26" font-weight="700" style="fill:#0B1220">raw</text>' +
        '<path d="M210 215 L540 215 L510 275 L180 275 Z" fill="#6da7ec"/><text x="360" y="255" text-anchor="middle" font-size="26" font-weight="700" style="fill:#0B1220">curated</text>' +
        '<path d="M210 290 L540 290 L510 350 L180 350 Z" fill="#3987e5"/><text x="360" y="330" text-anchor="middle" font-size="26" font-weight="700" style="fill:#fff">consumption</text></g>' +
        '<rect x="180" y="380" width="360" height="56" rx="12" fill="rgba(53,192,138,.16)" stroke="#35C08A" stroke-width="2"/><text x="360" y="417" text-anchor="middle" font-size="24" style="fill:#EAF0F8">Gobierno · linaje · calidad</text></svg>';
      return '<div class="cover"><div>' +
        '<div class="kicker">' + esc(D.meta.universidad) + " · " + esc(D.meta.curso) + "</div>" +
        "<h1>" + esc(D.meta.titulo) + "</h1>" +
        '<div class="co">' + icon("building") + esc(D.meta.empresa) + "</div>" +
        '<div class="reco">' + icon("cloud") + "Recomendación: <b>" + esc(D.meta.recomendacion) + "</b></div>" +
        '<div class="kpis"><div class="kpi"><span class="lbl-sm">Costo mensual</span><b>US$ ' + cv(scn(), "gcp", "total") + '</b></div><div class="kpi"><span class="lbl-sm">Puntaje ponderado</span><b>' + f2(s.gcp) + " / 5" + dv(s.gcp, so.gcp) + '</b></div><div class="kpi"><span class="lbl-sm">Posición por costo</span><b>' + (K.ranking(c).indexOf("gcp") + 1) + "° de 4</b></div></div>" +
        '<div class="meta"><span>' + esc(D.meta.equipo) + "</span><span>Integrantes: " + (D.meta.integrantes ? esc(D.meta.integrantes) : tbd("Nombres del grupo")) + "</span><span>" + esc(D.meta.fecha) + "</span></div>" +
        "</div><div>" + art + "</div></div>";
    },
    notes: function () {
      return "<p>Buenos días. Somos " + esc(D.meta.equipo) + ". Presentamos la solución de Data Lake con Gobierno de Datos para " + esc(D.meta.empresa) + " y nuestra recomendación: <b>Google Cloud</b>, con un lago serverless sobre Cloud Storage + BigLake (Apache Iceberg) + BigQuery, gobernado con Knowledge Catalog, en la región " + esc(D.meta.region) + ".</p>" +
        "<p>Dos cifras resumen la decisión: el menor costo mensual con la misma carga (US$ " + f2(D.totalesInforme.gcp) + ") y el mayor puntaje ponderado (" + f2(D.verificacion.matriz.original.gcp) + "/5). Cifras con precios oficiales al " + esc(D.meta.fechaPrecios) + ".</p>" +
        '<p class="qa">Si preguntan por qué no hay logotipos: usamos íconos propios para no reproducir marcas; cada proveedor tiene un color fijo en toda la presentación.</p>';
    } },

  /* 2 ─ Agenda */
  { id: "s2", kicker: "Agenda", title: "Tres actos: problema, decisión, plan y valor", cite: "(Clase 9, diap. 20)", src: "Especificación del proyecto · sección 4.3",
    render: function () {
      var acts = [
        { n: 1, t: "Problema", d: "Por qué RetailAndes debe cambiar", go: 2, r: "Diap. 3–5", i: "down" },
        { n: 2, t: "Decisión", d: "Qué nube, por qué y cuánto cuesta", go: 5, r: "Diap. 6–15", i: "scale" },
        { n: 3, t: "Plan y valor", d: "Cómo lo ejecutamos y qué gana la empresa", go: 15, r: "Diap. 16–19", i: "flag" }
      ];
      return '<div class="agenda">' + acts.map(function (a) {
        return '<button type="button" class="act" data-goto="' + a.go + '"><span class="n">' + a.n + "</span>" + icon(a.i, "big") + "<h3>" + a.t + '</h3><span class="muted">' + a.d + '</span><span class="go">' + a.r + " " + icon("arrow") + "</span></button>";
      }).join("") + "</div>";
    },
    notes: function () {
      return "<p>La exposición tiene tres actos. Primero el problema: quién es RetailAndes, cuáles son sus cinco fallas de datos y cuánto le cuesta no actuar. Segundo, la decisión: cómo comparamos los cuatro proveedores con una carga idéntica y por qué gana Google Cloud, incluida la arquitectura AS-IS y TO-BE y los costos. Tercero, el plan: hoja de ruta en tres sprints, modelo de gobierno, indicadores del Nivel 1 y las decisiones que pedimos al comité.</p>" +
        '<p class="qa">Cada tarjeta es clicable y salta al acto correspondiente. Las diapositivas de respaldo (B1–B6) están después del cierre para responder preguntas.</p>';
    } },

  /* 3 ─ RetailAndes en cifras */
  { id: "s3", kicker: "Acto 1 · Problema", title: "RetailAndes en cifras", cite: "(Clase 4 · Data-Driven, diap. 5)", src: "Especificación del proyecto · sección 1",
    render: function () {
      var e = D.empresa;
      var tiles = [
        { i: "store", v: f0(e.tiendas), l: "tiendas" }, { i: "pin", v: f0(e.ciudades), l: "ciudades" },
        { i: "users", v: f0(e.empleados) + "+", l: "empleados directos" }, { i: "coin", v: "COP " + f0(e.ingresosCOPM) + " M", l: "ingresos anuales (más de)" },
        { i: "globe", v: String(e.paises.length), l: "países con proveedores: " + e.paises.join(", ") }, { i: "cart", v: String(e.ecommerceDesde), l: "año de lanzamiento del e-commerce" }
      ];
      return '<div class="tiles" style="grid-template-columns:repeat(3,1fr)">' + tiles.map(function (t, i) { return '<div class="tile step" data-step="' + (i < 3 ? 0 : 1) + '">' + icon(t.i, "big") + '<span class="v">' + esc(t.v) + '</span><span class="l">' + esc(t.l) + "</span></div>"; }).join("") + "</div>" +
        '<div class="timeline step" data-step="2">' +
        '<div class="tl-pt"><b>' + e.fundacion + "</b>Fundación en " + esc(e.sede) + "</div>" +
        '<div class="tl-pt"><b>' + e.ecommerceDesde + "</b>E-commerce</div>" +
        '<div class="tl-pt bad"><b>' + e.crisisDesde + "</b>Crisis de competitividad</div>" +
        '<div class="tl-pt bad"><b>2026</b>Diagnóstico: ' + esc(e.madurez) + "</div>" +
        '<div class="tl-pt acc"><b>Hoy</b>Data Lake gobernado</div></div>';
    },
    steps: 2,
    notes: function () {
      var e = D.empresa;
      return "<p>RetailAndes es una cadena colombiana fundada en " + esc(e.sede) + " en " + e.fundacion + ": " + e.tiendas + " tiendas en " + e.ciudades + " ciudades, e-commerce desde " + e.ecommerceDesde + ", proveedores en " + e.paises.join(", ") + ", más de " + f0(e.empleados) + " empleados e ingresos superiores a COP " + f0(e.ingresosCOPM) + " M.</p>" +
        "<p>Desde " + e.crisisDesde + " está en crisis de competitividad. El diagnóstico de DataStrategos (1T-2026) concluyó que la causa es arquitectónica, no comercial ni logística. En el modelo de madurez está en " + esc(e.madurez) + " (Clase 6, diap. 9, citada en la especificación) y en el nivel de \"datos artesanales\" de la escalera data-driven (Clase 4 · Data-Driven, diap. 5).</p>" +
        '<p class="qa">Pregunta probable: ¿por qué es un problema de arquitectura? Porque decenas de millones de registros diarios viven en cinco silos sin integración, sin trazabilidad y sin gobierno.</p>';
    } },

  /* 4 ─ 5 problemas + costo de no actuar */
  { id: "s4", kicker: "Acto 1 · Problema", title: "Cinco fallas críticas y lo que cuesta no actuar", cite: "(Caso ConstructAndes, diap. 5 y 16)", src: "Informe v2 · tabla 10",
    render: function () {
      var na = D.noActuar, tot = na.max;
      var segs = [
        { n: "Agotados (rango bajo)", v: na.items[0].min, c: "#e66767" },
        { n: "Agotados (hasta el rango alto)", v: na.items[0].max - na.items[0].min, c: "url(#hatch)" },
        { n: na.items[1].nombre, v: na.items[1].min, c: "#d95926" },
        { n: na.items[2].nombre, v: na.items[2].min, c: "#c98500" },
        { n: na.items[3].nombre, v: na.items[3].min, c: "#9085e9" }
      ];
      var x = 0, rects = segs.map(function (s) { var w = s.v / tot * 100, r = '<rect x="' + x.toFixed(2) + '%" y="0" width="' + w.toFixed(2) + '%" height="100%" fill="' + s.c + '" stroke="#0F1623" stroke-width="2" data-tip="' + esc(s.n + ": COP " + f0(s.v) + " M") + '"/>'; x += w; return r; }).join("");
      return '<div class="fails">' + D.fallas.map(function (f) { return '<div class="fail"><span class="n">Falla ' + f.id + "</span>" + icon(f.icon, "big") + "<b>" + esc(f.corto) + "</b></div>"; }).join("") + "</div>" +
        '<div class="cost-strip step" data-step="1"><div><div class="lbl-sm">No actuar cuesta al año</div><div class="hero-num">COP <span class="counter" data-to="' + na.min + '">' + f0(na.min) + '</span>–<span class="counter" data-to="' + na.max + '">' + f0(na.max) + '</span> M</div><div class="lbl-sm">' + esc(na.pctIngresos) + " de los ingresos</div></div>" +
        '<div><svg width="100%" height="56" preserveAspectRatio="none" aria-label="Desglose del costo de no actuar"><defs><pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="10" height="10" fill="#4A2530"/><line x1="0" y1="0" x2="0" y2="10" stroke="#e66767" stroke-width="4"/></pattern></defs>' + rects + "</svg>" +
        '<div class="legend" style="margin-top:10px">' + na.items.map(function (it, i) { return '<span><i class="dot" style="background:' + ["#e66767", "#d95926", "#c98500", "#9085e9"][i] + '"></i>' + esc(it.nombre) + " " + (it.min === it.max ? f0(it.min) : f0(it.min) + "–" + f0(it.max)) + "</span>"; }).join("") + "</div></div></div>" +
        '<div class="step" data-step="1" style="margin-top:18px">' + team("Las pérdidas son " + esc(na.nota.toLowerCase())) + "</div>";
    },
    steps: 1,
    notes: function () {
      var na = D.noActuar;
      return "<p>El diagnóstico identificó cinco fallas: " + D.fallas.map(function (f) { return f.id + ") " + f.corto.toLowerCase(); }).join("; ") + ".</p>" +
        "<p>El statu quo cuesta entre COP " + f0(na.min) + " y " + f0(na.max) + " M al año (" + na.pctIngresos + " de los ingresos): margen perdido por agotados " + f0(na.items[0].min) + "–" + f0(na.items[0].max) + " (2% a 4% de ventas perdidas × 28% de margen; Gruen et al., 2002), exceso de inventario " + f0(na.items[1].min) + ", fuga en promociones " + f0(na.items[2].min) + " y trabajo manual " + f0(na.items[3].min) + " (40 analistas × 30% del tiempo).</p>" +
        "<p>El curso enseña que no actuar \"no es una opción neutral\" (Caso ConstructAndes, diap. 5) y que la primera pregunta del arquitecto es qué pasa si no hacemos nada (diap. 16).</p>" +
        '<p class="qa">Si cuestionan las cifras: son supuestos del equipo consultor, marcados para validar con Finanzas, Abastecimiento, Comercial y Gestión Humana. Aun así son conservadoras: IHL Group (2025) estima la distorsión de inventario en 6,5% de las ventas minoristas.</p>';
    } },

  /* 5 ─ Por qué Data Lake con gobierno */
  { id: "s5", kicker: "Acto 1 · Problema", title: "Por qué un Data Lake con gobierno", cite: "(Clase 9, diap. 20; Clase Big Data, diap. 13)", src: "Derivado del caso (validar con el equipo)",
    render: function () {
      var A = D.alternativas, map = { ok: "ok", mit: "mit", no: "no" }, lbl = { ok: "Sí", mit: "Parcial", no: "No" };
      var g = '<div class="alt-grid"><div class="h">Criterio</div>' + A.opciones.map(function (o) { return '<div class="h ' + o.id + '">' + esc(o.nombre) + "</div>"; }).join("");
      A.criterios.forEach(function (c) { g += "<div>" + esc(c.nombre) + "</div>" + A.opciones.map(function (o) { var v = c.v[o.id]; return '<div class="c ' + o.id + '"><span class="st ' + map[v] + '">' + icon(map[v]) + lbl[v] + "</span></div>"; }).join(""); });
      g += "</div>";
      return g + '<div class="callout" style="margin-top:22px">Solo el Data Lake gobernado cubre los cinco criterios, incluidos los datos de IoT y redes sociales.</div>' +
        '<div style="margin-top:16px">' + team("El informe no detalla alternativas descartadas: se derivaron del caso. Validar con el equipo antes de exponer.") + "</div>";
    },
    notes: function () {
      return "<p>Comparamos tres caminos. Seguir con bases de datos y Excel no resuelve ninguna falla. Una bodega de datos tradicional da una fuente única para datos estructurados, pero no acoge bien los datos no estructurados o semiestructurados de IoT y redes sociales, y el linaje y la latencia dependen de procesos adicionales. El Data Lake con gobierno guarda todo en formato abierto en tres zonas (raw, curated, consumption), combina batch y tiempo real según la arquitectura Lambda (Clase Big Data, diap. 13) y cumple los ocho criterios de un Data Lake exitoso (Clase 9, diap. 20).</p>" +
        "<p>El gobierno no es un complemento: \"la gobernanza no es opcional\" (Clase 9, diap. 20); sin él, el lago se vuelve un pantano de datos.</p>" +
        '<p class="qa">Nota: esta comparación de alternativas se derivó del caso porque el informe no la detalla. Si el jurado pregunta por un lakehouse: la propuesta ya lo es, porque BigLake + Iceberg + BigQuery dan SQL de bodega sobre el lago.</p>';
    } },

  /* 6 ─ Cómo decidimos y por qué GCP */
  { id: "s6", kicker: "Acto 2 · Decisión", title: "Cómo decidimos y por qué Google Cloud", cite: "(Clase 9, diap. 20; Clase 4 · Comparativa, diap. 17–18; Caso ConstructAndes, diap. 7)", src: "Informe v2 · tabla 7",
    render: function () {
      var s = scoresRef(), so = scoresO();
      var met = '<div class="steps-v">' + D.metodo.map(function (m, i) { return '<div class="mstep"><span class="n">' + (i + 1) + "</span><div><b>" + esc(m.paso) + "</b><span>" + esc(m.detalle) + "</span></div></div>"; }).join("") + "</div>";
      var chart = '<div class="chart-title">' + icon("chart") + "Puntaje ponderado (sobre 5) · el costo se recalcula en vivo</div>" + provBars(s, { max: 5, lw: "9.4em", vw: "10.5em", valueHtml: function (p) { return f2(s[p]) + dv(s[p], so[p], f2, true); } }) +
        '<div class="lbl-sm" style="margin-top:14px">' + icon("warn") + " " + esc(D.matriz.advertencia) + "</div>";
      var why = '<div class="tiles" style="grid-template-columns:repeat(2,1fr)">' + D.porQueGCP.map(function (r, i) { return '<div class="tile">' + icon(["target", "scale", "store", "flag"][i], "big") + '<span style="font-size:28px;font-weight:650">' + esc(r.texto) + '</span><span class="lbl-sm">(' + esc(r.cita) + ")</span></div>"; }).join("") + "</div>";
      return tabs("s6", [
        { k: "m", label: "Método y resultado", html: '<div class="row"><div style="width:620px">' + met + '</div><div class="card grow">' + chart + "</div></div>" },
        { k: "w", label: "Por qué GCP según el curso", html: why }
      ]);
    },
    notes: function () {
      var w = D.matriz.criterios.map(function (c) { return c.nombre + " " + c.peso + "%"; }).join(", ");
      return "<p>Método en cuatro pasos: los 10 criterios mínimos de la especificación; una carga idéntica para los cuatro (" + esc(D.carga.descripcion) + "); precios oficiales; y ponderación según las fallas del diagnóstico. Pesos: " + w + ". El puntaje de costo es 5 × costo mínimo / costo del proveedor.</p>" +
        "<p>Seguimos el marco del curso: ocho criterios de un Data Lake exitoso (Clase 9, diap. 20), ecosistema, competencias y costos a 3–5 años (Clase 4 · Comparativa, diap. 17), y criterios no negociables frente a criterios de preferencia (Caso ConstructAndes, diap. 7). Los cuatro proveedores cumplen los no negociables; GCP gana en las preferencias.</p>" +
        "<p>Por qué GCP según el curso: es el recomendado para Retail y E-commerce (Clase 4 · Comparativa, diap. 18). Azure solo ganaría si RetailAndes usara Microsoft 365, Active Directory o un ERP en Azure (Clase 9, diap. 19), y el caso no lo reporta. El caso de referencia, una cadena europea con BigQuery + IoT en Cloud Storage + Vertex AI (Clase 4 · Comparativa, diap. 14), es prácticamente nuestro TO-BE.</p>" +
        '<p class="qa">Advertencia honesta (auditoría): los puntajes 1–5 son juicio del equipo, sin una escala por nivel. Por eso en el dashboard (tecla D) se pueden mover los pesos y ver si cambia el ganador. Con el ecosistema al 25%, el informe reporta GCP ' + f2(D.matriz.sensEcosistema25Informe.gcp) + " frente a AWS " + f2(D.matriz.sensEcosistema25Informe.aws) + " y Azure " + f2(D.matriz.sensEcosistema25Informe.azure) + ". Condición de revisión: si aparece un Enterprise Agreement con Microsoft, se reevalúa.</p>";
    } },

  /* 7 ─ Comparación 1: almacenamiento e ingesta */
  { id: "s7", kicker: "Acto 2 · Comparación 1", title: "Almacenamiento e ingesta", cite: "(Clase 9, diap. 18; Clase 4 · Comparativa, diap. 4–5)", src: "Informe v2 · tablas 3, 4 y 6",
    render: function () {
      var c = ref(), R = D.rasgos;
      var sub = {}; P.forEach(function (p) { sub[p] = K.clase9Subset(c[p]); });
      var maxP = Math.max.apply(null, P.map(function (p) { return Math.max(sub[p], D.clase9.ref[p]); })) * 1.05;
      var alm = '<div class="row"><div class="card grow"><div class="chart-title">Precio de lista (US$/GB-mes)</div>' + provBars(R.precioGB, { vw: "4.5em", valueHtml: function (p) { return K.fmt(R.precioGB[p], 4); } }) + '</div><div class="card grow"><div class="chart-title">Costo mensual de 10 TB (US$)</div>' + costBars(scn(), "storage") + "</div></div>" +
        '<div class="card" style="margin-top:18px"><div class="chart-title">Almacenamiento + consulta: Clase 9, diap. 18 (gris, mar-2026) frente al informe (color, sep-2026)</div>' +
        pairedBars(P.map(function (p) { return { labelHtml: provLabel(p), a: D.clase9.ref[p], b: sub[p], colorB: PV[p].color, hi: p === "gcp", txt: "~" + f0(D.clase9.ref[p]) + " → " + f2(sub[p]), tip: D.clase9.servicios[p] }; }), { max: maxP, lw: "9.4em", vw: "8.5em" }) + "</div>";
      var ing = '<div class="card"><div class="chart-title">Costo mensual de ingesta (US$)</div>' + costBars(scn(), "ingest") + '</div><div style="margin-top:16px">' +
        featGrid([
          { label: "Streaming", v: { aws: "Kinesis / Firehose", azure: "Event Hubs", gcp: "Pub/Sub", oci: "Streaming" } },
          { label: "CDC", v: R.cdc },
          { label: "IoT gestionado", v: { aws: yesno(true, R.iotGestionado.aws), azure: yesno(true, R.iotGestionado.azure), gcp: yesno(false, "No"), oci: yesno(false, "No") } },
          { raw: scoreRow("ing") }
        ]) + "</div>" +
        '<div class="callout warn" style="margin-top:16px">' + icon("warn") + " Brecha de GCP: sin IoT gestionado desde ago-2023 → broker MQTT hacia Pub/Sub. A favor: Pub/Sub cobra por volumen y absorbe los picos.</div>";
      return tabs("s7", [{ k: "a", label: "Almacenamiento", html: alm }, { k: "i", label: "Ingesta", html: ing }]);
    },
    notes: function () {
      return "<p><b>Almacenamiento.</b> Los cuatro ofrecen objetos de alta durabilidad. GCP publica el menor precio estándar ($0,020/GB-mes) frente a $0,021 (Azure), $0,023 (AWS) y $0,0255 (OCI). Con 10.240 GB, GCP ahorra US$ 30,72/mes frente a AWS. La ventaja estratégica es el formato: BigLake + Iceberg hace que raw, curated y consumption sean tablas abiertas legibles por Spark y BigQuery sin copiar datos. El curso destaca de Cloud Storage su simplicidad y su integración nativa con BigQuery (Clase 4 · Comparativa, diap. 4).</p>" +
        "<p><b>Conciliación con la Clase 9, diap. 18.</b> " + esc(D.clase9.lectura) + " El orden GCP < Azure < AWS se conserva.</p>" +
        "<p><b>Ingesta.</b> AWS y Azure tienen IoT gestionado; Google retiró Cloud IoT Core en agosto de 2023, así que los sensores de bodega publican a Pub/Sub vía un broker MQTT. El curso caracteriza la ingesta de GCP por su simplicidad (Pub/Sub escala solo; Dataflow unifica batch y streaming) y la de AWS por requerir orquestar múltiples servicios (Clase 4 · Comparativa, diap. 5).</p>" +
        '<p class="qa">¿Por qué OCI sale ~175 en la clase y 417 aquí? Porque su almacenamiento de 10 TB ya cuesta ~US$ 261 con el precio de lista vigente y su SQL se cobra por hora encendida. Aun aceptando la cifra del curso, la diferencia con GCP no compensa su falta de linaje y su menor puntaje en gobernanza.</p>';
    } },

  /* 8 ─ Comparación 2 */
  { id: "s8", kicker: "Acto 2 · Comparación 2", title: "Procesamiento, orquestación, consultas e IA", cite: "(Clase 4 · Comparativa, diap. 7, 10 y 16; Clase 9, diap. 12 y 15)", src: "Informe v2 · tablas 3 y 4",
    render: function () {
      var R = D.rasgos;
      function feat(rows) { return '<div style="margin-top:16px">' + featGrid(rows) + "</div>"; }
      function bars(comp, title) { return '<div class="card"><div class="chart-title">' + title + "</div>" + costBars(scn(), comp) + "</div>"; }
      var proc = bars("proc", "Spark serverless, 1.200 vCPU-h (US$/mes)") +
        feat([{ label: "Servicio", v: { aws: state.corregidas ? "EMR Serverless (est.)" : "AWS Glue", azure: "Synapse Spark", gcp: "Managed Service for Apache Spark", oci: "Data Flow" } }, { label: "Precio unitario", v: R.precioSpark }, { raw: scoreRow("proc") }]) +
        '<div class="callout" style="margin-top:16px">GCP: Spark serverless a $0,06/DCU-h sin clústeres. OCI es más barato en cómputo puro, pero pierde en consulta y gobierno.</div>';
      var orch = '<div class="row"><div class="card grow"><div class="chart-title">Orquestador serverless (Fase 1, US$/mes)</div>' + costBars(scn(), "orch") + '</div><div class="card grow"><div class="chart-title">Si se usa Airflow gestionado (US$/mes)</div>' +
        provBars({ aws: D.sim.airflow.aws, azure: 0, gcp: D.sim.airflow.gcp, oci: 0 }, { vw: "4.5em", valueHtml: function (p) { return D.sim.airflow[p] ? f2(D.sim.airflow[p]) : "—"; } }) + "</div></div>" +
        '<div class="callout warn" style="margin-top:18px">' + icon("warn") + " Con Airflow gestionado desde el día 1, GCP pasa a ser el más caro. Por eso: Workflows + Scheduler en Fase 1 y Managed Service for Apache Airflow en Fase 2.</div>";
      var cons = bars("query", "Consultas SQL, 1 TB escaneado (US$/mes)") +
        feat([{ label: "Modelo de cobro", v: R.modeloSQL }, { label: "BI sin licencia", v: { aws: yesno(false), azure: yesno(false), gcp: yesno(true, "Looker Studio"), oci: yesno(false) } }, { raw: scoreRow("cons") }]) +
        '<div class="callout" style="margin-top:16px">BigQuery: 1 TiB gratis al mes, tableros sin licencia y nada que pagar cuando nadie consulta.</div>';
      var ia = bars("ai", "IA/ML, 40 h de piloto (US$/mes)") +
        feat([{ label: "Servicios", v: { aws: "SageMaker, Bedrock", azure: "Azure ML, Azure OpenAI", gcp: "Vertex AI, Gemini, BigQuery ML", oci: "Data Science, Generative AI" } }, { raw: scoreRow("ia") }]) +
        '<div class="callout" style="margin-top:16px">Paridad de capacidades en AWS, Azure y GCP. Diferencia de GCP: BigQuery ML pronostica la demanda (ARIMA_PLUS) con SQL.</div>';
      return tabs("s8", [{ k: "p", label: "Procesamiento", html: proc }, { k: "o", label: "Orquestación", html: orch }, { k: "c", label: "Consultas", html: cons }, { k: "a", label: "IA", html: ia }]);
    },
    notes: function () {
      return "<p><b>Procesamiento.</b> A igual capacidad (1.200 vCPU-h), el informe reporta US$ 22 (OCI), 76 (GCP), 132 (AWS Glue) y 166 (Synapse). Con la corrección E-04, AWS se compara con EMR Serverless: US$ 90,89 (estimación; validar con la calculadora). En Azure hay riesgo de hoja de ruta: Microsoft recomienda Fabric para nuevas cargas (Clase 4 · Comparativa, diap. 16).</p>" +
        "<p><b>Orquestación.</b> Los serverless nativos (Step Functions, Data Factory, Workflows) cuestan menos de US$ 6/mes. Airflow gestionado suma US$ 357,70 (MWAA) o 583,20 (Managed Service for Apache Airflow, antes Cloud Composer). El curso define la orquestación por sus pilares (Clase 9, diap. 12) y lista Workflows, Scheduler y Composer en GCP (diap. 15).</p>" +
        "<p><b>Consultas.</b> Es el componente más diferenciador. Athena, Synapse serverless y BigQuery cobran por dato escaneado; BigQuery añade 1 TiB gratis y Looker Studio sin licencia. OCI cobra por ECPU-hora encendida. El curso describe BigQuery como columnar, con separación entre almacenamiento y cómputo (Clase 4 · Comparativa, diap. 7).</p>" +
        "<p><b>IA.</b> Vertex AI unifica la IA de Google (Clase 4 · Comparativa, diap. 10). Con la corrección E-01, el piloto cuesta US$ 8,74 y no 17,48.</p>" +
        '<p class="qa">Si preguntan por Airflow: hoy son 60 pipelines diarios; un orquestador serverless basta. Airflow entra en Fase 2, cuando la escala lo justifique.</p>';
    } },

  /* 9 ─ Comparación 3: gobernanza y seguridad */
  { id: "s9", kicker: "Acto 2 · Comparación 3", title: "Gobernanza y seguridad", cite: "(Clase 9, diap. 4–7 y 10)", src: "Informe v2 · tablas 3 y 4",
    render: function () {
      var R = D.rasgos;
      var gob = '<div class="card"><div class="chart-title">Gobernanza (US$/mes)</div>' + costBars(scn(), "gov") + '</div><div style="margin-top:16px">' +
        featGrid([{ label: "Servicios necesarios", v: { aws: String(R.serviciosGob.aws), azure: String(R.serviciosGob.azure), gcp: String(R.serviciosGob.gcp), oci: String(R.serviciosGob.oci) } }, { label: "Linaje", v: R.linaje }, { raw: scoreRow("gob") }]) + "</div>" +
        '<div class="callout" style="margin-top:16px">Knowledge Catalog (antes Dataplex Universal Catalog): catálogo, linaje automático y calidad en un solo servicio.</div>';
      var seg = '<div class="card"><div class="chart-title">Seguridad (US$/mes)' + (state.normSec ? ' · <span style="color:var(--badge-ink)">normalizada (E-03)</span>' : " · sin normalizar: la carga no es equivalente (activa “Normalizar seguridad”, tecla S)") + "</div>" + costBars(scn(), "sec") + '</div><div style="margin-top:16px">' +
        featGrid([{ label: "Detección de amenazas", v: R.deteccion }, { label: "Región / residencia", v: R.region }, { raw: scoreRow("seg") }]) + "</div>" +
        '<div class="callout" style="margin-top:16px">Ventaja de GCP: VPC Service Controls contra la exfiltración + federación con el directorio corporativo existente.</div>';
      return tabs("s9", [{ k: "g", label: "Gobernanza", html: gob }, { k: "s", label: "Seguridad", html: seg }]);
    },
    notes: function () {
      return "<p><b>Gobernanza</b> es el criterio más importante para una organización en Nivel 1. Knowledge Catalog registra linaje automático para BigQuery, Spark, Dataflow y Airflow y ejecuta reglas de calidad y perfilado; su límite es que retiene el linaje 30 días, y se mitiga exportándolo a BigQuery. Purview cobra US$ 0,50 por activo gobernado: US$ 300/mes con 300 elementos críticos y calidad. AWS reparte el gobierno en cuatro servicios (Lake Formation, Glue Catalog, DataZone y Glue Data Quality). OCI Data Catalog no reporta linaje nativo.</p>" +
        "<p>El curso califica a Dataplex (hoy Knowledge Catalog) como una de las propuestas más modernas porque unifica gobernanza, calidad y seguridad con linaje automático (Clase 9, diap. 5); de Purview destaca el linaje visual y la integración con Microsoft 365 (diap. 4).</p>" +
        "<p><b>Seguridad.</b> Los cuatro cifran en reposo y en tránsito. AWS (GuardDuty + Macie) y Azure (Defender) tienen detección de amenazas más madura en su nivel de entrada; en GCP la detección avanzada requiere SCC Premium. La auditoría (E-03) señala que la carga no es equivalente: con seguridad normalizada, AWS queda en US$ 5,94 y Azure en 3,00. Los controles de GCP coinciden con la Clase 9, diap. 10 (IAM con mínimo privilegio, CMEK y VPC SC) bajo Zero Trust (diap. 7).</p>" +
        '<p class="qa">Si preguntan por la región: OCI es el único con región en Bogotá (desde dic-2023) y AWS tiene una Local Zone en Bogotá. Usamos us-east1: EE. UU. es país adecuado según la SIC. Detalle legal en el respaldo B3.</p>';
    } },

  /* 10 ─ AS-IS */
  { id: "s10", kicker: "Acto 2 · Arquitectura", title: "AS-IS: cinco silos sin integración", cite: "(Clase 4 · Data-Driven, diap. 5)", src: "Informe v2 · figura 2",
    render: function () {
      var inter = '<div class="asis"><div class="silos">' + D.silos.map(function (s) {
        return '<div class="silo ' + (state.sel.asis === s.id ? "sel" : "") + '" data-silo="' + s.id + '" tabindex="0">' + icon(s.icon, "big") + "<b>" + esc(s.nombre) + '</b><div class="st-ic">' + icon(s.almIcon) + "</div></div>";
      }).join("") + '</div><div class="norepo">' + icon("x") + " Repositorio central / fuente única de verdad: NO EXISTE</div>" +
        '<div class="asis-bottom"><div><div class="lbl-sm" style="margin-bottom:10px">Cada área con sus propias cifras en Excel</div><div class="areas">' + D.areasConsumidoras.map(function (a) { return '<div class="area">' + icon("user") + esc(a) + icon("sheet") + "</div>"; }).join("") + '</div></div><div class="detail" data-asisout>' + asisDetail() + "</div></div></div>";
      var img = '<div class="imgbox" style="height:610px"><img src="assets/as-is.png" alt="Diagrama AS-IS original del informe"></div>';
      return tabs("s10", [{ k: "i", label: "Interactivo", html: inter }, { k: "o", label: "Imagen original del informe", html: img }]);
    },
    notes: function () {
      return "<p>El AS-IS muestra cinco sistemas de origen, cada uno con su propio almacenamiento: POS en bases relacionales por región o tienda; e-commerce en una BD transaccional con logs; el ERP en una BD relacional con exportes a Excel; IoT en archivos planos en servidores locales; y redes sociales en descargas manuales. No hay conexiones entre ellos ni un repositorio central.</p>" +
        "<p>Cada área consumidora (Comercial, Finanzas, Logística, Marketing, Operaciones) arma sus cifras en Excel. Eso explica las cinco fallas: cifras contradictorias, ausencia de gobierno, almacenamiento heterogéneo, sin linaje y 4 a 7 días de latencia. Es el Nivel 1 de \"datos artesanales\" (Clase 4 · Data-Driven, diap. 5).</p>" +
        '<p class="qa">Interacción: pasar el cursor o hacer clic sobre cada silo muestra sus datos, su almacenamiento y las fallas que agrava. La pestaña "Imagen original" muestra la figura del informe.</p>';
    } },

  /* 11 ─ TO-BE */
  { id: "s11", kicker: "Acto 2 · Arquitectura", title: "TO-BE: Data Lake gobernado sobre Google Cloud", cite: "(Clase 9, diap. 20; Caso ConstructAndes, diap. 10; Clase Big Data, diap. 13)", src: "Informe v2 · figura 3 y sección 6.3",
    render: function () {
      var T = D.tobe, cmp = {}; T.componentes.forEach(function (c) { cmp[c.id] = c; });
      function box(id, inner) { var c = cmp[id]; return '<div class="tb-comp ' + (state.sel.tobe === id ? "sel" : "") + '" data-tobe="' + id + '" tabindex="0"><div class="hd"><span class="n">' + c.n + "</span>" + esc(c.nombre) + "</div>" + inner + "</div>"; }
      var arrow = '<div class="arrow">' + icon("arrow") + "</div>";
      var main = '<div class="tobe-main"><div class="tb-src"><b>Fuentes</b>' + D.silos.map(function (s) { return "<div>" + icon(s.icon) + esc(s.nombre.replace(" de inventario", "").replace(" de bodegas", "")) + "</div>"; }).join("") + "</div>" + arrow +
        box("ing", '<div class="svc">Pub/Sub · Spark JDBC</div><div class="svc">Datastream (Fase 2)</div><div class="svc">Storage Transfer</div>') + arrow +
        box("alm", '<div class="svc">Cloud Storage + BigLake</div><span class="zone raw">raw</span><span class="zone cur">curated</span><span class="zone con">consumption</span>') + arrow +
        box("proc", '<div class="svc">Spark serverless</div><div class="svc">Dataflow</div><div class="svc">Reglas de calidad</div>') + arrow +
        box("cons", '<div class="svc">BigQuery · Looker Studio</div><div class="svc">BigQuery ML</div><div class="svc">Vertex AI + Gemini</div>') + "</div>";
      var bands = '<div class="tb-band gob ' + (state.sel.tobe === "gob" ? "sel" : "") + '" data-tobe="gob" tabindex="0"><span class="n">5</span><b>Gobernanza</b> Knowledge Catalog · SDP</div>' +
        '<div class="tb-band seg ' + (state.sel.tobe === "seg" ? "sel" : "") + '" data-tobe="seg" tabindex="0">' + icon("shield") + "<b>Seguridad</b> IAM + WIF · CMEK · VPC SC · SCC</div>" +
        '<div class="tb-band orq ' + (state.sel.tobe === "orq" ? "sel" : "") + '" data-tobe="orq" tabindex="0">' + icon("gear") + "<b>Orquestación</b> Workflows + Scheduler · Airflow (F2)</div>";
      var inter = '<div class="tobe">' + main + '<div class="tobe-lower"><div class="col" style="gap:12px">' + bands + '<div class="lbl-sm">' + icon("search") + ' Clic en cada componente: servicios, falla que resuelve y costo.</div></div><div class="detail" data-tobeout>' + tobeDetail() + "</div></div></div>";
      var traz = '<table class="t"><tr><th>Falla</th><th>Respuesta de la arquitectura</th><th>Indicador</th></tr>' + D.trazabilidad.map(function (t) { return "<tr><td><b>" + t.falla + ".</b> " + esc(D.fallas[t.falla - 1].corto) + "</td><td>" + esc(t.respuesta) + "</td><td>" + esc(t.indicador) + "</td></tr>"; }).join("") + "</table>";
      var img = '<div class="imgbox" style="height:610px"><img src="assets/to-be.png" alt="Diagrama TO-BE original del informe"></div>';
      return tabs("s11", [{ k: "i", label: "Interactivo", html: inter }, { k: "t", label: "Trazabilidad falla → solución", html: traz }, { k: "o", label: "Imagen original del informe", html: img }]);
    },
    notes: function () {
      return "<p>El TO-BE tiene cinco componentes. (1) Ingesta: Pub/Sub en streaming para ventas, e-commerce e IoT (vía broker MQTT), Spark JDBC/API en batch para el ERP y las redes, Datastream para CDC en Fase 2 y Storage Transfer para archivos. (2) Almacenamiento: Cloud Storage + BigLake con tablas Iceberg en tres zonas, como las Bronze, Silver y Gold de ConstructAndes (Caso ConstructAndes, diap. 10). (3) Procesamiento: Managed Service for Apache Spark (antes Dataproc Serverless) y Dataflow; un dato solo se promueve de zona si pasa la calidad. (4) Consulta e IA: BigQuery, Looker Studio, BigQuery ML y Vertex AI + Gemini. (5) Gobernanza: Knowledge Catalog + Sensitive Data Protection.</p>" +
        "<p>Capas transversales: seguridad (IAM + Workforce Identity Federation, KMS con CMEK, VPC Service Controls, SCC y Audit Logs) y orquestación (Workflows + Scheduler en Fase 1, Managed Service for Apache Airflow en Fase 2, Cloud Monitoring). Combina batch y tiempo real según la arquitectura Lambda (Clase Big Data, diap. 13) y cubre los ocho criterios de la Clase 9, diap. 20.</p>" +
        '<p class="qa">La pestaña de trazabilidad conecta cada falla con su respuesta y su indicador: es la prueba de que la arquitectura responde al diagnóstico y no es genérica.</p>';
    } },

  /* 12 ─ Cuadro comparativo de costos */
  { id: "s12", kicker: "Acto 2 · Costos", title: "Cuadro comparativo de costos por componente", cite: "(Clase 9, diap. 18)", src: "Informe v2 · tablas 4 y 6",
    render: function () {
      var c = ref(), o = refO(), sh = {}, sho = {};
      P.forEach(function (p) { sh[p] = K.share(c[p].storage, c[p].total); sho[p] = K.share(o[p].storage, o[p].total); });
      var lo = f0(Math.min(sh.aws, sh.gcp)), hi = f0(Math.max(sh.aws, sh.gcp));
      var share = '<div class="lbl-sm" style="margin-top:10px">' + icon("db") + " El almacenamiento pesa ≈ " + (lo === hi ? lo : lo + "–" + hi) + "% del total en AWS y GCP (AWS " + f1(sh.aws) + "%" + dv(sh.aws, sho.aws, f1, true, idsTot(scn(), ["aws"])) + ", GCP " + f1(sh.gcp) + "%" + dv(sh.gcp, sho.gcp, f1, true, idsTot(scn(), ["gcp"])) + ") · 10 TB + 1 TB/mes</div>";
      var sub = {}; P.forEach(function (p) { sub[p] = K.clase9Subset(c[p]); });
      var maxP = Math.max.apply(null, P.map(function (p) { return Math.max(sub[p], D.clase9.ref[p]); })) * 1.05;
      var conc = '<div class="card"><div class="chart-title">Almacenamiento + consulta: Clase 9 (gris) frente al informe (color), US$/mes</div>' +
        pairedBars(P.map(function (p) { return { labelHtml: provLabel(p, true), a: D.clase9.ref[p], b: sub[p], colorB: PV[p].color, hi: p === "gcp", txt: "~" + f0(D.clase9.ref[p]) + " → " + f2(sub[p]), tip: D.clase9.servicios[p] }; }), { max: maxP, vw: "8.5em" }) + "</div>" +
        '<div class="callout" style="margin-top:18px">' + esc(D.clase9.lectura) + "</div>" +
        '<div class="lbl-sm" style="margin-top:14px">En Data Lakes maduros: procesamiento ' + D.distribucionMadura.procesamiento + "%, almacenamiento " + D.distribucionMadura.almacenamiento + "%, transferencias " + D.distribucionMadura.transferencias + "%, consultas " + D.distribucionMadura.consultas + "% (Clase 4 · Comparativa, diap. 11).</div>";
      return tabs("s12", [{ k: "t", label: "Costos por componente (USD/mes)", html: '<div class="tight">' + costTable(scn(), {}) + "</div>" + share }, { k: "c", label: "Conciliación con la Clase 9", html: conc }]);
    },
    notes: function () {
      var t = D.totalesInforme;
      return "<p>Con la carga de referencia, el orden del informe es GCP (US$ " + f2(t.gcp) + "), OCI (" + f2(t.oci) + "), AWS (" + f2(t.aws) + ") y Azure (" + f2(t.azure) + "). En pesos (TRM " + K.fmt(TRM, 2) + "): 1,22 / 1,59 / 1,68 / 2,53 millones al mes. A 36 meses, GCP suma US$ " + f0(D.totales36Informe.gcp) + ".</p>" +
        "<p>De dónde viene la diferencia: almacenamiento (precio por GB × 10.240 GB), procesamiento (Spark a $0,06/DCU-h), consulta (1 TiB gratis en BigQuery frente a OCI por hora encendida) y gobernanza (Purview US$ 300 en Azure).</p>" +
        "<p>Con el interruptor en \"Corregidas\": E-01 baja la IA de GCP a 8,74 (total 370,26) y E-04 baja el procesamiento de AWS a 90,89 (total 481,95), con lo que AWS pasa al segundo lugar, por debajo de OCI. GCP sigue primero. Con seguridad normalizada (E-03), AWS queda en 419,45 y Azure en 759,70.</p>" +
        '<p class="qa">La infraestructura no es el factor decisivo: incluso Azure es menos del 0,01% de los ingresos. La diferencia GCP–Azure a 60 meses es de US$ ' + f0(D.financiero.difGcpAzure60mInforme) + ", menos del 1% de la inversión total. Todos los valores deben validarse con la calculadora oficial (Clase 9, diap. 18).</p>";
    } },

  /* 13 ─ Simulador */
  { id: "s13", kicker: "Acto 2 · Costos", title: "Simulador: ¿y si cambia la carga?", cite: "(Clase 9, diap. 18; Clase 4 · Comparativa, diap. 11)", src: "Informe v2 · tabla 5 (sensibilidad)",
    render: function () {
      return '<div class="sim"><div class="sim-ctl">' + simControls() + '</div><div class="sim-out"><div class="callout warn sim-alert" data-simout="alert"></div>' +
        "<div>" + legendComps() + '<div style="margin-top:8px" data-simout="bars"></div></div>' +
        '<div class="row" style="gap:20px"><div class="grow"><div class="lbl-sm" style="margin-bottom:6px">Ranking (US$/mes · puntaje) · clic para ver el detalle</div>' + rankHTML() + '</div><div class="detail" style="width:400px" data-simout="detail"></div></div>' + simNote() + "</div></div>";
    },
    after: function () { refreshDynamic(); },
    notes: function () {
      var v = D.verificacion.simulador;
      return "<p>El simulador aplica las fórmulas del informe sobre la carga de referencia. Pruebas del informe (tabla 5): con 10 TB escaneados, GCP " + f2(v[0].esperado.gcp) + " frente a AWS " + f2(v[0].esperado.aws) + "; con 20 TB almacenados, GCP " + f2(v[1].esperado.gcp) + " frente a OCI " + f2(v[1].esperado.oci) + "; con Airflow gestionado, GCP sube a " + f2(v[2].esperado.gcp) + " y gana OCI (" + f2(v[2].esperado.oci) + ").</p>" +
        "<p>Demostración sugerida: subir los TB almacenados (GCP sigue ganando), luego activar Airflow (aparece la alerta de cambio de ganador) y explicar por qué la Fase 1 usa Workflows + Scheduler. Mover las horas del SQL de OCI muestra el efecto del cobro por tiempo encendido.</p>" +
        '<p class="qa">' + esc(D.meta.notaPrecios) + ". El ranking muestra también el puntaje de la matriz recalculado con los costos simulados.</p>";
    } },

  /* 14 ─ Qué dejas de atender */
  { id: "s14", kicker: "Acto 2 · Riesgos", title: "Qué dejas de atender con cada proveedor", cite: "(Clase 4 · Comparativa, diap. 5 y 16; Clase 9, diap. 19)", src: "Informe v2 · secciones 5.4 y 5.6",
    render: function () { return provsel() + '<div style="margin-top:16px;height:calc(100% - 70px)" data-gapsout="slide">' + gapsSlideOut() + "</div>"; },
    notes: function () {
      return "<p>Ningún proveedor es perfecto; la pregunta es qué dejamos sin atender y cuánto cuesta mitigarlo. Con GCP: sin IoT gestionado (broker MQTT hacia Pub/Sub), sin región en Colombia (región en EE. UU., contrato de transmisión y CMEK), linaje retenido 30 días (exportación a BigQuery), menos talento certificado (plan de certificación y socio, COP 40 M en Fase 1), detección avanzada solo con SCC Premium y Airflow caro (se pospone a Fase 2).</p>" +
        "<p>AWS reparte el gobierno en cuatro servicios y tiene precios difíciles de estimar (Clase 4 · Comparativa, diap. 5 y 16). Azure es el más caro, cobra por activo gobernado y está en transición de Synapse a Fabric; su ventaja (Microsoft 365, ERP en Azure) no aparece en el caso (Clase 9, diap. 19). OCI cobra el SQL por hora encendida y no tiene linaje nativo: la falla 4 queda sin atender.</p>" +
        '<p class="qa">El semáforo es una valoración del equipo derivada del informe: verde = atendida, amarillo = atendida con mitigación, rojo = sin atender. Los costos de mitigación que el informe no estima aparecen como "Por definir".</p>';
    } },

  /* 15 ─ Costos de GCP */
  { id: "s15", kicker: "Acto 2 · Costos", title: "Costo mensual de Google Cloud, desglosado", cite: "(Clase 9, diap. 18)", src: "Informe v2 · Anexo A.1",
    render: function () {
      var c = ref(), o = refO(), g = c.gcp, lines = D.lineas.gcp, prev = null;
      var rows = lines.map(function (l) {
        var first = l.comp !== prev; prev = l.comp;
        var corr = l.correccion && state.corregidas && D.correcciones[l.correccion].prov === "gcp";
        var val = corr ? D.correcciones[l.correccion].corregido : l.usd;
        var sup = corr && l.supuestoCorregido ? l.supuestoCorregido : l.supuesto;
        return '<tr data-tip="' + esc(l.servicio + " · " + sup) + '"><td>' + (first ? esc(CN[l.comp]) : "") + "</td><td>" + esc(l.corto || l.servicio) + '</td><td class="n">' + f2(val) + (corr ? badge([l.correccion], f2(l.usd), true) : "") + "</td></tr>";
      }).join("");
      var tbl = '<table class="t"><tr><th>Componente</th><th>Servicio (pasa el cursor: supuesto)</th><th class="n">US$/mes</th></tr>' + rows + '<tr class="tot"><td colspan="2">Total mensual</td><td class="n">' + cv(scn(), "gcp", "total", true) + "</td></tr></table>";
      var rk = K.ranking(c), second = rk[rk[0] === "gcp" ? 1 : 0], pct = -K.pctDiff(g.total, c[second].total), pcto = -K.pctDiff(o.gcp.total, o[K.ranking(o)[1]].total);
      var right = '<div class="card hi" style="padding:16px 22px"><div class="lbl-sm">Total mensual</div><div class="big-num" style="font-size:50px">US$ ' + f2(g.total) + badge(K.correccionesAplicadas(D, scn()).gcp.total, f2(o.gcp.total), "m") + '</div><div class="lbl-sm" style="margin-top:6px">≈ COP ' + f2(g.total * TRM / 1e6) + " M/mes · 36 meses: US$ " + f0(g.total * 36) + '</div><div style="margin-top:4px">' + f1(pct) + "% menos que " + esc(PV[second].nombre) + ", el segundo" + dv(pct, pcto, f1, true, idsTot(scn(), ["gcp", second])) + "</div></div>" +
        '<div class="card compact-bars" style="margin-top:10px;padding:12px 22px" aria-label="Costo de GCP por componente, US$/mes">' +
        hbars(K.COMPS.slice().sort(function (a, b) { return g[b] - g[a]; }).map(function (k) { return { label: CN[k], value: g[k], color: CC[k], valueHtml: f2(g[k]) }; }), { lw: "7.6em", vw: "4.2em" }) + "</div>";
      return '<div class="row"><div style="width:860px" class="tight">' + tbl + '</div><div class="grow">' + right + '</div></div><div class="note-fixed" style="margin-top:10px">' + icon("calendar") + " " + esc(D.meta.notaPrecios) + ".</div>";
    },
    notes: function () {
      var l = D.lineas.gcp;
      return "<p>Desglose de GCP (Anexo A.1): " + l.map(function (x) { return esc(x.servicio) + " (" + esc(x.supuesto) + ") = " + f2(x.usd); }).join("; ") + ". Total US$ " + f2(D.totalesInforme.gcp) + " ≈ COP 1,22 M al mes con TRM " + K.fmt(TRM, 2) + " (" + esc(D.meta.trmFecha) + ").</p>" +
        "<p>Las consultas cuestan cero porque 0,91 TiB caben en el TiB gratuito mensual de BigQuery. Sin esa capa gratuita, el total sería 384,68. Con la corrección E-01, Vertex AI cuesta 40 h × 0,2185 = 8,74 y el total baja a 370,26.</p>" +
        '<p class="qa">' + esc(D.meta.notaPrecios) + ". No incluyen IVA, descuentos por compromiso, créditos ni transferencia de salida.</p>";
    } },

  /* 16 ─ Hoja de ruta */
  { id: "s16", kicker: "Acto 3 · Plan", title: "Hoja de ruta: tres sprints-incrementos en 24 semanas", cite: "(Clase 4 · Scrum, diap. 6–7; Clase 4 · Comparativa, diap. 20)", src: "Informe v2 · sección 6.5 y tabla 19",
    render: function () {
      var R = D.roadmap, axis = '<div class="road-axis"><div style="border:0"></div>';
      for (var i = 0; i < 6; i++) axis += "<div>Sem. " + (i * 4 + 1) + "–" + (i * 4 + 4) + "</div>";
      axis += '<div style="border:0"></div></div>';
      var row = '<div class="road-row"><div class="gate">' + icon("flag") + "<b>" + esc(R.compuertas[0].nombre) + "</b>" + esc(R.compuertas[0].detalle) + "</div>" +
        R.sprints.map(function (s) { return '<div class="sprint" style="grid-column:span 2"><b style="font-size:30px">Sprint ' + s.n + " · " + esc(s.nombre) + '</b><span class="lbl-sm">Semanas ' + s.semanas[0] + "–" + s.semanas[1] + " · COP " + f1(s.costoCOPM) + ' M</span><div class="it"><span>Iteración 1</span><span>Iteración 2</span></div></div>'; }).join("") +
        '<div class="gate">' + icon("flag") + "<b>" + esc(R.compuertas[1].nombre) + "</b>" + esc(R.compuertas[1].detalle) + "</div></div>";
      var del = '<div class="road-row"><div></div>' + R.sprints.map(function (s) { return '<div class="step" data-step="' + s.n + '" style="grid-column:span 2;padding:0 6px"><div class="chips">' + s.entregables.map(function (e) { return '<span class="chip">' + esc(e) + "</span>"; }).join("") + "</div></div>"; }).join("") + "<div></div></div>";
      return '<div class="road">' + axis + row + del + '<div class="lbl-sm" style="margin-top:6px">' + icon("calendar") + " " + esc(R.nota) + " Fase 1: COP " + f1(R.fase1COPM) + " M.</div></div>";
    },
    steps: 3,
    notes: function () {
      var R = D.roadmap;
      return "<p>La especificación pide tres sprints. Los presentamos como tres sprints-incrementos; cada uno se ejecuta en dos iteraciones de cuatro semanas (24 semanas), porque Scrum limita un sprint a un mes (Clase 4 · Scrum, diap. 6) y agrupa el trabajo en incrementos funcionales (diap. 7).</p>" +
        R.sprints.map(function (s) { return "<p><b>Sprint " + s.n + " (semanas " + s.semanas[0] + "–" + s.semanas[1] + "), " + esc(s.nombre.toLowerCase()) + ":</b> " + s.entregables.map(esc).join("; ") + ". Costo: COP " + f1(s.costoCOPM) + " M.</p>"; }).join("") +
        '<p class="qa">Compuertas: antes del Sprint 1, la prueba de concepto (3 semanas, COP 66,5 M). Al mes 6, la Fase 1 se aprueba como completa si se cumplen al menos 10 de los 12 indicadores; al mes 12, si los beneficios medidos están por debajo del 70% del plan, se congela la ampliación del equipo. El primer caso de uso es el pronóstico de demanda, el caso acotado de alto valor que el curso recomienda (Clase 4 · Comparativa, diap. 20).</p>';
    } },

  /* 17 ─ Modelo de gobierno */
  { id: "s17", kicker: "Acto 3 · Gobierno", title: "Modelo de gobierno de datos: Fase 1", cite: "(Clase 2 · DAMA, diap. 5; Clase 9, diap. 2)", src: "Informe v2 · secciones 10.2–10.5",
    render: function () {
      var G = D.gobierno, r = G.roles;
      function ob(x, top) { return '<div class="orgbox ' + (top ? "top" : "") + '" data-tip="' + esc(x.hace) + '"><b>' + esc(x.rol) + "</b><span>" + esc(x.quien) + "</span></div>"; }
      var roles = '<div class="org"><div class="lvl">' + ob(r[0], true) + '</div><div class="lvl">' + ob(r[1]) + '</div><div class="lvl">' + ob(r[2]) + ob(r[3]) + ob(r[4]) + '</div><div class="lvl">' + ob(r[5]) + '</div><div class="lbl-sm">Pasa el cursor sobre cada rol para ver sus responsabilidades.</div></div>';
      var dom = '<div class="row"><div class="grow"><div class="chart-title">Dominios y Data Owners</div><div class="tiles" style="grid-template-columns:1fr 1fr;gap:12px">' + G.dominios.map(function (d) { return '<div class="tile" style="padding:12px 18px"><b>' + esc(d.dominio) + '</b><span class="lbl-sm">Owner: ' + esc(d.area) + "</span></div>"; }).join("") + '</div></div><div style="width:620px"><div class="chart-title">Fuentes críticas</div><table class="t"><tr><th>Fuente</th><th>Criticidad</th><th>Datos personales</th></tr>' +
        G.fuentes.map(function (f) { return "<tr><td>" + esc(f.fuente) + "</td><td>" + esc(f.criticidad) + "</td><td>" + esc(f.pii) + "</td></tr>"; }).join("") + "</table></div></div>";
      var lin = '<div class="chart-title">Lineamientos</div><div class="chips">' + G.lineamientos.map(function (l) { return '<span class="chip">' + icon("check") + esc(l) + "</span>"; }).join("") + '</div><div class="chart-title" style="margin-top:24px">Políticas de calidad (umbral Fase 1)</div><div class="tiles" style="grid-template-columns:repeat(3,1fr);gap:12px">' +
        G.calidad.map(function (q) { return '<div class="tile" style="padding:12px 18px"><span class="lbl-sm">' + esc(q.dim) + '</span><b style="font-size:32px">' + esc(q.umbral) + "</b></div>"; }).join("") + "</div>";
      return tabs("s17", [{ k: "r", label: "Roles", html: roles }, { k: "d", label: "Dominios y fuentes", html: dom }, { k: "l", label: "Lineamientos y calidad", html: lin }]);
    },
    notes: function () {
      var G = D.gobierno;
      return "<p>La estructura sigue DMBOK2 (pp. 76–78): " + G.roles.map(function (r) { return "<b>" + esc(r.rol) + "</b> (" + esc(r.quien) + "): " + esc(r.hace.toLowerCase()); }).join("; ") + ".</p>" +
        "<p>Dominios y dueños: " + G.dominios.map(function (d) { return esc(d.area) + " → " + esc(d.dominio.toLowerCase()); }).join("; ") + ". Fuentes críticas: " + G.fuentes.map(function (f) { return esc(f.fuente) + " (" + esc(f.criticidad.toLowerCase()) + ", PII: " + esc(f.pii.toLowerCase()) + ")"; }).join("; ") + ".</p>" +
        "<p>Los lineamientos cubren los cuatro pilares del curso: descubrimiento, clasificación, acceso y calidad (Clase 9, diap. 2). El gobierno se entiende como \"el ejercicio de la autoridad, el control y la toma de decisiones sobre los activos de datos\" (Clase 2 · DAMA, diap. 5). Calidad: datos completos, precisos, consistentes y actualizados (Clase 2 · DAMA, diap. 12).</p>" +
        '<p class="qa">Si preguntan quién paga: los Owners (5% del tiempo), Stewards (25%) y Custodians (30%) son personal actual; su tiempo está valorado en el modelo financiero.</p>';
    } },

  /* 18 ─ Indicadores Nivel 1 */
  { id: "s18", kicker: "Acto 3 · Métricas", title: "Indicadores del Nivel 1: de la línea base a la meta del mes 6", cite: "(Clase 6, diap. 11 — pendiente; Clase 4 · Estrategia, diap. 5)", src: "Informe v2 · sección 10.6",
    render: function () {
      var r = D.reglaNivel1;
      return '<div class="callout" style="margin-bottom:16px">' + icon("target") + " Nivel 1 completo = al menos <b>" + r.cumplir + " de " + r.de + "</b> indicadores cumplidos al mes 6. Hoy: todos en cero o sin medición.</div>" +
        '<div class="kpigrid">' + D.indicadores.map(function (k) {
          return '<div class="kpit"><div class="nm"><i>' + k.n + "</i>" + esc(k.nombre) + '</div><div class="bm"><span class="st no" data-tip="Línea base (hoy)">' + icon("no") + esc(k.base) + '</span><span class="muted">' + icon("arrow") + '</span><span class="st ok" data-tip="Meta al mes 6">' + icon("flag") + esc(k.meta) + "</span></div></div>";
        }).join("") + '</div><div style="margin-top:16px">' + team(esc(D.notaClase6)) + "</div>";
    },
    notes: function () {
      return "<p>Los 12 indicadores miden si las capacidades básicas del Nivel 1 quedaron establecidas de forma formal y sostenible: " + D.indicadores.map(function (k) { return k.n + ") " + esc(k.nombre.toLowerCase()) + ": " + esc(k.base) + " → " + esc(k.meta); }).join("; ") + ".</p>" +
        "<p>Regla: cumplir al menos 10 de 12 al mes 6 permite declarar el Nivel 1 completo y aprobar la Fase 2. Se diseñaron con las características de un buen KPI: medible, alineado, comprensible, comparable y orientado a decisiones (Clase 4 · Estrategia, diap. 5). El indicador \"KPIs desde fuente única\" mide si los datos realmente deciden algo (Clase 4 · Data-Driven, diap. 2 y 10).</p>" +
        '<p class="qa">Transparencia: el informe no tuvo acceso a la Clase 6 (diap. 9–11) y usó DMBOK2 (pp. 510–511) como sustituto. Antes de exponer, el equipo debe cotejar estos indicadores con la Clase 6, diap. 11 (nota visible; se oculta con H).</p>';
    } },

  /* 19 ─ Cierre */
  { id: "s19", kicker: "Cierre", title: "Propuesta de valor y decisiones que pedimos", cite: "(Caso ConstructAndes, diap. 13 y 15)", src: "Informe v2 · secciones 1, 9.7 y 11",
    render: function () {
      var c = ref(), o = refO(), g = c.gcp.total;
      var pa = -K.pctDiff(g, c.aws.total), pz = -K.pctDiff(g, c.azure.total), pao = -K.pctDiff(o.gcp.total, o.aws.total), pzo = -K.pctDiff(o.gcp.total, o.azure.total);
      var F = D.financiero;
      var left = '<div class="vprop"><div class="v">' + icon("clock") + "<div><b>Una sola cifra de ventas e inventario</b><br><span class=\"muted\">de 4–7 días a menos de 24 horas</span></div></div>" +
        '<div class="v">' + icon("gov") + "<div><b>Gobierno con linaje y calidad</b><br><span class=\"muted\">desde el primer sprint</span></div></div>" +
        '<div class="v">' + icon("coin") + "<div><b>US$ " + cv(scn(), "gcp", "total") + "/mes</b><br><span class=\"muted\">" + f0(pa) + "% menos que AWS" + dv(pa, pao, f0, true, idsTot(scn(), ["gcp", "aws"])) + " · " + f0(pz) + "% menos que Azure" + dv(pz, pzo, f0, true, idsTot(scn(), ["gcp", "azure"])) + "</span></div></div>" +
        '<div class="callout warn">Crea valor si se ejecuta: requiere capturar al menos <b>COP ' + f0(F.umbralBeneficio) + " M al año</b> en beneficios.</div></div>";
      var right = '<div class="decis">' + D.decisiones.map(function (d) { return '<div class="d step" data-step="' + d.n + '"><span class="n">' + d.n + "</span><div><b>" + esc(d.texto) + "</b>" + (d.monto ? '<br><span class="muted">' + esc(d.monto) + "</span>" : "") + "</div></div>"; }).join("") + "</div>";
      return '<div class="row" style="gap:50px;height:100%;align-items:center"><div class="grow">' + left + '</div><div style="width:720px"><div class="chart-title">Decisiones que solicitamos al comité</div>' + right + "</div></div>";
    },
    steps: 3,
    notes: function () {
      var F = D.financiero, b = F.escenarios[1];
      return "<p>Cerramos con la propuesta de valor: una fuente única de verdad con latencia menor a 24 horas, gobierno nativo con linaje y calidad, y la nube más eficiente con la carga de referencia.</p>" +
        "<p>Mensaje económico con matices: el programa a 5 años cuesta COP " + f0(F.inversionTotal) + " M (US$ " + f2(F.inversionUSDM) + " M); en el escenario base el VPN es COP " + f0(b.vpn) + " M al " + F.tasa + "%, la TIR " + esc(b.tirTxt) + " y la recuperación en el " + esc(b.recTxt.toLowerCase()) + ". No decimos \"es rentable\" sin matices: crea valor si se ejecuta, y para eso hay que capturar al menos COP " + f0(F.umbralBeneficio) + " M al año. Por eso el compromiso es escalonado, como las fases de ConstructAndes (Caso ConstructAndes, diap. 13), con la prueba de concepto como la herramienta más poderosa de gestión de riesgos (diap. 15).</p>" +
        "<p>Pedimos tres decisiones: " + D.decisiones.map(function (d) { return d.n + ") " + esc(d.texto.toLowerCase()) + (d.monto ? " (" + esc(d.monto) + ")" : ""); }).join("; ") + ".</p>" +
        '<p class="qa">Las diapositivas de respaldo B1–B6 cubren el modelo financiero, la prueba de concepto, la regulación, la sensibilidad, la fe de erratas y las fuentes.</p>';
    } },

  /* ─────────────── RESPALDO ─────────────── */
  { id: "b1", backup: "B1", kicker: "Respaldo B1", title: "Modelo financiero a 5 años y escenarios", cite: "(Clase 4 · Comparativa, diap. 17; Caso ConstructAndes, diap. 13–14)", src: "Informe v2 · tablas 21–23",
    render: function () {
      var F = D.financiero;
      var inv = '<div class="row"><div class="card grow"><div class="chart-title">Inversión por periodo (COP millones)</div>' + vbars(F.porAnio.map(function (a) { return { label: a.p, value: a.v, valueTxt: K.fmt(a.v, a.v < 100 ? 1 : 0), tip: a.p + ": COP " + K.fmt(a.v, 1) + " M", color: "#3987e5" }; }), { w: 900, h: 420, label: "Inversión por año" }) + '</div><div class="col" style="width:400px">' +
        '<div class="tile"><span class="lbl-sm">Inversión total</span><span class="v" style="font-size:46px">COP ' + f0(F.inversionTotal) + ' M</span><span class="l">US$ ' + f2(F.inversionUSDM) + ' M</span></div><div class="tile"><span class="v" style="font-size:46px">' + F.pctPersonas + '%</span><span class="l">personas</span></div><div class="tile"><span class="v" style="font-size:46px">' + F.pctNube + '%</span><span class="l">nube y herramientas</span></div></div></div>';
      var esc3 = '<div class="tiles" style="grid-template-columns:repeat(3,1fr)">' + F.escenarios.map(function (e) {
        return '<div class="tile ' + (e.id === "base" ? "card hi" : "") + '"><b style="font-size:32px">' + esc(e.nombre) + '</b><dl class="kv"><dt>Beneficio/año</dt><dd>COP ' + f0(e.beneficio) + " M</dd><dt>VPN " + F.tasa + "%</dt><dd>" + f0(e.vpn) + "</dd><dt>TIR</dt><dd>" + esc(e.tirTxt) + "</dd><dt>Recuperación</dt><dd>" + esc(e.recTxt) + "</dd></dl></div>";
      }).join("") + '</div><div class="callout warn" style="margin-top:20px">Crea valor si se ejecuta: el punto de equilibrio exige beneficios de COP ' + f0(F.umbralBeneficio) + " M al año.</div>";
      var figs = '<div class="row" style="height:560px"><div class="imgbox grow"><img src="assets/fig4-inversion-anual.png" alt="Figura 4 del informe: inversión anual por rubro"></div><div class="imgbox grow"><img src="assets/fig5-flujo-acumulado.png" alt="Figura 5 del informe: flujo neto acumulado"></div></div>';
      return tabs("b1", [{ k: "i", label: "Inversión", html: inv }, { k: "e", label: "Escenarios", html: esc3 }, { k: "f", label: "Figuras del informe", html: figs }]);
    },
    notes: function () {
      var F = D.financiero;
      return "<p>Inversión de COP " + f0(F.inversionTotal) + " M (US$ " + f2(F.inversionUSDM) + " M) a 5 años: " + F.porAnio.map(function (a) { return esc(a.p) + " " + K.fmt(a.v, 1); }).join("; ") + ". Las personas explican el " + F.pctPersonas + "% y la nube con herramientas el " + F.pctNube + "%. Equivale al 0,33% de los ingresos del periodo, por debajo del umbral de 1,5% de ConstructAndes (diap. 7).</p>" +
        "<p>Escenarios: " + F.escenarios.map(function (e) { return esc(e.nombre) + ": beneficio " + f0(e.beneficio) + ", VPN " + f0(e.vpn) + ", TIR " + esc(e.tirTxt) + ", " + esc(e.recTxt.toLowerCase()); }).join("; ") + ". ConstructAndes recupera en menos de 14 meses (diap. 14) porque sus pérdidas estaban concentradas; en RetailAndes el valor está disperso en miles de decisiones diarias.</p>" +
        '<p class="qa">El modelo financiero no se recalcula con las correcciones de costos de nube: su efecto es menor al 0,1% de la inversión.</p>';
    } },

  { id: "b2", backup: "B2", kicker: "Respaldo B2", title: "Prueba de concepto: validar antes de comprometer", cite: "(Caso ConstructAndes, diap. 9 y 15; Clase 4 · Comparativa, diap. 20)", src: "Informe v2 · sección 8",
    render: function () {
      var Q = D.poc;
      var tiles = [{ i: "coin", v: "COP " + K.fmt(Q.costoCOPM, 1) + " M", l: "US$ " + K.fmt(Q.costoUSDk, 1) + " mil" }, { i: "calendar", v: Q.semanas + " semanas", l: "15 días hábiles" }, { i: "store", v: Q.tiendas + " tiendas", l: "de " + D.empresa.tiendas }, { i: "boxes", v: "~" + Q.skus + " SKU", l: "una categoría de alta rotación" }];
      return '<div class="row"><div class="tiles" style="grid-template-columns:1fr 1fr;width:720px">' + tiles.map(function (t) { return '<div class="tile">' + icon(t.i, "big") + '<span class="v" style="font-size:44px">' + esc(t.v) + '</span><span class="l">' + esc(t.l) + "</span></div>"; }).join("") + '</div><div class="grow card"><div class="chart-title">Criterios obligatorios de aprobación</div>' +
        Q.criterios.map(function (k) { return '<div style="display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:1px solid var(--line)"><span>' + icon("check") + " " + esc(k.m) + "</span><b>" + esc(k.u) + "</b></div>"; }).join("") + "</div></div>" +
        '<div class="callout" style="margin-top:20px">' + esc(Q.regla) + "</div>";
    },
    notes: function () {
      var Q = D.poc;
      return "<p>Pronóstico de demanda semanal por SKU y tienda: " + Q.tiendas + " tiendas en dos ciudades, ~" + Q.skus + " SKU, 24 meses de POS y 12 de ERP (~" + Q.datosGB + " GB). Arquitectura mínima: Cloud Storage (raw) → Spark (curated) → BigQuery sobre BigLake (consumption) → BigQuery ML ARIMA_PLUS → Looker Studio, con Knowledge Catalog (linaje y diez reglas de calidad). Sin datos personales.</p>" +
        "<p>Costo: COP " + K.fmt(Q.costoCOPM, 1) + " M, el 0,5% del programa. ConstructAndes descubrió en su prueba un problema de duplicados que habría costado semanas en producción (Caso ConstructAndes, diap. 9); el curso la llama \"la herramienta más poderosa de gestión de riesgos\" (diap. 15).</p>" +
        '<p class="qa">El umbral de −15% en WAPE es prudente frente a la reducción de 20% a 50% que reporta McKinsey (2022).</p>';
    } },

  { id: "b3", backup: "B3", kicker: "Respaldo B3", title: "Regulación: transmisión de datos personales", cite: "(Caso ConstructAndes, diap. 7; Clase 9, diap. 2)", src: "Informe v2 · secciones 3.2 y 7.3 + auditoría E-05",
    render: function () {
      var R = D.regulacion, co = R.colombia;
      return '<div class="callout" style="margin-bottom:20px">' + icon("scale") + " Un proveedor de nube actúa como <b>encargado</b>: es una <b>transmisión</b> (no una transferencia) y exige un <b>contrato de transmisión</b>.</div>" +
        '<div class="tiles" style="grid-template-columns:1.25fr 1fr 1fr">' +
        '<div class="tile card hi"><b style="font-size:32px">Colombia</b><span>' + esc(co.norma) + '</span><span class="lbl-sm">' + esc(co.base) + "</span><span>" + icon("check") + " " + esc(co.pais) + '</span><span class="lbl-sm">Sanción: ' + esc(co.sancion) + "</span></div>" +
        '<div class="tile"><b style="font-size:32px">Perú</b><span>' + esc(R.peru.norma) + '</span><span class="lbl-sm">' + esc(R.peru.sancion) + "</span><span>" + esc(R.peru.exposicion) + "</span></div>" +
        '<div class="tile"><b style="font-size:32px">Ecuador</b><span>' + esc(R.ecuador.norma) + '</span><span class="lbl-sm">' + esc(R.ecuador.sancion) + "</span><span>" + esc(R.ecuador.exposicion) + "</span></div></div>" +
        '<div class="lbl-sm" style="margin-top:18px">' + icon("pin") + " " + esc(R.regiones) + "</div>";
    },
    notes: function () {
      var R = D.regulacion;
      return "<p>Corrección E-05: el informe hablaba de \"transferencia\" (Ley 1581, art. 26). Usar un proveedor de nube como encargado es una <b>transmisión</b> (" + esc(R.colombia.base) + "), que exige un contrato de transmisión con el proveedor. La región de EE. UU. sigue siendo válida: " + esc(R.colombia.pais) + ".</p>" +
        "<p>" + esc(R.regiones) + " Mitigaciones en el diseño: CMEK, clasificación automática de PII con Sensitive Data Protection, control de acceso por dominio y linaje. En ConstructAndes, el cumplimiento de la Ley 1581 fue un criterio no negociable (Caso ConstructAndes, diap. 7).</p>" +
        '<p class="qa">Perú y Ecuador: la exposición es media-baja (datos de contacto de proveedores). La información regulatoria proviene de fuentes secundarias y debe validarse con asesoría jurídica.</p>';
    } },

  { id: "b4", backup: "B4", kicker: "Respaldo B4", title: "Sensibilidad de costos, del VPN y de los pesos", cite: "(Clase 9, diap. 18)", src: "Informe v2 · tablas 5, 7 y 24",
    render: function () {
      var base = scn(), sc = [
        { n: "Base", p: {} }, { n: "10 TB escaneados", p: { tbEscaneados: 10 } }, { n: "20 TB almacenados", p: { tbAlmacenados: 20 } },
        { n: "BigQuery sin capa gratuita", p: { sinCapaGratuitaBQ: true } }, { n: "Purview reducido", p: { purviewReducido: true } }, { n: "Airflow gestionado", p: { airflow: true } }
      ];
      var t = '<table class="t"><tr><th>Escenario (US$/mes)</th>' + P.map(function (p) { return '<th class="n ' + (p === "gcp" ? "gcpcol" : "") + '">' + provLabel(p, true) + "</th>"; }).join("") + "<th>Menor costo</th></tr>" +
        sc.map(function (s) { var prm = assign(base, s.p), c = K.costs(D, prm), ch = K.cheapest(c); return "<tr><td>" + esc(s.n) + "</td>" + P.map(function (p) { return '<td class="n ' + (p === "gcp" ? "gcpcol" : "") + '">' + cv(prm, p, "total", true) + "</td>"; }).join("") + "<td>" + (ch === "gcp" ? provLabel(ch, true) : '<span class="st mit">' + icon("warn") + esc(PV[ch].nombre) + "</span>") + "</td></tr>"; }).join("") + "</table>";
      var F = D.financiero, vpn = '<div class="card"><div class="chart-title">VPN del escenario base (COP millones)</div>' + divergingBars(F.sensibilidad.map(function (x) { return { label: x.var, value: x.vpn, hi: x.var === "Base" }; }), { max: 1500, lw: "9em", vw: "5em" }) + "</div>";
      var e25 = D.matriz.sensEcosistema25Informe;
      var w = '<div class="card"><div class="chart-title">Matriz con ecosistema al 25% (valores del informe)</div>' + provBars(e25, { max: 5, vw: "5em" }) + '</div><div class="callout" style="margin-top:18px">GCP conserva el primer lugar. En el dashboard (tecla D) puedes mover los diez pesos y ver si cambia el ganador.</div>';
      return tabs("b4", [{ k: "c", label: "Costos (tabla 5)", html: t }, { k: "v", label: "VPN", html: vpn }, { k: "w", label: "Pesos de la matriz", html: w }]);
    },
    notes: function () {
      return "<p>La tabla 5 se recalcula con el motor del simulador y respeta los interruptores. GCP es el más barato en cinco de seis escenarios; la excepción es Airflow gestionado desde el día uno (gana OCI). Por eso Airflow se pospone a la Fase 2.</p>" +
        "<p>VPN del escenario base: " + D.financiero.sensibilidad.map(function (x) { return esc(x.var) + " " + f0(x.vpn); }).join("; ") + ". El resultado es estrecho: se vuelve negativo con un sobrecosto de 15% o un retraso de 6 meses en los beneficios. La velocidad de captura es crítica.</p>" +
        '<p class="qa">Pesos: los puntajes 1–5 son juicio del equipo (auditoría). La normalización del dashboard reparte los pesos para que sumen 100%.</p>';
    } },

  { id: "b5", backup: "B5", kicker: "Respaldo B5", title: "Fe de erratas de la auditoría", cite: "(Clase 9, diap. 18)", src: "Auditoría del informe v2",
    render: function () {
      function tb(list) { return '<table class="t"><tr><th>Código · qué</th><th>Original → corregido</th><th>Motivo</th><th>Se aplica con</th></tr>' + list.map(function (e) { return "<tr><td><b>" + esc(e.id) + "</b> · " + esc(e.que) + "</td><td>" + esc(e.orig) + " → <b>" + esc(e.corr) + "</b></td><td>" + esc(e.motivo) + "</td><td>" + esc(e.interruptor) + "</td></tr>"; }).join("") + "</table>"; }
      var nums = D.erratas.filter(function (e) { return e.interruptor !== "Siempre"; }), cont = D.erratas.filter(function (e) { return e.interruptor === "Siempre"; });
      var stt = '<div class="lbl-sm" style="margin-top:14px">Estado actual: cifras <b>' + (state.corregidas ? "corregidas" : "originales") + "</b> · seguridad <b>" + (state.normSec ? "normalizada" : "sin normalizar") + "</b> (tecla C / S).</div>";
      return tabs("b5", [{ k: "n", label: "Cifras (interruptores)", html: tb(nums) + stt }, { k: "c", label: "Contenido (siempre aplicado)", html: tb(cont) }]);
    },
    notes: function () {
      var v = D.verificacion.totales;
      return "<p>Totales de verificación. Original: " + P.map(function (p) { return PV[p].nombre + " " + f2(v.original[p]); }).join(" · ") + ". Corregidas: " + P.map(function (p) { return PV[p].nombre + " " + f2(v.corregidas[p]); }).join(" · ") + ". Corregidas + seguridad normalizada: " + P.map(function (p) { return PV[p].nombre + " " + f2(v.corregidasNormSec[p]); }).join(" · ") + ".</p>" +
        "<p>Las correcciones de contenido (nombres vigentes, marco legal, mensaje económico, peso del almacenamiento y la validación de la Clase 6) se aplican siempre. Las de cifras dependen del interruptor de la cabecera; en modo \"Original\", la presentación reproduce exactamente el informe.</p>" +
        '<p class="qa">Si el jurado nota diferencias con el documento: el modo Original coincide con el informe y el modo Corregidas muestra, con distintivo, cada cifra que cambió y por qué.</p>';
    } },

  { id: "b6", backup: "B6", kicker: "Respaldo B6", title: "Fuentes y convención de citas", cite: "(Clase 9, diap. 18)", src: "Informe v2 · sección 12",
    render: function () {
      var conv = '<table class="t"><tr><th>Cita en la presentación</th><th>Presentación del curso</th></tr>' + D.convencionCitas.map(function (c) { return "<tr><td><b>" + esc(c.cita) + "</b></td><td>" + esc(c.pres) + "</td></tr>"; }).join("") + "</table>";
      var fu = '<div class="col">' + D.fuentesClave.map(function (f) { return '<div class="chip" style="white-space:normal">' + icon("book") + esc(f) + "</div>"; }).join("") + '<div class="lbl-sm">Formato de cita: (Clase X · tema, diap. n). TRM COP ' + K.fmt(TRM, 2) + " (" + esc(D.meta.trmFecha) + ").</div></div>";
      var pd = '<div class="col">' + D.porDefinir.map(function (f) { return '<div class="team">' + icon("eye") + "<div>" + esc(f) + "</div></div>"; }).join("") + "</div>";
      return tabs("b6", [{ k: "c", label: "Convención de citas", html: conv }, { k: "f", label: "Fuentes clave", html: fu }, { k: "p", label: "Pendientes del equipo", html: pd }]);
    },
    notes: function () {
      return "<p>Las citas del curso siguen el formato (Clase X · tema, diap. n). Los precios provienen de listas oficiales consultadas el " + esc(D.meta.fechaPrecios) + "; los de Azure, de fuentes secundarias recientes que deben validarse en la calculadora oficial. Las cifras de negocio son supuestos del equipo consultor.</p>" +
        '<p class="qa">La pestaña "Pendientes del equipo" lista lo que falta definir antes de la sustentación; se oculta con H junto con las demás notas internas.</p>';
    } }
  ];

  var MAIN_COUNT = SLIDES.filter(function (s) { return !s.backup; }).length;

  function asisDetail() {
    var s = D.silos.filter(function (x) { return x.id === state.sel.asis; })[0];
    if (!s) return '<h4>' + icon("search") + 'Pasa el cursor sobre un silo</h4><div class="hint">Verás qué datos guarda, dónde y qué fallas agrava.</div>';
    return "<h4>" + icon(s.icon) + esc(s.nombre) + '</h4><div class="lbl-sm">' + esc(s.sub) + "</div><div>" + esc(s.datos) + '</div><div class="lbl-sm" style="margin:4px 0">' + icon(s.almIcon) + " " + esc(s.almacen) + '</div><div class="chips">' + s.fallas.map(function (n) { return '<span class="chip f">' + n + ". " + esc(D.fallas[n - 1].corto) + "</span>"; }).join("") + "</div>";
  }
  function tobeDetail() {
    var id = state.sel.tobe, T = D.tobe, c = T.componentes.filter(function (x) { return x.id === id; })[0] || T.transversales.filter(function (x) { return x.id === id; })[0];
    if (!c) return "";
    var cs = ref(), os = refO(), tot = 0, toto = 0, ids = [], ap = K.correccionesAplicadas(D, scn()).gcp;
    c.comps.forEach(function (k) { tot += cs.gcp[k]; toto += os.gcp[k]; if (ap[k]) ids = ids.concat(ap[k]); });
    return "<h4>" + (c.n ? '<span class="pill">' + c.n + "</span>" : "") + esc(c.nombre) + '</h4><div class="chips" style="margin:6px 0 10px">' + c.servicios.map(function (s) { return '<span class="chip">' + esc(s) + "</span>"; }).join("") + "</div>" +
      '<div style="margin-bottom:10px">' + esc(c.funcion) + "</div>" +
      '<div class="row" style="gap:20px;align-items:flex-start"><div class="grow">' + (c.fallas ? '<div class="lbl-sm">Resuelve</div><div class="chips">' + c.fallas.map(function (n) { return '<span class="chip f">' + n + ". " + esc(D.fallas[n - 1].mini) + "</span>"; }).join("") + "</div>" : '<div class="lbl-sm">Capa transversal</div>') + "</div>" +
      '<div><div class="lbl-sm">Costo mensual</div><div class="big-num" style="font-size:44px">US$ ' + f2(K.r2(tot)) + "</div>" + (ids.length ? badge(ids, f2(K.r2(toto)), "m") : "") + "</div></div>";
  }

  /* ======================================================================
     DASHBOARD
     ====================================================================== */
  function dashKpis(sp) {
    var c = K.costs(D, sp), o = K.costs(D, assign(sp, ORIG)), ch = K.cheapest(c), m = K.matrixScores(D, c, state.weights), win = K.winner(m.scores), F = D.financiero, na = D.noActuar;
    return '<div class="dkpi"><div class="l">Costo mensual GCP</div><div class="v">US$ ' + cv(sp, "gcp", "total", true) + '</div><div class="s">≈ COP ' + f2(c.gcp.total * TRM / 1e6) + " M · 36 m: US$ " + f0(c.gcp.total * 36) + "</div></div>" +
      '<div class="dkpi ' + (ch !== "gcp" ? "alert" : "") + '"><div class="l">Más barato</div><div class="v">' + esc(PV[ch].nombre) + '</div><div class="s">US$ ' + f2(c[ch].total) + (ch !== "gcp" ? " · " + icon("warn") + " GCP ya no es el más barato" : "") + "</div></div>" +
      '<div class="dkpi ' + (win !== "gcp" ? "alert" : "") + '"><div class="l">Matriz ponderada</div><div class="v">' + esc(PV[win].nombre) + " " + f2(m.scores[win]) + '</div><div class="s">GCP ' + f2(m.scores.gcp) + " · pesos actuales</div></div>" +
      '<div class="dkpi"><div class="l">Costo de no actuar</div><div class="v">COP ' + f0(na.min) + "–" + f0(na.max) + ' M</div><div class="s">al año · ' + esc(na.pctIngresos) + " de los ingresos</div></div>" +
      '<div class="dkpi"><div class="l">Inversión a 5 años</div><div class="v">COP ' + f0(F.inversionTotal) + ' M</div><div class="s">US$ ' + f2(F.inversionUSDM) + " M · " + F.pctPersonas + "% personas</div></div>" +
      '<div class="dkpi"><div class="l">VPN base (' + F.tasa + '%)</div><div class="v">COP ' + f0(F.escenarios[1].vpn) + ' M</div><div class="s">Requiere ≥ COP ' + f0(F.umbralBeneficio) + " M/año de beneficios</div></div>";
  }
  function renderDash() {
    var html = '<div class="dgrid"><div class="dkpis" data-simout="kpis"></div>' +
      '<div class="dcard span12"><h3>' + icon("chart") + 'Simulador de costos por proveedor <span class="muted" style="font-weight:400">· clic en un proveedor para sincronizar el panel de brechas</span></h3><div class="sim"><div class="sim-ctl">' + simControls() + '</div><div class="sim-out"><div class="callout warn sim-alert" data-simout="alert"></div><div class="sim-cols"><div><div class="chart-title">Costo mensual por componente (US$)</div>' + legendComps() + '<div style="margin-top:8px" data-simout="bars"></div></div><div><div class="chart-title">Ranking (costo · puntaje)</div>' + rankHTML() + '<div class="detail" style="margin-top:10px" data-simout="detail"></div></div></div>' + simNote() + "</div></div></div>" +
      '<div class="dcard span7"><h3>' + icon("warn") + "Qué dejas de atender " + provsel() + '</h3><div data-gapsout="dash"></div></div>' +
      '<div class="dcard span5"><h3>' + icon("scale") + 'Matriz ponderada con pesos ajustables</h3><div class="col" style="gap:6px">' + weightSliders() + '</div><button type="button" class="hbtn" data-act="wreset" style="margin:10px 0">Restablecer pesos</button><div data-simout="matrix"></div><p class="muted">' + icon("warn") + " " + esc(D.matriz.advertencia) + " Los pesos se normalizan para sumar 100%.</p></div>" +
      '<div class="dcard span7"><h3>' + icon("coin") + 'Cuadro de costos (supuestos del simulador)</h3><div data-simout="table"></div></div>' +
      '<div class="dcard span5"><h3>' + icon("target") + "Indicadores del Nivel 1 · meta al mes 6 (≥ " + D.reglaNivel1.cumplir + " de " + D.reglaNivel1.de + ')</h3><table class="t">' + D.indicadores.map(function (k) { return "<tr><td>" + k.n + ". " + esc(k.nombre) + '</td><td class="n">' + stIcon("no") + esc(k.base) + '</td><td class="n">' + icon("flag") + " " + esc(k.meta) + "</td></tr>"; }).join("") + "</table>" + team(esc(D.notaClase6)) + "</div>" +
      "</div>";
    $("#dash").innerHTML = html;
    refreshDynamic();
  }

  /* ======================================================================
     NAVEGACIÓN Y RENDER
     ====================================================================== */
  var stage = $("#stage");
  function slideNum(s) { return s.backup ? "Respaldo " + s.backup : (SLIDES.indexOf(s) + 1) + " / " + MAIN_COUNT; }
  function renderSlide() {
    var s = SLIDES[state.idx];
    var head = s.noHead ? "" : '<header class="s-head"><div><div class="kicker">' + esc(s.kicker) + "</div><h2>" + esc(s.title) + "</h2></div></header>";
    stage.innerHTML = '<section class="slide ' + (s.backup ? "backup" : "") + '" data-id="' + s.id + '">' + head + '<div class="s-body">' + s.render() + "</div>" +
      '<footer class="s-foot"><span class="cite">' + esc(s.cite) + '</span><span class="src">' + esc(s.src) + '</span><button type="button" class="navb" data-act="prev" aria-label="Anterior">' + icon("prev") + '</button><button type="button" class="navb" data-act="next" aria-label="Siguiente">' + icon("next") + '</button><span class="pg">' + slideNum(s) + "</span></footer></section>";
    applySteps(false);
    if (s.after) s.after();
    renderNotes();
    $("#pos").textContent = slideNum(s);
    $("#progress").style.width = ((state.idx + 1) / SLIDES.length * 100) + "%";
    var h = "#/" + (s.backup || (state.idx + 1));
    if (location.hash !== h) history.replaceState(null, "", h);
  }
  function applySteps(animate) {
    $$("#stage .step").forEach(function (el) {
      var on = (+el.dataset.step || 0) <= state.step;
      if (on && !el.classList.contains("on")) { el.classList.add("on"); if (animate) $$(".counter", el).forEach(countUp); }
      else if (!on) el.classList.remove("on");
    });
  }
  function countUp(el) {
    var to = +el.dataset.to, t0 = null, dur = REDUCED ? 0 : 400;
    if (!dur) { el.textContent = f0(to); return; }
    function tick(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / dur); el.textContent = f0(Math.round(to * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(tick); }
    requestAnimationFrame(tick);
  }
  function renderNotes() {
    var s = SLIDES[state.idx], n = $("#notes");
    n.classList.toggle("on", state.notes && state.mode === "deck");
    n.innerHTML = state.notes ? "<h4>Notas del orador · " + slideNum(s) + " · " + esc(s.title || D.meta.titulo) + "</h4>" + s.notes() : "";
  }
  function goto(i, toEnd) {
    i = Math.max(0, Math.min(SLIDES.length - 1, i));
    state.idx = i; state.step = toEnd || state.capture ? (SLIDES[i].steps || 0) : 0;
    renderSlide(); layout();
  }
  function next() { var s = SLIDES[state.idx]; if (state.step < (s.steps || 0)) { state.step++; applySteps(true); } else if (state.idx < SLIDES.length - 1) goto(state.idx + 1); }
  function prev() { if (state.step > 0) { state.step--; applySteps(false); } else if (state.idx > 0) goto(state.idx - 1, true); }

  function layout() {
    var hdr = $("#hdr").offsetHeight, notesH = state.notes && state.mode === "deck" ? Math.round(window.innerHeight * 0.3) : 0;
    var W = window.innerWidth, H = window.innerHeight - hdr - notesH, s = Math.min(W / 1600, H / 900);
    stage.style.transform = "scale(" + s + ")";
    stage.style.left = Math.max(0, (W - 1600 * s) / 2) + "px";
    stage.style.top = Math.max(0, (H - 900 * s) / 2) + "px";
    $("#notes").style.height = notesH + "px";
  }
  function syncHeader() {
    $$("[data-setc]").forEach(function (b) { b.classList.toggle("on", (b.dataset.setc === "1") === state.corregidas); });
    $$('#hdr input[data-global="normSec"]').forEach(function (i) { i.checked = state.normSec; });
    $("#modeLbl").textContent = state.mode === "deck" ? "Dashboard" : "Exposición";
    $('[data-act="mode"]').classList.toggle("on", state.mode === "dash");
    $('[data-act="notes"]').classList.toggle("on", state.notes);
    $('[data-act="team"]').classList.toggle("on", state.hideTeam);
    document.body.classList.toggle("hide-team", state.hideTeam);
    document.body.classList.toggle("mode-dash", state.mode === "dash");
  }
  function rerender() { syncHeader(); if (state.mode === "deck") { var st = state.step; renderSlide(); state.step = st; applySteps(false); } else renderDash(); }
  function setScenario(k, v) { state[k] = v; rerender(); }
  function setMode(m) {
    state.mode = m; syncHeader();
    if (m === "dash") { renderDash(); history.replaceState(null, "", "#/dash"); } else { renderSlide(); layout(); }
    renderNotes(); layout();
  }

  /* ---------------- Eventos ---------------- */
  document.addEventListener("click", function (e) {
    var t = e.target;
    var el;
    if ((el = t.closest("[data-setc]"))) { setScenario("corregidas", el.dataset.setc === "1"); return; }
    if ((el = t.closest("[data-tab]"))) {
      var parts = el.dataset.tab.split(":"); state.tabs[parts[0]] = parts[1];
      $$('[data-tab^="' + parts[0] + ':"]').forEach(function (b) { b.classList.toggle("on", b === el); });
      $$('[data-panel^="' + parts[0] + ':"]').forEach(function (p) { p.classList.toggle("on", p.dataset.panel === el.dataset.tab); });
      return;
    }
    if ((el = t.closest("[data-goto]"))) { goto(+el.dataset.goto); return; }
    if ((el = t.closest("[data-gap]"))) { state.sel.gap = +el.dataset.gap; refreshDynamic(); return; }
    if ((el = t.closest("[data-prov]")) && !t.closest(".hb-row:not(.stk-row)")) { state.selProv = el.dataset.prov; state.sel.gap = 0; refreshDynamic(); return; }
    if ((el = t.closest("[data-silo]"))) { state.sel.asis = el.dataset.silo; $$("[data-silo]").forEach(function (x) { x.classList.toggle("sel", x === el); }); $("[data-asisout]").innerHTML = asisDetail(); return; }
    if ((el = t.closest("[data-tobe]"))) { state.sel.tobe = el.dataset.tobe; $$("[data-tobe]").forEach(function (x) { x.classList.toggle("sel", x.dataset.tobe === state.sel.tobe); }); $("[data-tobeout]").innerHTML = tobeDetail(); return; }
    if ((el = t.closest("[data-act]"))) {
      var a = el.dataset.act;
      if (a === "prev") prev(); else if (a === "next") next();
      else if (a === "mode") setMode(state.mode === "deck" ? "dash" : "deck");
      else if (a === "notes") { state.notes = !state.notes; syncHeader(); renderNotes(); layout(); }
      else if (a === "team") toggleTeam();
      else if (a === "fs") toggleFs();
      else if (a === "help") $("#help").classList.toggle("on");
      else if (a === "simreset") { state.sim = simDefaults(); refreshDynamic(); }
      else if (a === "wreset") { state.weights = K.defaultWeights(D); $$("input[data-w]").forEach(function (i) { i.value = state.weights[i.dataset.w]; }); refreshDynamic(); }
      return;
    }
    if (t.closest("#help")) { $("#help").classList.remove("on"); return; }
    if (state.mode === "deck" && t.closest("#stage") && !t.closest("button, a, input, label, details, summary, .tab, .panel .card, .silo, .tb-comp, .tb-band, .gap, .rank-row, .stk-row, .orgbox, table, img, [data-tip]")) next();
  });
  document.addEventListener("mouseover", function (e) {
    var s = e.target.closest && e.target.closest("[data-silo]");
    if (s && state.sel.asis !== s.dataset.silo) { state.sel.asis = s.dataset.silo; $$("[data-silo]").forEach(function (x) { x.classList.toggle("sel", x === s); }); var o = $("[data-asisout]"); if (o) o.innerHTML = asisDetail(); }
  });
  document.addEventListener("input", function (e) {
    var t = e.target;
    if (t.dataset.sim) { state.sim[t.dataset.sim] = t.type === "checkbox" ? t.checked : parseFloat(t.value); refreshDynamic(); }
    else if (t.dataset.w) { state.weights[t.dataset.w] = parseFloat(t.value); refreshDynamic(); }
  });
  document.addEventListener("change", function (e) { var t = e.target; if (t.dataset.global) setScenario(t.dataset.global, t.checked); });

  /* Tooltip */
  var tip = $("#tip");
  document.addEventListener("mousemove", function (e) {
    var el = e.target.closest && e.target.closest("[data-tip]");
    if (!el || !el.dataset.tip) { tip.classList.remove("on"); return; }
    tip.textContent = el.dataset.tip; tip.classList.add("on");
    var x = e.clientX + 16, y = e.clientY + 18, r = tip.getBoundingClientRect();
    if (x + r.width > window.innerWidth - 8) x = e.clientX - r.width - 12;
    if (y + r.height > window.innerHeight - 8) y = e.clientY - r.height - 12;
    tip.style.left = x + "px"; tip.style.top = y + "px";
  });

  function toggleTeam() { state.hideTeam = !state.hideTeam; try { localStorage.setItem("ra-hideTeam", state.hideTeam ? "1" : "0"); } catch (e) { /* sin almacenamiento */ } syncHeader(); }
  function toggleFs() { if (!document.fullscreenElement) { if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen(); } else if (document.exitFullscreen) document.exitFullscreen(); }

  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var tag = (e.target.tagName || "").toLowerCase(), inRange = tag === "input";
    var k = e.key;
    if (k === "Escape") { $("#help").classList.remove("on"); return; }
    if (inRange && (k === "ArrowLeft" || k === "ArrowRight" || k === "ArrowUp" || k === "ArrowDown" || k === " " || k === "Home" || k === "End")) return;
    if (state.mode === "deck") {
      if (k === "ArrowRight" || k === "PageDown" || k === " ") { e.preventDefault(); next(); return; }
      if (k === "ArrowLeft" || k === "PageUp") { e.preventDefault(); prev(); return; }
      if (k === "Home") { goto(0); return; }
      if (k === "End") { goto(MAIN_COUNT - 1, true); return; }
    }
    var l = k.toLowerCase();
    if (l === "f") toggleFs();
    else if (l === "d") setMode(state.mode === "deck" ? "dash" : "deck");
    else if (l === "n") { state.notes = !state.notes; syncHeader(); renderNotes(); layout(); }
    else if (l === "c") setScenario("corregidas", !state.corregidas);
    else if (l === "s") setScenario("normSec", !state.normSec);
    else if (l === "h") toggleTeam();
    else if (k === "?") $("#help").classList.toggle("on");
  });
  window.addEventListener("resize", layout);
  document.addEventListener("fullscreenchange", layout);

  /* ---------------- Verificación de desbordes (para Playwright) ---------------- */
  function overflowReport() {
    var out = [], body = $("#stage .s-body"), slide = $("#stage .slide");
    if (!body) return out;
    var br = body.getBoundingClientRect(), sr = slide.getBoundingClientRect(), sc = br.width / body.offsetWidth || 1;
    $$("#stage .slide *").forEach(function (el) {
      if (el.closest("svg") && el.tagName.toLowerCase() !== "svg") return;
      var r = el.getBoundingClientRect(); if (!r.width && !r.height) return;
      var inBody = body.contains(el), box = inBody ? br : sr, tol = 2 * sc;
      if (r.right > box.right + tol || r.bottom > box.bottom + tol || r.left < box.left - tol || r.top < box.top - tol) out.push((el.className && el.className.baseVal === undefined ? el.className : el.tagName) + " «" + (el.textContent || "").trim().slice(0, 50) + "» (" + Math.round((r.right - box.right) / sc) + "px der., " + Math.round((r.bottom - box.bottom) / sc) + "px abajo)");
      var cs = getComputedStyle(el);
      if ((cs.overflowX === "hidden" || cs.textOverflow === "ellipsis") && el.scrollWidth > el.clientWidth + 2) out.push("Texto recortado: «" + (el.textContent || "").trim().slice(0, 60) + "»");
    });
    return out.filter(function (v, i, a) { return a.indexOf(v) === i; }).slice(0, 25);
  }

  window.RA = {
    goto: function (i, all) { state.capture = !!all; goto(i, all); },
    count: SLIDES.length, main: MAIN_COUNT, ids: SLIDES.map(function (s) { return s.backup || s.id; }),
    setMode: setMode, set: setScenario, state: state, overflow: overflowReport, refresh: refreshDynamic,
    citesOk: function () { return SLIDES.every(function (s) { return /^\(.+(diap\.|Clase).+\)$/.test(s.cite) && s.notes().length > 200; }); }
  };

  /* ---------------- Arranque ---------------- */
  function fromHash() {
    var h = location.hash.replace("#/", "");
    if (h === "dash") return { mode: "dash" };
    var b = SLIDES.map(function (s) { return s.backup; }).indexOf(h.toUpperCase());
    if (b >= 0) return { idx: b };
    var n = parseInt(h, 10); return { idx: isNaN(n) ? 0 : n - 1 };
  }
  var hs = fromHash();
  syncHeader();
  if (hs.mode === "dash") { renderSlide(); setMode("dash"); } else goto(hs.idx || 0);
  layout();
})();
