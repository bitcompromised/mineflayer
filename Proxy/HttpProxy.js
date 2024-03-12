import Http from 'http';
import mc from 'minecraft-protocol'
import { ProxyAgent } from 'proxy-agent';

const mcServer = {
    host: "", // Replace with your Minecraft server IP
    port: 25565,
};

const proxy = {
    host: "",
    port: ,
    username: '',
    password: ''
};

const proxyHost = proxy.host;
const proxyPort = proxy.port;

const client = mc.createClient({ // use this as a setting in your mineflayer createBot, client: ${client}
  version: '1.8',
  connect: (client) => {
    const req = Http.request({
      host: proxyHost,
      port: proxyPort,
      method: 'CONNECT',
      path: `${mcServer.host}:${mcServer.port}`,
    })
    req.end()

    req.on('connect', (res, stream) => {
      client.setSocket(stream)
      client.emit('connect')
    })
  },
  host: mcServer.host,
  port: mcServer.port,
  agent: new ProxyAgent(`http://${proxy.username}:${proxy.password}@${proxy.host}`),
})

