import { v4 as uuid } from "uuid"

export default class Room {
  constructor() {
    this.id = uuid()
    this.state = []
    this.messages = []
  }

  addUser(user) {
    if(this.state.length < 4) {
      this.state.push(user)
    }
  }

  async deleteUser(id) {
    const removeUser = this.state.find(u => u.id === id)
    if(removeUser) {
      const removeCallId = await removeUser.removeUser()
      this.state = this.state.filter(u => u.id !== id)
      return removeCallId
    }
  }

  addMessage(message) {
    this.messages.push(message)
  }
  
  removeMessages() {
    this.messages.length = 0
  }
}
