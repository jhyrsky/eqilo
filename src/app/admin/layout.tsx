"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Store, 
  ChevronRight,
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AdminGuard } from "@/components/admin/AdminGuard";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await signOut(auth);
    router.push("/");
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: Store },
    { name: "Customers (CRM)", href: "/admin/customers", icon: Users },
    { name: "Carts & Links", href: "/admin/carts", icon: ShoppingCart },
  ];

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-muted/20 font-sans antialiased">
      {/* Sidebar */}
      <aside className="w-72 border-r bg-white flex flex-col sticky top-0 h-screen shadow-sm">
        <div className="p-8 border-b">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-primary/5 rounded-lg group-hover:bg-primary/10 transition-colors">
              <Image 
                src="/eqilologo.webp" 
                alt="Eqilo.fi Logo" 
                width={32} 
                height={32} 
                className="h-8 w-auto object-contain"
              />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-foreground leading-none">Eqilo</h2>
              <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Admin Portal</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-6 space-y-1">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-4 opacity-50">
            Management
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={cn(
                  "flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 translate-x-1" 
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "group-hover:text-primary")} />
                  <span className="text-sm font-bold tracking-tight">{item.name}</span>
                </div>
                {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
              </Link>
            );
          })}

          <div className="pt-8 text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-4 opacity-50">
            System
          </div>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all group">
            <Settings className="h-5 w-5 group-hover:text-primary" />
            <span className="text-sm font-bold tracking-tight">Store Settings</span>
          </Link>
        </nav>

        <div className="p-6 border-t bg-muted/10">
          <Link href="/shop">
            <Button variant="outline" className="w-full justify-start gap-2 font-bold border-primary/20 hover:bg-primary hover:text-white transition-all">
              <Store className="h-4 w-4" />
              Return to Storefront
            </Button>
          </Link>
          <div className="flex items-center gap-3 mt-6 px-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">Administrator</p>
              <p className="text-[10px] text-muted-foreground truncate">admin@eqilo.fi</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <header className="h-[73px] border-b bg-white/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-muted-foreground">Path /</span>
            <span className="text-sm font-bold capitalize">{pathname.split('/').pop() || 'Dashboard'}</span>
          </div>
          <div className="flex items-center gap-4">
             <Button variant="ghost" className="text-xs font-bold uppercase tracking-wider h-8">Support</Button>
             <div className="h-4 w-[1px] bg-border"></div>
             <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                System Live
             </div>
          </div>
        </header>
        <div className="p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
    </AdminGuard>
  );
}
