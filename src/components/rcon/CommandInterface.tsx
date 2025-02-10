import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Response, GameConfig } from "@/types/rcon";
import config from "@/config.json";
import DarkModeToggle from "../dark-mode";
import Link from "next/link";
import Command from "../ui/command-input";
import { useRconConnection } from "@/hooks/useRconConnection";

const typedConfig = config as GameConfig;

interface CommandInterfaceProps {
  responses: Response[];
  game: string;
  inputValue: string;
  setInputValue: (value: string) => void;
  onGameChange: (value: string) => void;
  onInputChange: (value: string) => void;
  onCommandSubmit: (command: string) => Promise<boolean>;
  onDisconnect: () => void;
  connectionInfo: string;
}

export const CommandInterface: React.FC<CommandInterfaceProps> = ({
  responses,
  game,
  inputValue,
  setInputValue,
  onGameChange,
  onInputChange,
  onCommandSubmit,
  onDisconnect,
  connectionInfo
}) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const {
    connection: { password, host, port }
  } = useRconConnection();

  const handleInput = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onCommandSubmit(inputValue);
      setInputValue("");
    }
  };

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [responses]);

  return (
    <div className="font-mono p-2 flex flex-col h-screen w-full">
      <div className="flex flex-col h-full w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">{connectionInfo}</div>
          <div className="flex gap-6">
            <Link
              href=""
              className="text-sm hover:text-gray-700"
              onClick={() => {
                const url = new URL(window.location.origin);
                url.searchParams.set("host", host);
                url.searchParams.set("port", port);
                url.searchParams.set("password", password);
                navigator.clipboard.writeText(url.toString());
              }}
            >
              Copy connection url
            </Link>
            <Link
              href="https://github.com/DDDASHXD/rcon"
              className="text-sm hover:text-gray-700"
            >
              View on GitHub
            </Link>
            <DarkModeToggle />
            <button
              onClick={onDisconnect}
              className="text-red-500 text-sm hover:text-red-700"
            >
              Disconnect
            </button>
          </div>
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
          <Command
            commands={Object.keys(typedConfig[game].commandDescriptions)}
            value={inputValue}
            onChange={onInputChange}
            onKeyDown={handleInput}
          />
          {inputValue}
          <Select onValueChange={onGameChange} value={game}>
            <SelectTrigger className="w-max h-max border-none p-0 m-0">
              <SelectValue placeholder="Select a game" />
              <SelectContent>
                {Object.keys(typedConfig).map((gameKey) => (
                  <SelectItem key={gameKey} value={gameKey}>
                    {typedConfig[gameKey].name}
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
