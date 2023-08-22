const Request = (socket, event, data={}) =>
  new Promise((resolve) => {
    socket.emit(event, data, (response) => resolve(response));
  });

export default Request;
