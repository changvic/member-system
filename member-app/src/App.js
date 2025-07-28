import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import MemberList from "./MemberList";

function App() {
  const [user, setUser] = useState(null);

  // 檢查 localStorage，有 token 代表登入
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setUser({ token });
  }, []);

  const handleLogin = (data) => {
    localStorage.setItem("token", data.token);
    setUser(data);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <div>
      {user ? (
        <div>
          <h2>Hi, {user.nickname || "用戶"}，你已登入！</h2>
          <button onClick={handleLogout}>登出</button>
          {/* 會員列表等功能 */}
          <MemberList token={user.token} />
        </div>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
