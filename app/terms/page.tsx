import { Separator } from "@/components/ui/separator";

const termsData = {
  title: "Terms of Service",
  lastUpdated: "March 12, 2025",
  sections: [
    {
      title: "User Conduct",
      content: [
        "When using our platform, you agree to:",
      ],
      list: [
        "Provide accurate and complete information when creating an account",
        "Maintain the security of your account and password",
        "Accept responsibility for all activities that occur under your account",
        "Not use the platform for any illegal or unauthorized purpose",
        "Not attempt to access restricted areas of the website or other users' accounts",
        "Not share your account credentials with third parties",
        "Not engage in any activity that disrupts or interferes with our services",
      ],
    },
    {
      title: "Intellectual Property Rights",
      content: [
        "All content on our platform, including but not limited to courses, videos, text, graphics, logos, and software, is the property of Market Mastery and is protected by copyright, trademark, and other intellectual property laws.",
        "When you purchase a course, you are granted a limited, non-exclusive, non-transferable license to access and view the course materials for your personal, non-commercial use. You may not:",
      ],
      list: [
        "Reproduce, distribute, publicly display, or create derivative works of the course materials",
        "Share your account or course access with others",
        "Record, download, or redistribute course videos or materials",
        "Remove any copyright, trademark, or other proprietary notices",
        "Use course materials for commercial purposes",
      ],
    },
    {
      title: "Payment Terms",
      content: [
        "By purchasing a course, you agree to pay the specified fees. All fees are in US dollars and are non-negotiable. We accept payment via credit/debit cards and other payment methods specified on our website.",
        "For subscription-based services, you authorize us to charge your payment method on a recurring basis until you cancel. You are responsible for any taxes applicable to your purchase.",
        "Prices for courses are subject to change at any time, but changes will not affect completed purchases.",
      ],
    },
    // {
    //   title: "Refund Policy",
    //   content: [
    //     "We offer a 30-day money-back guarantee for most of our courses. If you are unsatisfied with a course, you may request a refund within 30 days of purchase by contacting our support team.",
    //   ],
    //   list: [
    //     "Refund requests must be submitted within 30 days of purchase",
    //     "You must have completed less than 30% of the course",
    //     "Refunds are not available for subscription services after the first 30 days",
    //     "Bundle purchases may be refunded only in full, not for individual components",
    //     "Promotional or discounted purchases may have different refund terms as specified at the time of purchase",
    //   ],
    // },
    {
      title: "Disclaimer of Financial Advice",
      content: [
        "The content provided in our courses and on our platform is for educational and informational purposes only. It should not be construed as financial, investment, legal, or tax advice.",
        "We do not guarantee any specific results from following our courses or strategies. Stock market investing involves risk, including the possible loss of principal. Past performance is not indicative of future results.",
        "Before making any investment decisions, you should consult with a qualified financial advisor, accountant, or attorney to determine what may be best for your individual needs.",
      ],
    },
    {
      title: "Limitation of Liability",
      content: [
        "To the maximum extent permitted by law, Market Mastery and its affiliates, officers, employees, agents, partners, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:",
      ],
      list: [
        "Your access to or use of or inability to access or use the service",
        "Any conduct or content of any third party on the service",
        "Any content obtained from the service",
        "Unauthorized access, use, or alteration of your transmissions or content",
      ],
    },
    {
      title: "Governing Law",
      content: [
        "These Terms shall be governed and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.",
        "Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.",
      ],
    },
    {
      title: "Dispute Resolution",
      content: [
        "Any disputes arising out of or relating to these Terms or our services shall first be attempted to be resolved through good-faith negotiation. If the dispute cannot be resolved through negotiation, both parties agree to resolve the dispute through binding arbitration in accordance with the rules of the American Arbitration Association.",
        "The arbitration shall be conducted in Delaware, and the judgment on the arbitration award may be entered in any court having jurisdiction thereof. You agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action.",
      ],
    },
    {
      title: "Changes to Terms",
      content: [
        "We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.",
        "By continuing to access or use our service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the service.",
      ],
    },
    {
      title: "Contact Us",
      content: [
        "If you have any questions about these Terms, please contact us at:",
        "Email: legal@marketmastery.com",
        "Address: 123 Trading Street, Suite 456, Financial District, New York, NY 10001",
      ],
    },
  ],
};

export default function TermsPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-16 max-w-4xl mx-auto">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{termsData.title}</h1>
          <p className="text-muted-foreground mt-2">Last updated: {termsData.lastUpdated}</p>
        </div>

        <Separator />

        {termsData.sections.map((section, index) => (
          <div key={index} className="space-y-4">
            <h2 className="text-2xl font-semibold">{index + 1}. {section.title}</h2>
            {section.content.map((paragraph, pIndex) => (
              <p key={pIndex}>{paragraph}</p>
            ))}
            {section.list && (
              <ul className="list-disc pl-6 space-y-2">
                {section.list.map((item, lIndex) => (
                  <li key={lIndex}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
