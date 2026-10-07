/* ==========================================================================
   calc.js — Motor de cálculo. Funciones puras: reciben los datos (RA_DATA) y
   los parámetros del escenario y devuelven resultados; no tocan el DOM.
   ========================================================================== */
(function (root) {
  "use strict";

  /* Redondeo a 2 decimales estable (268,325 → 268,33 pese al error binario) */
  function r2(x) { return Math.round(Math.round(x * 1e6) / 1e4) / 100; }

  var PROVS = ["aws", "azure", "gcp", "oci"];
  var COMPS = ["storage", "ingest", "proc", "query", "gov", "sec", "orch", "ai"];

  /* Parámetros por defecto del escenario (carga de referencia, cifras originales) */
  function defaultParams(D) {
    var r = D.sim.rangos;
    return {
      tbAlmacenados: r.tbAlmacenados.def,
      tbEscaneados: r.tbEscaneados.def,
      vcpuH: r.vcpuH.def,
      ociHorasDia: r.ociHorasDia.def,
      airflow: false,
      corregidas: false,
      normSec: false,
      sinCapaGratuitaBQ: false,
      purviewReducido: false
    };
  }

  function withDefaults(D, p) {
    var out = defaultParams(D);
    for (var k in (p || {})) if (Object.prototype.hasOwnProperty.call(p, k)) out[k] = p[k];
    return out;
  }

  /* Costo mensual por componente y proveedor (USD). Fórmulas de C6. */
  function costs(D, params) {
    var p = withDefaults(D, params);
    var S = D.sim, O = D.costosOriginal, C = D.correcciones;
    var res = {};
    PROVS.forEach(function (prov) {
      var c = {};
      // Almacenamiento = TB × 1.024 × precio_GB + operaciones (OCI descuenta 10 GB gratis)
      var a = S.almacenamiento[prov];
      c.storage = r2(Math.max(0, p.tbAlmacenados * 1024 - a.gbGratis) * a.precioGB + a.ops);
      // Ingesta = valor fijo
      c.ingest = O[prov].ingest;
      // Procesamiento = base × (vCPU-h / 1.200)
      var base = S.procBase[prov];
      if (p.corregidas && C["E-04"].prov === prov) base = C["E-04"].corregido;
      c.proc = r2(base * (p.vcpuH / S.procBaseVcpu));
      // Consultas
      if (prov === "aws" || prov === "azure") {
        c.query = r2(p.tbEscaneados * S.consultas.porTB[prov]);
      } else if (prov === "gcp") {
        var g = S.consultas.gcp, tib = p.tbEscaneados * g.tibPorTB;
        var fact = p.sinCapaGratuitaBQ ? tib : Math.max(0, tib - g.tibGratis);
        c.query = r2(fact * g.precioTiB);
      } else {
        var o = S.consultas.oci;
        c.query = r2(o.ecpu * p.ociHorasDia * o.diasMes * o.precioECPU + o.almacenamiento);
      }
      // Gobernanza
      c.gov = O[prov].gov;
      if (prov === "azure" && p.purviewReducido) {
        var pr = S.purviewReducido;
        c.gov = r2(pr.activos * pr.precioActivo + pr.dgpu * pr.precioDGPU);
      }
      // Seguridad (E-03: normalizar)
      c.sec = O[prov].sec;
      if (p.normSec && C["E-03"].resultado[prov] !== undefined) c.sec = C["E-03"].resultado[prov];
      // Orquestación (Airflow gestionado reemplaza el orquestador serverless)
      c.orch = O[prov].orch;
      if (p.airflow && S.airflow[prov] !== undefined) c.orch = S.airflow[prov];
      // IA (E-01)
      c.ai = O[prov].ai;
      if (p.corregidas && C["E-01"].prov === prov) c.ai = C["E-01"].corregido;

      c.total = r2(COMPS.reduce(function (s, k) { return s + c[k]; }, 0));
      res[prov] = c;
    });
    return res;
  }

  /* Qué correcciones afectan cada cifra: {prov: {comp: ["E-04"], total: [...]}} */
  function correccionesAplicadas(D, params) {
    var p = withDefaults(D, params), C = D.correcciones, out = {};
    PROVS.forEach(function (prov) { out[prov] = {}; });
    function add(prov, comp, id) {
      (out[prov][comp] = out[prov][comp] || []).push(id);
      if ((out[prov].total || []).indexOf(id) < 0) (out[prov].total = out[prov].total || []).push(id);
    }
    if (p.corregidas) {
      add(C["E-01"].prov, C["E-01"].comp, "E-01");
      add(C["E-04"].prov, C["E-04"].comp, "E-04");
    }
    if (p.normSec) Object.keys(C["E-03"].resultado).forEach(function (prov) { add(prov, "sec", "E-03"); });
    return out;
  }

  function ranking(costTable) {
    return PROVS.slice().sort(function (a, b) { return costTable[a].total - costTable[b].total; });
  }

  function cheapest(costTable) { return ranking(costTable)[0]; }

  /* Pesos normalizados para que sumen 100 */
  function normalizeWeights(w) {
    var sum = 0, k, out = {};
    for (k in w) sum += Math.max(0, w[k]);
    for (k in w) out[k] = sum > 0 ? Math.max(0, w[k]) * 100 / sum : 0;
    return out;
  }

  function defaultWeights(D) {
    var w = {};
    D.matriz.criterios.forEach(function (c) { w[c.id] = c.peso; });
    return w;
  }

  /* Matriz ponderada: costo = 5 × costo mínimo / costo del proveedor */
  function matrixScores(D, costTable, weights) {
    var w = normalizeWeights(weights || defaultWeights(D));
    var min = Math.min.apply(null, PROVS.map(function (p) { return costTable[p].total; }));
    var scores = {}, costScore = {};
    PROVS.forEach(function (prov) {
      costScore[prov] = 5 * min / costTable[prov].total;
      var s = 0;
      D.matriz.criterios.forEach(function (c) {
        var v = c.calculado ? costScore[prov] : c.s[prov];
        s += v * w[c.id] / 100;
      });
      scores[prov] = s;
    });
    return { scores: scores, costScore: costScore, weights: w };
  }

  function winner(scores) {
    return PROVS.slice().sort(function (a, b) { return scores[b] - scores[a]; })[0];
  }

  function toCOP(usd, trm) { return usd * trm; }
  function months(usd, n) { return usd * n; }
  function pctDiff(a, b) { return (a - b) / b * 100; }        // a respecto de b
  function share(part, total) { return part / total * 100; }
  function clase9Subset(c) { return r2(c.storage + c.query); }

  /* Formato numérico colombiano: miles con punto, decimales con coma */
  function fmt(n, dec) {
    if (n === null || n === undefined || isNaN(n)) return "—";
    dec = dec === undefined ? 2 : dec;
    var neg = n < 0, x = Math.abs(n);
    var s = (dec > 0 ? r2dec(x, dec).toFixed(dec) : String(Math.round(x)));
    var parts = s.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return (neg ? "−" : "") + parts.join(",");
  }
  function r2dec(x, dec) { var f = Math.pow(10, dec); return Math.round(Math.round(x * f * 1e4) / 1e4) / f; }

  var api = {
    PROVS: PROVS, COMPS: COMPS, r2: r2,
    defaultParams: defaultParams, withDefaults: withDefaults,
    costs: costs, correccionesAplicadas: correccionesAplicadas,
    ranking: ranking, cheapest: cheapest,
    normalizeWeights: normalizeWeights, defaultWeights: defaultWeights,
    matrixScores: matrixScores, winner: winner,
    toCOP: toCOP, months: months, pctDiff: pctDiff, share: share, clase9Subset: clase9Subset,
    fmt: fmt
  };
  root.RACalc = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
