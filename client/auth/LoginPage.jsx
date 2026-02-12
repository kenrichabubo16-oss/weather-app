import { useState } from "react";

export default function LoginPage({ onLogin }) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const submitLogin = async (e) => {
    e.preventDefault();
    const res = await onLogin({
        email: loginEmail,
        password: loginPassword,
    });

    if (res && res.ok) {
      console.log("✅ Login Success:", res); // ✅ Success log
      alert("Login successful!");
    } else {
      console.log("❌ Login Failed:", res); // ❌ Fail log
      alert(res?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={submitLogin} className="auth-form">
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
      </div>

      <button type="submit" className="btn-primary">
        Login
      </button>
    </form>
  );
}
