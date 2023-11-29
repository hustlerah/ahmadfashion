// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    // Perform authentication logic here
    if (email === 'ahmadrizvi380@gmail.com' && password === 'Ahmad123@') {
      // Successful login
      // Redirect to the dashboard
      router.push('/Admin/dashboard');
    } else {
      // Failed login
      alert('Invalid email or password');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
