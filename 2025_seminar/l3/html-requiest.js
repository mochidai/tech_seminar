const net = require('net')
const dns = require('dns')

dns.lookup('example.com', (err, address) => {
        if (err) throw err

        const socket = net.createConnection({
            host: address, 
            port: 80
        })


const request = `
GET / HTTP/1.1
Host: example.com

`.slice(1)

socket.write(request)
socket.pipe(process.stdout)
        
}
)


