import { Aperture } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  withText?: boolean;
}

export function Logo({ className, withText = true }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <div className="bg-primary flex items-center justify-center rounded-md p-1 glow">
        <Aperture className="h-5 w-5 text-accent" strokeWidth={2} />
      </div>
      {withText && (
        <span className="font-bold text-lg tracking-tight">LoanLens</span>
      )}
    </Link>
  );
}
