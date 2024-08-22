import { Dispatch, SetStateAction, createContext } from "react";

export interface Server{
    // TODO: auth into server

    connected: boolean;
    ip?: string;
}

export interface ServerContext {
  server: Server;
  setServer: Dispatch<SetStateAction<Server>>;
}

export const ServerContext = createContext<ServerContext>({
    server: { connected: false },
    setServer: () => {}
});

