import axios from 'axios'

const service = {}

service.get = async () => {
  const {
    data: { ip }
  } = await axios.get('https://api.ipify.org?format=json')
  return ip
}

export default {
  service
}
