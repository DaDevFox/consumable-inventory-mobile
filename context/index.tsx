import { ServerContext } from './ServerContext'
import { useServer } from "@/hooks/useServer";
import { ReactNode, useMemo } from "react";

export * from './ServerContext'

export const ServerContextProvider = ({ children }: {children: ReactNode}) => {
    const {server, setServer} = useServer();
    const serverValue = useMemo(() => ({ server, setServer }), [server]);

    return(<ServerContext.Provider value={serverValue}>{children}</ServerContext.Provider>)
}