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
let mailMsg = []
imap.once('ready', () => {
  openInbox((err, box) => {
    console.log('打开邮箱')
    if (err) throw err
    imap.search(['UNSEEN', ['SINCE', 'March 5, 2021']], (error, res) => {
      if (error) throw error
      const f = imap.fetch(res, { bodies: '' }) // 抓取邮件
      f.on('message', (msg, seqno) => {
        const mailparser = new MailParser()
        msg.on('body', (stream, info) => {
          stream.pipe(mailparser) // 将为解析的数据流pipe到mailparser
          let obj = {}

          // 邮件头内容
          mailparser.on('headers', headers => {
            console.log('邮件头信息>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
            console.log(headers.get('from').text)
            let date = headers.get('date') ? dateFormat('mm月dd日', new Date(headers.get('date'))) : null
            obj = {
              subject: headers.get('subject'),
              from: headers.get('from').value.name || headers.get('from').text,
              to: headers.get('to').text,
              iconTxt: headers.get('from').text.substring(0, 1),
              date,
              seqno
            }
          })

          // 邮件内容
          mailparser.on('data', data => {
            if (data.type === 'text') { // 邮件正文
              console.log('邮件内容信息>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
              // console.log(`邮件内容 ${data.html}`)
              obj.html = data.html
            }
            if (data.type === 'attachment') { // 附件
              console.log('邮件附件信息>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
              console.log(`附件名称：${data.filename}`)
              obj.filename = data.filename
              data.content.pipe(fs.createWriteStream(`./annex/${seqno}.${data.filename.split('.')[1]}`)) // 保存附件到当前目录下
              obj.fileUrl = `http://${hostname}:${port}/annex/${seqno}.${data.filename.split('.')[1]}`
              data.release()
            }
          })
          mailparser.on('end', () => {
            mailMsg.push(obj)
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
        app.get('/get/message', (msgreq, msgres) => {
          msgres.send(mailMsg)
        })
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

function dateFormat(fmt, date) {
  let ret;
  const opt = {
      "Y+": date.getFullYear().toString(),        // 年
      "m+": (date.getMonth() + 1).toString(),     // 月
      "d+": date.getDate().toString(),            // 日
      "H+": date.getHours().toString(),           // 时
      "M+": date.getMinutes().toString(),         // 分
      "S+": date.getSeconds().toString()          // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
      };
  };
  return fmt;
}