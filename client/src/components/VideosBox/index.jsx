import React from "react";
import { useStore } from "../../context";
import VideoStream from '../VideoStream';
import css from "./VideosBox.module.css"


const VideosBox = () => {
  const store = useStore()

  const renderStream = React.useCallback(() => {
    return store.streams?.map((s) => s.user ? (
      <VideoStream
        key={s.callId}
        stream={s.stream}
        isMuted={true}
        name={store.user.name}
      />
    ) : (
      <VideoStream
        key={s.callId}
        stream={s.stream}
        isMuted={false}
        name={s.name}
      />
    ))
  }, [store.streams, store.user.name])
  
    return (
        <div className={css.videosBox}>
          {renderStream()}
        </div>
    )
}

export default React.memo(VideosBox)
