import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function FAQPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Frequently Asked Questions</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our stock market courses, enrollment process, and platform features.
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is Market Mastery?</AccordionTrigger>
                <AccordionContent>
                  Market Mastery is an online education platform specializing in stock market and investment courses. We
                  provide comprehensive, expert-led training designed to help individuals at all levels—from beginners
                  to advanced traders—develop the skills and knowledge needed to navigate the financial markets with
                  confidence.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Who are your instructors?</AccordionTrigger>
                <AccordionContent>
                  Our instructors are industry professionals with extensive experience in trading, investing, and
                  financial markets. Each instructor has a minimum of 10 years of real-world experience and a proven
                  track record in their area of expertise. You can view detailed instructor profiles on each course
                  page, including their background, experience, and teaching approach.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Do I need prior knowledge to take your courses?</AccordionTrigger>
                <AccordionContent>
                  Not at all! We offer courses for all experience levels. Our beginner courses assume no prior knowledge
                  and start with the fundamentals. For those with some experience, our intermediate and advanced courses
                  build upon existing knowledge to develop more sophisticated trading and investment strategies. Each
                  course description clearly indicates the recommended experience level.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>How long do I have access to a course after purchase?</AccordionTrigger>
                <AccordionContent>
                  Once you purchase a course, you receive lifetime access to the course materials. This includes all
                  future updates and improvements to the course content. Our Pro and Premium plans include lifetime
                  access, while the Basic plan provides 3 months of access to course materials.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Do you offer a money-back guarantee?</AccordionTrigger>
                <AccordionContent>
                  Yes, we offer a 30-day money-back guarantee for most of our courses. If you're unsatisfied with your
                  purchase, you can request a refund within 30 days, provided you've completed less than 30% of the
                  course. Some promotional or heavily discounted courses may have different refund terms, which will be
                  clearly stated at the time of purchase.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="courses" className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What topics do your courses cover?</AccordionTrigger>
                <AccordionContent>
                  Our courses cover a wide range of stock market and investment topics, including:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Stock market fundamentals and terminology</li>
                    <li>Technical analysis and chart reading</li>
                    <li>Fundamental analysis and company valuation</li>
                    <li>Day trading and swing trading strategies</li>
                    <li>Options trading and derivatives</li>
                    <li>Risk management and portfolio construction</li>
                    <li>Market psychology and behavioral finance</li>
                    <li>Algorithmic trading basics</li>
                  </ul>
                  New courses are added regularly based on market trends and student requests.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>How are the courses structured?</AccordionTrigger>
                <AccordionContent>
                  Each course is divided into modules, with each module containing multiple video lessons. Courses also
                  include:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Downloadable resources and worksheets</li>
                    <li>Interactive quizzes to test your knowledge</li>
                    <li>Practical exercises and assignments</li>
                    <li>Case studies and real-world examples</li>
                    <li>Discussion forums to engage with instructors and peers</li>
                  </ul>
                  You can progress through the material at your own pace, and your progress is automatically saved.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>How long does it take to complete a course?</AccordionTrigger>
                <AccordionContent>
                  Course duration varies depending on the complexity and depth of the material. Most courses range from
                  20 to 60 hours of video content, plus additional time for exercises and practice. The actual
                  completion time depends on your learning pace and how much time you dedicate to the course. Each
                  course page provides an estimated completion time, and you can take as long as you need to finish the
                  material.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Do you provide certificates upon completion?</AccordionTrigger>
                <AccordionContent>
                  Yes, you'll receive a certificate of completion after finishing a course. This certificate can be
                  downloaded, printed, or shared on professional networks like LinkedIn. While our certificates
                  demonstrate your commitment to learning and skill development, please note they are not accredited by
                  financial regulatory bodies and do not qualify you as a licensed financial advisor.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Can I interact with instructors during the course?</AccordionTrigger>
                <AccordionContent>
                  Yes, all courses include access to a discussion forum where you can ask questions and receive feedback
                  from instructors and fellow students. Pro and Premium plans also include monthly live Q&A sessions
                  with instructors. Premium plan members receive direct access to instructors through one-on-one
                  mentorship sessions.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                <AccordionContent>
                  We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover), PayPal, and
                  Apple Pay. For corporate training or bulk purchases, we also offer invoice payment options. All
                  payments are processed securely through industry-standard encryption.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Are there any hidden fees or subscription charges?</AccordionTrigger>
                <AccordionContent>
                  No, there are no hidden fees. The price you see is the full price you pay for the course. For one-time
                  purchases, you make a single payment and receive lifetime access to the course. If you choose a
                  subscription plan, the recurring payment terms will be clearly stated before you complete your
                  purchase.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Do you offer any discounts or promotions?</AccordionTrigger>
                <AccordionContent>
                  Yes, we regularly offer promotions and discounts. To stay informed about special offers:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Subscribe to our newsletter</li>
                    <li>Follow us on social media</li>
                    <li>Check our website for seasonal sales</li>
                  </ul>
                  We also offer special discounts for students, educators, and military personnel. Contact our support
                  team with appropriate documentation to learn more about these discounts.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Can I upgrade my plan after purchase?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can upgrade from a Basic plan to a Pro or Premium plan at any time. When upgrading, you'll
                  only pay the difference between your current plan and the new plan. To upgrade, log into your account,
                  go to "My Courses," and select the upgrade option for your course.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>How do refunds work?</AccordionTrigger>
                <AccordionContent>
                  If you're unsatisfied with a course, you can request a refund within 30 days of purchase, provided
                  you've completed less than 30% of the course. To request a refund:
                  <ol className="list-decimal pl-6 mt-2 space-y-1">
                    <li>Log into your account</li>
                    <li>Go to "My Courses"</li>
                    <li>Select the course you wish to refund</li>
                    <li>Click on "Request Refund"</li>
                    <li>Fill out the refund request form</li>
                  </ol>
                  Our support team will process your request within 3-5 business days, and the refund will be issued to
                  your original payment method within 5-10 business days.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="technical" className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What are the technical requirements for accessing courses?</AccordionTrigger>
                <AccordionContent>
                  Our platform is web-based and compatible with all modern browsers (Chrome, Firefox, Safari, Edge). For
                  the best experience, we recommend:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>A stable internet connection (minimum 5 Mbps)</li>
                    <li>An updated web browser</li>
                    <li>JavaScript enabled</li>
                    <li>Cookies enabled</li>
                  </ul>
                  Mobile apps for iOS and Android are also available, allowing you to learn on the go.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Can I download course videos for offline viewing?</AccordionTrigger>
                <AccordionContent>
                  Yes, Pro and Premium plan members can download video lessons for offline viewing through our mobile
                  apps. This feature is particularly useful for learning while traveling or in areas with limited
                  internet access. Downloaded content is available only within our app and cannot be transferred to
                  other devices.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>How do I track my progress in a course?</AccordionTrigger>
                <AccordionContent>
                  Our platform automatically tracks your progress as you complete lessons and modules. You can view your
                  progress on your course dashboard, which shows:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Percentage of course completed</li>
                    <li>Modules and lessons completed</li>
                    <li>Quiz scores and assessment results</li>
                    <li>Estimated time to completion</li>
                  </ul>
                  You can resume your course exactly where you left off, even if you switch devices.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>What should I do if I encounter technical issues?</AccordionTrigger>
                <AccordionContent>
                  If you experience technical difficulties:
                  <ol className="list-decimal pl-6 mt-2 space-y-1">
                    <li>Check our troubleshooting guide in the Help Center</li>
                    <li>Clear your browser cache and cookies</li>
                    <li>Try a different browser or device</li>
                    <li>
                      Contact our technical support team via the "Help" button in your account or email
                      support@marketmastery.com
                    </li>
                  </ol>
                  Our technical support team is available Monday through Friday, 9 AM to 8 PM EST, and typically
                  responds within 24 hours.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Is my personal and payment information secure?</AccordionTrigger>
                <AccordionContent>
                  Yes, we take data security very seriously. We implement industry-standard security measures to protect
                  your information:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>All data is encrypted using SSL/TLS encryption</li>
                    <li>Payment processing is handled by trusted third-party providers (Stripe, PayPal)</li>
                    <li>We do not store complete credit card information</li>
                    <li>Our systems undergo regular security audits and updates</li>
                    <li>We comply with data protection regulations</li>
                  </ul>
                  For more details, please refer to our Privacy Policy.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>

        <div className="mt-12 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Still Have Questions?</CardTitle>
              <CardDescription>
                If you couldn't find the answer you were looking for, our support team is here to help.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

