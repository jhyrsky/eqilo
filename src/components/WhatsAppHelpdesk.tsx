"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useLanguage } from "./language-provider";
import Image from "next/image";
import dynamic from "next/dynamic";

const ReactQRCode = dynamic(() => import("@lglab/react-qr-code").then((mod) => mod.ReactQRCode), {
  ssr: false,
  loading: () => <div className="w-[160px] h-[160px] bg-muted animate-pulse rounded-md" />
});

export function WhatsAppHelpdesk({ phone = "+358505633097" }: { phone?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const { t, lang } = useLanguage();

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;

  const handleInteraction = () => {
    if (isMobile) {
      window.open(whatsappUrl, "_blank");
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {isOpen && !isMobile && (
        <Card className="shadow-2xl border-border/50 bg-background w-[320px] animate-in slide-in-from-bottom-5 overflow-hidden rounded-2xl flex flex-col">
          {/* Chat Header */}
          <div className="bg-[#25D366] p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center shrink-0 overflow-hidden relative border-2 border-white/20 shadow-sm">
                <Image src="/johannes.webp" alt="Johannes Hyrsky" fill className="object-cover" sizes="44px" />
              </div>
              <div>
                <h3 className="font-bold text-md leading-tight">
                  Johannes / Eqilo
                </h3>
                <p className="text-xs text-white/90 font-medium flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  {t("whatsapp.online")}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 rounded-full w-8 h-8">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Chat Content */}
          <div className="p-6 bg-slate-50/50 flex flex-col items-center border-b border-border/50 relative">
            <div className="bg-white p-4 text-sm text-slate-700 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 self-start mb-6 max-w-[85%] leading-relaxed relative">
              <div className="absolute -left-2 top-0 w-4 h-4 bg-white border-l border-t border-slate-100 transform -skew-y-12" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}></div>
              {t("whatsapp.welcome")}
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <ReactQRCode 
                value={whatsappUrl} 
                size={160}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center px-4 font-medium leading-relaxed">
              {t("whatsapp.scan_desc")}
            </p>
          </div>

          {/* Chat Footer */}
          <div className="p-4 bg-background">
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noreferrer"
              className="w-full"
            >
              <Button className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-bold shadow-sm group h-12">
                <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                {t("whatsapp.web_link")}
              </Button>
            </a>
          </div>
        </Card>
      )}

      <button
        onClick={handleInteraction}
        className="group relative flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 border-[3px] border-white overflow-hidden p-0"
        aria-label="Open WhatsApp Helpdesk"
      >
        {isOpen && !isMobile ? (
          <X className="w-6 h-6" />
        ) : (
          <Image src="/johannes.webp" alt="Johannes" fill className="object-cover" sizes="64px" />
        )}
        
        {/* Always Online Indicator */}
        {(!isOpen || isMobile) && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 z-10">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
          </span>
        )}
        
        {/* Tooltip for desktop */}
        <span className="absolute right-full mr-4 bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity hidden md:block whitespace-nowrap pointer-events-none shadow-lg z-10">
          {t("whatsapp.ask_johannes")}
        </span>
      </button>
    </div>
  );
}
