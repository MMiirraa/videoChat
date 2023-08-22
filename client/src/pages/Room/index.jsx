import React from "react";
import { useNavigate } from "react-router-dom";
import VideoChat from "../../construсtors/VideoChat/index.jsx";
import { useStore } from "../../context/index.js";
import ws from "../../socket/index.js";

const Room = () => {
  const store = useStore()
  const navigate = useNavigate()

  React.useEffect(() => {
    if(!store.isJoin) {
      navigate("/")
    }
  }, [navigate, store.isJoin])

  React.useEffect(() => {
    store.publishStream(store.isJoin)
    ws.connect()
    return() => {
      store.setIsJoin(false)
      store.setStreams([])
      store.setRemoveCallId(null)
      store.setUser({})
    }
  }, [])
  
  return(
    <>
      <VideoChat/>
    </>
  )
}

export default React.memo(Room)
