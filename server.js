const express = require('express')
const app = express()
const path = require('path')
const router = express.Router()
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const nodemailer = require('nodemailer')
const smtpTransport = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: 465,
  secure: true,
  auth: {
    user: '389057465@qq.com',
    pass: ''
  }
})

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/success', (req, res) => {
  res.render('success')
})

app.post('/join', (req, res) => {
  let { name, qq, age } = req.body

  const mailOptions = {
    from: '389057465@qq.com',
    to: '2334430605@qq.com',
    subject: 'Node-test邮件',
    html: `
            <b>姓名：${name}</b>
            <b>QQ：${qq}</b>
            <b>年龄：${age}</b>
          `
  }

  smtpTransport.sendMail(mailOptions, (err, res) => {
    if (err) {
      res.send({
        code: 500,
        msg: '错误'
      })
    } else {
      res.send({
        code: 200,
        msg: '成功'
      })
    }
    smtpTransport.close() // 关闭连接池
  })
})

/* listen port */
const http = require('http')
const server = http.createServer(app)
const port = 3000
server.listen(port)
server.on('error', onError)

/* Event listener for HTTP server error event */
function onError (err) {
  if (err.syscall !== 'listen') {
    throw err
  }
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`
  // handle specific listen errors with friendly messages
  switch (err.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`)
      process.exit(1)
      break
    default:
      throw err
  }
}