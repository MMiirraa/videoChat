import { getConstraints, getUserMedia } from '../utils/mediaDevices.js';
import { CONNECTION_TYPE } from "../consts/CONNECTION_TYPE.js"

export class WebRtcConnection {
    constructor(data) {
        this.callId = data.callId;
        this.publishCallId = data.publishCallId;
        this.type = data.type;

        this.iceServers = data.iceServers;
        this.localStream = data.localStream;

        this.onGotOffer = data.onGotOffer;
        this.onGotCandidate = data.onGotCandidate;
        this.onGotRemoteStream = data.onGotRemoteStream;
        this.onGotLocalStream = data.onGotLocalStream;
        this.sdpAnswerSet = false;
        this.remoteStream = null;
    }

    createPeerConnection = async () => {
        this.peerConnection = new RTCPeerConnection({ iceServers: this.iceServers });
        this.peerConnection.oniceconnectionstatechange = () => {
            const iceConnectionState = this.peerConnection.iceConnectionState;
            console.log(`Ice changed: ${iceConnectionState}`);
        };
        this.peerConnection.onicecandidate = e => e.candidate && this.onGotCandidate(this.callId, e.candidate);
        if (this.type === CONNECTION_TYPE.VIEW) {
            this.peerConnection.ontrack = e => {
                this.remoteStream = this.remoteStream || new MediaStream();
                this.remoteStream.addTrack(e.track);
                this.onGotRemoteStream?.(this.remoteStream);
            }
        }
    };

    createOffer = async () => {
        const isPublish = this.type === CONNECTION_TYPE.PUBLISH;

        if (this.localStream) {
            this.peerConnection.addStream(new MediaStream(this.localStream.getTracks()));
        }
        const offer = await this.peerConnection.createOffer({
            offerToReceiveAudio: !isPublish,
            offerToReceiveVideo: !isPublish
        });

        await this.peerConnection.setLocalDescription(offer);
        this.onGotOffer(this.callId, offer.sdp);

    };

    addIceCandidate = async (candidate) => {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
    };

    generateLocalStream = async () => {
        const constraints = getConstraints();
        this.localStream = await getUserMedia(constraints);
        this.onGotLocalStream?.(this.localStream);
    }

    addAnswer = async (sdp) => {
        await this.peerConnection.setRemoteDescription({ type: "answer", sdp });
        this.sdpAnswerSet = true;
    };

    stop = () => {
      this.peerConnection?.close()
    }
}
