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

  const {
    responses,
    game,
    inputValue,
    filteredCommands,
    selectedIndex,
    showDropdown,
    setGame,
    setInputValue,
    sendCommand,
    handleCommandSelection
  } = useRconCommands(connection);

  // Wrap handleConnect to match expected type
  const handleConnect = async () => {
    await rawHandleConnect();
  };

  if (isLoading) {
    return (
      <div className="font-mono p-4 flex justify-center items-center h-screen">
        Loading...
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
      filteredCommands={filteredCommands}
      selectedIndex={selectedIndex}
      showDropdown={showDropdown}
      onGameChange={setGame}
      onInputChange={setInputValue}
      onCommandSelect={handleCommandSelection}
      onCommandSubmit={sendCommand}
      onDisconnect={handleDisconnect}
      connectionInfo={`Connected to: ${connection.host}:${connection.port}`}
    />
  );
};

export default Home;
