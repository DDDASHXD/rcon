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
    const savedSettings = localStorage.getItem("rconSettings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings) as ConnectionSettings;
      setConnection(settings);
      handleConnect(settings).then(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
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
