export const videoStreams = {}
export const candidateQueue = {};
export const addToCandidateQueue = ({ callId, candidate }) => {
    candidateQueue[callId] = candidateQueue[callId] || [];
    candidateQueue[callId].push(candidate);
}
