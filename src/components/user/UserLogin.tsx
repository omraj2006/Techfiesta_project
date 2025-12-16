import React, { useState } from 'react';
import { ArrowRight, Shield, CheckCircle, Smartphone } from 'lucide-react';

interface UserLoginProps {
  onLogin: (userName: string) => void;
}

type AuthStep = 'phone' | 'otp';

export function UserLogin({ onLogin }: UserLoginProps) {
  const [step, setStep] = useState<AuthStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length >= 10) {
      setStep('otp');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }

      // Auto-submit when all filled
      if (newOtp.every(digit => digit !== '') && index === 5) {
        setTimeout(() => {
          onLogin('John Doe'); // Mock login
        }, 500);
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-primary p-3 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Shield size={32} className="text-primary-foreground" />
          </div>
          <h1 className="text-foreground mb-2">Welcome to ClaimFlow</h1>
          <p className="text-muted-foreground">
            {step === 'phone' 
              ? 'Enter your phone number to get started'
              : 'Enter the verification code sent to your phone'
            }
          </p>
        </div>

        {/* Phone Number Step */}
        {step === 'phone' && (
          <div className="bg-card border border-border rounded-2xl shadow-card p-6 sm:p-8">
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div>
                <label className="block text-foreground mb-2">Phone Number</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <Smartphone size={18} className="text-muted-foreground" />
                    <span className="text-muted-foreground">+1</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="(555) 123-4567"
                    className="w-full pl-20 pr-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  We'll send you a one-time verification code
                </p>
              </div>

              <button
                type="submit"
                disabled={phoneNumber.length < 10}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg transition-all ${
                  phoneNumber.length >= 10
                    ? 'bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                Send Code
                <ArrowRight size={20} />
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-start gap-3">
                <Shield size={20} className="text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-foreground">Secure Authentication</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your information is encrypted and protected
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OTP Verification Step */}
        {step === 'otp' && (
          <div className="bg-card border border-border rounded-2xl shadow-card p-6 sm:p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-foreground mb-4 text-center">
                  Enter Verification Code
                </label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 text-center bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Code sent to +1 {phoneNumber.slice(0, 3)}-{phoneNumber.slice(3, 6)}-{phoneNumber.slice(6)}
                </p>
              </div>

              <button
                onClick={() => setStep('phone')}
                className="w-full text-muted-foreground hover:text-foreground transition-colors"
              >
                Change phone number
              </button>

              <button
                className="w-full text-primary hover:underline"
              >
                Resend code
              </button>
            </div>
          </div>
        )}

        {/* Demo Notice */}
        <div className="mt-6 bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-foreground">Demo Mode</p>
              <p className="text-sm text-muted-foreground mt-1">
                Enter any phone number and fill in the OTP to continue
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
