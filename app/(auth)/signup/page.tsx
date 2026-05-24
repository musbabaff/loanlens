"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/shared/logo";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const signupSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  bankName: z.string().min(2, { message: "Bank name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    setError(null);
    
    // 1. Sign up user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { full_name: values.fullName },
      },
    });

    if (signUpError) {
      if (signUpError.status === 429) {
        setError('Too many attempts. Please wait a minute and try again.');
      } else {
        setError(signUpError.message);
      }
      setIsLoading(false);
      return;
    }

    // 2. Create profile row (in a real app, you might use an edge function/trigger for this)
    if (data?.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          full_name: values.fullName,
          bank_name: values.bankName,
          role: 'analyst',
        } as any);

      if (profileError) {
        console.error(profileError);
      }
    }

    setIsLoading(false);
    toast.success("Account created successfully!");
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <Logo className="sm:scale-125 mb-4" />
        </div>
        
        <Card className="bg-surface border-border/50 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-center">
              Create an account
            </CardTitle>
            <CardDescription className="text-center">
              Start generating AI credit memos in minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  {...register("fullName")}
                  className={errors.fullName ? "border-danger focus-visible:ring-danger" : ""}
                />
                {errors.fullName && (
                  <p className="text-sm text-danger">{errors.fullName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank / Institution Name</Label>
                <Input
                  id="bankName"
                  placeholder="Acme Bank"
                  {...register("bankName")}
                  className={errors.bankName ? "border-danger focus-visible:ring-danger" : ""}
                />
                {errors.bankName && (
                  <p className="text-sm text-danger">{errors.bankName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@bank.com"
                  {...register("email")}
                  className={errors.email ? "border-danger focus-visible:ring-danger" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-danger">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  className={errors.password ? "border-danger focus-visible:ring-danger" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-danger">{errors.password.message}</p>
                )}
              </div>
              
              <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign up"}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-accent hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
