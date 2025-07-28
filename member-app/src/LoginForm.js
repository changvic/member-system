import React, { useState } from "react";

function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json().then((data) => ({ status: res.status, data })))
      .then(({ status, data }) => {
        if (status === 200 && data.token) {
          onLogin(data);
        } else {
          setError(data.error || "登入失敗");
        }
      })
      .catch(() => setError("伺服器錯誤"));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        onChange={handleChange}
        value={form.username}
        placeholder="帳號"
      />
      <input
        name="password"
        type="password"
        onChange={handleChange}
        value={form.password}
        placeholder="密碼"
      />
      <button type="submit">登入</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}

export default LoginForm;
