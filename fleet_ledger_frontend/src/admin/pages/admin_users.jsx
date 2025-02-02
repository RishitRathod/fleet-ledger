import React, { useEffect, useState } from "react";

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const [email, setEmail] = useState("");
    const [invitationStatus, setInvitationStatus] = useState("");

    const token = localStorage.getItem("token");

    // Fetch Users
    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/users/admin/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            console.log("Fetched Users:", data);  // 🔴 Debug Log
    
            if (!Array.isArray(data)) {
                console.error("Unexpected API Response:", data);
                setUsers([]);  // Ensure it's an array
            } else {
                setUsers(data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setUsers([]);  // Prevents crash
        }
    };
    

    useEffect(() => {
        fetchUsers();
    }, []);

    // Send Invitation
    const handleInvite = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/invitations/admin/invite", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                    // Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            setInvitationStatus(data.message || data.error);
            setEmail("");
            fetchUsers();
        } catch (error) {
            console.error("Error sending invitation:", error);
        }
    };

    // Delete User
    const handleDelete = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/admin/users/${userId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                setUsers(users.filter((user) => user._id !== userId));
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Users under Admin</h2>
            <form onSubmit={handleInvite} className="mb-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email to invite"
                    required
                    className="border p-2 mr-2 rounded"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Send Invitation
                </button>
            </form>
            {invitationStatus && <p className="text-green-600 mb-2">{invitationStatus}</p>}

            <ul className="space-y-2">
                {users.map((user) => (
                    <li key={user._id} className="flex justify-between items-center p-2 border rounded">
                        <span>{user.name} - {user.email}</span>
                        <button
                            onClick={() => handleDelete(user._id)}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserPage;