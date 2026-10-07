/* ==========================================================================
   data.js — FUENTE ÚNICA DE DATOS de la presentación-dashboard RetailAndes.
   Ninguna cifra se escribe a mano en el HTML: todo sale de este objeto y se
   calcula en calc.js. Para cambiar una cifra, edítala aquí y recarga.
   Fuente principal: "Informe_DataLake_RetailAndes_GCP_v2.docx" (v2.0).
   Correcciones: auditoría (E-01, E-03, E-04, E-05, E-06).
   Se carga como <script> (no JSON + fetch) para funcionar con file://.
   ========================================================================== */
window.RA_DATA = {

  meta: {
    titulo: "Data Lake con Gobierno de Datos",
    empresa: "RetailAndes S.A.S.",
    equipo: "DataStrategos (equipo consultor)",
    integrantes: null,                       // Por definir: nombres del grupo
    universidad: "Universidad de La Sabana",
    curso: "Proyecto Segundo Corte",
    fecha: "Octubre de 2026",
    fechaPrecios: "24-sep-2026",
    trm: 3208.66,
    trmFecha: "23-sep-2026",
    region: "us-east1 (EE. UU.)",
    recomendacion: "Google Cloud",
    notaPrecios: "Valores referenciales a marzo de 2026 (Clase 9, diap. 18), actualizados al 24-sep-2026; deben validarse con la calculadora oficial de cada proveedor"
  },

  empresa: {
    fundacion: 2009, sede: "Bogotá", tiendas: 340, ciudades: 22,
    ecommerceDesde: 2017, paises: ["Colombia", "Perú", "Ecuador"],
    empleados: 4200, ingresosCOPM: 780000, crisisDesde: 2022,
    madurez: "Nivel 1 incompleto", diagnostico: "DataStrategos, 1T-2026"
  },

  fallas: [
    { id: 1, mini: "Fuente única", corto: "Sin fuente única de verdad", detalle: "Cada área genera sus propias cifras, con resultados contradictorios.", icon: "split" },
    { id: 2, mini: "Gobierno", corto: "Gobierno de datos inexistente", detalle: "Sin roles, lineamientos ni políticas formales.", icon: "gov" },
    { id: 3, mini: "Almacenamiento", corto: "Almacenamiento heterogéneo", detalle: "BD on-premise, hojas de cálculo y archivos planos sin integración.", icon: "db" },
    { id: 4, mini: "Linaje", corto: "Sin linaje", detalle: "Imposible rastrear el origen y la transformación de una cifra.", icon: "lineage" },
    { id: 5, mini: "Latencia", corto: "Latencia de 4 a 7 días", detalle: "4 a 7 días hábiles para disponer de datos de análisis.", icon: "clock" }
  ],

  /* AS-IS (figura 2 del informe) */
  silos: [
    { id: "pos", nombre: "POS", icon: "store", sub: "340 puntos de venta · 22 ciudades", datos: "Transacciones de venta (decenas de millones de registros/día)", almacen: "BD relacionales on-premise por región / tienda", almIcon: "db", fallas: [1, 3, 5], area: "Comercial" },
    { id: "ecom", nombre: "E-commerce", icon: "cart", sub: "Plataforma web desde 2017", datos: "Pedidos, clientes, carritos, devoluciones", almacen: "BD transaccional + logs de navegación", almIcon: "db", fallas: [1, 4, 5], area: "Marketing" },
    { id: "erp", nombre: "ERP de inventario", icon: "boxes", sub: "Proveedores CO · PE · EC", datos: "Stock, compras, costos, proveedores", almacen: "BD relacional on-premise + exportes a Excel", almIcon: "db", fallas: [1, 3, 4], area: "Finanzas" },
    { id: "iot", nombre: "IoT de bodegas", icon: "sensor", sub: "Sensores en centros de distribución", datos: "Temperatura, humedad, movimientos de estiba", almacen: "Archivos planos (CSV/log) en servidores locales", almIcon: "file", fallas: [2, 3, 5], area: "Logística" },
    { id: "social", nombre: "Redes sociales", icon: "chat", sub: "Cuentas corporativas", datos: "Menciones, interacción, sentimiento", almacen: "Descargas manuales en hojas de cálculo", almIcon: "sheet", fallas: [2, 3, 4], area: "Operaciones" }
  ],
  areasConsumidoras: ["Comercial", "Finanzas", "Logística", "Marketing", "Operaciones"],

  proveedores: [
    { id: "aws",   nombre: "AWS",          largo: "Amazon Web Services", color: "#C9711A" },
    { id: "azure", nombre: "Azure",        largo: "Microsoft Azure",     color: "#4D86F0" },
    { id: "gcp",   nombre: "Google Cloud", largo: "Google Cloud (GCP)",  color: "#35C08A", elegido: true },
    { id: "oci",   nombre: "OCI",          largo: "Oracle Cloud (OCI)",  color: "#B5304A" }
  ],

  componentes: [
    { id: "storage", nombre: "Almacenamiento" },
    { id: "ingest",  nombre: "Ingesta" },
    { id: "proc",    nombre: "Procesamiento" },
    { id: "query",   nombre: "Consultas SQL" },
    { id: "gov",     nombre: "Gobernanza" },
    { id: "sec",     nombre: "Seguridad" },
    { id: "orch",    nombre: "Orquestación" },
    { id: "ai",      nombre: "IA / ML" }
  ],

  /* Perfil de carga (tabla 2.1 del informe) */
  carga: {
    tbAlmacenados: 10, tbEscaneados: 1, vcpuH: 1200, gbH: 4800, ociHorasDia: 8,
    descripcion: "10 TB almacenados + 1 TB procesado/mes · precios oficiales al 24-sep-2026"
  },

  /* Tabla 4 del informe — USD/mes, escenario ORIGINAL */
  costosOriginal: {
    aws:   { storage: 253.52, ingest: 40.50, proc: 132.00, query: 5.00,   gov: 14.00,  sec: 68.44, orch: 0.40, ai: 9.20 },
    azure: { storage: 238.04, ingest: 38.58, proc: 165.60, query: 5.00,   gov: 300.00, sec: 30.50, orch: 1.80, ai: 7.68 },
    gcp:   { storage: 222.80, ingest: 40.38, proc: 76.00,  query: 0.00,   gov: 11.81,  sec: 4.68,  orch: 5.85, ai: 17.48 },
    oci:   { storage: 268.33, ingest: 54.06, proc: 22.20,  query: 148.89, gov: 0.00,   sec: 0.00,  orch: 0.00, ai: 2.96 }
  },
  totalesInforme: { aws: 523.06, azure: 787.20, gcp: 379.00, oci: 496.44 },
  totalesCOPMInforme: { aws: 1.68, azure: 2.53, gcp: 1.22, oci: 1.59 },
  totales36Informe: { aws: 18830, azure: 28339, gcp: 13644, oci: 17872 },

  /* Parámetros del simulador (C6). Fórmulas en calc.js */
  sim: {
    rangos: {
      tbAlmacenados: { min: 5, max: 50, step: 1, def: 10 },
      tbEscaneados:  { min: 0.5, max: 20, step: 0.5, def: 1 },
      vcpuH:         { min: 300, max: 6000, step: 100, def: 1200 },
      ociHorasDia:   { min: 2, max: 24, step: 1, def: 8 }
    },
    almacenamiento: {
      aws:   { precioGB: 0.023,  ops: 18.00, gbGratis: 0 },
      azure: { precioGB: 0.021,  ops: 23.00, gbGratis: 0 },
      gcp:   { precioGB: 0.020,  ops: 18.00, gbGratis: 0 },
      oci:   { precioGB: 0.0255, ops: 7.46,  gbGratis: 10 }
    },
    procBase:     { aws: 132.00, azure: 165.60, gcp: 76.00, oci: 22.20 },
    procBaseVcpu: 1200,
    consultas: {
      porTB: { aws: 5, azure: 5 },
      gcp: { tibPorTB: 0.9095, tibGratis: 1, precioTiB: 6.25 },
      oci: { ecpu: 2, diasMes: 22, precioECPU: 0.336, almacenamiento: 30.62 }
    },
    airflow: { aws: 357.70, gcp: 583.20 },          // MWAA small / Managed Airflow (ex Composer 3)
    purviewReducido: { activos: 100, precioActivo: 0.50, dgpu: 5, precioDGPU: 15 }
  },

  /* Correcciones de la auditoría que mueven cifras (interruptores) */
  correcciones: {
    "E-01": {
      modo: "corregidas", prov: "gcp", comp: "ai", original: 17.48, corregido: 8.74,
      titulo: "Precio de Vertex AI",
      motivo: "Vertex AI n1-standard-4 cuesta US$ 0,2185/h, no 0,437: 40 h × 0,2185 = 8,74."
    },
    "E-04": {
      modo: "corregidas", prov: "aws", comp: "proc", original: 132.00, corregido: 90.89, estimacion: true,
      titulo: "Spark de AWS comparable",
      motivo: "AWS debe compararse con su Spark serverless más barato: EMR Serverless (1.200 vCPU-h × 0,052624 + 4.800 GB-h × 0,0057785 = 90,89). Estimación; validar con la calculadora.",
      emr: { precioVcpuH: 0.052624, precioGBh: 0.0057785 }
    },
    "E-03": {
      modo: "normSec", titulo: "Seguridad no equivalente",
      motivo: "AWS paga detección de amenazas (GuardDuty 12,00 + Macie 50,50) y Azure Defender (27,50); GCP usa SCC Standard sin detección equivalente. Normalizar quita esos rubros.",
      quitar: { aws: [{ rubro: "GuardDuty", usd: 12.00 }, { rubro: "Macie", usd: 50.50 }], azure: [{ rubro: "Defender for Storage", usd: 27.50 }] },
      resultado: { aws: 5.94, azure: 3.00 }
    }
  },

  /* Valores de verificación (tests.html) */
  verificacion: {
    totales: {
      original:            { aws: 523.06, azure: 787.20, gcp: 379.00, oci: 496.44 },
      corregidas:          { aws: 481.95, azure: 787.20, gcp: 370.26, oci: 496.44 },
      corregidasNormSec:   { aws: 419.45, azure: 759.70, gcp: 370.26, oci: 496.44 }
    },
    matriz: {
      original:            { aws: 4.36, azure: 4.09, gcp: 4.65, oci: 3.23 },
      corregidas:          { aws: 4.38, azure: 4.09, gcp: 4.65, oci: 3.22 },
      corregidasNormSec:   { aws: 4.44, azure: 4.09, gcp: 4.65, oci: 3.22 }
    },
    simulador: [
      { nombre: "10 TB escaneados", params: { tbEscaneados: 10 }, esperado: { aws: 568.06, azure: 832.20, gcp: 429.59, oci: 496.44 } },
      { nombre: "20 TB almacenados", params: { tbAlmacenados: 20 }, esperado: { aws: 758.58, azure: 1002.24, gcp: 583.80, oci: 757.56 } },
      { nombre: "Airflow gestionado", params: { airflow: true }, esperado: { aws: 880.36, azure: 787.20, gcp: 956.35, oci: 496.44 }, ganador: "oci" }
    ],
    /* Escenarios adicionales de la tabla 5 del informe */
    tabla5Extra: [
      { nombre: "BigQuery sin capa gratuita de 1 TiB", params: { sinCapaGratuitaBQ: true }, esperado: { aws: 523.06, azure: 787.20, gcp: 384.68, oci: 496.44 } },
      { nombre: "Purview reducido (100 activos, 5 DGPU)", params: { purviewReducido: true }, esperado: { aws: 523.06, azure: 612.20, gcp: 379.00, oci: 496.44 } }
    ]
  },

  /* Desglose línea a línea (Anexo A) */
  lineas: {
    gcp: [
      { corto: "Cloud Storage Standard", comp: "storage", servicio: "Cloud Storage Standard", supuesto: "10.240 GB × $0,020", usd: 204.80 },
      { corto: "Operaciones (lectura/escritura)", comp: "storage", servicio: "Operaciones Clase A + B", supuesto: "2 M + 20 M", usd: 18.00 },
      { corto: "Pub/Sub", comp: "ingest",  servicio: "Pub/Sub", supuesto: "290 GiB × $40/TiB + suscripción a Cloud Storage", usd: 25.98 },
      { corto: "Spark batch (JDBC/API)", comp: "ingest",  servicio: "Managed Service for Apache Spark (batch JDBC/API)", supuesto: "240 DCU-h × $0,06", usd: 14.40 },
      { corto: "Managed Service for Apache Spark", comp: "proc",    servicio: "Managed Service for Apache Spark", supuesto: "1.200 DCU-h × $0,06 + shuffle", usd: 76.00 },
      { corto: "BigQuery on-demand", comp: "query",   servicio: "BigQuery on-demand", supuesto: "0,91 TiB (dentro de 1 TiB gratis)", usd: 0.00 },
      { corto: "Knowledge Catalog: calidad", comp: "gov",     servicio: "Knowledge Catalog: calidad y perfilado", supuesto: "80 DCU-h × $0,089", usd: 7.12 },
      { corto: "Knowledge Catalog: linaje", comp: "gov",     servicio: "Knowledge Catalog: linaje automático", supuesto: "≈30 DCU-h + 1 GiB metadatos", usd: 4.69 },
      { corto: "Cloud KMS (CMEK)", comp: "sec",     servicio: "Cloud KMS (CMEK)", supuesto: "3 llaves + 1 M operaciones", usd: 3.18 },
      { corto: "Sensitive Data Protection + SCC", comp: "sec",     servicio: "Sensitive Data Protection; SCC Standard", supuesto: "Perfilado 50 GB × $0,03", usd: 1.50 },
      { corto: "Workflows + Cloud Scheduler", comp: "orch",    servicio: "Workflows + Cloud Scheduler", supuesto: "20.000 pasos; 60 jobs", usd: 5.85 },
      { corto: "Vertex AI", comp: "ai",      servicio: "Vertex AI", supuesto: "40 h n1-standard-4 × $0,437", supuestoCorregido: "40 h n1-standard-4 × $0,2185", usd: 17.48, correccion: "E-01" }
    ],
    aws: [
      { comp: "storage", servicio: "Amazon S3 Standard", supuesto: "10.240 GB × $0,023", usd: 235.52 },
      { comp: "storage", servicio: "Solicitudes S3", supuesto: "2 M PUT + 20 M GET", usd: 18.00 },
      { comp: "ingest",  servicio: "Amazon Data Firehose", supuesto: "300 GB × $0,029 + conversión", usd: 14.10 },
      { comp: "ingest",  servicio: "AWS Glue (batch)", supuesto: "60 DPU-h × $0,44", usd: 26.40 },
      { comp: "proc",    servicio: "AWS Glue ETL (Spark)", supuesto: "300 DPU-h × $0,44", usd: 132.00, correccion: "E-04" },
      { comp: "query",   servicio: "Amazon Athena", supuesto: "1 TB × $5", usd: 5.00 },
      { comp: "gov",     servicio: "Lake Formation + Glue Data Catalog", supuesto: "Permisos sin costo", usd: 0.00 },
      { comp: "gov",     servicio: "DataZone / SageMaker Catalog", supuesto: "16.000 req. + 1 GB + 1,8 CU", usd: 5.20 },
      { comp: "gov",     servicio: "Glue Data Quality", supuesto: "20 DPU-h × $0,44", usd: 8.80 },
      { comp: "sec",     servicio: "AWS KMS", supuesto: "3 llaves + 980.000 solicitudes", usd: 5.94 },
      { comp: "sec",     servicio: "Amazon GuardDuty", supuesto: "1 M + 10 M eventos", usd: 12.00, normSec: true },
      { comp: "sec",     servicio: "Amazon Macie", supuesto: "10 buckets, 50 GB inspeccionados", usd: 50.50, normSec: true },
      { comp: "orch",    servicio: "Step Functions + EventBridge Scheduler", supuesto: "16.000 transiciones", usd: 0.40 },
      { comp: "ai",      servicio: "SageMaker AI", supuesto: "40 h ml.m5.xlarge × $0,23", usd: 9.20 }
    ],
    azure: [
      { comp: "storage", servicio: "ADLS Gen2 Hot LRS", supuesto: "10.240 GB × $0,021", usd: 215.04 },
      { comp: "storage", servicio: "Operaciones", supuesto: "2 M escritura + 20 M lectura", usd: 23.00 },
      { comp: "ingest",  servicio: "Event Hubs Standard", supuesto: "1 TU × 730 h + 60 M eventos", usd: 23.58 },
      { comp: "ingest",  servicio: "Data Factory (copia batch)", supuesto: "60 DIU-h × $0,25", usd: 15.00 },
      { comp: "proc",    servicio: "Synapse Spark pool", supuesto: "1.200 vCore-h × $0,138", usd: 165.60 },
      { comp: "query",   servicio: "Synapse serverless SQL", supuesto: "1 TB × $5", usd: 5.00 },
      { comp: "gov",     servicio: "Purview Unified Catalog", supuesto: "300 activos × $0,50", usd: 150.00 },
      { comp: "gov",     servicio: "Purview Data Quality (Basic)", supuesto: "10 DGPU × $15", usd: 150.00 },
      { comp: "sec",     servicio: "Key Vault", supuesto: "1 M operaciones", usd: 3.00 },
      { comp: "sec",     servicio: "Defender for Storage", supuesto: "2 cuentas + 50 GB escaneo", usd: 27.50, normSec: true },
      { comp: "orch",    servicio: "Data Factory (orquestación)", supuesto: "1.800 ejecuciones × $1/1.000", usd: 1.80 },
      { comp: "ai",      servicio: "Azure Machine Learning", supuesto: "40 h D4s v5 × $0,192", usd: 7.68 }
    ],
    oci: [
      { comp: "storage", servicio: "Object Storage Standard", supuesto: "(10.240 − 10 GB) × $0,0255", usd: 260.87 },
      { comp: "storage", servicio: "Solicitudes", supuesto: "22 M × $0,0034/10.000", usd: 7.46 },
      { comp: "ingest",  servicio: "OCI Streaming", supuesto: "600 GB × $0,025 + retención", usd: 16.46 },
      { comp: "ingest",  servicio: "OCI Data Integration", supuesto: "60 h + 700 GB", usd: 37.60 },
      { comp: "proc",    servicio: "OCI Data Flow (Spark)", supuesto: "600 OCPU-h + 4.800 GB-h", usd: 22.20 },
      { comp: "query",   servicio: "Autonomous AI Lakehouse", supuesto: "352 ECPU-h × $0,336 + almacenamiento", usd: 148.89 },
      { comp: "gov",     servicio: "OCI Data Catalog", supuesto: "Sin precio publicado", usd: 0.00, porDefinir: true },
      { comp: "sec",     servicio: "Vault, Cloud Guard, Data Safe", supuesto: "Incluidos", usd: 0.00 },
      { comp: "orch",    servicio: "Data Integration (programación)", supuesto: "Incluida", usd: 0.00 },
      { comp: "ai",      servicio: "OCI Data Science", supuesto: "40 h E4 Flex", usd: 2.96 }
    ]
  },

  /* Clase 9, diap. 18 (marzo 2026; almacenamiento + consulta) */
  clase9: {
    ref: { aws: 230, azure: 220, gcp: 210, oci: 175 },
    servicios: { aws: "S3 + Athena", azure: "ADLS Gen2 + Synapse SQL", gcp: "Cloud Storage + BigQuery", oci: "Object Storage + Autonomous DW" },
    lectura: "AWS, Azure y GCP difieren 6–12% por las operaciones de lectura y escritura. OCI diverge: solo sus 10 TB ya cuestan ~US$ 261 y su SQL se cobra por tiempo encendido."
  },

  /* Distribución de costos en Data Lakes maduros (Clase 4 · Comparativa, diap. 11) */
  distribucionMadura: { procesamiento: 45, almacenamiento: 23, transferencias: 18, consultas: 14 },

  /* Matriz ponderada (tabla 7) — el criterio "costo" se calcula en vivo */
  matriz: {
    criterios: [
      { id: "eco",   nombre: "Ecosistema e integración", peso: 10, s: { aws: 4, azure: 5, gcp: 4, oci: 3 } },
      { id: "alm",   nombre: "Almacenamiento",           peso: 10, s: { aws: 5, azure: 4, gcp: 5, oci: 4 } },
      { id: "ing",   nombre: "Ingesta",                  peso: 10, s: { aws: 5, azure: 5, gcp: 4, oci: 3 } },
      { id: "proc",  nombre: "Procesamiento Spark",      peso: 10, s: { aws: 4, azure: 3, gcp: 5, oci: 4 } },
      { id: "cons",  nombre: "Consulta y análisis",      peso: 15, s: { aws: 4, azure: 4, gcp: 5, oci: 3 } },
      { id: "gob",   nombre: "Gobernanza",               peso: 15, s: { aws: 4, azure: 4, gcp: 5, oci: 2 } },
      { id: "seg",   nombre: "Seguridad",                peso: 10, s: { aws: 5, azure: 5, gcp: 4, oci: 4 } },
      { id: "orq",   nombre: "Orquestación",             peso: 5,  s: { aws: 5, azure: 4, gcp: 4, oci: 3 } },
      { id: "ia",    nombre: "IA",                       peso: 5,  s: { aws: 5, azure: 5, gcp: 5, oci: 3 } },
      { id: "costo", nombre: "Costo (5 × mín / costo)",  peso: 10, calculado: true }
    ],
    advertencia: "Los puntajes 1–5 son juicio del equipo; no hay una escala por nivel (auditoría).",
    sensEcosistema25Informe: { aws: 4.29, azure: 4.22, gcp: 4.55, oci: 3.20 }
  },

  /* Servicios por componente (tabla 3 / C5) */
  servicios: {
    storage: { aws: "Amazon S3 (11 nueves, Iceberg)", azure: "ADLS Gen2", gcp: "Cloud Storage + BigLake (Iceberg)", oci: "Object Storage (región en Bogotá)" },
    ingest:  { aws: "Kinesis / Firehose, IoT Core, DMS", azure: "Event Hubs, IoT Hub, Data Factory", gcp: "Pub/Sub, Datastream (CDC), Storage Transfer", oci: "Streaming, Data Integration, GoldenGate" },
    proc:    { aws: "AWS Glue / EMR Serverless", azure: "Synapse Spark / Databricks (Microsoft recomienda Fabric)", gcp: "Managed Service for Apache Spark ($0,06/DCU-h), Dataflow", oci: "OCI Data Flow" },
    query:   { aws: "Athena $5/TB · Quick Suite", azure: "Synapse serverless $5/TB · Power BI Pro $14/usuario", gcp: "BigQuery $6,25/TiB (1 TiB gratis) · Looker Studio sin costo", oci: "Autonomous AI Lakehouse $0,336/ECPU-h (tiempo encendido)" },
    gov:     { aws: "Lake Formation + Glue Catalog + DataZone + Glue DQ", azure: "Purview Unified Catalog ($0,50/activo/mes)", gcp: "Knowledge Catalog: linaje automático, calidad, perfilado", oci: "Data Catalog (sin linaje nativo)" },
    sec:     { aws: "IAM, KMS, GuardDuty, Macie", azure: "Entra ID, Key Vault, Defender", gcp: "IAM + Workforce Identity Federation, KMS (CMEK), VPC Service Controls, SCC, Sensitive Data Protection", oci: "IAM, Vault, Cloud Guard, Data Safe" },
    orch:    { aws: "Step Functions · MWAA (~$358/mes)", azure: "Data Factory · Fabric", gcp: "Workflows + Scheduler (Fase 1) · Managed Airflow (~$583/mes, Fase 2)", oci: "Data Integration" },
    ai:      { aws: "SageMaker, Bedrock", azure: "Azure ML, Azure OpenAI", gcp: "Vertex AI, Gemini, BigQuery ML (ARIMA_PLUS en SQL)", oci: "Data Science, Generative AI" }
  },
  nombresVigentes: [
    { actual: "Managed Service for Apache Spark", antes: "Dataproc Serverless / Serverless for Apache Spark" },
    { actual: "Knowledge Catalog", antes: "Dataplex Universal Catalog (renombrado el 10-abr-2026)" },
    { actual: "Managed Service for Apache Airflow", antes: "Cloud Composer" }
  ],

  /* Rasgos comparativos usados en las diapositivas 7–9 */
  rasgos: {
    precioGB:      { aws: 0.023, azure: 0.021, gcp: 0.020, oci: 0.0255 },
    iotGestionado: { aws: "IoT Core", azure: "IoT Hub", gcp: null, oci: null },
    cdc:           { aws: "DMS", azure: "Data Factory", gcp: "Datastream", oci: "GoldenGate" },
    precioSpark:   { aws: "$0,44/DPU-h (4 vCPU)", azure: "$0,138/vCore-h", gcp: "$0,06/DCU-h", oci: "$0,025/OCPU-h" },
    modeloSQL:     { aws: "Por TB escaneado", azure: "Por TB escaneado", gcp: "Por TiB escaneado · 1 TiB gratis", oci: "Por hora encendida" },
    biSinLicencia: { aws: false, azure: false, gcp: true, oci: false },
    serviciosGob:  { aws: 4, azure: 1, gcp: 1, oci: 1 },
    linaje:        { aws: "Repartido en servicios", azure: "Linaje visual", gcp: "Automático (retiene 30 días)", oci: "Sin linaje nativo" },
    deteccion:     { aws: "GuardDuty + Macie", azure: "Defender", gcp: "SCC Standard (avanzada = Premium)", oci: "Cloud Guard" },
    region:        { aws: "Local Zone en Bogotá", azure: "Sin región en Colombia", gcp: "Sin región en Colombia (us-east1)", oci: "Región en Bogotá (dic-2023)" }
  },

  /* Panel "Qué dejas de atender" (C7) */
  brechas: {
    gcp: [
      { brecha: "Sin IoT gestionado (desde ago-2023)", falla: [3], impacto: "Los sensores de bodega no tienen un servicio nativo de ingesta.", mitigacion: "Broker MQTT (socio o GKE) que publica en Pub/Sub; los sensores no cambian.", costo: null },
      { brecha: "Sin región en Colombia", falla: [], tema: "Cumplimiento", impacto: "Datos personales fuera del país.", mitigacion: "Región en EE. UU. (país adecuado) + contrato de transmisión + CMEK.", costo: null },
      { brecha: "Linaje retenido 30 días", falla: [4], impacto: "Se pierde el historial de auditoría.", mitigacion: "Exportar a BigQuery con la API de Data Lineage.", costo: "Marginal" },
      { brecha: "Menos talento certificado", falla: [], tema: "Riesgo de ejecución", impacto: "Curva de aprendizaje y dependencia del socio.", mitigacion: "Plan de certificación y socio de implementación en Fase 1.", costoCOPM: 40 },
      { brecha: "Detección avanzada de amenazas", falla: [], tema: "Seguridad", impacto: "SCC Standard no equivale a GuardDuty/Macie/Defender.", mitigacion: "Evaluar SCC Premium.", costo: null },
      { brecha: "Airflow gestionado caro", falla: [], tema: "Costo", impacto: "+US$ 583/mes; GCP pasaría a ser el más caro.", mitigacion: "Workflows + Scheduler en Fase 1; Airflow en Fase 2.", costoUSD: 583.20 }
    ],
    aws: [
      { brecha: "Gobierno repartido en 4 servicios", falla: [2, 4], impacto: "Integración compleja para una organización en Nivel 1.", mitigacion: "Equipo de plataforma con experiencia en Lake Formation + DataZone.", costo: null },
      { brecha: "Exceso de opciones; precios difíciles de estimar", falla: [], tema: "Costo / ejecución", impacto: "Riesgo de sobrecosto y de diseño (Clase 4 · Comparativa, diap. 5 y 16).", mitigacion: "FinOps desde el Sprint 1.", costo: null },
      { brecha: "No es el recomendado por el curso para retail", falla: [], tema: "Alineación", impacto: "Pierde el respaldo de Clase 4 · Comparativa, diap. 18.", mitigacion: "—", costo: null }
    ],
    azure: [
      { brecha: "El más caro (más del doble que GCP)", falla: [], tema: "Costo", impacto: "Diferencia sostenida cada mes.", mitigacion: "Purview reducido (100 activos): baja a US$ 612.", costo: null },
      { brecha: "Purview cobra por activo gobernado", falla: [2], impacto: "US$ 300/mes justo cuando hay que gobernar 300 elementos críticos.", mitigacion: "Gobernar por fases.", costoUSD: 300 },
      { brecha: "Transición de Synapse a Fabric", falla: [], tema: "Hoja de ruta", impacto: "Riesgo de rediseño (Clase 4 · Comparativa, diap. 16).", mitigacion: "Diseñar sobre Fabric desde el inicio.", costo: null },
      { brecha: "Su ventaja no aplica al caso", falla: [], tema: "Ecosistema", impacto: "Microsoft 365 / ERP en Azure no aparecen en el caso.", mitigacion: "Reevaluar si existe un Enterprise Agreement.", costo: null }
    ],
    oci: [
      { brecha: "SQL por tiempo encendido", falla: [1], impacto: "Las consultas esporádicas salen caras.", mitigacion: "Apagar el motor fuera de horario.", costo: null },
      { brecha: "Sin linaje nativo", falla: [4], impacto: "La falla 4 queda SIN atender.", mitigacion: "Herramienta de terceros.", costo: null },
      { brecha: "Gobernanza 2/5", falla: [2], impacto: "Falla 2 con mínima cobertura.", mitigacion: "Catálogo complementario.", costo: null },
      { brecha: "Ecosistema de datos menor", falla: [], tema: "Ejecución", impacto: "Menos herramientas y talento.", mitigacion: "—", costo: null },
      { brecha: "Su ventaja (legado Oracle) no aplica", falla: [], tema: "Ecosistema", impacto: "El caso no reporta ERP Oracle.", mitigacion: "—", costo: null }
    ]
  },
  aFavor: {
    gcp: "Menor costo con la carga de referencia; linaje y calidad nativos; recomendado para retail.",
    aws: "La opción más madura; la más fuerte en IoT y seguridad.",
    azure: "Mejor si domina el ecosistema Microsoft (365, Entra ID, Power BI).",
    oci: "Región en Bogotá y el cómputo más barato."
  },
  /* Semáforo de las 5 fallas por proveedor: ok = atendida · mit = con mitigación · no = sin atender
     (valoración del equipo derivada del informe y de C7) */
  semaforo: {
    gcp:   { 1: "ok",  2: "ok",  3: "mit", 4: "mit", 5: "ok" },
    aws:   { 1: "ok",  2: "mit", 3: "ok",  4: "mit", 5: "ok" },
    azure: { 1: "ok",  2: "mit", 3: "ok",  4: "ok",  5: "ok" },
    oci:   { 1: "mit", 2: "mit", 3: "ok",  4: "no",  5: "ok" }
  },

  /* Costo de no actuar (tabla 10) — COP M/año */
  noActuar: {
    min: 7634, max: 12002, pctIngresos: "0,98% a 1,54%",
    items: [
      { nombre: "Agotados (margen perdido)", min: 4368, max: 8736 },
      { nombre: "Exceso de inventario", min: 1385, max: 1385 },
      { nombre: "Fuga en promociones y precios", min: 585, max: 585 },
      { nombre: "Trabajo manual de consolidación", min: 1296, max: 1296 }
    ],
    nota: "Supuestos del equipo consultor; deben validarse con datos internos."
  },

  /* Diapositiva 5: alternativas (derivadas del caso; el informe no las detalla) */
  alternativas: {
    validar: true,
    opciones: [
      { id: "statu", nombre: "Seguir con BD + Excel" },
      { id: "dw", nombre: "Bodega tradicional (DW)" },
      { id: "dl", nombre: "Data Lake con gobierno" }
    ],
    criterios: [
      { nombre: "Datos no estructurados (IoT, redes)", v: { statu: "no", dw: "no", dl: "ok" } },
      { nombre: "Fuente única de verdad", v: { statu: "no", dw: "ok", dl: "ok" } },
      { nombre: "Linaje y gobierno", v: { statu: "no", dw: "mit", dl: "ok" } },
      { nombre: "Latencia < 24 h y streaming", v: { statu: "no", dw: "mit", dl: "ok" } },
      { nombre: "Escala con pago por uso", v: { statu: "no", dw: "mit", dl: "ok" } }
    ]
  },

  metodo: [
    { paso: "10 criterios", detalle: "Los mínimos de la especificación (sección 5)." },
    { paso: "Carga idéntica", detalle: "10 TB almacenados + 1 TB procesado/mes para los 4." },
    { paso: "Precios oficiales", detalle: "Listas y documentación al 24-sep-2026." },
    { paso: "Ponderación por fallas", detalle: "Consulta y gobernanza al 15%: atacan fuente única, gobierno y linaje." }
  ],
  porQueGCP: [
    { texto: "Recomendado para Retail y E-commerce", cita: "Clase 4 · Comparativa, diap. 18" },
    { texto: "Azure solo gana con Microsoft 365, AD o ERP en Azure", cita: "Clase 9, diap. 19" },
    { texto: "Caso de referencia: cadena europea con BigQuery + IoT en Cloud Storage + Vertex AI", cita: "Clase 4 · Comparativa, diap. 14" },
    { texto: "Condición de revisión: un Enterprise Agreement con Microsoft reabre la decisión", cita: "Caso ConstructAndes, diap. 7" }
  ],

  /* TO-BE (6.3) — comps: componentes de costo GCP asociados */
  tobe: {
    fuentes: ["POS (340 tiendas)", "E-commerce", "ERP de inventario", "IoT de bodegas", "Redes sociales"],
    componentes: [
      { id: "ing",  n: 1, nombre: "Ingesta", servicios: ["Pub/Sub", "Spark JDBC/API", "Datastream (Fase 2)", "Storage Transfer"], fallas: [3, 5], comps: ["ingest"], funcion: "Streaming de ventas, e-commerce e IoT (vía broker MQTT); batch de ERP y redes; todo aterriza en raw." },
      { id: "alm",  n: 2, nombre: "Almacenamiento", servicios: ["Cloud Storage", "BigLake (Iceberg)"], zonas: ["raw", "curated", "consumption"], fallas: [1, 3], comps: ["storage"], funcion: "Raw inmutable; curated limpio con PII cifrada; consumption con KPIs certificados (fuente única)." },
      { id: "proc", n: 3, nombre: "Procesamiento", servicios: ["Managed Service for Apache Spark", "Dataflow", "Reglas de calidad"], fallas: [4, 5], comps: ["proc"], funcion: "Raw → curated → consumption; un dato solo se promueve si pasa la calidad." },
      { id: "cons", n: 4, nombre: "Consulta e IA", servicios: ["BigQuery", "Looker Studio", "BigQuery ML", "Vertex AI + Gemini"], fallas: [1], comps: ["query", "ai"], funcion: "SQL serverless; tableros para comité y tiendas; pronóstico de demanda con SQL." },
      { id: "gob",  n: 5, nombre: "Gobernanza", servicios: ["Knowledge Catalog", "Sensitive Data Protection"], fallas: [2, 4], comps: ["gov"], funcion: "Catálogo, glosario, dominios y dueños; linaje automático; clasificación de PII." }
    ],
    transversales: [
      { id: "seg", nombre: "Seguridad", servicios: ["IAM + Workforce Identity Federation", "Cloud KMS (CMEK)", "VPC Service Controls", "SCC", "Audit Logs"], comps: ["sec"], funcion: "Identidades corporativas, mínimo privilegio, llaves propias, perímetro anti-exfiltración." },
      { id: "orq", nombre: "Orquestación", servicios: ["Workflows + Scheduler (Fase 1)", "Managed Airflow (Fase 2)", "Cloud Monitoring"], comps: ["orch"], funcion: "Programación, reintentos, alertas y frescura del dato (< 24 h)." }
    ]
  },
  trazabilidad: [
    { falla: 1, respuesta: "Zona consumption con KPIs certificados", indicador: "% de KPIs del comité servidos desde ella" },
    { falla: 2, respuesta: "Knowledge Catalog con dominios y dueños", indicador: "Dominios con Data Owner designado" },
    { falla: 3, respuesta: "Un único lago con Iceberg", indicador: "% de fuentes críticas ingeridas" },
    { falla: 4, respuesta: "Linaje automático exportado", indicador: "% de pipelines con linaje" },
    { falla: 5, respuesta: "Pub/Sub + Dataflow + batch diario", indicador: "Horas entre la transacción y su disponibilidad" }
  ],

  /* Hoja de ruta: 3 sprints-incrementos × 2 iteraciones de 4 semanas */
  roadmap: {
    semanas: 24, iteracionSemanas: 4,
    nota: "Cada sprint-incremento se ejecuta en 2 iteraciones de 4 semanas (24 semanas en total): Scrum limita un sprint a 1 mes (Clase 4 · Scrum, diap. 6).",
    sprints: [
      { n: 1, nombre: "Fundaciones", semanas: [1, 8], entregables: ["Proyectos GCP", "Federación de identidades", "CMEK + VPC SC", "Ingesta de POS y ERP", "Owners y Stewards designados", "Inventario de fuentes"], costoCOPM: 461.0 },
      { n: 2, nombre: "Datos confiables", semanas: [9, 16], entregables: ["Spark raw → curated", "Glosario", "Reglas de calidad", "Clasificación de PII", "Ingesta de e-commerce, IoT y redes"], costoCOPM: 435.8 },
      { n: 3, nombre: "Valor de negocio", semanas: [17, 24], entregables: ["Zona consumption", "Tableros", "Piloto de pronóstico (BigQuery ML)", "Indicadores del Nivel 1", "Compuerta de decisión"], costoCOPM: 409.8 }
    ],
    compuertas: [
      { semana: 0, nombre: "Prueba de concepto", detalle: "3 semanas · COP 66,5 M" },
      { semana: 24, nombre: "Compuerta mes 6", detalle: "≥ 10 de 12 indicadores" },
      { semana: 48, nombre: "Compuerta mes 12", detalle: "Beneficios ≥ 70% del plan" }
    ],
    fase1COPM: 1306.6
  },

  /* Modelo de gobierno — Fase 1 (sección 10) */
  gobierno: {
    roles: [
      { rol: "Comité de Gobierno", quien: "Patrocinador: VP Financiero; Owners; TI; Oficial de Protección de Datos", hace: "Aprueba políticas; resuelve conflictos; decide en las compuertas" },
      { rol: "Líder de Gobierno", quien: "Nuevo rol, tiempo completo", hace: "Coordina el programa, glosario e indicadores" },
      { rol: "Data Owners", quien: "Gerentes de los 5 dominios", hace: "Aprueban definiciones, reglas y accesos" },
      { rol: "Data Stewards", quien: "Un analista senior por dominio", hace: "Documentan CDE; definen y monitorean calidad" },
      { rol: "Data Custodians", quien: "Ingeniería de datos y plataforma (TI)", hace: "Operan GCP: pipelines, accesos, cifrado, linaje" },
      { rol: "Usuarios", quien: "Analistas, gerentes de tienda, comité", hace: "Usan datos certificados; reportan problemas" }
    ],
    dominios: [
      { area: "Comercial", dominio: "Ventas" },
      { area: "Mercadeo / E-commerce", dominio: "Cliente" },
      { area: "Abastecimiento", dominio: "Inventario y proveedores" },
      { area: "Logística", dominio: "Bodegas / IoT" },
      { area: "Financiero", dominio: "Finanzas" }
    ],
    fuentes: [
      { fuente: "POS", criticidad: "Alta", pii: "Sí" },
      { fuente: "E-commerce", criticidad: "Alta", pii: "Sí" },
      { fuente: "ERP", criticidad: "Alta", pii: "Limitada" },
      { fuente: "IoT", criticidad: "Media", pii: "No" },
      { fuente: "Redes sociales", criticidad: "Media", pii: "Posible" }
    ],
    lineamientos: ["Propiedad", "Definición única de KPIs", "Clasificación (pública, interna, confidencial, personal)", "Mínimo privilegio", "Promoción entre zonas solo si pasa la calidad", "Trazabilidad", "Retención de 13 meses"],
    calidad: [
      { dim: "Completitud", umbral: "≥ 99,5%" }, { dim: "Unicidad", umbral: "100%" },
      { dim: "Validez", umbral: "≥ 99%" }, { dim: "Consistencia ERP vs POS", umbral: "≤ 2%" },
      { dim: "Oportunidad", umbral: "≤ 24 h (≤ 15 min streaming)" }, { dim: "Exactitud", umbral: "≤ 0,5%" }
    ]
  },

  /* 12 indicadores del Nivel 1 (sección 10.6) */
  indicadores: [
    { n: 1, nombre: "Dominios con Owner", base: "0%", meta: "100%" },
    { n: 2, nombre: "Stewards capacitados", base: "0%", meta: "100%" },
    { n: 3, nombre: "Fuentes catalogadas", base: "0%", meta: "100%" },
    { n: 4, nombre: "Políticas aprobadas", base: "0", meta: "4" },
    { n: 5, nombre: "CDE con definición", base: "0%", meta: "≥ 80%" },
    { n: 6, nombre: "CDE con reglas de calidad", base: "0%", meta: "≥ 60%" },
    { n: 7, nombre: "Índice de calidad", base: "Sin medición", meta: "≥ 95%" },
    { n: 8, nombre: "Pipelines con linaje", base: "0%", meta: "≥ 90%" },
    { n: 9, nombre: "PII clasificada", base: "0%", meta: "100%" },
    { n: 10, nombre: "Latencia", base: "96–168 h", meta: "≤ 24 h" },
    { n: 11, nombre: "KPIs desde fuente única", base: "0%", meta: "≥ 70%" },
    { n: 12, nombre: "Sesiones del comité", base: "N/A", meta: "100%" }
  ],
  reglaNivel1: { cumplir: 10, de: 12 },
  notaClase6: "Validar contra Clase 6, diap. 11 antes de exponer: el informe no tuvo acceso a la Clase 6 (diap. 9–11) y usó DMBOK2 como sustituto.",

  /* Modelo financiero a 5 años (sección 9) — COP M */
  financiero: {
    inversionTotal: 12876, inversionUSDM: 4.01,
    porAnio: [ { p: "Fase 0", v: 66.5 }, { p: "Año 1", v: 2266 }, { p: "Año 2", v: 2658 }, { p: "Año 3", v: 2624 }, { p: "Año 4", v: 2637 }, { p: "Año 5", v: 2625 } ],
    pctPersonas: 79, pctNube: 10,
    umbralBeneficio: 3484,
    escenarios: [
      { id: "cons", nombre: "Conservador", beneficio: 1334, vpn: -6015, tir: null, tirTxt: "n/c", recuperacion: null, recTxt: "No se recupera" },
      { id: "base", nombre: "Base", beneficio: 3535, vpn: 142, tir: 14.9, tirTxt: "14,9%", recuperacion: 48, recTxt: "Mes 48" },
      { id: "opt",  nombre: "Optimista", beneficio: 5937, vpn: 6861, tir: 134.8, tirTxt: "134,8%", recuperacion: 23, recTxt: "Mes 23" }
    ],
    tasa: 12,
    sensibilidad: [
      { var: "Base", vpn: 142 },
      { var: "Tasa 10%", vpn: 250 },
      { var: "Tasa 15%", vpn: -3 },
      { var: "Devaluación 20%", vpn: 55 },
      { var: "Sobrecosto 15%", vpn: -1310 },
      { var: "Retraso 6 meses", vpn: -1374 }
    ],
    fase1COPM: 1307, difGcpAzure60mInforme: 24492
  },
  poc: {
    costoCOPM: 66.5, costoUSDk: 20.7, semanas: 3, tiendas: 20, skus: 500, datosGB: 200,
    criterios: [
      { m: "Error de pronóstico (WAPE)", u: "−15%" },
      { m: "Latencia", u: "≤ 24 h" },
      { m: "Calidad (10 reglas)", u: "≥ 98%" },
      { m: "Exactitud vs contabilidad", u: "≤ 0,5%" },
      { m: "Linaje y dueños", u: "100%" },
      { m: "Costo real vs estimado", u: "± 20%" }
    ],
    regla: "6 de 6 → Fase 1 · 4–5 → +1 semana con plan correctivo · < 4 → replantear"
  },
  decisiones: [
    { n: 1, texto: "Aprobar GCP y la prueba de concepto", monto: "COP 66,5 M" },
    { n: 2, texto: "Designar a los Data Owners de los 5 dominios", monto: null },
    { n: 3, texto: "Aprobar la Fase 1, condicionada a la prueba de concepto", monto: "COP 1.307 M" }
  ],

  /* Regulación (E-05) */
  regulacion: {
    colombia: { norma: "Ley 1581 de 2012", figura: "Transmisión (proveedor de nube = encargado)", base: "Decreto 1377 de 2013, art. 25; DUR 1074 de 2015", requisito: "Contrato de transmisión", pais: "EE. UU.: país adecuado (Circular Externa 005 de 2017, SIC)", sancion: "Hasta 2.000 SMMLV por infracción (COP 3.502 M)" },
    peru: { norma: "Ley 29733 + DS 016-2024-JUS (desde 30-mar-2025)", sancion: "Hasta 100 UIT; Oficial de Datos obligatorio; incidentes en 48 h", exposicion: "Media-baja: contactos de proveedores" },
    ecuador: { norma: "LOPDP (2021), sanciones desde 26-may-2023", sancion: "0,7% a 1% del volumen de negocio (graves)", exposicion: "Media-baja: contactos de proveedores" },
    regiones: "OCI es el único con región en Bogotá (desde dic-2023); AWS tiene una Local Zone en Bogotá."
  },

  /* Fe de erratas: original → corregido → motivo */
  erratas: [
    { id: "E-01", que: "IA de GCP (Vertex AI)", orig: "US$ 17,48 · total GCP 379,00", corr: "US$ 8,74 · total GCP 370,26", motivo: "Precio n1-standard-4 = 0,2185/h, no 0,437.", interruptor: "Corregidas" },
    { id: "E-04", que: "Procesamiento de AWS", orig: "US$ 132,00 (Glue) · total 523,06", corr: "US$ 90,89 (EMR Serverless) · total 481,95", motivo: "Comparar con el Spark serverless más barato. Estimación; validar con la calculadora.", interruptor: "Corregidas" },
    { id: "E-03", que: "Seguridad AWS / Azure", orig: "US$ 68,44 / 30,50", corr: "US$ 5,94 / 3,00", motivo: "Detección de amenazas sin equivalente en GCP (SCC Standard).", interruptor: "Normalizar seguridad" },
    { id: "E-05", que: "Marco legal", orig: "\"Transferencia\" a país adecuado (art. 26)", corr: "Transmisión con contrato (Decreto 1377/2013, art. 25; DUR 1074/2015)", motivo: "El proveedor de nube actúa como encargado.", interruptor: "Siempre" },
    { id: "E-06", que: "Peso del almacenamiento", orig: "≈ 50–60% del total", corr: "≈ 49–59% (AWS 48,5%)", motivo: "Recalculado sobre la tabla 4.", interruptor: "Siempre" },
    { id: "NOM", que: "Nombres de servicios", orig: "Serverless for Apache Spark · Dataplex · Composer", corr: "Managed Service for Apache Spark · Knowledge Catalog · Managed Service for Apache Airflow", motivo: "Nombres vigentes (Knowledge Catalog: 10-abr-2026).", interruptor: "Siempre" },
    { id: "ECO", que: "Mensaje económico", orig: "\"Es rentable\"", corr: "Crea valor si se ejecuta: requiere capturar ≥ COP 3.484 M/año", motivo: "VPN base estrecho (COP 142 M).", interruptor: "Siempre" },
    { id: "C6", que: "Indicadores del Nivel 1", orig: "Basados en DMBOK2", corr: "Validar contra Clase 6, diap. 11", motivo: "El informe no tuvo acceso a la Clase 6.", interruptor: "Siempre" }
  ],

  /* Convención de citas (tabla 27) */
  convencionCitas: [
    { cita: "Clase 4 · Comparativa", pres: "Arquitectura de Data Lake: Comparativa de Servicios en la Nube" },
    { cita: "Clase 9", pres: "Data Lakes Modernos en la Nube: Gobernanza, Seguridad y Orquestación (tabla de costos en diap. 18)" },
    { cita: "Clase 2 · DAMA", pres: "Gobierno de Datos — DAMA-DMBOK" },
    { cita: "Clase 2 · Integraciones", pres: "Lineamiento de Integraciones de datos" },
    { cita: "Clase 4 · Data-Driven", pres: "¿Qué es una organización data-driven?" },
    { cita: "Clase 4 · Estrategia", pres: "De la medición a la estrategia (KPI y OKR)" },
    { cita: "Clase 4 · Scrum", pres: "Introducción a la Gestión de Proyectos con Scrum" },
    { cita: "Clase Big Data", pres: "Big Data y Cloud Computing" },
    { cita: "Caso ConstructAndes", pres: "De los Silos de Datos al Data Lake Multicloud" },
    { cita: "Clase 6", pres: "Modelo de madurez (diap. 9–11) — no incluida en el material; pendiente" }
  ],
  fuentesClave: [
    "Listas oficiales de precios de AWS, Google Cloud y Oracle (24-sep-2026)",
    "Azure: fuentes secundarias 2026 (validar en la calculadora)",
    "SIC, Circular Externa 005 de 2017",
    "DAMA-DMBOK2 (2017), pp. 76–78 y 507–511",
    "Gruen, Corsten y Bharadwaj (2002); McKinsey (2021, 2022); IHL Group (2025)"
  ],

  /* Pendientes visibles para el equipo */
  porDefinir: [
    "Nombres de los integrantes del grupo (portada)",
    "Costo del broker MQTT para IoT en GCP",
    "Costo de SCC Premium (detección avanzada)",
    "Costo de mitigaciones de AWS, Azure y OCI",
    "Precio de OCI Data Catalog (no publicado; se asumió 0)",
    "Indicadores del Nivel 1 contra Clase 6, diap. 11",
    "Alternativas de la diapositiva 5 (derivadas del caso)",
    "EMR Serverless (E-04): validar con la calculadora de AWS"
  ]
};
