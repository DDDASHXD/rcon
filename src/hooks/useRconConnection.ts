import React from "react";
import { ConnectionSettings } from "@/types/rcon";
import { rconService } from "@/services/rconService";

export const useRconConnection = () => {
  const [connection, setConnection] = React.useState<ConnectionSettings>({
    host: "",
    port: "",
    password: ""
  });
  const [isConnected, setIsConnected] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const tryConnect = async () => {
      // Check URL parameters first
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const urlHost = params.get("host");
        const urlPort = params.get("port");
        const urlPassword = params.get("password");

        if (urlHost && urlPort && urlPassword) {
          const urlSettings: ConnectionSettings = {
            host: urlHost,
            port: urlPort,
            password: urlPassword
          };
          setConnection(urlSettings);
          await handleConnect(urlSettings);
          setIsLoading(false);
          return;
        }
      }

      // Fall back to saved settings if no URL parameters
      const savedSettings = localStorage.getItem("rconSettings");
      if (savedSettings) {
        const settings = JSON.parse(savedSettings) as ConnectionSettings;
        setConnection(settings);
        await handleConnect(settings);
      }
      setIsLoading(false);
    };

    tryConnect();
  }, []);

  const handleConnect = async (settingsToUse = connection) => {
    try {
      const response = await rconService.connect(settingsToUse);
      if (response.success) {
        setIsConnected(true);
        localStorage.setItem("rconSettings", JSON.stringify(settingsToUse));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to connect:", error);
      return false;
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    localStorage.removeItem("rconSettings");
  };

  const updateConnection = (field: keyof ConnectionSettings, value: string) => {
    setConnection((prev) => ({ ...prev, [field]: value }));
  };

  return {
    connection,
    isConnected,
    isLoading,
    updateConnection,
    handleConnect,
    handleDisconnect
  };
};
