import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConnectionSettings } from "@/types/rcon";

interface ConnectionFormProps {
  connection: ConnectionSettings;
  onUpdateConnection: (field: keyof ConnectionSettings, value: string) => void;
  onConnect: () => Promise<void>;
}

export const ConnectionForm: React.FC<ConnectionFormProps> = ({
  connection,
  onUpdateConnection,
  onConnect
}) => {
  return (
    <div className="font-mono p-4 flex flex-col gap-4 max-w-md mx-auto mt-10">
      <h1 className="text-xl font-bold">RCON Connection</h1>
      <Input
        type="text"
        placeholder="Host"
        value={connection.host}
        onChange={(e) => onUpdateConnection("host", e.target.value)}
      />
      <Input
        type="text"
        placeholder="Port"
        value={connection.port}
        onChange={(e) => onUpdateConnection("port", e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={connection.password}
        onChange={(e) => onUpdateConnection("password", e.target.value)}
      />
      <Button className="bg-blue-500 text-white" onClick={onConnect}>
        Connect
      </Button>
    </div>
  );
};
