import { CONNECTION_TYPE } from '../consts/CONNECTION_TYPE.js';
import { WebRtcConnection } from './WebRtcConnection.js';

class WebRtcController {
    constructor() {
        this.connections = {};
        this.candidateQueue = {};
    }
    getConnection(id, type) {
      return this.connections[id]
    }

    addIceCandidate = async ({ candidate, callId }) => {
      const WebRtcConnection = this.connections[callId]
      if(WebRtcConnection && WebRtcConnection.sdpAnswerSet) {
        return await WebRtcConnection.addIceCandidate(candidate)
      }
      this.candidateQueue[callId] = this.candidateQueue[callId] || []
      this.candidateQueue[callId].push(candidate)
    };

    createPublishConnection = async (data) => {
        if (this.getConnection(data.userId, CONNECTION_TYPE.PUBLISH)) {
          return;
        }

        const connection = new WebRtcConnection({ ...data, type: CONNECTION_TYPE.PUBLISH });

        await connection.generateLocalStream();
        await connection.createPeerConnection();
        await connection.createOffer();

        this.connections[connection.callId] = connection;
    };

    createViewConnection = async (data) => {
        const connection = new WebRtcConnection({ ...data, type: CONNECTION_TYPE.VIEW });

        await connection.createPeerConnection();
        await connection.createOffer();

        this.connections[connection.callId] = connection;
    };

    stopViewConnection = async (callId) => {
        const connection = this.getConnection(callId, CONNECTION_TYPE.VIEW);
        if (!connection) {
          return;
        }
        connection.stop()
        delete this.connections[callId]
    };

    stopPublishConnection = async (callId) => {
        const connection = this.getConnection(callId, CONNECTION_TYPE.PUBLISH);
        if (!connection) {
            return;
        }
        connection.stop()
        delete this.connections[callId]
    };

    addAnswer = async ({ answer, callId }) => {
        const connection = this.connections[callId];
        await connection.addAnswer(answer);
        const candidateQueue = this.candidateQueue[callId];
        if (candidateQueue) {
            for (let i = 0; i < candidateQueue.length; i++) {
                await connection.addIceCandidate(candidateQueue[i]);
            }
            delete this.candidateQueue[callId];
        }
    };
}

export default new WebRtcController();
