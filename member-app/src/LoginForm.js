import React, { useState } from "react";
import { Button, TextField, Typography, Paper, Box } from "@mui/material";

function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
    <Paper sx={{ p: 3, maxWidth: 320, mx: "auto", mt: 8 }}>
      <Typography variant="h6" align="center" gutterBottom>
        會員登入
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="帳號"
          name="username"
          value={form.username}
          onChange={handleChange}
          margin="normal"
          fullWidth
          required
        />
        <TextField
          label="密碼"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          margin="normal"
          fullWidth
          required
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          登入
        </Button>
      </Box>
    </Paper>
  );
}

export default LoginForm;
