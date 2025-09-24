import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await API.post("/login", { email, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);
      localStorage.setItem("tenant", res.data.tenant);
      localStorage.setItem("plan", res.data.plan);
     
    navigate("/notes");
  }

  return (
    <div className="login-page">
    <form onSubmit={handleSubmit} className="login-box">
      <h1>Login</h1>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Login</button>
      <p>
  New Company? <a href="/signup">Signup here</a>
</p>
    </form>
    </div>
  );
}
