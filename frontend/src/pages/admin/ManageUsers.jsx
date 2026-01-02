import { useEffect, useMemo, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { fetchUsers, updateUser, deleteUser } from "../../api/userApi";

const ManageUsers = () => {
	const { user } = useAuth();
	const isAdmin = useMemo(() => user?.role === "admin", [user]);
		const selectStyle = {
			color: "#0f172a",
			background: "white",
			border: "1px solid #d1d5db",
			borderRadius: "6px",
			padding: "6px 8px",
		};
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [savingId, setSavingId] = useState(null);
	const [deletingId, setDeletingId] = useState(null);
	const [error, setError] = useState("");

	const loadUsers = async () => {
		try {
			setLoading(true);
			const data = await fetchUsers();
			setUsers(data || []);
			setError("");
		} catch (err) {
			setError(err.response?.data?.message || "Failed to load users");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadUsers();
	}, []);

	const handleRoleChange = async (userId, nextRole) => {
		try {
			setSavingId(userId);
			await updateUser(userId, { role: nextRole });
			await loadUsers();
		} catch (err) {
			setError(err.response?.data?.message || "Failed to update user");
		} finally {
			setSavingId(null);
		}
	};

	const handleDelete = async (userId) => {
		if (!window.confirm("Delete this user?")) return;
		try {
			setDeletingId(userId);
			await deleteUser(userId);
			await loadUsers();
		} catch (err) {
			setError(err.response?.data?.message || "Failed to delete user");
		} finally {
			setDeletingId(null);
		}
	};

	return (
		<div>
			<h2 style={{ marginBottom: "12px" }}>Manage Users</h2>
			{!isAdmin && (
				<p style={{ color: "red", marginBottom: "12px" }}>
					Admin role required to manage users.
				</p>
			)}
			{error && <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>}

			<div
				style={{
					border: "1px solid #e5e7eb",
					borderRadius: "8px",
					padding: "14px",
					background: "#f9fafb",
				}}
			>
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<h3 style={{ margin: 0 }}>Users</h3>
					<button type="button" onClick={loadUsers} disabled={loading}>
						{loading ? "Refreshing..." : "Refresh"}
					</button>
				</div>
				<div style={{ marginTop: "10px", display: "grid", gap: "10px" }}>
					{loading ? (
						<p>Loading users...</p>
					) : users.length === 0 ? (
						<p>No users found.</p>
					) : (
						users.map((u) => (
							<div
								key={u.userId}
								style={{
									border: "1px solid #e5e7eb",
									borderRadius: "6px",
									padding: "12px",
									background: "white",
								}}
							>
								<div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
									<div style={{ flex: 1 }}>
										<h4 style={{ margin: 0 }}>{u.name}</h4>
										<p style={{ margin: "2px 0", color: "#475569" }}>{u.email}</p>
										<p style={{ margin: 0, fontSize: "0.9rem", color: "#475569" }}>
											User ID: {u.userId} · Role: {u.role}
										</p>
									</div>
									<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
										<select
											value={u.role}
											onChange={(e) => handleRoleChange(u.userId, e.target.value)}
											disabled={!isAdmin || savingId === u.userId}
											style={selectStyle}
										>
											<option value="user">User</option>
											<option value="admin">Admin</option>
										</select>
										<button
											type="button"
											onClick={() => handleDelete(u.userId)}
											disabled={!isAdmin || deletingId === u.userId}
											style={{ color: "#b91c1c" }}
										>
											{deletingId === u.userId ? "Deleting..." : "Delete"}
										</button>
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default ManageUsers;
