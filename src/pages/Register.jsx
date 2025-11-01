import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RegisterSchema } from "../components/Schema/Register";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "../store/slices/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSend = async (data) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      console.log("Registered successfully:", data);
      navigate("/login");
      reset();
    } catch (err) {
      console.error("Failed to register:", err);
    }
  };

  return (
    <div className="flex justify-center items-start mt-50 ">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Register
        </h1>

        <form onSubmit={handleSubmit(onSend)} className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <input
              type="text"
              {...register("name")}
              placeholder="Enter your name"
              className={`border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.name ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <input
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              className={`border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.email ? "focus:ring-red-500" : "focus:ring-blue-500"
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
                errors.password ? "focus:ring-red-500" : "focus:ring-blue-500"
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
            className="bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 cursor-pointer"
          >
            Register
          </button>
          {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
        </form>

           <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:underline cursor-pointer"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
