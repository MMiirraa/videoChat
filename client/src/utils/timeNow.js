const timeNow = () => {
  const Data = new Date();
  const hour = Data.getHours();
  const minutes = Data.getMinutes();
  const seconds = Data.getSeconds();
  
  return `${hour}:${minutes}:${seconds}`
}

export default timeNow
