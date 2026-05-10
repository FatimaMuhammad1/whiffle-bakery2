// ==================== VERIFY OTP PAGE ====================
// Shown right after signup — user enters the 6-digit code
// sent to their email to activate their account.
// =========================================================

import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { MailCheck, RefreshCw, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import heroBg from "@/assets/hero-bakery.jpg";
import WhiffleLogo from "@/components/WhiffleLogo";

const OTP_LENGTH = 6;

// ---- VerifyOtp Page Component ----
const VerifyOtp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first empty box on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  // ---- Digit Input Handler ----
  const handleDigitChange = (index: number, value: string) => {
    // Only take the last character (handles paste or hold)
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    // Auto-advance focus
    if (char && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  // ---- End Digit Input Handler ----

  // ---- Paste Handler ----
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = [...digits];
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    // Focus last filled box
    const lastIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[lastIdx]?.focus();
  };
  // ---- End Paste Handler ----

  // ---- Backspace Handler ----
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  // ---- End Backspace Handler ----

  // ---- Submit Handler ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < OTP_LENGTH) {
      toast.error("Please enter all 6 digits.");
      return;
    }
    if (!email) {
      toast.error("Email address is missing. Please sign up again.");
      return;
    }
    setSubmitting(true);
    try {
      await api.verifyOtp({ email, code });
      toast.success("Email verified! You can now log in.");
      navigate("/login");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Verification failed";
      toast.error(message);
      // Clear inputs on failure so user can try again
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setSubmitting(false);
    }
  };
  // ---- End Submit Handler ----

  // ---- Resend Handler ----
  const handleResend = async () => {
    if (countdown > 0 || !email) return;
    setResending(true);
    try {
      await api.resendOtp(email);
      toast.success("A new OTP has been sent to your email.");
      setCountdown(60);
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not resend OTP";
      toast.error(message);
    } finally {
      setResending(false);
    }
  };
  // ---- End Resend Handler ----

  return (
    <div className="min-h-[80vh] flex">
      {/* ---- Left Decorative Panel ---- */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img src={heroBg} alt="Fresh baked goods" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-chocolate/80 to-chocolate/50 flex items-center justify-center">
          <div className="text-center px-12">
            <WhiffleLogo className="h-16 w-auto text-cream mx-auto mb-6" />
            <h2 className="font-heading text-3xl font-bold text-cream mb-4 italic">
              Almost There!
            </h2>
            <p className="font-body text-cream/80 text-lg max-w-sm mx-auto">
              We sent a 6-digit code to your email. Enter it to activate your account.
            </p>
          </div>
        </div>
      </div>
      {/* ---- End Left Decorative Panel ---- */}

      {/* ---- Right Form Panel ---- */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gradient-to-b from-background to-secondary/30">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <WhiffleLogo className="h-12 w-auto text-chocolate mx-auto mb-2" />
          </div>

          {/* ---- Icon + Heading ---- */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 ring-4 ring-primary/20">
              <MailCheck size={32} className="text-primary" strokeWidth={1.5} />
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground text-center mb-2">
              Check Your Email
            </h1>
            <p className="font-body text-muted-foreground text-center text-sm max-w-xs">
              We sent a 6-digit verification code to{" "}
              <span className="font-semibold text-foreground">{email || "your email"}</span>.
            </p>
          </div>
          {/* ---- End Icon + Heading ---- */}

          {/* ---- OTP Form ---- */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 6 digit boxes */}
            <div className="flex justify-center gap-3" onPaste={handlePaste}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  id={`otp-digit-${i}`}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={2}
                  value={digit}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className={`
                    w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 bg-card
                    font-heading transition-all duration-150 outline-none
                    ${digit
                      ? "border-primary text-primary shadow-sm shadow-primary/20"
                      : "border-border text-foreground"
                    }
                    focus:border-primary focus:ring-2 focus:ring-primary/30
                  `}
                />
              ))}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || digits.join("").length < OTP_LENGTH}
              className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-xl font-heading font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? "Verifying…" : "Verify Email"}
            </button>
          </form>
          {/* ---- End OTP Form ---- */}

          {/* ---- Resend ---- */}
          <div className="mt-6 text-center">
            <p className="font-body text-sm text-muted-foreground mb-2">
              Didn't receive it?
            </p>
            <button
              onClick={handleResend}
              disabled={countdown > 0 || resending}
              className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-primary hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
            >
              <RefreshCw size={14} strokeWidth={2} className={resending ? "animate-spin" : ""} />
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
            </button>
          </div>
          {/* ---- End Resend ---- */}

          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 font-body text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft size={14} strokeWidth={2} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
      {/* ---- End Right Form Panel ---- */}
    </div>
  );
};
// ---- End VerifyOtp Page Component ----

export default VerifyOtp;
// ==================== END VERIFY OTP PAGE ====================
