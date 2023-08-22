import kurentoClient from 'kurento-client';

class Kurento {
  connection = null;
  pipeline = null;

  getOrCreateKurentoConnection = async () => {
    if (this.connection) {
      return this.connection;
    }

    this.connection = await kurentoClient(process.env.KURENTO_URL || "ws://127.0.0.1:8888/kurento", { failAfter: 5 });
    return this.connection;
  };

  getOrCreatePipeline = async () => {
    if (this.pipeline) {
      return this.pipeline;
    }

    const connection = await this.getOrCreateKurentoConnection();
    this.pipeline = await connection.create("MediaPipeline");
    return this.pipeline;
  };

  getOrCreateEndpoint = async () => {
    if(this.pipeline) {
      return this.pipeline.create("WebRtcEndpoint");
    }
    const pipeline = await this.getOrCreatePipeline();
    return pipeline.create("WebRtcEndpoint");
  };
}

export default new Kurento();
