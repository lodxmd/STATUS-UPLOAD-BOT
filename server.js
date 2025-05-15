import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { startSock, getQRBuffer } from './utils/sock.js'

const app = express()
const PORT = process.env.PORT || 3000
const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(express.static(path.join(__dirname, 'public')))

let sock
app.get('/qr', async (req, res) => {
  const buffer = await getQRBuffer()
  if (buffer) {
    res.set('Content-Type', 'image/png')
    res.send(buffer)
  } else {
    res.status(204).send('No QR yet')
  }
})

app.listen(PORT, async () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
  sock = await startSock()
})
