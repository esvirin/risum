"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if the app is already installed
      if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
        setIsAppInstalled(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check if the app is launched in standalone mode (PWA installed)
    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
      setIsAppInstalled(true);
    }

    // Event listener for when the app is installed
    window.addEventListener('appinstalled', () => {
      setIsAppInstalled(true);
    });


    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("User accepted the PWA install prompt");
      setIsAppInstalled(true);
    } else {
      console.log("User dismissed the PWA install prompt");
    }
    setDeferredPrompt(null);
  };

  if (!deferredPrompt || isAppInstalled) {
    return null;
  }

  return (
    <Button
      onClick={handleInstallClick}
      className="fixed bottom-4 right-4 z-50 shadow-lg"
      size="lg"
    >
      <Download className="h-5 w-5 mr-2" />
      Install App
    </Button>
  );
}
