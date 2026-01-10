import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import useAuth from "../../hooks/useAuth";
import "./Login.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ email: identifier, password });
      login(data.token, data.user);
      navigate("/app", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>Log in</h1>
          <p className="subtitle">to start learning</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}

          <label className="field-label">Email or handle</label>
          <div className="input-with-prefix">
            <span className="prefix">@</span>
            <input
              className="text-input"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="yourname or you@example.com"
              required
            />
            <span className="valid-check">✓</span>
          </div>

          <label className="field-label">Password</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              className="text-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="forgot">Forgot password?</div>

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in →"}
          </button>
        </form>

        <div className="signup-note">
          Don’t have an account? <Link to="/register">Sign up now!</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
