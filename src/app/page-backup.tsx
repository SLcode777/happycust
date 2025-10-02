import Link from "next/link"
import { MessageSquare, Star, Bug, Lightbulb, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  const features = [
    {
      icon: MessageSquare,
      title: "Simple Feedback",
      description: "Collect quick feedback from your users effortlessly",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Star,
      title: "Customer Reviews",
      description: "Gather and showcase authentic customer reviews",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      icon: Bug,
      title: "Bug Reports",
      description: "Let users report issues with screenshots",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      icon: Lightbulb,
      title: "Feature Requests",
      description: "Crowdsource ideas with built-in voting system",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  const benefits = [
    "Embeddable widget for any web application",
    "Powerful admin dashboard",
    "Multi-language support (EN/FR)",
    "Upload screenshots for bug reports",
    "Public API for displaying reviews",
    "GDPR compliant",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">HappyCust</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
            <Link href="/en/admin/login" className="text-gray-600 hover:text-gray-900 transition-colors">
              Login
            </Link>
            <Link href="/en/admin/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Customer Feedback,
            <br />
            Made Simple
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Collect feedback, reviews, bug reports, and feature requests from your customers.
            All in one embeddable widget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/en/admin/signup">
              <Button size="lg" className="gap-2">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button size="lg" variant="outline">
                See Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need
          </h2>
          <p className="text-gray-600 text-lg">
            One widget, four powerful feedback tools
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Why Choose HappyCust?
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See It In Action
          </h2>
          <p className="text-gray-600 mb-8">
            Click the feedback button in the bottom right to try our widget
          </p>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12 border-2 border-dashed border-gray-300">
            <div className="flex items-center justify-center gap-4 text-gray-500">
              <MessageSquare className="h-12 w-12" />
              <div className="text-left">
                <p className="font-semibold text-gray-700">Interactive Demo</p>
                <p className="text-sm">Look for the widget button →</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Listen to Your Customers?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join companies that value customer feedback. Start collecting insights today.
          </p>
          <Link href="/en/admin/signup">
            <Button size="lg" variant="secondary" className="gap-2">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-bold">HappyCust</span>
            </div>
            <div className="flex gap-6">
              <Link href="/en/admin/login" className="hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/en/admin/signup" className="hover:text-white transition-colors">
                Sign Up
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Documentation
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} HappyCust. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
