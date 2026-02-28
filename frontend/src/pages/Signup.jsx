import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ check passwords match
    if (password !== confirmPassword) {
      setErrors({ submit: "Passwords do not match" });
      return;
    }

    const result = await register(email, password, name);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setErrors({
        submit: result.error || "Registration failed",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            TaxPal
          </h1>
          <p className="text-slate-500 mt-2">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
          />

          {errors.submit && (
            <p className="text-red-500 text-sm text-center">{errors.submit}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary mt-6"
          >
            {isLoading ? <LoadingSpinner /> : "Create Account"}
          </button>

          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}