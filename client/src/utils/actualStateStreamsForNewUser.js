const actualStateStreamsForNewUser = async ({state, viewStream}) => {
  for(let user of state) {
    if(user.publishStream !== null) {
      await viewStream(user.publishStream.callId, user.name)
    }
  }
}

export default actualStateStreamsForNewUser
