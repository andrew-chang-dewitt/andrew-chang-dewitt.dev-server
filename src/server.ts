import express from 'express'
import morgan from 'morgan'
import path from 'path'
import nodemailer from 'nodemailer'

const app = express()
const port = 3000

const contactAddress = 'hello@andrew-chang-dewitt.dev'

const mailer = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_PASSWORD,
  },
})

app.use(morgan('dev'))
app.use(express.json())

app.post('/reach-out', (req, res) => {
  mailer.sendMail(
    {
      replyTo: req.body.email,
      to: contactAddress,
      subject: req.body.subject,
      text: req.body.message,
    },
    function (err, info) {
      if (err) {
        console.error(err)
        return res.status(500).send(err)
      } else res.json({ success: true })
    }
  )
})

app.listen(port, () => {
  console.debug(`server started at localhost:${port}`)
})
