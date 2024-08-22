import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from "react"
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Server } from '@/context/ServerContext';

var fetchController: AbortController | null = null;

interface ServerConnectionAction{
    (server: {ip: string, connected: boolean}): void
}

export const checkServerConnection = async (server: {ip: string, connected: boolean}, onSuccess?: ServerConnectionAction, onFailure?: ServerConnectionAction) => {
    // cancel prior request and start new one
    fetchController?.abort();
    fetchController = new AbortController();
    const signal = fetchController.signal;
      console.log("sending GET request")
    fetch(`http://${server.ip}/foods`, { method: 'GET', signal: signal})
    .then(response => {
      // if we receive a 200 OK response from a /foods URI
      if(!response.ok) return;
      console.log("GET request followed through")
      onSuccess && onSuccess(server);
    })
    .catch(reason => {
      console.log("fetch request failed: " + reason)
      onFailure && onFailure(server);
    });


}

export function useServer(){
    const [server, setServer] = useState<Server>({ ip: "DEFAULT", connected: false });

    // origin: https://github.com/search?q=repo%3Acrafting-software%2Fnuca-mobile%20AuthContext&type=code
    
    // storing ip securely (key in future)
    // connecting using ip to check validity
    useEffect(() => {
        const restoreServer = async () => {
            // state is set for formal use (outside this effect, in other classes); this temp var used for this function ONLY
            var foundConnection : {ip: string, connected: boolean} | undefined = undefined

            if (Platform.OS === 'web') {
                // refuse connect -- insecure?
                const value = await AsyncStorage.getItem('serverConnection');
                if (value !== null) {
                    const { ip, connected } = JSON.parse(value);
                    foundConnection = {ip: ip, connected: connected};
                } 
            } else {
                const value = await SecureStore.getItemAsync('serverConnection');
                if (value) {
                    const { ip, connected } = JSON.parse(value);
                    foundConnection = {ip: ip, connected: connected};
                }
            }

            console.log("restored; picked up server connection is: " + foundConnection?.connected);
            if(foundConnection) 
                checkServerConnection(
                    {ip: foundConnection.ip ?? "x.x.x.x", connected: foundConnection.connected}, 
                    server => setServer({ip: server.ip, connected: true}),   // set state at end when we know for sure it's still up
                    server => setServer({ip: server.ip, connected: false})); // or set it to false despite being true on disk b/c/ server is now down
                    // these 'server's are actually foundConnection
            
            // TODO: determine what to do when nothing found on disk
        };

        if(server.ip === "DEFAULT")
        {
            console.log("PICKED UP SERVER IP FROM PERSISTENT STORE");
            // get server from persistent store (if present)
            restoreServer() 
        }
    }, []);

    return { server: server, setServer: setServer }
}