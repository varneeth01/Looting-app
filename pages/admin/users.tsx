    import { useState, useEffect } from 'react';
    import { verifyAdminToken } from '../../utils/adminAuth';
    import dbConnect from '../../utils/dbConnect';
    import User from '../../models/User';

    export default function AdminUsersPage() {
      const [adminUser, setAdminUser] = useState(null);
      const [users, setUsers] = useState([]);

      useEffect(() => {
        const fetchAdminUser = async () => {
          try {
            // Retrieve the token from a secure place (e.g., httpOnly cookie or local storage)
            const token = 'your_admin_token';

            // Verify the token
            const adminUser = await verifyAdminToken(token);
            setAdminUser(adminUser);

            // Fetch all users from the database
            await dbConnect();
            const allUsers = await User.find({}).lean();
            setUsers(allUsers);
          } catch (err) {
            // Handle invalid token error
            console.error('Invalid token:', err);
          }
        };

        fetchAdminUser();
      }, []);

      const handleUserUpdate = async (userId, updates) => {
        try {
          await dbConnect();
          const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).lean();
          setUsers((prevUsers) =>
            prevUsers.map((user) => (user._id === userId ? updatedUser : user))
          );
        } catch (err) {
          console.error('Error updating user:', err);
        }
      };

      const handleUserDelete = async (userId) => {
        try {
          await dbConnect();
          await User.findByIdAndDelete(userId);
          setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        } catch (err) {
          console.error('Error deleting user:', err);
        }
      };

      return (
        <div>
          <h1>Admin Users</h1>
          {adminUser ? (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.fullName}</td>
                      <td>{user.email}</td>
                      <td>{user.phoneNumber}</td>
                      <td>{user.role}</td>
                      <td>
                        <button onClick={() => handleUserUpdate(user._id, { role: 'vendor' })}>
                          Make Vendor
                        </button>
                        <button onClick={() => handleUserDelete(user._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      );
    }
