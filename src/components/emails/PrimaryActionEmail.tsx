import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  render,
} from '@react-email/components'

interface EmailTemplateProps {
  actionLabel: string
  buttonText: string
  href: string
}

export const EmailTemplate = ({
  actionLabel,
  buttonText,
  href,
}: EmailTemplateProps) => {
  const email = {
    preview: "The marketplace for high-quality digital contents.",
    body: [
      {
        type: 'img',
        src: `${process.env.NEXT_PUBLIC_SERVER_URL}/hippo-newsletter-sign-up.png`,
        width: 150,
        height: 150,
        alt: 'Uperhaps',
        style: logo
      },
      {
        type: 'text',
        value: 'Hi there,',
        style: paragraph
      },
      {
        type: 'text',
        value: `Welcome to Uperhaps, your digital library for high quality literary contents. Use the button below to ${actionLabel}.`,
        style: paragraph
      },
      {
        type: 'button',
        value: buttonText,
        href: href,
        style: button
      },
      {
        type: 'text',
        value: 'Best,\nThe Uperhaps team',
        style: paragraph
      },
      {
        type: 'hr',
        style: hr
      },
      {
        type: 'text',
        value: 'If you did not request this email, you can safely ignore it.',
        style: footer
      }
    ]
  }

  return email
}

export const PrimaryActionEmailHtml = (props: EmailTemplateProps) => {
  const email = EmailTemplate(props)
  
  return `
    <html>
      <head>
        <title>${email.preview}</title>
      </head>
      <body style="${styleToString(main)}">
        <div style="${styleToString(container)}">
          ${email.body.map(renderElement).join('')}
        </div>
      </body>
    </html>
  `
}

const renderElement = (element: any) => {
  switch (element.type) {
    case 'img':
      return `<img src="${element.src}" width="${element.width}" height="${element.height}" alt="${element.alt}" style="${styleToString(element.style)}" />`
    case 'text':
      return `<p style="${styleToString(element.style)}">${element.value}</p>`
    case 'button':
      return `<div style="${styleToString(btnContainer)}"><a href="${element.href}" style="${styleToString(element.style)}">${element.value}</a></div>`
    case 'hr':
      return `<hr style="${styleToString(element.style)}" />`
    default:
      return ''
  }
}

const styleToString = (style: Record<string, string | number>) => {
  return Object.entries(style).map(([key, value]) => `${key}: ${value}`).join('; ')
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
}

const logo = {
  margin: '0 auto',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
}

const btnContainer = {
  textAlign: 'center',
}

const button = {
  padding: '12px 12px',
  backgroundColor: '#2563eb',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
}

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
}