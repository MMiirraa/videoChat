import {io} from 'socket.io-client';
import { CONFIG } from '../config';

const options = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout : 10000,
  transports : ["websocket"]
}

const ws = io(CONFIG.WS_URL, options);

export default ws;
