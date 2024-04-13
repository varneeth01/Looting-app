import { useState, useEffect } from 'react';
import { verifyAdminToken } from '../../utils/adminAuth';
import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';

export default function AdminVendorsPage() {
  const [adminUser, setAdminUser] = useState(null);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchAdminUser = async () => {
      try {
        // Retrieve the token from a secure place (e.g., httpOnly cookie or local storage)
        const token = 'your_admin_token';

        // Verify the token
        const adminUser = await verifyAdminToken(token);
        setAdminUser(adminUser);

        // Fetch all vendors from the database
        await dbConnect();
        const allVendors = await User.find({ role: 'vendor' }).lean();
        setVendors(allVendors);
      } catch (err) {
        // Handle invalid token error
        console.error('Invalid token:', err);
      }
    };

    fetchAdminUser();
  }, []);

  const handleVendorUpdate = async (vendorId, updates) => {
    try {
      await dbConnect();
      const updatedVendor = await User.findByIdAndUpdate(vendorId, updates, { new: true }).lean();
      setVendors((prevVendors) =>
        prevVendors.map((vendor) => (vendor._id === vendorId ? updatedVendor : vendor))
      );
    } catch (err) {
      console.error('Error updating vendor:', err);
    }
  };

  const handleVendorDelete = async (vendorId) => {
    try {
      await dbConnect();
      await User.findByIdAndDelete(vendorId);
      setVendors((prevVendors) => prevVendors.filter((vendor) => vendor._id !== vendorId));
    } catch (err) {
      console.error('Error deleting vendor:', err);
    }
  };

  return (
    <div>
      <h1>Admin Vendors</h1>
      {adminUser ? (
        <div>
          <table>
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Address</th>
                <th>City</th>
                <th>State</th>
                <th>Zip Code</th>
                <th>Country</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor._id}>
                  <td>{vendor.businessName}</td>
                  <td>{vendor.address}</td>
                  <td>{vendor.city}</td>
                  <td>{vendor.state}</td>
                  <td>{vendor.zipCode}</td>
                  <td>{vendor.country}</td>
                  <td>
                    <button onClick={() => handleVendorUpdate(vendor._id, { /* update data */ })}>
                      Update
                    </button>
                    <button onClick={() => handleVendorDelete(vendor._id)}>Delete</button>
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
