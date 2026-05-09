"use client";

import { useRouter, usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function PeriodToggle({ period }: { period: "30d" | "all" }) {
  const router = useRouter();
  const pathname = usePathname();

  const toggle = () => {
    router.push(period === "30d" ? `${pathname}?period=all` : pathname);
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-border shadow-sm hover:border-primary/40 transition-colors cursor-pointer"
    >
      <Badge variant="outline" className="border-none font-bold text-primary pointer-events-none">
        {period === "30d" ? "Last 30 Days" : "All Time"}
      </Badge>
      <div className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent">
        <TrendingUp className={cn("w-4 h-4", period === "30d" ? "text-primary" : "text-muted-foreground")} />
      </div>
    </button>
  );
}
