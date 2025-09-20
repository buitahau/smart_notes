'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import {
  Brain,
  MessageSquare,
  CheckSquare,
  Chrome,
  Star,
  Users,
  Zap,
  CheckCircle,
  BarChart3,
  Calendar,
  FileText,
  Shield
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description: 'Get intelligent suggestions and summaries powered by advanced AI technology.'
  },
  {
    icon: MessageSquare,
    title: 'Unified Chat Interface',
    description: 'All your conversations in one place with smart context awareness.'
  },
  {
    icon: CheckSquare,
    title: 'Smart Task Management',
    description: 'Organize tasks with AI prioritization and automatic categorization.'
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data stays private with end-to-end encryption and local storage.'
  }
]

const benefits = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Instant access to your notes and tasks with Chrome extension integration.'
  },
  {
    icon: BarChart3,
    title: 'Productivity Analytics',
    description: 'Track your productivity patterns and optimize your workflow.'
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'AI-powered scheduling that adapts to your work habits.'
  },
  {
    icon: FileText,
    title: 'Intelligent Organization',
    description: 'Automatic categorization and tagging of all your content.'
  }
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Manager',
    content: 'Smart Notes has completely transformed how I manage my daily tasks. The AI insights are incredibly accurate!',
    rating: 5
  },
  {
    name: 'Alex Rodriguez',
    role: 'Software Developer',
    content: 'The unified chat interface is a game-changer. Everything I need is in one place, organized intelligently.',
    rating: 5
  },
  {
    name: 'Emily Watson',
    role: 'Marketing Director',
    content: 'I\'ve tried many note-taking apps, but Smart Notes is the first one that actually understands how I work.',
    rating: 5
  }
]

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      'Basic note taking',
      'Simple task management',
      'Chrome extension access',
      'Up to 100 notes'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    features: [
      'Unlimited notes & tasks',
      'Advanced AI insights',
      'Priority support',
      'Data export',
      'Custom templates',
      'Team collaboration'
    ],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Team',
    price: '$29',
    period: '/month',
    features: [
      'Everything in Pro',
      'Team workspaces',
      'Advanced analytics',
      'API access',
      'Dedicated support',
      'Custom integrations'
    ],
    cta: 'Contact Sales',
    popular: false
  }
]

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="hero-gradient min-h-screen flex items-center pt-20">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Transform Your Productivity with
              <span className="gradient-text block">AI-Powered Notes</span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Smart Notes combines intelligent note-taking, task management, and unified chat in one powerful Chrome extension.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-300">
                <Chrome className="w-5 h-5 inline mr-2" />
                Add to Chrome - It's Free
              </button>
              <Link href="/dashboard" className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-400 transition-colors text-center">
                View Dashboard
              </Link>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-400 transition-colors">
                Watch Demo
              </button>
            </motion.div>

            <motion.div
              className="flex items-center justify-center space-x-8 text-sm text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>10,000+ active users</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 fill-current text-yellow-500" />
                <span>4.9/5 rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Privacy focused</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Powerful Features, <span className="gradient-text">Simplified</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to stay organized and productive, powered by intelligent AI.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white p-8 rounded-xl card-hover"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4">
                Why Choose <span className="gradient-text">Smart Notes</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Experience the future of productivity with our AI-powered Chrome extension that adapts to your workflow.
              </p>

              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={benefit.title} className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-2">{benefit.title}</h4>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <div className="flex items-center space-x-2 mb-6">
                  <Chrome className="w-6 h-6" />
                  <span className="font-semibold">Chrome Extension</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Available on Chrome Web Store</h3>
                <p className="mb-6">Join thousands of productive users who've transformed their workflow with Smart Notes.</p>
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-8 h-8 bg-white/20 rounded-full border-2 border-white flex items-center justify-center text-xs">
                        {i}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm">10,000+ active installations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Loved by <span className="gradient-text">Productivity Enthusiasts</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our users have to say about their experience with Smart Notes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.name} className="bg-white p-8 rounded-xl card-hover">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current text-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Simple, <span className="gradient-text">Transparent Pricing</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works best for you. Always free to get started.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={plan.name} className={`relative bg-white rounded-xl border-2 ${
                plan.popular ? 'border-blue-600 ring-4 ring-blue-50' : 'border-gray-200'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Productivity?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who've already discovered the power of AI-powered note-taking and task management.
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-300">
            <Chrome className="w-5 h-5 inline mr-2" />
            Add to Chrome - It's Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Smart Notes</span>
            </div>

            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>&copy; 2024 Smart Notes. All rights reserved. Made with ❤️ for productivity enthusiasts.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}