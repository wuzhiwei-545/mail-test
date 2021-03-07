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

const Imap = require('imap')
const MailParser = require('mailparser').MailParser
const fs = require('fs')

const imap = new Imap({
  user: '389057465@qq.com',
  password: 'mdsblpxpjtkvbjde',
  host: 'imap.qq.com',
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false } // 禁用对证书有效性的检查
})

function openInbox(cb) {
  imap.openBox('INBOX', true, cb)
}

imap.once('ready', () => {
  openInbox((err, box) => {
    console.log('打开邮箱')
    if (err) throw err
    imap.search(['UNSEEN', ['SINCE', 'May 5, 2020']], (error, res) => {
      if (error) throw error
      const f = imap.fetch(res, { bodies: '' }) // 抓取邮件
      f.on('message', (msg, seqno) => {
        const mailparser = new MailParser()
        msg.on('body', (stream, info) => {
          stream.pipe(mailparser) // 将为解析的数据流pipe到mailparser

          // 邮件头内容
          mailparser.on('headers', headers => {
            console.log('邮件头信息>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
            console.log(`邮件主题 ${headers.get('subject')}`)
            console.log(`发件人 ${headers.get('from').text}`)
            console.log(`收件人 ${headers.get('to').text}`)
          })

          // 邮件内容
          mailparser.on('data', data => {
            if (data.type === 'text') { // 邮件正文
              console.log('邮件内容信息>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
              console.log(`邮件内容 ${data.html}`)
              app.get('/get/message', (req, res) => {
                res.send(data.html)
                console.log('msg', req)
                console.log('msg', res)
              })
            }
            if (data.type === 'attachment') { // 附件
              console.log('邮件附件信息>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
              console.log(`附件名称：${data.filename}`)
              // data.content.pipe(fs.createWriteStream(data.filename)) // 保存附件到当前目录下
              // data.release()
            }
          })
        })
        msg.once('end', () => {
          console.log(`${seqno}完成`)
        })
      })
      f.once('error', err => {
        console.log(`抓取出现错误：${err}`)
      })
      f.once('end', () => {
        console.log('所有邮件抓取完成')
        imap.end()
      })
    })
  })
})

imap.once('error', err => {
  console.log(`imap err ${err}`)
})

imap.once('end', () => {
  console.log('关闭邮箱')
})

imap.connect()