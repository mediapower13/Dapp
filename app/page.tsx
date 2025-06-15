import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Vote, Shield, Users, CheckCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Vote className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">UNILORIN Vote</h1>
              <p className="text-xs text-gray-600">Student Union Elections</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-green-600 hover:bg-green-700">Register</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
            Secure • Transparent • Blockchain-Powered
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            University of Ilorin
            <br />
            <span className="text-green-600">Student Union Elections</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Cast your vote securely using blockchain technology. Your voice matters in shaping the future of our student
            community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3">
                Start Voting Now
              </Button>
            </Link>
            <Link href="/results">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                View Results
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Our Voting Platform?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Secure & Transparent</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Blockchain technology ensures every vote is recorded securely and transparently, preventing fraud and
                  manipulation.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Student-Verified</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Only verified UNILORIN students with valid email addresses can participate in the election process.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Real-time Results</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  View live election results and track voting progress in real-time with complete transparency.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Election Info */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Election Information</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Voting Period</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-2">
                    <strong>Start:</strong> March 15, 2024 - 8:00 AM
                  </p>
                  <p className="text-gray-600">
                    <strong>End:</strong> March 17, 2024 - 6:00 PM
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-600">Eligible Voters</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-2">
                    All registered UNILORIN students with valid student email addresses
                  </p>
                  <p className="text-sm text-gray-500">Format: matricno@students.unilorin.edu.ng</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Vote className="h-6 w-6" />
            <span className="text-lg font-semibold">UNILORIN Vote</span>
          </div>
          <p className="text-gray-400 mb-4">Empowering student democracy through secure blockchain voting</p>
          <p className="text-sm text-gray-500">© 2024 University of Ilorin Student Union. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
