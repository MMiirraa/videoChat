import React from "react"
import Request from "../socket/Request";
import ws from "../socket";
import timeNow from "../utils/timeNow";
import { WS_EVENTS } from "../consts/SOCKET_EVENTS";
import { RTC_EVENTS } from "../consts/RTC_EVENTS";
import WebRtcController from "../controllers/WebRtcController";
import { v4 as uuid } from 'uuid';
import actualStateStreamsForNewUser from "../utils/actualStateStreamsForNewUser";
import iceServers from "../consts/iceServers";

const Context = React.createContext({})
const removeSpacesRegExp = /^\s+|\s+$/g

export const ProviderState = ({ children }) => {
  const [isFull, setIsFull] = React.useState(false)
  const [isJoin, setIsJoin] = React.useState(false)
  const [user, setUser] = React.useState({})
  const [messages, setMessages] = React.useState([])
  const [streams, setStreams] = React.useState([]);
  const [removeCallId, setRemoveCallId] = React.useState(null)

  React.useEffect(() => {
    ws.on(WS_EVENTS.MESSAGES_STATE, (data) => {
      setMessages(data)
    })
    ws.on(WS_EVENTS.MESSAGE_PULL, (data) => {
      setMessages(prevState => [...prevState, data])
    })
    ws.on(RTC_EVENTS.ICE_CANDIDATE, async ({ callId, candidate }) => {
      await WebRtcController.addIceCandidate({ callId, candidate });
    });
    ws.on(RTC_EVENTS.STATE, async ({ callId, name }) => {
      await viewStream(callId, name);
    });
    ws.on(RTC_EVENTS.STATE_AFTER_LEAVE, (removeCallId) => {
      setRemoveCallId(removeCallId)
    })
  }, [])

  const deleteRemoteStream = React.useCallback(async (removeCallId) => {
    const willRemove = streams.find(s => s.publishCallId === removeCallId)
    await WebRtcController.stopViewConnection(willRemove.callId);
    setStreams(state => {
      return state.filter(s => s.callId !== willRemove.callId)
    })
  }, [streams])

  React.useEffect(() => {
    if(removeCallId !== null) {
      deleteRemoteStream(removeCallId)
    }
  }, [removeCallId])

  

  const handleJoin = React.useCallback(async (name) => {
    const res = await Request(ws, WS_EVENTS.JOIN, {name: name, message:`${timeNow()}/connect: ${name}`})
    if(res.join) {
      const newUser = res.user
      setUser(newUser)
      setIsJoin(res.join)
      setMessages(res.messages)
      const state = res.state
      await actualStateStreamsForNewUser({ state, viewStream })
    } else {
      setIsFull(true)
    }
  }, [])

  const handleSend = React.useCallback(async (inputState) => {
    if(inputState.replace(removeSpacesRegExp, '')) {
      const dataReq = {
        user,
        message: `${timeNow()}/${user.name}: ${inputState}`,
      } 
      const res = await Request(ws, WS_EVENTS.MESSAGE, dataReq)
      const mess = res.message
      setMessages(prevState => [...prevState, {user: user, message: mess}])
    }
  }, [user])

  const viewStream = React.useCallback(async (publishCallId, name) => {
    const callId = uuid();
    await WebRtcController.createViewConnection({
      callId,
      publishCallId,
      onGotOffer: (callId, offer) => ws.emit(
        RTC_EVENTS.VIEW,
        { callId, offer, publishCallId },
        ({ answer }) => WebRtcController.addAnswer({ answer, callId }),
      ),
      onGotCandidate: (callId, candidate) => ws.emit(
        RTC_EVENTS.ICE_CANDIDATE,
        { callId, candidate }
      ),
      onGotRemoteStream: (stream) => {
        setStreams(state => [...state.filter(s => s.callId !== callId), {stream, callId, publishCallId, name: name}])
      },
    })
  }, [])

  const onGotOffer = async (callId, offer) => {
    const res = await Request(ws, RTC_EVENTS.PUBLISH, { callId, offer })
    const answer = res.answer
    await WebRtcController.addAnswer({ answer, callId })
  }

  const publishStream = React.useCallback(async (isJoin) => {
    if(isJoin) {
      const callId = uuid();
      await WebRtcController.createPublishConnection({
        callId,
        iceServers: iceServers,
        onGotOffer: onGotOffer,
        onGotCandidate: (callId, candidate) => ws.emit(
          RTC_EVENTS.ICE_CANDIDATE,
          { callId, candidate }
        ),
        onGotLocalStream: (stream) => setStreams(state => [
          ...state.filter(s => s.callId !== callId),
          {stream, callId, user}
        ]),
      });
    }
  }, [])

  return(
    <Context.Provider
      value={{
        isJoin,
        user,
        messages,
        ws,
        isFull,
        streams,
        setIsJoin,
        handleJoin,
        setMessages,
        handleSend,
        setUser,
        publishStream,
        setStreams,
        setRemoveCallId
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useStore = () => {
  const store = React.useContext(Context)
  return store
}
