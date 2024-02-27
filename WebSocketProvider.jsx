require("dotenv").config()
import {createContext} from 'react';


const socket = new WebSocket($(process.env.WSADDR));

export const WSContext = createContext(socket);

export const 