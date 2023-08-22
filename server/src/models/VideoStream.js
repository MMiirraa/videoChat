import kurentoClient from 'kurento-client';
import { IceServersProvider } from '../providers/IceServersProvider.js';
const IceCandidate = kurentoClient.getComplexType('IceCandidate');

export class VideoStream {
    constructor({endpoint, callId, onIceCandidate}) {
        this.endpoint = endpoint;
        this.callId = callId;
        this.endpoint.on('OnIceCandidate', event => onIceCandidate(IceCandidate(event.candidate)))
    }

    async release() {
        await this.endpoint.release();
    }

    async processOffer(offer) {
        return this.endpoint.processOffer(offer);
    }

    async gatherCandidates() {
        await this.endpoint.gatherCandidates();
    }

    async addCandidate(candidate) {
        await this.endpoint.addIceCandidate(IceCandidate(candidate));
    }

    async addCandidates(candidates) {
        await Promise.all(candidates.map(async c => this.addCandidate(c)));
    }

    async configureEndpoint() {
      const iceServers = IceServersProvider.getIceServersForKurento()
      await this.endpoint.setStunServerAddress(iceServers.stun.ip);
      await this.endpoint.setStunServerPort(iceServers.stun.port);
      await this.endpoint.setTurnUrl(iceServers.turn);
    }
}
