import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-purple-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Logo size={100} />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">RareMatch</h1>
                <p className="text-gray-600 text-sm">Discover how unique you really are</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-purple-700 bg-purple-100 px-4 py-2 rounded-full">
              <i className="fas fa-users text-purple-600"></i>
              <span>Professional rarity analysis</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Discover Your Rarity</h2>
          <p className="text-xl md:text-2xl mb-8 text-purple-100">
            Calculate how unique your combination of traits makes you and generate a personalized certificate
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/generator">
              <Button
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-xl transform hover:scale-105 transition-all duration-200"
                data-testid="button-start-creating"
              >
                <i className="fas fa-magic mr-2"></i>Start Creating
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">1 in</div>
              <div className="text-3xl font-bold text-purple-600 mb-2">10K+</div>
              <div className="text-purple-700">Rarest combinations possible</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl shadow-lg">
              <div className="text-3xl font-bold text-pink-600 mb-2">25+</div>
              <div className="text-pink-700">Unique traits tracked</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl shadow-lg">
              <div className="text-2xl font-bold text-yellow-600 mb-2">Scientific</div>
              <div className="text-yellow-700">Research-based calculations</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">Instant</div>
              <div className="text-blue-700">Certificate generation</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
