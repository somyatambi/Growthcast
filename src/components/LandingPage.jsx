import React from 'react';
import { 
  SparklesIcon, 
  RocketLaunchIcon, 
  ChartBarIcon, 
  CloudArrowUpIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import { ChartBarSquareIcon } from '@heroicons/react/24/solid';

function LandingPage({ onGetStarted, onNavigateToExcelCleaner }) {
  const features = [
    {
      icon: <SparklesIcon className="h-8 w-8" />,
      title: 'Excel File Cleaning',
      description: 'Automatically clean your Excel files - remove duplicates, handle missing values, standardize formats, and more.',
      action: onNavigateToExcelCleaner
    },
    {
      icon: <ChartBarIcon className="h-8 w-8" />,
      title: 'Admin Dashboard',
      description: 'Comprehensive dashboard to manage your data, view reports, and monitor all cleaning operations.'
    },
    {
      icon: <ArrowTrendingUpIcon className="h-8 w-8" />,
      title: 'Predictive Analysis',
      description: 'See accurate business forecasts for 3, 6, and 12 months ahead with AI-powered predictions.'
    },
    {
      icon: <CloudArrowUpIcon className="h-8 w-8" />,
      title: 'Report Generation',
      description: 'Generate professional reports from your Excel files with visualizations and insights automatically.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Upload Your Data',
      description: 'Simply upload your Excel file with sales, revenue, or any business metrics.'
    },
    {
      number: '02',
      title: 'AI Processing',
      description: 'Our intelligent system analyzes patterns and trends in your data.'
    },
    {
      number: '03',
      title: 'Get Insights',
      description: 'View beautiful dashboards with predictions and actionable insights.'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/30 rounded-full px-6 py-2 mb-8">
              <SparklesIcon className="h-5 w-5 text-green-400" />
              <span className="text-green-400 font-medium">AI-Powered Business Intelligence</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Transform Your</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                Business Data
              </span>
              <br />
              <span className="text-white">Into Growth</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              No coding required. Just upload your Excel file and watch as AI transforms 
              complex data into clear insights and accurate growth predictions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button
                onClick={onGetStarted}
                className="group px-8 py-4 bg-green-500 hover:bg-green-600 text-black font-bold rounded-lg text-lg transition-all hover:shadow-2xl hover:shadow-green-500/50 transform hover:scale-105 flex items-center space-x-2"
              >
                <span>Start Free Trial</span>
                <RocketLaunchIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg text-lg border border-green-500/30 transition-all backdrop-blur-sm"
              >
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">10K+</div>
                <div className="text-gray-500 text-sm">Active Users</div>
              </div>
              <div className="text-center border-x border-green-500/20">
                <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">95%</div>
                <div className="text-gray-500 text-sm">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">24/7</div>
                <div className="text-gray-500 text-sm">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gradient-to-b from-black to-green-950/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful Features for Your Business
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Complete suite of tools to clean, analyze, predict, and report on your data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                onClick={feature.action}
                className={`group bg-white/5 backdrop-blur-sm border border-green-500/20 rounded-xl p-8 hover:bg-white/10 hover:border-green-500/40 transition-all hover:shadow-xl hover:shadow-green-500/10 hover:transform hover:scale-105 ${feature.action ? 'cursor-pointer' : ''}`}
              >
                <div className="bg-green-500/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6 text-green-400 group-hover:bg-green-500/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                {feature.action && (
                  <div className="mt-4 text-green-400 text-sm font-semibold flex items-center">
                    Try it now →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-black">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">
              Three simple steps to unlock powerful insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-green-500/50 to-transparent"></div>
                )}
                
                <div className="relative bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/30 rounded-2xl p-8 text-center hover:border-green-500/60 transition-all">
                  <div className="text-6xl font-bold text-green-500/20 mb-4">{step.number}</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-green-950/20">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-2xl p-12 backdrop-blur-sm">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Grow Your Business?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of businesses making smarter decisions with AI-powered insights
            </p>
            <button
              onClick={onGetStarted}
              className="px-10 py-5 bg-green-500 hover:bg-green-600 text-black font-bold rounded-lg text-xl transition-all hover:shadow-2xl hover:shadow-green-500/50 transform hover:scale-105"
            >
              Start Your Free Trial Now
            </button>
            <p className="text-gray-500 mt-6">No credit card required • 14-day free trial</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-green-500/20 py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <ChartBarSquareIcon className="h-8 w-8 text-green-400" />
            <span className="text-xl font-bold">
              <span className="text-white">Growth</span>
              <span className="text-green-400">Cast</span>
            </span>
          </div>
          <p className="text-gray-500">
            © 2025 GrowthCast. All rights reserved. Empowering businesses with AI-driven insights.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
