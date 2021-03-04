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
  secureConnection: true, // use SSL
  port: 465,
  secure: true,
  auth: {
    user: '389057465@qq.com',
    pass: 'mdsblpxpjtkvbjde' // QQ邮箱需要使用授权码
  }
})

//跨域问题解决方面
app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
　next();　
});

app.get('/', (req, res) => {
  res.send('666')
})

app.get('/success', (req, res) => {
  res.render('success')
})

app.post('/join', (req, res) => {
  console.log(req.body)
  let { recipient, theme, content } = req.body

  const mailOptions = {
    from: '389057465@qq.com',
    to: recipient,
    subject: theme,
    html: content
  }

  smtpTransport.sendMail(mailOptions, (err, resp) => {
    if (err) {
      console.log(err)
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
const hostname = '127.0.0.1'
const port = 3000
console.log('3000')
server.listen(port, hostname)
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