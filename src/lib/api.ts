export async function sendMessage(message: string): Promise<string> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_OLLAMA_URL}/ollama/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: message }), // ✅ CORREGIDO
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
    const reply = data?.response?.content;

    if (!reply) throw new Error("Respuesta inválida del servidor");

    return reply;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Error desconocido al conectar con el servidor");
  }
}
