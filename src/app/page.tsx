"use client";

import React from "react";
import { ConnectionForm } from "@/components/rcon/ConnectionForm";
import { CommandInterface } from "@/components/rcon/CommandInterface";
import { useRconConnection } from "@/hooks/useRconConnection";
import { useRconCommands } from "@/hooks/useRconCommands";

const Home = () => {
  const {
    connection,
    isConnected,
    isLoading,
    updateConnection,
    handleConnect: rawHandleConnect,
    handleDisconnect
  } = useRconConnection();

  const { responses, game, inputValue, setGame, setInputValue, sendCommand } =
    useRconCommands(connection);

  // Wrap handleConnect to match expected type
  const handleConnect = async () => {
    await rawHandleConnect();
  };

  if (isLoading) {
    return (
      <div className="font-mono p-4 flex flex-col gap-4 justify-center items-center h-screen">
        <div>Loading...</div>
        {connection.host && (
          <div className="text-sm opacity-70">
            Attempting to connect to {connection.host}:{connection.port}
          </div>
        )}
      </div>
    );
  }

  if (!isConnected) {
    return (
      <ConnectionForm
        connection={connection}
        onUpdateConnection={updateConnection}
        onConnect={handleConnect}
      />
    );
  }

  return (
    <CommandInterface
      responses={responses}
      game={game}
      inputValue={inputValue}
      setInputValue={setInputValue}
      onGameChange={setGame}
      onInputChange={setInputValue}
      onCommandSubmit={sendCommand}
      onDisconnect={handleDisconnect}
      connectionInfo={`Connected to: ${connection.host}:${connection.port}`}
    />
  );
};

export default Home;
