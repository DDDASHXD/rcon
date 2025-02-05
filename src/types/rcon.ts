export interface Response {
  command: string;
  result: string;
  timestamp: number;
}

export interface ConnectionSettings {
  host: string;
  port: string;
  password: string;
}

export interface GameCommand {
  name: string;
  description: string;
}

export interface Game {
  name: string;
  commands: string[];
  commandDescriptions: { [key: string]: string };
}

export interface GameConfig {
  [key: string]: Game;
}

export interface RconResponse {
  success: boolean;
  data: string;
}
