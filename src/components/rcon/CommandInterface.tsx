import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

const typedConfig = config as GameConfig;

interface CommandInterfaceProps {
  responses: Response[];
  game: string;
  inputValue: string;
  filteredCommands: string[];
  selectedIndex: number;
  showDropdown: boolean;
  onGameChange: (value: string) => void;
  onInputChange: (value: string) => void;
  onCommandSelect: (command: string) => void;
  onCommandSubmit: (command: string) => Promise<boolean>;
  onDisconnect: () => void;
  connectionInfo: string;
}

export const CommandInterface: React.FC<CommandInterfaceProps> = ({
  responses,
  game,
  inputValue,
  filteredCommands,
  selectedIndex,
  showDropdown,
  onGameChange,
  onInputChange,
  onCommandSelect,
  onCommandSubmit,
  onDisconnect,
  connectionInfo
}) => {
  const input = React.useRef<HTMLInputElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const handleInput = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (showDropdown && filteredCommands.length > 0 && selectedIndex >= 0) {
        e.preventDefault();
        onCommandSelect(filteredCommands[selectedIndex]);
      } else if (input.current?.value) {
        await onCommandSubmit(input.current.value);
      }
    }
  };

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [responses]);

  return (
    <div
      className="font-mono p-2 flex flex-col h-screen w-full"
      onClick={() => input.current?.focus()}
    >
      <div className="flex flex-col h-full w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">{connectionInfo}</div>
          <div className="flex gap-6">
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
          <div className="w-full flex relative">
            <Input
              type="text"
              className="h-max w-full border-none p-0 m-0"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              ref={input}
              onKeyDown={handleInput}
            />
            {showDropdown && filteredCommands.length > 0 && (
              <div className="flex flex-col bg-background p-1 rounded-md absolute bottom-[calc(100%+10px)] max-h-[600px] overflow-y-auto border">
                {filteredCommands.map((command, index) => (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`justify-start h-max font-mono ${
                      index === selectedIndex ? "bg-accent" : ""
                    }`}
                    key={command}
                    onClick={() => onCommandSelect(command)}
                  >
                    {command} - {typedConfig[game].commandDescriptions[command]}
                  </Button>
                ))}
              </div>
            )}
          </div>
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
