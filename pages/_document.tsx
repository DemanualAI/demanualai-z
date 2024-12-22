import { Html, Head, Main, NextScript } from 'next/document'
import type { DocumentProps } from 'next/document'

export default function Document(props: DocumentProps) {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/images/logo.png" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <link rel="shortcut icon" href="/images/logo.png" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://demanualai.com/" />
        <meta property="og:title" content="DemanualAI | Intelligent Business Process Automation" />
        <meta property="og:description" content="Automate your business processes with AI-powered solutions. 500+ processes automated, 50+ projects completed, 100% on-time delivery. Transform your operations today." />
        <meta property="og:image" content="https://demanualai.com/images/og-image.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://demanualai.com/" />
        <meta name="twitter:title" content="DemanualAI | Business Automation Solutions" />
        <meta name="twitter:description" content="Streamline your business with intelligent automation. Integrate 1000+ tools, automate workflows, and boost efficiency. Start your automation journey today." />
        <meta name="twitter:image" content="https://demanualai.com/images/twitter-card.jpg" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://demanualai.com" />

        {/* Language alternatives */}
        <link rel="alternate" hrefLang="en" href="https://demanualai.com" />
        <link rel="alternate" hrefLang="x-default" href="https://demanualai.com" />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(d, t) {
                var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
                v.onload = function() {
                  window.voiceflow.chat.load({
                    verify: { projectID: '67686a6af6a4fb4536568e13' },
                    url: 'https://general-runtime.voiceflow.com',
                    versionID: 'production'
                  });
                }
                v.src = "https://cdn.voiceflow.com/widget/bundle.mjs"; 
                v.type = "text/javascript"; 
                s.parentNode.insertBefore(v, s);
              })(document, 'script');
            `
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "DemanualAI",
              "description": "AI-powered business automation solutions",
              "url": "https://demanualai.com",
              "logo": "https://demanualai.com/images/logo.png",
              "sameAs": [
                "https://linkedin.com/company/demanualai",
                "https://twitter.com/demanualai"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Chennai",
                "addressRegion": "Tamil Nadu",
                "addressCountry": "India"
              }
            })
          }}
        />
      </body>
    </Html>
  )
} 