import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import {
  getDRServicios,
  formatCatalogoParaPrompt,
  esPreguntaMedica,
} from "@/lib/doctor-recetas";

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-3-haiku-20240307";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt requerido" }, { status: 400 });
    }

    // ── Contexto DoctorRecetas ─────────────────────────────────────────────
    let systemPrompt = "Eres un asistente médico inteligente y amable.";

    if (esPreguntaMedica(prompt)) {
      try {
        const servicios = await getDRServicios();
        const catalogo = formatCatalogoParaPrompt(servicios);

        systemPrompt = `Eres un asistente médico virtual de DoctorRecetas.com, una plataforma de telemedicina.
Tienes acceso al catálogo actualizado de servicios médicos. Usa esa información para responder con precisión.
Cuando recomiendes un servicio, indica el nombre, precio y URL.
Si la pregunta trata síntomas, orienta al paciente y sugiere el servicio más adecuado del catálogo.
No inventes servicios que no estén en el catálogo.

${catalogo}`;
      } catch (err) {
        console.warn("[chat] No se pudo cargar catálogo DR:", err);
      }
    }
    // ─────────────────────────────────────────────────────────────────────

    // Call Claude API
    const message = await anthropic.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract text from response
    const reply = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    if (!reply) {
      return NextResponse.json(
        { error: "Respuesta vacía de Claude" },
        { status: 502 }
      );
    }

    return NextResponse.json({ response: reply });
  } catch (error) {
    console.error("[chat] Error:", error);
    
    // Handle specific Anthropic errors
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Claude API: ${error.message}` },
        { status: error.status ?? 500 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno" },
      { status: 500 }
    );
  }
}
