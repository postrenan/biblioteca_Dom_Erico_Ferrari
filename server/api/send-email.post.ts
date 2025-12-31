import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email } = body

  if (!email) {
    throw createError({
      statusCode: 400,
      message: 'Email is required'
    })
  }

  const config = useRuntimeConfig()
  const { host, port, user, pass } = config.mailtrap

  if (!host || !user || !pass) {
    console.error('❌ Mailtrap credentials missing')
    throw createError({
      statusCode: 500,
      message: 'Server configuration error'
    })
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(port) || 2525,
    auth: {
      user,
      pass
    }
  })

  try {
    const info = await transporter.sendMail({
      from: '"GrandTour Newsletter" <newsletter@grandtour.com>',
      to: email,
      subject: "Bem-vindo à GrandTour!",
      text: "Obrigado por se inscrever na nossa newsletter. Em breve enviaremos novidades!",
      html: "<b>Obrigado por se inscrever na nossa newsletter.</b><br>Em breve enviaremos novidades!"
    })

    console.log("Message sent: %s", info.messageId)
    return { success: true, message: 'Email sent successfully' }
  } catch (error) {
    console.error('Error sending email:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to send email'
    })
  }
})
