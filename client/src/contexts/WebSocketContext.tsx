import React, { createContext, useContext, useEffect, useState } from "react";

const WEBSOCKET_URL = "/ws/freqsplit/";

interface WebSocketContextType {
    socket: WebSocket | null;
    isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
    socket: null,
    isConnected: false,
});

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const newSocket = new WebSocket(WEBSOCKET_URL);

        newSocket.onopen = () => {
            setIsConnected(true);
        };

        newSocket.onclose = () => {
            console.warn("Disconnected from WebSocket");
            setIsConnected(false);
        };

        newSocket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        newSocket.onmessage = (event) => {
            console.log("ws/freqsplit: ", JSON.parse(event.data).response);
        };

        setSocket(newSocket);
    
        return () => {
            newSocket.close();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
