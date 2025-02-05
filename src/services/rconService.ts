import { ConnectionSettings, RconResponse } from "@/types/rcon";

export const rconService = {
  connect: async (settings: ConnectionSettings): Promise<RconResponse> => {
    return sendCommand(settings, "help");
  },

  sendCommand: async (
    settings: ConnectionSettings,
    command: string
  ): Promise<RconResponse> => {
    return sendCommand(settings, command);
  }
};

const sendCommand = async (
  settings: ConnectionSettings,
  command: string
): Promise<RconResponse> => {
  try {
    const res = await fetch("/api/rcon", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...settings,
        command
      })
    });

    return await res.json();
  } catch (error) {
    console.error("Failed to send command:", error);
    return {
      success: false,
      data: "Failed to send command"
    };
  }
};
