/** Elimina etiquetas HTML y espacios excesivos de una cadena */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export interface DRServicio {
  id: number;
  categoria: string;
  titulo: string;
  resumen: string;
  descripcion: string;
  precio: string;
  precio_vip: string;
  tags: string[];
  url: string;
}

const DR_API_URL =
  "https://www.doctorrecetas.com/api/todas_las_ordenes.php";

let _cache: DRServicio[] | null = null;
let _cacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

/** Recupera y normaliza todos los servicios de DoctorRecetas.com */
export async function getDRServicios(): Promise<DRServicio[]> {
  const now = Date.now();
  if (_cache && now - _cacheTime < CACHE_TTL_MS) return _cache;

  const res = await fetch(DR_API_URL, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`DoctorRecetas API error: ${res.status}`);

  const data = await res.json();

  const servicios: DRServicio[] = [];

  for (const [categoria, items] of Object.entries(data)) {
    if (!Array.isArray(items)) continue;
    for (const item of items as Record<string, unknown>[]) {
      servicios.push({
        id: item.id as number,
        categoria,
        titulo: String(item.titulo ?? "").trim(),
        resumen: stripHtml(String(item.resumen ?? "")),
        descripcion: stripHtml(String(item.detalle ?? "")).slice(0, 600),
        precio: String(item.precio ?? ""),
        precio_vip: String(item.precio_vip ?? ""),
        tags: Array.isArray(item.tags)
          ? item.tags.flatMap((t: string) => t.split(",").map((s) => s.trim()))
          : [],
        url: `https://www.doctorrecetas.com${item.url}`,
      });
    }
  }

  _cache = servicios;
  _cacheTime = now;
  return servicios;
}

/**
 * Convierte el catálogo completo en un bloque de texto compacto
 * para inyectar como contexto en el prompt de Ollama.
 */
export function formatCatalogoParaPrompt(servicios: DRServicio[]): string {
  const lines: string[] = [
    "=== CATÁLOGO DE SERVICIOS DE DOCTORRECETAS.COM ===",
    "DoctorRecetas es una plataforma de telemedicina que ofrece consultas médicas, órdenes de laboratorio, pruebas diagnósticas, certificados médicos y paquetes de salud de forma remota y digital.",
    "",
  ];

  for (const s of servicios) {
    lines.push(`[${s.categoria}] ${s.titulo} | $${s.precio} (VIP: $${s.precio_vip})`);
    if (s.resumen) lines.push(`  Resumen: ${s.resumen}`);
    if (s.descripcion) lines.push(`  Detalle: ${s.descripcion}`);
    if (s.tags.length) lines.push(`  Tags: ${s.tags.join(", ")}`);
    lines.push(`  URL: ${s.url}`);
    lines.push("");
  }

  lines.push("=== FIN DEL CATÁLOGO ===");
  return lines.join("\n");
}

/** Palabras clave que indican que el usuario pregunta sobre health/DR */
const DR_KEYWORDS = [
  "doctor recetas",
  "doctorrecetas",
  "síntoma",
  "sintoma",
  "dolor",
  "fiebre",
  "tos",
  "gripe",
  "covid",
  "prueba",
  "análisis",
  "analisis",
  "examen",
  "laboratorio",
  "lab",
  "receta",
  "certificado",
  "consulta médica",
  "consulta medica",
  "embarazo",
  "diabetes",
  "influenza",
  "tiroides",
  "colesterol",
  "presión",
  "presion",
  "sangre",
  "orina",
  "cáncer",
  "cancer",
  "vacuna",
  "medicamento",
  "tratamiento",
  "diagnóstico",
  "diagnostico",
  "infección",
  "infeccion",
  "garganta",
  "mamografía",
  "mamografia",
  "ets",
  "its",
  "vih",
  "sifilis",
  "clamidia",
  "gonorrea",
  "hba1c",
  "glucosa",
  "tiroides",
  "tsh",
  "refill",
  "peso",
  "telemedicina",
  "médico",
  "medico",
  "salud",
];

export function esPreguntaMedica(texto: string): boolean {
  const lower = texto.toLowerCase();
  return DR_KEYWORDS.some((kw) => lower.includes(kw));
}
