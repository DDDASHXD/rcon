"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import config from "@/config.json";
import { Button } from "@/components/ui/button";

interface Response {
  command: string;
  result: string;
  timestamp: number;
}

interface ConnectionSettings {
  host: string;
  port: string;
  password: string;
}

interface GameConfig {
  [key: string]: {
    name: string;
    commands: string[];
    commandDescriptions: { [key: string]: string };
  };
}

const typedConfig = config as GameConfig;

const Home = () => {
  const input = React.useRef<HTMLInputElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [responses, setResponses] = React.useState<Response[]>([]);
  const [connection, setConnection] = React.useState<ConnectionSettings>({
    host: "",
    port: "",
    password: ""
  });
  const [isConnected, setIsConnected] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [game, setGame] = React.useState("pz");
  const [inputValue, setInputValue] = React.useState("");
  const [filteredCommands, setFilteredCommands] = React.useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [showDropdown, setShowDropdown] = React.useState(false);

  // Load saved settings
  React.useEffect(() => {
    const savedSettings = localStorage.getItem("rconSettings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings) as ConnectionSettings;
      setConnection(settings);

      // Auto-connect if settings exist
      handleConnect(settings).then(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleConnect = async (settingsToUse = connection) => {
    try {
      const res = await fetch("/api/rcon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...settingsToUse,
          command: "help" // Test command to verify connection
        })
      });

      const data = await res.json();
      if (data.success) {
        setIsConnected(true);
        // Save settings only after successful connection
        localStorage.setItem("rconSettings", JSON.stringify(settingsToUse));
        setResponses((prev) => [
          ...prev,
          {
            command: "help",
            result: data.data,
            timestamp: Date.now()
          }
        ]);
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
    setResponses([]);
    localStorage.removeItem("rconSettings");
  };

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

  const handleBlur = React.useCallback((e: React.FocusEvent) => {
    // Delay hiding dropdown to allow click events to register
    setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  }, []);

  const handleInput = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (showDropdown && filteredCommands.length > 0 && selectedIndex >= 0) {
        // If dropdown is open and item selected, autocomplete instead of submitting
        e.preventDefault();
        setInputValue(filteredCommands[selectedIndex]);
        setShowDropdown(false);
      } else if (input.current?.value) {
        // Otherwise submit the command
        const command = input.current.value;
        try {
          const res = await fetch("/api/rcon", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              ...connection,
              command
            })
          });

          const data = await res.json();
          if (data.success) {
            setResponses((prev) => [
              ...prev,
              {
                command,
                result: data.data,
                timestamp: Date.now()
              }
            ]);
            setInputValue("");
          }
        } catch (error) {
          console.error("Failed to send command:", error);
        }
      }
    } else if (e.key === "ArrowDown" && filteredCommands.length > 0) {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredCommands.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp" && filteredCommands.length > 0) {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Tab" && filteredCommands.length > 0) {
      e.preventDefault();
      if (selectedIndex >= 0) {
        setInputValue(filteredCommands[selectedIndex]);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [responses]);

  if (isLoading) {
    return (
      <div className="font-mono p-4 flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="font-mono p-4 flex flex-col gap-4 max-w-md mx-auto mt-10">
        <h1 className="text-xl font-bold">RCON Connection</h1>
        <Input
          type="text"
          placeholder="Host"
          value={connection.host}
          onChange={(e) =>
            setConnection((prev) => ({ ...prev, host: e.target.value }))
          }
        />
        <Input
          type="text"
          placeholder="Port"
          value={connection.port}
          onChange={(e) =>
            setConnection((prev) => ({ ...prev, port: e.target.value }))
          }
        />
        <Input
          type="password"
          placeholder="Password"
          value={connection.password}
          onChange={(e) =>
            setConnection((prev) => ({ ...prev, password: e.target.value }))
          }
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => handleConnect()}
        >
          Connect
        </button>
      </div>
    );
  }

  return (
    <div
      className="font-mono p-2 flex flex-col h-screen w-full"
      onClick={() => {
        input.current?.focus();
      }}
    >
      <div className="flex flex-col h-full w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            Connected to: {connection.host}:{connection.port}
          </div>
          <button
            onClick={handleDisconnect}
            className="text-red-500 text-sm hover:text-red-700"
          >
            Disconnect
          </button>
        </div>
        <div className="flex-1 overflow-y-auto mb-4">
          {responses.map((response) => (
            <div key={response.timestamp} className="mb-2">
              <div className="text-gray-500">$ {response.command}</div>
              <pre className="whitespace-pre-wrap">{response.result}</pre>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex items-center gap-2">
          {">"}
          <div className="w-full flex relative">
            <Input
              type="text"
              className="h-max w-full border-none p-0 m-0"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              ref={input}
              onKeyDown={handleInput}
              onFocus={() => setShowDropdown(true)}
              onBlur={handleBlur}
            />
            {showDropdown && filteredCommands.length > 0 && (
              <div className="flex flex-col bg-background p-2 rounded-md absolute bottom-[calc(100%+10px)] max-h-[600px] overflow-y-auto">
                {filteredCommands.map((command, index) => (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`justify-start ${
                      index === selectedIndex ? "bg-accent" : ""
                    }`}
                    key={command}
                    onClick={() => {
                      setInputValue(command);
                      input.current?.focus();
                    }}
                  >
                    {command} - {typedConfig[game].commandDescriptions[command]}
                  </Button>
                ))}
              </div>
            )}
          </div>
          <Select onValueChange={(value) => setGame(value)} value={game}>
            <SelectTrigger className="w-max h-max border-none p-0 m-0">
              <SelectValue placeholder="Select a game" />
              <SelectContent>
                {Object.keys(typedConfig).map((game) => (
                  <SelectItem key={game} value={game}>
                    {typedConfig[game].name}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectTrigger>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default Home;
