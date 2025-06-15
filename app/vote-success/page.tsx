import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Vote, BarChart3, Home } from "lucide-react"

export default function VoteSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="shadow-xl border-0 text-center">
          <CardContent className="pt-12 pb-8">
            <div className="mx-auto mb-6 p-4 bg-green-100 rounded-full w-fit">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">Vote Successfully Recorded!</h1>

            <p className="text-lg text-gray-600 mb-6">
              Your vote has been securely recorded on the blockchain. Thank you for participating in the UNILORIN
              Student Union Elections.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Transaction Details</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <strong>Transaction ID:</strong> 0x7a8b9c2d3e4f5g6h7i8j9k0l1m2n3o4p
                </p>
                <p>
                  <strong>Block Number:</strong> #2,847,392
                </p>
                <p>
                  <strong>Timestamp:</strong> {new Date().toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong> <span className="text-green-600 font-medium">Confirmed</span>
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>

              <Link href="/results">
                <Button variant="outline" className="w-full">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Results
                </Button>
              </Link>

              <Link href="/vote-receipt">
                <Button variant="outline" className="w-full">
                  <Vote className="h-4 w-4 mr-2" />
                  Get Receipt
                </Button>
              </Link>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Important:</strong> Your vote is anonymous and cannot be traced back to you. The blockchain
                ensures transparency while maintaining voter privacy.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
