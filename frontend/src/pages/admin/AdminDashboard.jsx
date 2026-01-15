import { useEffect, useState } from "react";
import { getPlatformSummary } from "../../api/adminApi";




const AdminDashboard = () => {
	const [summary, setSummary] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchSummary = async () => {
			try {
				const data = await getPlatformSummary();
				setSummary(data);
			} catch (err) {
				setError(err.response?.data?.message || "Failed to load admin summary");
			} finally {
				setLoading(false);
			}
		};
		fetchSummary();
	}, []);

	if (loading) return <p>Loading admin overview...</p>;
	if (error) return <p style={{ color: "red" }}>{error}</p>;

	const stats = [
		{ label: "Total Users", value: summary?.totalUsers ?? 0 },
		{ label: "Total Modules", value: summary?.totalModules ?? 0 },
		{ label: "Total Questions", value: summary?.totalQuestions ?? 0 },
		{ label: "Total Attempts", value: summary?.totalAttempts ?? 0 },
		{ label: "Simulations", value: summary?.totalSimulations ?? 0 },
		{ label: "Avg Accuracy", value: `${summary?.avgAccuracy ?? 0}%` },
	];

	return (
		<div>
			<h2 style={{ marginBottom: "12px" }}>Admin Overview</h2>
			<p style={{ marginBottom: "16px", color: "#6b7280" }}>
				Real-time platform statistics and metrics.
			</p>
			<div
				style={{
					display: "grid",
					gap: "12px",
					gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
				}}
			>
				{stats.map(({ label, value }) => (
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
							{value}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default AdminDashboard;
