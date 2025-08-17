import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="flex flex-col">
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Simple, Transparent Pricing
              </h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Choose the plan that's right for your learning journey
              </p>
            </div>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 mt-8">
            {/* Basic Plan */}
            <Card className="flex flex-col">
              <CardHeader className="flex flex-col space-y-1.5">
                <CardTitle className="text-xl">Basic</CardTitle>
                <CardDescription>Essential stock market knowledge</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$199</span>
                  <span className="text-muted-foreground ml-2">one-time</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 text-sm">
                  {[
                    "Access to beginner modules",
                    "Basic technical analysis",
                    "Trading fundamentals",
                    "3 months access",
                    "Email support",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/checkout?plan=basic">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Pro Plan */}
            <Card className="flex flex-col border-primary">
              <CardHeader className="flex flex-col space-y-1.5">
                <div className="px-4 py-1 text-xs bg-primary text-primary-foreground rounded-full w-fit mx-auto mb-2">
                  Most Popular
                </div>
                <CardTitle className="text-xl">Pro</CardTitle>
                <CardDescription>Complete trading education</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$399</span>
                  <span className="text-muted-foreground ml-2">one-time</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 text-sm">
                  {[
                    "All Basic features",
                    "Intermediate & Advanced modules",
                    "Trading strategy blueprints",
                    "Lifetime access",
                    "Priority email support",
                    "Monthly live Q&A sessions",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/checkout?plan=pro">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Premium Plan */}
            <Card className="flex flex-col">
              <CardHeader className="flex flex-col space-y-1.5">
                <CardTitle className="text-xl">Premium</CardTitle>
                <CardDescription>Advanced trading with mentorship</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$699</span>
                  <span className="text-muted-foreground ml-2">one-time</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 text-sm">
                  {[
                    "All Pro features",
                    "1-on-1 mentorship sessions",
                    "Portfolio review",
                    "Custom trading plan",
                    "Private community access",
                    "Direct instructor access",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/checkout?plan=premium">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-xl font-bold mb-4">Need a custom solution?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We offer corporate training and custom packages for teams and organizations. Contact us to discuss your
              specific needs.
            </p>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-24 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Frequently Asked Questions</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need to know about our course
              </p>
            </div>
          </div>

          <div className="mx-auto grid max-w-3xl gap-6 mt-8">
            {[
              {
                question: "How long do I have access to the course?",
                answer:
                  "Basic plan includes 3 months of access. Pro and Premium plans include lifetime access to all course materials and updates.",
              },
              {
                question: "Is there a money-back guarantee?",
                answer: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with the course.",
              },
              {
                question: "Do I need prior knowledge to take this course?",
                answer:
                  "No prior knowledge is required. Our course starts with the basics and gradually progresses to more advanced topics.",
              },
              {
                question: "Can I upgrade my plan later?",
                answer:
                  "Yes, you can upgrade from Basic to Pro or Premium at any time by paying the difference in price.",
              },
              {
                question: "How is the course delivered?",
                answer:
                  "The course is delivered through our online platform with video lessons, downloadable resources, quizzes, and assignments.",
              },
            ].map((faq, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">Still have questions? We're here to help.</p>
            <Button asChild variant="outline">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

