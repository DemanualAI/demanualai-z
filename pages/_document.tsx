import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="images/logo.png" />
        {/* For better compatibility across different devices, you might want to add these: */}
        <link rel="apple-touch-icon" href="images/logo.png" />
        <link rel="shortcut icon" href="images/logo.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 