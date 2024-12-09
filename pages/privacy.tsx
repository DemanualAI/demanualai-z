import Link from 'next/link';
import Image from 'next/image';


export default function Privacy() {
  return (
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
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Last Updated: December 09, 2024</p>

          <div className="prose max-w-none">
            <p className="mb-6">
              Welcome to DemanualAI Inc. ("DemanualAI," "we," "us," or "our"). Your privacy is important to us, and we are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website www.demanualai.com and use our services. Please read this policy carefully to understand our views and practices regarding your personal data.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              DemanualAI Inc. provides AI-based automation services to businesses in India, focusing on optimizing operations in areas such as marketing, hiring, sales, and operations. Our services involve integrating and linking various software systems used by our clients to streamline their business processes.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">2. Important Information and Who We Are</h2>
            <p>
              <strong>Controller:</strong><br />
              DemanualAI Inc. is the data controller responsible for your personal data.<br />
              <strong>Contact Information:</strong><br />
              Email: admin@demanualai.com<br />
              Location: Chennai, Tamil Nadu, India
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">3. The Data We Collect About You</h2>
            <p>We collect and process the following categories of personal data only when necessary:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Identity Data: Name, job title</li>
              <li>Contact Data: Email address, phone number</li>
              <li>Technical Data: IP address, browser type, operating system</li>
              <li>Usage Data: Information about how you use our website and services</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">4. How Is Your Personal Data Collected?</h2>
            <p>Your personal data may be collected through the following methods:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Direct Interactions: When you contact us via email, contact forms, or other direct communication channels.</li>
              <li>Automated Technologies: Through the use of cookies and similar tracking technologies to monitor your interactions with our website.</li>
              <li>Third-Party Integrations: Data may be processed through the software systems we integrate with, based on your interactions with those systems.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">5. How We Use Your Personal Data</h2>
            <p>We use your personal data for the following purposes:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Service Delivery: To provide and manage our AI-based automation services.</li>
              <li>Communication: To respond to your inquiries, provide customer support, and send important updates about our services.</li>
              <li>Improvement: To understand how our services are used and to improve our offerings.</li>
              <li>Security: To protect our systems and data from unauthorized access, misuse, or breaches.</li>
              <li>Compliance: To comply with legal obligations and enforce our policies.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">6. Legal Basis for Processing</h2>
            <p>We process your personal data based on the following legal grounds:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Contractual Necessity: Processing is necessary to fulfill our contractual obligations to you.</li>
              <li>Legitimate Interests: Processing is necessary for our legitimate business interests, provided these interests do not override your data protection rights.</li>
              <li>Legal Compliance: Processing is necessary to comply with applicable laws and regulations.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">7. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. These measures include:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Encryption: Protecting data in transit and at rest.</li>
              <li>Access Controls: Restricting access to personal data to authorized personnel only.</li>
              <li>Regular Audits: Conducting periodic reviews of our security practices.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">8. Data Retention</h2>
            <p>
              We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When data is no longer needed, it is securely deleted or anonymized.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">9. Your Legal Rights</h2>
            <p>Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access: Request access to your personal data.</li>
              <li>Rectification: Request correction of inaccurate or incomplete data.</li>
              <li>Erasure: Request deletion of your personal data.</li>
              <li>Restriction: Request restriction of processing your data.</li>
              <li>Objection: Object to the processing of your data.</li>
              <li>Data Portability: Request transfer of your data to another controller.</li>
            </ul>
            <p>To exercise any of these rights, please contact us at admin@demanualai.com.</p>

            <h2 className="text-xl font-semibold mt-8 mb-4">10. International Transfers</h2>
            <p>
              DemanualAI operates primarily in India. If we transfer your personal data outside of India, we ensure that such transfers comply with applicable data protection laws and that your data remains protected.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">11. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites or services that are not operated by us. We are not responsible for the privacy practices or content of these third-party sites. We encourage you to review the privacy policies of any third-party websites you visit.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">12. Cookies and Similar Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our website. Cookies help us understand how you use our site and improve our services. You can manage your cookie preferences through your browser settings.
            </p>
            <p className="mt-2">
              Learn more about our use of cookies in our Cookie Policy.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">13. Children's Privacy</h2>
            <p>
              Our services and website are not intended for use by children under the age of 18. We do not knowingly collect personal data from children. If we become aware that we have inadvertently received personal data from a child, we will take steps to delete such information promptly.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">14. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes by posting the new Privacy Policy on our website. The updated policy will be effective as of the "Last Updated" date.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">15. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
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
  );
} 