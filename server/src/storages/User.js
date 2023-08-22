import { videoStreams } from "./Video.js"

export default class User {
  constructor(name, socketId) {
    this.id = socketId
    this.name = name
    this.publishStream = null
    this.viewStreams = []
  }

  setPublushStream(stream) {
    this.publishStream = stream
    return true
  }

  setViewStream(stream) {
    this.viewStreams.push(stream)
  }

  async removeUser() {
    const callId = this.publishStream.callId
    const allStreams = [this.publishStream, ...this.viewStreams]
    allStreams.forEach(async s => {
      if(s) {
        await s.endpoint.release()
        delete videoStreams[s.callId]
      }
    })
    return callId
  }
}
