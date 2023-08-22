export class IceServersProvider {
  static getIceServersForKurento = () => ({
    turn: process.env.ICE_SERVERS_TURN ||
    "kurentoturn:kurentoturnpassword@78.46.107.230:3486",
    stun: {
      ip: "64.233.163.127", // stun.l.google.com
      port: 19302,
    },
  });
}
