import { useEffect, useState } from 'react';
import { verifyAdminToken } from '../../utils/adminAuth';
import { useRouter } from 'next/router';

export default function AdminDashboardPage() {
  const [adminUser, setAdminUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAdminUser = async () => {
      try {
        // Retrieve the token from a secure place (e.g., httpOnly cookie or local storage)
        const token = 'your_admin_token';

        // Verify the token
        const adminUser = await verifyAdminToken(token);
        setAdminUser(adminUser);
      } catch (err) {
        // Handle invalid token error
        console.error('Invalid token:', err);
        router.push('/admin/login');
      }
    };

    fetchAdminUser();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {adminUser ? (
        <p>Welcome, {adminUser.email}</p>
      ) : (
        <p>Loading...</p>
      )}
      {/* Add admin functionality here */}
    </div>
  );
}
