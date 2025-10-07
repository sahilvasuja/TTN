import React, { useEffect, useState } from "react";
import axios from "axios";

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5500/user/allUser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data.user);
      } catch (err) {
        console.log("Error fetching users:", err);
      }
    };
    fetchAllUsers();
  }, []);
console.log(users)
  return (
    <div style={{ padding: "20px" }}>
      <h2>All Registered Users</h2>
      {users?.length > 0 ? (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>User ID</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u._id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default AllUsers;
