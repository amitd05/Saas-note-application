import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [tenantName, setTenantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/signup", { tenantName, email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("tenant", res.data.tenant);
      localStorage.setItem("role", "admin"); // first user is always admin
      navigate("/notes");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Signup</h1>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSignup}>
          <input
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
            placeholder="Company Name"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Signup</button>
        </form>
      </div>
    </div>
  );
}
