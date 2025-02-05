import { Rcon } from "rcon-client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { host, port, password, command } = body;

    const rcon = new Rcon({
      host,
      port: parseInt(port),
      password
    });

    await rcon.connect();
    const response = await rcon.send(command);
    rcon.end();

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error("Failed to connect to RCON server:", error);
    return NextResponse.json(
      { success: false, error: "Failed to connect to RCON server" },
      { status: 500 }
    );
  }
}
