import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const tenant = localStorage.getItem("tenant");
  const role = localStorage.getItem("role");

  function logout() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <div className="navbar">
      <div className="logo">My SaaS App</div>
      <div className="info">
        <span>Tenant: {tenant}</span>
        <span>Role: {role}</span>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
