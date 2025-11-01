
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { LoginSchema } from "../components/Schema/Login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/slices/auth";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, status } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSend = async (data) => {
    try {
      const result = await dispatch(loginUser(data)).unwrap();
      console.log(" Successfully logged in:", result);

    
        navigate("/");
        reset();
      
    } catch (err) {
      console.error("❌ Login error:", err);
    }
  };

  return (
    <div className="flex justify-center items-start mt-50 ">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Log In
        </h1>

        <form onSubmit={handleSubmit(onSend)} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <input
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              className={`border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.email ? "focus:ring-red-500" : "focus:ring-indigo-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1 relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="Enter your password"
              className={`border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.password ? "focus:ring-red-500" : "focus:ring-indigo-500"
              }`}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-5 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            {errors.password && (
              <p className="text-red-500 text-sm font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className={`py-2 rounded-lg font-semibold text-white ${
              status === "loading"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-800"
            }`}
          >
            {status === "loading" ? "Logging in..." : "Login"}
          </button>

          {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
        </form>

                <div className="text-center mt-4 text-sm text-gray-800">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Sign Up
          </Link>
        </div>

        <div className="text-center mt-4">
          <a href="#" className="text-sm text-indigo-600 hover:underline">
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
