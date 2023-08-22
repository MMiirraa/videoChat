import { Server } from "socket.io";
import Room from "./storages/Room.js";
import User from "./storages/User.js";
import { CONFIG } from "./config.js"
import WS_EVENT from "./consts/WS_EVENT.js";
import { iceCandidate, publish, view } from "./handlers/video.js";

const port = CONFIG.port || 8000
const wss = new Server(port);
const room = new Room()

wss.on(WS_EVENT.CONNECTION, (ws) => {
  
  ws.on(WS_EVENT.PUBLISH, async (data, cb) => {
    const user = room.state.find(u => u.id === ws.id)
    await publish(wss, user, ws, data, cb, room)
  })

  ws.on(WS_EVENT.ICE_CANDIDATE, (data, cb) => {
    const user = room.state.find(u => u.id === ws.id)
    iceCandidate(wss, user, ws, data, cb)
  })

  ws.on(WS_EVENT.VIEW, (data, cb) => {
    const user = room.state.find(u => u.id === ws.id)
    view(wss, user, ws, data, cb, room)
  })

  ws.on(WS_EVENT.JOIN, async (data, cb) => {
    if(room.state.length < 4) {
      const user = new User(data.name, ws.id)
      room.addUser(user)
      room.addMessage({user: user, message: data.message})

      ws.broadcast.emit(WS_EVENT.MESSAGE_PULL, {user: user, message: data.message})
      ws.emit(WS_EVENT.MESSAGE_PULL, {user: user, message: data.message})
      
      cb({join: true, user: user, messages: room.messages, state: room.state })
    } else {
      cb({join: false})
    }
  })

  ws.on(WS_EVENT.DISCONNECTION, async () => {
    const removeCallId = await room.deleteUser(ws.id)
    wss.emit(WS_EVENT.STATE_AFTER_LEAVE, removeCallId)
    if(room.state.length < 1) {
      room.removeMessages()
    }
  })

  ws.on(WS_EVENT.MESSAGE, async (dataMessage, cb) => {
    room.addMessage(dataMessage)
    ws.broadcast.emit(WS_EVENT.MESSAGE_PULL, dataMessage)
    cb({message: dataMessage.message})
  })

})

