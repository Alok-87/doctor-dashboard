import React, { useContext, useMemo } from 'react';
import { io } from 'socket.io-client';


const SocketContext = React.createContext(null);

export const SocketProvider = (props) => {

    // const baseURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v4`
    const socket = useMemo(() => io(process.env.NEXT_PUBLIC_API_BASE_URL), []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {props.children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => {
    return useContext(SocketContext);
};