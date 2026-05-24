"use client";

import { Menu, Bell, Search } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Topbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  
  const pathSegment = pathname.split('/').pop() || "";
  const title = pathname === "/dashboard" 
    ? "Overview" 
    : pathSegment ? pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1) : "Dashboard";

  return (
    <header className="h-16 border-b border-border-subtle bg-bg-surface flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div className="lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 border-r-border-subtle bg-bg-surface">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <Sidebar isMobile onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search applications..."
            className="pl-9 h-9 bg-bg-surface border-border-subtle focus-visible:ring-brand-accent placeholder:text-text-muted text-text-primary"
          />
        </div>
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="h-9 w-9 relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-brand-accent rounded-full border border-bg-surface"></span>
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  );
}
