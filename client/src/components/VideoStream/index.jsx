import React, {useEffect, useRef} from 'react';
import css from "./stream.module.css"

const VideoStream = ({ stream, isMuted, name }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div className={css.container}>
      {name && <p className={css.name}>{name}</p>}
      <video className={css.video} muted={isMuted} autoPlay playsInline ref={videoRef}/>
    </div>
  )
}

export default React.memo(VideoStream);
