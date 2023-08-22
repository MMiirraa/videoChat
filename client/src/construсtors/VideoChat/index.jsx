import React from "react";
import InputChat from "../../components/InputChat";
import StoryChat from "../../components/StoryChat";
import VideosBox from "../../components/VideosBox";
import { useStore } from "../../context";
import css from "./VideoChat.module.css"


const VideoChat = () => {
  const store = useStore()

  React.useEffect(() => {
    return() => {
      store.setIsJoin(false)
    }
  }, [])
  
  return(
    <>
      <div className={css.content}>
        <VideosBox/>
        <StoryChat/>
      </div>
      <InputChat/>
    </>
  )
}

export default React.memo(VideoChat)
