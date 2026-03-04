import { NextRequest, NextResponse } from "next/server";
import {
  getDRServicios,
  formatCatalogoParaPrompt,
  esPreguntaMedica,
} from "@/lib/doctor-recetas";

const OLLAMA_HOST = process.env.OLLAMA_HOST ?? "127.0.0.1";
const OLLAMA_PORT = process.env.OLLAMA_PORT ?? "11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "qwen2.5:7b";

const OLLAMA_URL = `http://${OLLAMA_HOST}:${OLLAMA_PORT}/api/generate`;

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt requerido" }, { status: 400 });
    }

    // ── Contexto DoctorRecetas ─────────────────────────────────────────────
    let contextBlock = "";

    if (esPreguntaMedica(prompt)) {
      try {
        const servicios = await getDRServicios();
        const catalogo = formatCatalogoParaPrompt(servicios);

        contextBlock = `
Eres un asistente médico virtual de DoctorRecetas.com, una plataforma de telemedicina.
Tienes acceso al catálogo actualizado de servicios médicos. Usa esa información para responder con precisión.
Cuando recomiendes un servicio, indica el nombre, precio y URL.
Si la pregunta trata síntomas, orienta al paciente y sugiere el servicio más adecuado del catálogo.
No inventes servicios que no estén en el catálogo.

${catalogo}

Con base en el catálogo anterior, responde la siguiente pregunta del usuario:
`;
      } catch (err) {
        console.warn("[chat] No se pudo cargar catálogo DR:", err);
        // Continúa sin contexto si la API falla
      }
    }

    const finalPrompt = contextBlock
      ? `${contextBlock}\n${prompt}`
      : prompt;
    // ─────────────────────────────────────────────────────────────────────

    const ollamaRes = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: finalPrompt,
        stream: false,
      }),
    });

    if (!ollamaRes.ok) {
      const errBody = await ollamaRes.text();
      console.error("[chat] Ollama error:", errBody);
      return NextResponse.json(
        { error: `Ollama: ${errBody}` },
        { status: ollamaRes.status }
      );
    }

    const data = await ollamaRes.json();
    const reply: string = data?.response;

    if (!reply) {
      return NextResponse.json(
        { error: "Respuesta vacía de Ollama" },
        { status: 502 }
      );
    }

    return NextResponse.json({ response: reply });
  } catch (error) {
    console.error("[chat] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno" },
      { status: 500 }
    );
  }
}
