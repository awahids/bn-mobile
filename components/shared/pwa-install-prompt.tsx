"use client";

import { useState, useEffect } from "react";
import { X, Share, PlusSquare, Download } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function PWAInstallPrompt() {
  const [isStandalone, setIsStandalone] = useState(true);
  const [isIOS, setIsIOS] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if dismissed previously
    let isDismissed = false;
    try {
      isDismissed = localStorage.getItem("pwa-prompt-dismissed") === "true";
    } catch {
      // Storage may be unavailable (private mode); treat as not dismissed.
    }
    if (isDismissed) return;

    // Check display-mode standalone and Safari's standalone flag
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    const standalone = isStandaloneMode || isIOSStandalone;
    setIsStandalone(standalone);
    if (standalone) return;

    // Determine if iOS for specific instruction
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // iOS has no install event, so show manual instructions after a short delay.
    // Other browsers only get the prompt once beforeinstallprompt fires, so the
    // "Install" button always has a native prompt to trigger.
    const timeoutId = isIOSDevice ? window.setTimeout(() => setShowPrompt(true), 1500) : undefined;

    // Listen for the prompt event on Android/Chrome
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };
    const handleAppInstalled = () => setShowPrompt(false);

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const [installError, setInstallError] = useState(false);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else {
      setInstallError(true);
      setTimeout(() => setInstallError(false), 5000);
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
    try {
      localStorage.setItem("pwa-prompt-dismissed", "true");
    } catch {
      // Ignore storage write errors.
    }
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <div role="dialog" aria-label="Instal aplikasi Belajar Ngaji" className="fixed bottom-24 left-4 right-4 mx-auto max-w-md md:left-auto md:right-8 md:w-[400px] z-[100] flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-700 bg-card/95 backdrop-blur-2xl border border-border shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[2rem] p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary blur-lg opacity-20 animate-pulse" />
            <div className="relative bg-gradient-to-br from-primary to-emerald-600 p-2.5 rounded-2xl shadow-lg shadow-primary/20">
              <Download className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-foreground text-base tracking-tight">
              Belajar Ngaji PWA
            </h3>
            <p className="text-xs font-semibold text-primary">
              Akses Cepat & Offline
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClose}
          aria-label="Tutup ajakan instal"
          className="p-2 text-muted-foreground hover:text-foreground transition-colors bg-secondary/50 rounded-full active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {isIOS ? (
          <div className="bg-muted/50 rounded-2xl p-4 border border-border/50">
            <p className="text-[14px] text-foreground/80 leading-relaxed font-medium">
              Cara instal: Tap ikon <Share className="inline w-4 h-4 mx-1 text-blue-500" /> di bawah browser, lalu pilih <span className="font-bold text-foreground inline-flex items-center gap-1 underline underline-offset-4 decoration-primary/30">Tambahkan ke Layar Utama <PlusSquare className="w-4 h-4 ml-1" /></span>
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground leading-relaxed px-1">
              Instal aplikasi untuk performa yang lebih baik dan tetap bisa belajar meskipun tanpa koneksi internet.
            </p>

            <div className="flex flex-col gap-2.5">
              <Button
                onClick={handleInstallClick}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground active:scale-[0.98] transition-all rounded-2xl font-bold text-sm shadow-xl shadow-primary/10"
              >
                Install Sekarang
              </Button>

              {installError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-[12px] text-center text-accent font-bold">
                    Gunakan menu browser &amp; pilih &quot;Install App&quot; / &quot;Tambahkan&quot;
                  </p>
                </motion.div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
