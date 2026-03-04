import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { readFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { randomUUID } from "crypto";

// Binario de Piper instalado vía pip
const PIPER_BIN = "/Users/calebcondor/Library/Python/3.9/bin/piper";

// Modelo de voz español (dentro del proyecto)
const MODEL_PATH = join(
  process.cwd(),
  "piper-models",
  "es_ES-davefx-medium.onnx"
);

/**
 * Ejecuta Piper TTS en un subproceso.
 * Envía el texto por stdin y devuelve el WAV generado como Buffer.
 */
function runPiper(text: string): Promise<Buffer> {
  const outFile = join(tmpdir(), `piper-${randomUUID()}.wav`);

  return new Promise((resolve, reject) => {
    const proc = spawn(PIPER_BIN, [
      "--model", MODEL_PATH,
      "--output_file", outFile,
    ]);

    let stderr = "";
    proc.stderr.on("data", (d: Buffer) => { stderr += d.toString(); });

    proc.on("error", (err) =>
      reject(new Error(`Piper no pudo iniciarse: ${err.message}`))
    );

    proc.on("close", async (code) => {
      if (code !== 0) {
        return reject(new Error(`Piper salió con código ${code}: ${stderr}`));
      }
      try {
        const buf = await readFile(outFile);
        await unlink(outFile).catch(() => {});
        resolve(buf);
      } catch (e) {
        reject(e);
      }
    });

    // Enviar texto via stdin y cerrar el pipe
    proc.stdin.write(text, "utf8");
    proc.stdin.end();
  });
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: "Texto requerido" }, { status: 400 });
    }

    const wavBuffer = await runPiper(text);
    const base64 = wavBuffer.toString("base64");

    return NextResponse.json({ base64, mimeType: "audio/wav" });
  } catch (error) {
    console.error("[TTS] Piper error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error TTS" },
      { status: 500 }
    );
  }
}
