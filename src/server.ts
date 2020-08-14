import express from 'express'
import morgan from 'morgan'
import path from 'path'
import nodemailer from 'nodemailer'
import { body, validationResult } from 'express-validator'

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

app.post(
  '/reach-out',
  [
    body('email').isLength({ min: 5 }).isEmail().normalizeEmail(),
    body('subject').trim().unescape(),
    body('message').isLength({ min: 1 }).trim().unescape(),
  ],
  (req: express.Request, res: express.Response) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

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
  }
)

app.listen(port, () => {
  console.debug(`server started at localhost:${port}`)
})
