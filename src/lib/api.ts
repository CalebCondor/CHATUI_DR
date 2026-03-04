/**
 * Convierte texto a voz usando ElevenLabs vía la ruta interna /api/tts.
 * Devuelve una data-URL "data:audio/mpeg;base64,..." o null si falla.
 */
export async function synthesizeSpeech(text: string): Promise<string | null> {
  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) return null;

    const { base64, mimeType } = await res.json();
    if (!base64) return null;

    return `data:${mimeType};base64,${base64}`;
  } catch {
    return null;
  }
}

export async function sendMessage(message: string): Promise<string> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: message }),
    });

    if (!response.ok) {
      let err = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData?.error) err = errorData.error;
      } catch {}
      throw new Error(err);
    }

    const data = await response.json();
    // Ollama devuelve { response: "texto completo" } cuando stream: false
    const reply: string = data?.response;

    if (!reply) throw new Error("Respuesta inválida del servidor");

    return reply;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Error desconocido al conectar con el servidor");
  }
}
