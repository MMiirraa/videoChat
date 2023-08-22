
import { VideoStream } from "../models/VideoStream.js"
import { candidateQueue, videoStreams } from "../storages/Video.js"
import Kurento from "./Kurento.js"

class VideoService {

  async flushCandidateQueueToStream(stream) {
  if (!candidateQueue[stream.callId]) {
      return;
  }
  await stream.addCandidates(candidateQueue[stream.callId]);
}
  
  async createVideoStream({ callId, offer, onIceCandidate }) {
    const endpoint = await Kurento.getOrCreateEndpoint()

    const videoStream = new VideoStream({
      endpoint,
      callId,
      onIceCandidate
    })
    
    await videoStream.configureEndpoint()
    const answer = await videoStream.processOffer(offer)
    await this.flushCandidateQueueToStream(videoStream);
    await videoStream.gatherCandidates()
    videoStreams[callId] = videoStream
    return { answer, videoStream }
  }
}

 export default new VideoService()
