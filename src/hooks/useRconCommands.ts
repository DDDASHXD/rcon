import React from "react";
import { Response, ConnectionSettings, GameConfig } from "@/types/rcon";
import { rconService } from "@/services/rconService";
import config from "@/config.json";

const typedConfig = config as GameConfig;

export const useRconCommands = (connection: ConnectionSettings) => {
  const [responses, setResponses] = React.useState<Response[]>([]);
  const [game, setGame] = React.useState("pz");
  const [inputValue, setInputValue] = React.useState("");
  const [filteredCommands, setFilteredCommands] = React.useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [showDropdown, setShowDropdown] = React.useState(false);

  React.useEffect(() => {
    const filtered = Array.from(new Set(typedConfig[game].commands))
      .filter((command) => {
        if (inputValue === "") return false;
        const searchTerm = inputValue.toLowerCase();
        const commandLower = command.toLowerCase();
        return commandLower.startsWith(searchTerm);
      })
      .sort();

    setFilteredCommands(filtered);
    setSelectedIndex(filtered.length > 0 ? 0 : -1);
    setShowDropdown(filtered.length > 0);
  }, [inputValue, game]);

  const sendCommand = async (command: string) => {
    if (command.toLowerCase() === "clear") {
      clearResponses();
      setInputValue("");
      return true;
    }

    try {
      const response = await rconService.sendCommand(connection, command);
      if (response.success) {
        setResponses((prev) => [
          ...prev,
          {
            command,
            result: response.data,
            timestamp: Date.now()
          }
        ]);
        setInputValue("");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to send command:", error);
      return false;
    }
  };

  const handleCommandSelection = (command: string) => {
    setInputValue(command);
    setShowDropdown(false);
  };

  const clearResponses = () => {
    setResponses([]);
  };

  return {
    responses,
    game,
    inputValue,
    filteredCommands,
    selectedIndex,
    showDropdown,
    setGame,
    setInputValue,
    setSelectedIndex,
    setShowDropdown,
    sendCommand,
    handleCommandSelection,
    clearResponses,
    availableGames: Object.keys(typedConfig)
  };
};
