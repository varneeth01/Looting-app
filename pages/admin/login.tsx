import { useState } from 'react';
import { adminLogin } from '../../utils/adminAuth';
import { useRouter } from 'next/router';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = await adminLogin(email, password);
      // Store the token in a secure way (e.g., httpOnly cookie or local storage)
      // Redirect to the admin dashboard
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Admin Login</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
      }
