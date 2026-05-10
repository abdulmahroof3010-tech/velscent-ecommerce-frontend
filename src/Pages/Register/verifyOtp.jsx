import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

function VerifyOtp() {
  const { verifyOtp, resendOtp } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  if (!email) return null;

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [resend, setResend] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);

  const inputsRef = useRef([]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    if (finalOtp.length !== 4) {
      setError("Please enter complete OTP");
      return;
    }

    setError("");

    const result = await verifyOtp(email, finalOtp);

    if (result.success) {
      toast.success("Register successful");
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  const handleResend = async () => {
    if (resending) return;

    try {
      setResending(true);
      await resendOtp(email);
      toast.success("New OTP sent");
      setTimeLeft(60);
      setResend(false);
      setOtp(["", "", "", ""]);
      setError("");
      inputsRef.current[0]?.focus();
    } catch (e) {
      toast.error("Failed to send otp");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm border border-neutral-200/50">
          
          {/* Header */}
          <div className="px-8 pt-10 pb-6 text-center bg-white">
            <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-neutral-900 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-light tracking-wide text-neutral-900">Verification</h3>
            <p className="text-neutral-500 text-sm mt-2 font-light">
              Enter the 4-digit code sent to<br />{email}
            </p>
          </div>

          {/* Body */}
          <div className="px-8 pb-10">
            {/* OTP Inputs */}
            <div className="flex justify-center gap-3 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-14 h-14 text-center text-2xl font-light bg-neutral-50 border-b-2 border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-900 transition-all duration-300 placeholder-neutral-400"
                  placeholder="0"
                />
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 text-center">
                <p className="text-red-400 text-xs tracking-wide">{error}</p>
              </div>
            )}

            {/* Timer + Verify */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-neutral-400 font-light tracking-wide">
                {timeLeft > 0 ? (
                  <>OTP expires <span className="text-neutral-700 font-medium">{formatTime()}</span></>
                ) : (
                  <span className="text-red-400">OTP expired</span>
                )}
              </p>

              <button
                onClick={handleSubmit}
                className="bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Verify
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-neutral-400 font-light">or</span>
              </div>
            </div>

            {/* Resend */}
            <div className="text-center">
              <button
                onClick={handleResend}
                disabled={!resend || resending}
                className={`text-sm font-light tracking-wide transition-all duration-300 ${
                  resend && !resending
                    ? "text-neutral-600 hover:text-neutral-900 hover:underline underline-offset-4"
                    : "text-neutral-300 cursor-not-allowed"
                }`}
              >
                {resending ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Resend OTP"
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer note */}
        <p className="text-center text-neutral-400 text-xs mt-6 font-light">
          Didn't receive the code? Check your spam folder
        </p>
      </div>
    </div>
  );
}

export default VerifyOtp;