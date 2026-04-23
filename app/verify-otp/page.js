'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VerifyOTPForm() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  useEffect(() => {
    if (!email) {
      const storedEmail = sessionStorage.getItem('resetEmail');
      if (storedEmail) {
        router.push(`/verify-otp?email=${encodeURIComponent(storedEmail)}`);
      } else {
        router.push('/forgot-password');
      }
    }
  }, [email, router]);

  // Timer for OTP expiry
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const data = await res.json();

      if (res.ok) {
        sessionStorage.setItem('resetToken', data.resetToken);
        router.push(`/reset-password?token=${data.resetToken}`);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setTimeLeft(600);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        document.getElementById('otp-0')?.focus();
        alert('✅ New OTP sent successfully!');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-10">
            <div className="text-4xl mb-3">🔑</div>
            <h1 className="text-3xl font-bold text-white mb-2">Verify OTP</h1>
            <p className="text-indigo-100">Enter the 6-digit code sent to your email</p>
          </div>

          {/* Form */}
          <div className="p-8">
            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input Fields */}
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="h-14 w-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
                    disabled={loading}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {/* Timer */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {timeLeft > 0 ? (
                    <>
                      ⏱️ OTP expires in:{' '}
                      <span className="font-bold text-indigo-600">{formatTime(timeLeft)}</span>
                    </>
                  ) : (
                    <span className="text-red-600">❌ OTP has expired</span>
                  )}
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || timeLeft === 0}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-400/50 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {loading ? '🔄 Verifying...' : '✓ Verify OTP'}
              </button>
            </form>

            {/* Resend OTP */}
            <div className="mt-6 text-center">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
                >
                  📤 Resend OTP
                </button>
              ) : (
                <p className="text-sm text-gray-500">
                  Didn't receive code? Wait {formatTime(timeLeft)} to resend
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold">
                ← Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      }
    >
      <VerifyOTPForm />
    </Suspense>
  );
}