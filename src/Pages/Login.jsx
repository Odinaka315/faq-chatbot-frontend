import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. FastAPI OAuth2 expects form-urlencoded data, not raw JSON
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      // Note: Make sure this endpoint matches your FastAPI router!
      // (Usually it is /auth/token)
      const response = await api.post("/auth/login", formData);
      const token = response.data.access_token;

      // 2. Fetch the staff member's profile
      const userResponse = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = userResponse.data;

      // 3. Hand everything over to the Context
      login(token, userData);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Invalid credentials. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 font-sans">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gold text-2xl shadow-lg">
            🎓
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            UI Career Advisor
          </h1>
          <p className="mt-1 text-xs text-muted">
            Portal Access — Admission Unit
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-xs text-red-400">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-medium tracking-wider uppercase text-muted mb-2">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface2 px-3.5 py-2.5 text-sm text-text outline-none transition-colors focus:border-gold placeholder:text-muted/30"
              placeholder="admin@ui.edu.ng"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium tracking-wider uppercase text-muted mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface2 px-3.5 py-2.5 text-sm text-text outline-none transition-colors focus:border-gold placeholder:text-muted/30"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-gold py-2.5 text-sm font-semibold text-black transition-all hover:bg-[#d4b55e] active:scale-[0.99] disabled:opacity-50"
          >
            {isLoading ? "Authenticating..." : "Sign In →"}
          </button>
        </form>
      </div>
    </div>
  );
}
