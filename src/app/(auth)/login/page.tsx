import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form-input";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-c1">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-c4 p-8 flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-c3">My Dashboard</h1>
          <p className="text-sm text-c2">Sign in to your account</p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <FormInput type="email" label="Email" placeholder="you@example.com" />
          <FormInput type="password" label="Password" placeholder="••••••••" />

          <Button className="w-full py-2.5 cursor-pointer">
            Sign In
          </Button>
        </div>
      </div>
    </div>
  )
}