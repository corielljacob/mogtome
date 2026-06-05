import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import {
  setAuthToken,
  useAuth,
  getReturnUrl,
  clearReturnUrl,
} from "@/shared/contexts/AuthContext";
import { ProcessingScreen } from "@/components/authCallback/ProcessingScreen";
import { SuccessScreen } from "@/components/authCallback/SuccessScreen";
import { ErrorScreen } from "@/components/authCallback/ErrorScreen";

import moogleWizard from "@/assets/moogles/wizard moogle.webp";

type CallbackStatus = "processing" | "success" | "error";

export function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser, user } = useAuth();
  const [status, setStatus] = useState<CallbackStatus>("processing");
  const [error, setError] = useState<string>("");

  // capture return URL on first render, before effects can clear it
  const returnUrlRef = useRef<string | null>(null);
  if (returnUrlRef.current === null) {
    returnUrlRef.current = getReturnUrl() || "/";
    clearReturnUrl();
  }

  useEffect(() => {
    async function handleCallback() {
      const errorParam = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (errorParam) {
        setStatus("error");
        setError(errorDescription || "Authentication was cancelled or failed");
        return;
      }

      const token = searchParams.get("token");

      if (token) {
        setAuthToken(token);
        await refreshUser();
        setStatus("success");
        // SuccessScreen drives navigation via its onComplete callback
        return;
      }

      setStatus("error");
      setError(
        "No authentication token received. Please try logging in again.",
      );
    }

    handleCallback();
  }, [searchParams, navigate, refreshUser]);

  const handleReturnHome = () => navigate("/", { replace: true });

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4 pt-[calc(4rem+env(safe-area-inset-top))] md:pt-0 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0 relative overflow-hidden">
      <motion.img
        src={moogleWizard}
        alt=""
        aria-hidden="true"
        className="absolute bottom-24 right-6 md:right-20 w-20 md:w-28 object-contain opacity-[0.08]"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-lg relative z-10"
      >
        <div
          className={`bg-[var(--card)] rounded-lg p-6 shadow-sm border border-[var(--border)] relative overflow-hidden transition-all duration-300 ${status === "success" ? "max-w-lg" : "max-w-sm"}`}
        >
          {status === "processing" && <ProcessingScreen />}
          {status === "success" && user && (
            <SuccessScreen
              user={user}
              onComplete={() =>
                navigate(returnUrlRef.current!, { replace: true })
              }
            />
          )}
          {status === "error" && (
            <ErrorScreen error={error} onReturnHome={handleReturnHome} />
          )}
        </div>
      </motion.div>
    </div>
  );
}
