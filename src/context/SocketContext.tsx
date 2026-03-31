"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { io, Socket } from "socket.io-client";

// ✅ Define type
type SocketContextType = {
  socket: Socket | null;
};

// ✅ Create context (NO null type issue)
const SocketContext = createContext<SocketContextType>({
  socket: null,
});

// ✅ Provider
export const SocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const socket = useMemo(() => {
    const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!URL) {
      console.error("❌ Socket URL missing");
      return null;
    }

    return io(URL, {
      transports: ["websocket"],
    });
  }, []);

  // ✅ Cleanup
  useEffect(() => {
    return () => {
      socket?.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

// ✅ Hook (NO null error now)
export const useSocket = () => {
  return useContext(SocketContext);
};