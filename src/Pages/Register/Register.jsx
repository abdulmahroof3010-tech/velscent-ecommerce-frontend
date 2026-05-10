import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { RegisterValidation } from "./RegisterValidation";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const initialValues = {
  name: "",
  email: "",
  password: "",
  cpassword: "",
};

function Register() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showComPassword, setShowComPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Header */}
          <div className="px-6 pt-6 pb-3 text-center">
            <div className="w-10 h-10 mx-auto mb-3 bg-black rounded-full flex items-center justify-center">
              <svg 
                className="w-4 h-4 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.2} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              </svg>
            </div>
            <h3 className="text-xl font-light tracking-wide text-gray-900">
              Join the experience
            </h3>
            <p className="text-gray-500 text-xs mt-1 font-light">
              Create your account to begin
            </p>
          </div>

          {/* Form */}
          <div className="px-6 pb-6">
            <Formik
              initialValues={initialValues}
              validationSchema={RegisterValidation}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const result = await registerUser({
                    name: values.name,
                    email: values.email,
                    password: values.password,
                  });

                  if (result.success) {
                    toast.success(result.message);
                    navigate("/verify-otp", { state: { email: values.email } });
                  } else {
                    toast.error(result.message);
                  }
                } catch (err) {
                  console.error("Error Registering User:", err);
                  toast.error("Failed to Create Account!");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-700 mb-1 font-semibold">
                      Full Name
                    </label>
                    <Field name="name">
                      {({ field, form }) => (
                        <input 
                          {...field}
                          type="text"
                          placeholder="Enter your full name"
                          className={`w-full px-0 py-1.5 bg-transparent border-b text-gray-900 text-sm placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-all duration-300 ${
                            errors.name && touched.name
                              ? "border-red-400"
                              : "border-gray-200"
                          }`}
                          onFocus={() => form.setFieldError("name", "")}
                        />
                      )}
                    </Field>
                    {errors.name && touched.name && (
                      <small className="text-red-400 text-xs mt-1 block">
                        {errors.name}
                      </small>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-700 mb-1 font-semibold">
                      Email 
                    </label>
                    <Field name="email">
                      {({ field, form }) => (
                        <input 
                          {...field}
                          type="email"
                          placeholder="hello@example.com"
                          className={`w-full px-0 py-1.5 bg-transparent border-b text-gray-900 text-sm placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-all duration-300 ${
                            errors.email && touched.email
                              ? "border-red-400"
                              : "border-gray-200"
                          }`}
                          onFocus={() => form.setFieldError("email", "")}
                        />
                      )}
                    </Field>
                    {errors.email && touched.email && (
                      <small className="text-red-400 text-xs mt-1 block">
                        {errors.email}
                      </small>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-700 mb-1 font-semibold">
                      Password
                    </label>
                    <div className="relative">
                      <Field name="password">
                        {({ field, form }) => (
                          <input 
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            className={`w-full px-0 py-1.5 pr-8 bg-transparent border-b text-gray-900 text-sm placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-all duration-300 ${
                              errors.password && touched.password
                                ? "border-red-400"
                                : "border-gray-200"
                            }`}
                            onFocus={() => form.setFieldError("password", "")}
                          />
                        )}
                      </Field>

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 bottom-1.5 text-gray-400 hover:text-gray-900 transition-colors"
                      >
                        {showPassword ? (
                          <FaEye size={14} />
                        ) : (
                          <FaEyeSlash size={14} />
                        )}
                      </button>
                    </div>
                    {errors.password && touched.password && (
                      <small className="text-red-400 text-xs mt-1 block">
                        {errors.password}
                      </small>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-700 mb-1 font-semibold">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Field name="cpassword">
                        {({ field, form }) => (
                          <input 
                            {...field}
                            type={showComPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className={`w-full px-0 py-1.5 pr-8 bg-transparent border-b text-gray-900 text-sm placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-all duration-300 ${
                              errors.cpassword && touched.cpassword
                                ? "border-red-400"
                                : "border-gray-200"
                            }`}
                            onFocus={() => form.setFieldError("cpassword", "")}
                          />
                        )}
                      </Field>

                      <button
                        type="button"
                        onClick={() => setShowComPassword(!showComPassword)}
                        className="absolute right-0 bottom-1.5 text-gray-400 hover:text-gray-900 transition-colors"
                      >
                        {showComPassword ? (
                          <FaEye size={14} />
                        ) : (
                          <FaEyeSlash size={14} />
                        )}
                      </button>
                    </div>
                    {errors.cpassword && touched.cpassword && (
                      <small className="text-red-400 text-xs mt-1 block">
                        {errors.cpassword}
                      </small>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black hover:bg-gray-800 text-white py-2.5 rounded-full font-light tracking-wide transition-all duration-300 disabled:opacity-50 text-sm mt-4 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {isSubmitting ? "Sending OTP..." : "Create Account"}
                  </button>

                  {/* Divider */}
                  <div className="relative my-3">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-3 bg-white text-gray-400 font-light">
                        or
                      </span>
                    </div>
                  </div>

                  {/* Login Link */}
                  <div className="text-center">
                    <p className="text-gray-600 text-xs font-light inline">
                      Already have an account?
                    </p>
                    <Link
                      to="/login"
                      className="text-black hover:text-gray-600 text-xs font-light ml-1 transition-colors border-b border-transparent hover:border-black"
                    >
                      Sign In
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        
        {/* Footer note */}
        <p className="text-center text-gray-500 text-xs mt-3 font-light tracking-wide">
          By creating an account, you agree to our terms
        </p>
      </div>
    </div>
  );
}

export default Register;