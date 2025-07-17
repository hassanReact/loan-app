"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Zap, Clock, TrendingUp, Users, DollarSign, Star } from "lucide-react"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-blue-600" />,
      title: "Lightning Fast",
      description: "Get approved in minutes, not days",
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "100% Secure",
      description: "Bank-level security for your data",
    },
    {
      icon: <Clock className="h-8 w-8 text-purple-600" />,
      title: "24/7 Support",
      description: "Round-the-clock customer assistance",
    },
  ]

  const stats = [
    { icon: <Users className="h-6 w-6" />, value: "50K+", label: "Happy Customers" },
    { icon: <DollarSign className="h-6 w-6" />, value: "$100M+", label: "Loans Disbursed" },
    { icon: <TrendingUp className="h-6 w-6" />, value: "99.9%", label: "Approval Rate" },
    { icon: <Star className="h-6 w-6" />, value: "4.9/5", label: "Customer Rating" },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div
            className={`text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Badge variant="secondary" className="mb-6 bg-white/10 text-white border-white/20">
              <Zap className="h-4 w-4 mr-2" />
              New: Instant Loan Approval
            </Badge>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Get Your Loan in
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Minutes, Not Days
              </span>
            </h1>

            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Apply for personal loans, track application status, and manage repayments — all in one modern, secure
              platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Link href="/register">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full bg-transparent"
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-400/20 rounded-full animate-ping"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-700 delay-${index * 100} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-400">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose SwiftLoan?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Experience the future of lending with our cutting-edge platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm delay-${index * 200} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              >
                <CardContent className="p-8 text-center">
                  <div className="mb-6 flex justify-center">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Simple 3-Step Process</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Get your loan in just three easy steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Apply Online", desc: "Fill out our simple application form" },
              { step: "02", title: "Get Approved", desc: "Receive instant approval decision" },
              { step: "03", title: "Receive Funds", desc: "Money transferred to your account" },
            ].map((item, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-700 delay-${index * 200} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              >
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto shadow-lg">
                    {item.step}
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 opacity-30"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of satisfied customers who trust SwiftLoan</p>
          <Button
            asChild
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <Link href="/register">
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
