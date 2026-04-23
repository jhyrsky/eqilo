"use client";

import { useAuth } from "@/components/auth-provider";
import { auth } from "@/lib/firebase/client";
import { 
  signOut, 
  sendSignInLinkToEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from "firebase/auth";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  LogOut, 
  LayoutDashboard, 
  Settings, 
  ShieldCheck, 
  Mail, 
  Phone,
  CheckCircle,
  ShoppingCart
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/components/language-provider";

export function UserMenu() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<"input" | "otp">("input");

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const actionCodeSettings = {
        url: window.location.origin + window.location.pathname,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setLinkSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      let formattedPhone = phone.trim();
      if (!formattedPhone.startsWith("+")) {
        // Default to Finnish prefix if missing (for convenience)
        formattedPhone = formattedPhone.startsWith("0") 
          ? `+358${formattedPhone.substring(1)}` 
          : `+${formattedPhone}`;
      }

      if (typeof window !== "undefined") {
        if (window.recaptchaVerifier) {
          try { window.recaptchaVerifier.clear(); } catch(e) { console.error(e); }
          // @ts-expect-error Resetting the verifier for retry
          window.recaptchaVerifier = undefined;
        }
        if (recaptchaRef.current) {
          recaptchaRef.current.innerHTML = ''; // Force clear DOM to prevent argument-error
          window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaRef.current, {
            size: "invisible",
          });
        } else {
          throw new Error("Recaptcha container is missing from the DOM.");
        }
      }
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);
      setStep("otp");
    } catch (err) {
      console.error("Phone Auth Error:", err);
      // Clean up the verifier if it fails so they can try again
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        // @ts-expect-error Resetting the verifier for retry
        window.recaptchaVerifier = undefined;
      }
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!confirmationResult) return;
    try {
      await confirmationResult.confirm(otp);
      setIsLoginOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  if (loading) return <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />;

  // If user is logged in (and NOT anonymous)
  if (user && !user.isAnonymous) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="relative h-9 w-9 rounded-full border border-primary/10 hover:bg-primary/5 transition-colors flex items-center justify-center">
            <div className="flex items-center justify-center w-full h-full bg-primary/10 text-primary rounded-full font-extrabold text-xs">
              {user.email?.charAt(0).toUpperCase() || user.phoneNumber?.slice(-2) || <User className="h-4 w-4" />}
            </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 p-2 shadow-lg border border-primary/10" align="end">
          <DropdownMenuLabel className="font-normal p-2">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-bold leading-none text-foreground flex items-center gap-2">
                {t("nav.profile")} <ShieldCheck className="w-3 h-3 text-primary" />
              </p>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {user.email || user.phoneNumber}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="opacity-50" />
          <DropdownMenuItem onClick={() => router.push("/admin")} className="font-medium p-2 cursor-pointer">
            <LayoutDashboard className="mr-3 h-4 w-4 text-muted-foreground" />
            <span>{t("nav.admin")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/orders")} className="font-medium p-2 cursor-pointer">
            <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
            <span>{t("nav.my_orders")}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="opacity-50" />
          <DropdownMenuItem onClick={handleSignOut} className="p-2 text-destructive focus:text-destructive focus:bg-destructive/5 cursor-pointer font-bold">
            <LogOut className="mr-3 h-4 w-4" />
            <span>{t("nav.logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Handle Login / Anonymous State
  return (
    <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
      <DialogTrigger render={<Button variant="ghost" size="icon" className="hover:bg-primary/5 hover:text-primary transition-colors" />}>
        <User className="h-5 w-5" />
        <span className="sr-only">{t("nav.login")}</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 shadow-2xl">
        <div className="bg-primary p-6 text-primary-foreground text-center">
           <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-80" />
           <DialogTitle className="text-2xl font-bold mb-2">
             {t("auth.login_title")}
           </DialogTitle>
           <DialogDescription className="text-primary-foreground/80">
             {t("auth.login_desc")}
           </DialogDescription>
        </div>
        
        <div className="p-6 bg-background">
          {error && <p className="text-sm text-destructive font-bold mb-4 bg-destructive/10 p-3 rounded-md border border-destructive/20">{error}</p>}
          
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="phone" className="font-bold"><Phone className="w-4 h-4 mr-2" /> {t("auth.phone")}</TabsTrigger>
              <TabsTrigger value="email" className="font-bold"><Mail className="w-4 h-4 mr-2" /> {t("auth.email")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="phone">
              {step === "input" ? (
                <form onSubmit={handlePhoneSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("auth.phone")}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+358 50 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="h-12 text-lg font-medium"
                    />
                    <p className="text-xs text-muted-foreground mt-1">{t("auth.phone_note")}</p>
                  </div>
                  <div ref={recaptchaRef}></div>
                  <Button type="submit" className="w-full h-12 text-lg font-bold shadow-md">
                    {t("auth.send_code")}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">{t("auth.sms_code")}</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      className="h-12 text-lg font-mono tracking-widest text-center"
                      maxLength={6}
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 text-lg font-bold shadow-md">
                    {t("auth.verify")}
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={() => setStep("input")}>
                    {t("auth.back")}
                  </Button>
                </form>
              )}
            </TabsContent>
            
            <TabsContent value="email">
              {linkSent ? (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  </div>
                  <h3 className="text-lg font-bold">Check your email</h3>
                  <p className="text-muted-foreground">
                    We&apos;ve sent a magic link to <strong>{email}</strong>. Click the link in the email to sign in.
                  </p>
                  <Button variant="outline" className="w-full mt-4" onClick={() => setLinkSent(false)}>
                    Try another email
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("auth.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.fi"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 text-lg font-bold shadow-md">
                    Send Magic Link
                  </Button>
                </form>
              )}
            </TabsContent>
          </Tabs>
          {/* Invisible Recaptcha must remain in the DOM at all times */}
          <div ref={recaptchaRef}></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}
