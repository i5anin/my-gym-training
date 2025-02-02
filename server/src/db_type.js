const os = require('os')

const getNetworkDetails = () => {
  const nets = os.networkInterfaces()
  let localIp = ''
  let databaseType = 'test' // Default to test

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal && net.address.startsWith('192.168')) {
        localIp = net.address
        if (localIp === '192.168.0.11') databaseType = 'build'
        return { localIp, databaseType }
      }
    }
  }

  if (!localIp) {
    throw new Error('Локальный IP-адрес не найден.')
  }
}

module.exports = { getNetworkDetails }
