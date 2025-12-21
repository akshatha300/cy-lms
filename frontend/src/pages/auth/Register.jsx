import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authApi";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await registerUser(form);
      setSuccess("Registration successful. Please login.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", color: "#000" }}>
      <h2>Register</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit}>
      <input
  name="name"
  placeholder="Name"
  onChange={handleChange}
  required
  style={{ color: "#000", backgroundColor: "#fff" }}
/>
<input
  name="email"
  type="email"
  placeholder="Email"
  onChange={handleChange}
  required
  style={{ color: "#000", backgroundColor: "#fff" }}
/>
<input
  name="password"
  type="password"
  placeholder="Password"
  onChange={handleChange}
  required
  style={{ color: "#000", backgroundColor: "#fff" }}
  />
<button type="submit" style={{ color: "#000", backgroundColor: "#fff" }}>Register</button>
</form>
</div>
  );
};
export default Register;
