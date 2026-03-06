import { NextResponse } from "next/server";

/**
 * This route is no longer used.
 * Speech-to-text is handled client-side via the Web Speech API (AudioRecorder.tsx).
 * whisper-node required compiling whisper.cpp which is not available on this system.
 */
export async function POST() {
  return NextResponse.json(
    { error: "STT is handled client-side via the Web Speech API" },
    { status: 410 }
  );
}
