import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingBag, UserPlus, LogIn } from "lucide-react";
import AuthGuard from "@/lib/auth";

export default function HomePage() {
  return (
    <AuthGuard>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 px-4">
        <div className="w-full max-w-4xl shadow-2xl rounded-3xl bg-white/80 backdrop-blur-md p-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-tr from-primary to-green-400 rounded-full p-5 shadow-lg">
                <ShoppingBag className="h-14 w-14 text-white drop-shadow" />
              </div>
            </div>
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight drop-shadow">
              Welcome to <span className="text-primary">ShopHub</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your ultimate e-commerce destination. Discover amazing products,
              great deals, and a seamless shopping experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <Card className="hover:shadow-2xl transition-shadow border-2 border-blue-100 hover:border-blue-300 bg-white/90">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-tr from-blue-200 to-blue-400 rounded-full p-4 shadow">
                    <LogIn className="h-9 w-9 text-white" />
                  </div>
                </div>
                <CardTitle className="text-blue-700">Sign In</CardTitle>
                <CardDescription>
                  Access your existing account to continue shopping
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/login">
                  <Button
                    className="w-full font-semibold text-lg"
                    variant="default"
                    size="lg"
                  >
                    Sign In to Your Account
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-2xl transition-shadow border-2 border-green-100 hover:border-green-300 bg-white/90">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-tr from-green-200 to-green-400 rounded-full p-4 shadow">
                    <UserPlus className="h-9 w-9 text-white" />
                  </div>
                </div>
                <CardTitle className="text-green-700">Create Account</CardTitle>
                <CardDescription>
                  Join our community and start your shopping journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/register">
                  <Button
                    className="w-full font-semibold text-lg"
                    variant="outline"
                    size="lg"
                  >
                    Create New Account
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-500 text-base flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
              Secure authentication
              <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
              Fast checkout
              <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full"></span>
              24/7 support
            </p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
