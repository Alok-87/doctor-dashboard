"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiPhone } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hook";
import { sendOtp, verifyOtp } from "../../../../redux/auth/authThunks";
import OTPInput from "otp-input-react";
import { setMobileNumber, setMobileOtpSent } from "../../../../redux/auth/authSlice";
import { useRouter } from "next/navigation";

type LoginForm = {
  phone_number: string;
};

export default function DoctorLoginPage() {
  const [loading, setLoading] = useState(false);
  const { mobileOtpSent, mobileNumber } = useAppSelector((state) => state.auth);
  const [OTP, setOTP] = useState("");

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      phone_number: "",
    },
    shouldUnregister: false,
  });

  const dispatch = useAppDispatch();
  const router = useRouter()

  const onSubmit = async (data: LoginForm) => {
    dispatch(setMobileNumber(data.phone_number));
    const payload = {
      phone_number: data.phone_number,
      purpose: "LOGIN",
    };
    setLoading(true);
    await dispatch(sendOtp(payload));
    setLoading(false);
  };

  const handleVerify = async () => {
    if (OTP.length !== 6) return;
    setLoading(true);
    const payload = {
      phone_number: getValues("phone_number"),
      otp_code: OTP,
    };
    await dispatch(verifyOtp(payload));
    setLoading(false);
    router.push('/')
  };

  const handleResend = async () => {
    const payload = {
      phone_number: getValues("phone_number"),
      purpose: "LOGIN",
    };
    await dispatch(sendOtp(payload));

  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center gap-12 md:gap-20">

        {/* ── LEFT — Illustration ── */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div className="relative w-full max-w-md aspect-square">
            <Image
              src="/images/login.png"
              alt="Doctors illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* ── RIGHT — Form ── */}
        <div className="w-full md:w-1/2 max-w-sm">
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-1">
            Welcome Back Doctor!
          </h1>
          <p className="text-sm text-gray-400 mb-8">Let&apos;s get you logged in</p>

          {/* ── STEP 1: Phone number ── */}
          {!mobileOtpSent ? (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

              {/* Input — full width */}
              <div>
                <div
                  className={`flex items-center gap-3 border rounded-lg px-4 py-3.5 bg-white transition ${errors.phone_number
                    ? "border-red-400 ring-1 ring-red-300"
                    : "border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"
                    }`}
                >
                  <FiPhone className="text-gray-500" />
                  <input
                    type="tel"
                    placeholder="Enter Your Mobile Number"
                    autoComplete="tel"
                    className="flex-1 text-sm font-semibold text-gray-700 placeholder:text-gray-400 bg-transparent outline-none"
                    {...register("phone_number", {
                      required: "Mobile number is required",
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: "Enter a valid 10-digit mobile number",
                      },
                    })}
                  />
                </div>
                {errors.phone_number && (
                  <p className="text-red-500 text-xs mt-1 pl-1">
                    {errors.phone_number.message}
                  </p>
                )}
              </div>

              {/* Button — same full width as input */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg bg-primary active:scale-[0.98] text-white text-base font-semibold tracking-wide shadow-md cursor-pointer transition-all disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <AiOutlineLoading3Quarters className="animate-spin text-lg" />
                    Sending OTP...
                  </span>
                ) : (
                  "Send OTP"
                )}
              </button>

              <div className="flex justify-end">
                <Link
                  href="/authentication/forgot-password"
                  className="text-xs text-primary hover:underline transition"
                >
                  Need Help?
                </Link>
              </div>
            </form>

          ) : (

            /* ── STEP 2: OTP entry ── */
            <div className="flex flex-col gap-4 w-full">
              <p className="text-sm text-gray-500">
                Enter the 6-digit OTP sent to{" "}
                <span className="font-semibold text-gray-800">+91 {mobileNumber}</span>
                <button
                  type="button"
                  onClick={() => dispatch(setMobileOtpSent(false))}
                  className="ml-2 text-primary text-xs font-medium hover:underline cursor-pointer"
                >
                  Change
                </button>
              </p>

              <OTPInput
                value={OTP}
                onChange={setOTP}
                OTPLength={6}
                otpType="number"
                disabled={false}
                className="flex  min-w-max ml-2"
                inputClassName="!w-10 !h-10 sm:!w-11 sm:!h-11 border border-slate-300 rounded-md text-center font-semibold outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={handleVerify}
                disabled={loading || OTP.length !== 6}
                className="w-full py-3.5 rounded-lg bg-primary active:scale-[0.98] text-white text-base font-semibold tracking-wide shadow-md cursor-pointer transition-all disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <AiOutlineLoading3Quarters className="animate-spin text-lg" />
                    Verifying...
                  </span>
                ) : (
                  "Verify OTP"
                )}
              </button>

              <div className="flex justify-between w-full text-xs">
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  Resend OTP
                </button>
                <Link
                  href="/authentication/forgot-password"
                  className="text-primary hover:underline transition"
                >
                  Need Help?
                </Link>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}