import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head'

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service | DemanualAI</title>
        <meta name="description" content="Review DemanualAI's terms of service for our business automation and AI integration solutions. Understanding our commitment to your success." />
      </Head>
      <section className="relative min-h-screen">
        {/* Hero Image */}
        <div className="h-[150px] w-full -z-10">
          <Image 
            src="/images/bg.jpg"
            alt="Background"
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
            <p className="text-sm text-gray-600 mb-8">Last Updated: December 09, 2024</p>

            <div className="prose max-w-none">
              <p className="mb-6">
                Welcome to DemanualAI Inc. ("DemanualAI," "we," "us," or "our"). These Terms of Service ("Terms") govern your access to and use of our website www.demanualai.com and the services we provide. By accessing or using our services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
              <p>
                DemanualAI Inc. specializes in providing AI-based automation services to businesses in India, focusing on optimizing operations in areas such as marketing, hiring, sales, and operations. Our services involve integrating and linking various software systems used by our clients to streamline their business processes.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">2. Services Provided</h2>
              <p>DemanualAI offers the following services:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>AI-Based Automation: Implementing AI solutions to automate and optimize business processes.</li>
                <li>Pipeline Integration: Linking different software systems used by your company to ensure seamless data flow and operational efficiency.</li>
                <li>Consulting Services: Providing expert advice on optimizing your business operations using AI and automation technologies.</li>
                <li>Support and Maintenance: Offering ongoing support and maintenance for the implemented solutions to ensure their effectiveness and reliability.</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">3. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. Any changes will be posted on this page with an updated revision date. Your continued use of our services after such changes constitutes your acceptance of the new Terms. It is your responsibility to review these Terms periodically for updates.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">4. Account Registration and Use</h2>
              <p>
                To access certain features of our services, you may be required to create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">5. Privacy Policy</h2>
              <p>
                Our Privacy Policy describes how we handle your personal data and is incorporated into these Terms by reference. By using our services, you consent to the practices described in the Privacy Policy.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">6. User Conduct</h2>
              <p>You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Use our services in any manner that could damage, disable, overburden, or impair our systems.</li>
                <li>Attempt to gain unauthorized access to any portion of our services, other accounts, computer systems, or networks connected to our services.</li>
                <li>Use our services to transmit any malicious software or code.</li>
                <li>Engage in any activity that interferes with or disrupts our services or servers.</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">7. Intellectual Property</h2>
              <p>
                All intellectual property rights in our services and their content are the exclusive property of DemanualAI or its licensors. You are granted a limited, non-exclusive, non-transferable license to use our services for your internal business purposes. You agree not to reproduce, distribute, modify, create derivative works from, publicly display, or exploit any part of our services without our prior written consent.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">8. Third-Party Services</h2>
              <p>
                Our services may contain links to third-party websites or services that are not owned or controlled by DemanualAI. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services. You acknowledge and agree that DemanualAI shall not be liable for any damage or loss caused by your use of any third-party services.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">9. Termination</h2>
              <p>
                We may terminate or suspend your access to our services immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the services will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive, including intellectual property provisions, warranty disclaimers, indemnity, and limitations of liability.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">10. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. You agree to submit to the exclusive jurisdiction of the courts located in Bangalore, India, for the resolution of any disputes arising out of or relating to these Terms or your use of our services.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">11. Changes to Service</h2>
              <p>
                We reserve the right to withdraw or amend our services, and any service or material we provide via the services, in our sole discretion without notice. We will not be liable if for any reason all or any part of the services is unavailable at any time or for any period.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">12. Disclaimer and Limitation of Liability</h2>
              <p>
                Our services are provided "as is" and "as available" without any warranties of any kind, either express or implied. To the fullest extent permitted by law, DemanualAI disclaims all warranties, including but not limited to, implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
              </p>
              <p className="mt-4">
                In no event shall DemanualAI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Your access to or use of or inability to access or use the services.</li>
                <li>Any conduct or content of any third party on the services.</li>
                <li>Any content obtained from the services.</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">13. Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold harmless DemanualAI and its affiliates, licensors, and service providers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the services.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">14. Disclaimer of Warranties</h2>
              <p>
                DemanualAI does not warrant that the services will be uninterrupted, timely, secure, or error-free. We do not warrant the accuracy or completeness of the services or any content therein. Your use of the services is at your sole risk.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">15. Limitation of Liability</h2>
              <p className="uppercase font-semibold">
                To the maximum extent permitted by law, in no event will DemanualAI be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, use, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Your access to or use of or inability to access or use the services.</li>
                <li>Any conduct or content of any third party on the services.</li>
                <li>Any content obtained from the services.</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">16. Severability</h2>
              <p>
                If any provision of these Terms is found to be unenforceable or invalid by a court, the remaining provisions will remain in full effect and an enforceable term will be substituted reflecting our intent as closely as possible.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">17. Entire Agreement</h2>
              <p>
                These Terms constitute the entire agreement between you and DemanualAI regarding your use of the services and supersede all prior agreements, understandings, and representations regarding the same.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">18. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us using the following information:
              </p>
              <p className="mt-4">
                Email: <span className="text-blue-500">admin@demanualai.com</span><br />
                Location: Chennai, Tamil Nadu, India
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <Link 
                href="/"
                className="text-blue-500 hover:text-blue-600"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 