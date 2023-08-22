import VideoService from "../services/VideoService.js"
import WS_EVENT from "../consts/WS_EVENT.js"
import { addToCandidateQueue, videoStreams } from "../storages/Video.js";

export const publish = async (wss, user, ws, data, cb, room) => {
  const { offer, callId } = data;
  const { answer, videoStream } = await VideoService.createVideoStream({
    callId,
    offer,
    onIceCandidate: (candidate) => ws.emit(WS_EVENT.ICE_CANDIDATE, { candidate, callId })
  })
  user?.setPublushStream(videoStream)
  const name = user.name
  ws.broadcast.emit(WS_EVENT.STATE, { callId, name })
  if(cb) cb({ answer, videoStream })
}

export const iceCandidate = async (wss, ws, user, data, cb) => {
  const { callId, candidate } = data
  const videoStream = videoStreams[callId]
  if(!videoStream) {
    addToCandidateQueue({ callId, candidate })
    return
  }
  await videoStream.addCandidate(candidate)
}

export const view = async (wss, user, ws, data, cb, room) => {
  const { offer, callId, publishCallId } = data;
  const publishStream = videoStreams[publishCallId]
  if (!publishStream) {
      console.log('Wrong callId');
      return;
  }
  const { answer, videoStream } = await VideoService.createVideoStream ({
    callId,
    offer,
    onIceCandidate: (candidate) => ws.emit(WS_EVENT.ICE_CANDIDATE, { candidate, callId })
  })
  publishStream.endpoint.connect(videoStream.endpoint)
  room.state.forEach(u => {
    user?.setViewStream(videoStream)
  })
  cb({ answer })
}
