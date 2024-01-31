import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname__ = path.dirname(url.fileURLToPath(import.meta.url))
const __boundary = '--boundary'

const app = express()

const __imageCount = 5
let __imageLoopIndex = 0
const getABase64Img = () => {
  if(__imageLoopIndex >= __imageCount) {
    __imageLoopIndex = 1
  }else {
    __imageLoopIndex ++
  }

  return fs
    .readFileSync(`${__dirname__}/pictures/p${__imageLoopIndex}.jpeg`)
    .toString('base64')
}

app.get('/stream-picture', (req, res) => {
  res.writeHead(200, {
    'Content-Type': `multipart/x-mixed-replace; boundary=${__boundary}`,
    "Connection": 'keep-alive',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  })

  let sender = setInterval(() => {
    const image1 = getABase64Img()

    res.write(`${__boundary}\r\n`)
    res.write('Content-Type: image/jpeg\r\n')
    res.write(`Content-Length: ${image1.length}\r\n\r\n`)
    res.write(image1, 'base64')
    res.write('\r\n\r\n')

  }, 1000)

  res.on('close', () => {
    clearInterval(sender)
  })
})

app.listen(3456, () => {
  console.log('server is running')
})