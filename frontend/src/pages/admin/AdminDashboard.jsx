
const AdminDashboard = () => {
	return (
		<div>
			<h2 style={{ marginBottom: "12px" }}>Admin Overview</h2>
			<p style={{ marginBottom: "16px" }}>
				Quick snapshot of activity. Hook this up to analytics or server stats
				when ready.
			</p>
			<div
				style={{
					display: "grid",
					gap: "12px",
					gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
				}}
			>
				{["Active users", "Pending modules", "Open questions", "System logs"].map(
					(label, idx) => (
						<div
							key={label}
							style={{
								border: "1px solid #e5e7eb",
								borderRadius: "8px",
								padding: "14px",
								background: "#f8fafc",
							}}
						>
							<div style={{ fontSize: "14px", color: "#475569" }}>{label}</div>
							<div style={{ fontSize: "24px", fontWeight: 600 }}>
								{idx * 12 + 42}
							</div>
						</div>
					)
				)}
			</div>
		</div>
	);
};

export default AdminDashboard;
