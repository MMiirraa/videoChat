import React from 'react';
import { useStore } from '../../context';
import VideoStream from '../VideoStream';

const VideoChat = () => {
  const store = useStore()
  
  return (
    <>
      {store.streams.map(({ stream, callId }) => {
        return <VideoStream
          key={callId}
          stream={stream}
        />
      })}
    </>
  )
}

export default React.memo(VideoChat);
