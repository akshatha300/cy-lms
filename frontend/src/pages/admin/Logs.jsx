import { useEffect, useMemo, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { fetchLogs, createLog } from "../../api/logApi";

const Logs = () => {
	const { user } = useAuth();
	const isAdmin = useMemo(() => user?.role === "admin", [user]);
	const [logs, setLogs] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");
	const [level, setLevel] = useState("info");
	const [saving, setSaving] = useState(false);

	const loadLogs = async () => {
		try {
			setLoading(true);
			const data = await fetchLogs();
			setLogs(data || []);
			setError("");
		} catch (err) {
			setError(err.response?.data?.message || "Failed to load logs");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadLogs();
	}, []);

	const handleCreate = async (e) => {
		e.preventDefault();
		if (!message.trim()) return;
		setSaving(true);
		try {
			await createLog({ level, message: message.trim() });
			setMessage("");
			await loadLogs();
		} catch (err) {
			setError(err.response?.data?.message || "Failed to create log");
		} finally {
			setSaving(false);
		}
	};

	return (
		<div>
			<h2 style={{ marginBottom: "12px" }}>System Logs</h2>
			{!isAdmin && (
				<p style={{ color: "red", marginBottom: "12px" }}>
					Admin role required to view logs.
				</p>
			)}
			{error && <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>}

			<div
				style={{
					border: "1px solid #e5e7eb",
					borderRadius: "8px",
					padding: "14px",
					marginBottom: "14px",
					background: "#f9fafb",
				}}
			>
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<h3 style={{ margin: 0 }}>Recent logs</h3>
					<button type="button" onClick={loadLogs} disabled={loading}>
						{loading ? "Refreshing..." : "Refresh"}
					</button>
				</div>
				<div style={{ marginTop: "10px", display: "grid", gap: "8px" }}>
					{loading ? (
						<p>Loading logs...</p>
					) : logs.length === 0 ? (
						<p>No logs yet.</p>
					) : (
						logs.map((log) => (
							<div
								key={log._id}
								style={{
									border: "1px solid #e5e7eb",
									borderRadius: "6px",
									padding: "10px",
									background: "white",
								}}
							>
								<div style={{ display: "flex", justifyContent: "space-between" }}>
									<span style={{ fontWeight: 600, color: levelColor(log.level) }}>
										{log.level?.toUpperCase() || "INFO"}
									</span>
									<span style={{ fontSize: "12px", color: "#475569" }}>
										{log.createdAt ? new Date(log.createdAt).toLocaleString() : ""}
									</span>
								</div>
								<p style={{ margin: "6px 0", color: "#0f172a" }}>{log.message}</p>
								{log.context && Object.keys(log.context || {}).length > 0 && (
									<pre
										style={{
											background: "#f8fafc",
											padding: "8px",
											borderRadius: "6px",
											fontSize: "12px",
											overflowX: "auto",
										}}
									>
										{JSON.stringify(log.context, null, 2)}
									</pre>
								)}
							</div>
						))
					)}
				</div>
			</div>

			<div
				style={{
					border: "1px solid #e5e7eb",
					borderRadius: "8px",
					padding: "14px",
					background: "#f9fafb",
				}}
			>
				<h3 style={{ marginTop: 0 }}>Add log entry</h3>
				<form onSubmit={handleCreate}>
					<div style={{ display: "grid", gap: "8px" }}>
						<label>
							Level
							<select
								value={level}
								onChange={(e) => setLevel(e.target.value)}
								style={{ width: "100%", padding: "8px", marginTop: "4px" }}
							>
								<option value="info">Info</option>
								<option value="warn">Warn</option>
								<option value="error">Error</option>
							</select>
						</label>
						<label>
							Message
							<input
								type="text"
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								style={{ width: "100%", padding: "8px", marginTop: "4px" }}
							/>
						</label>
						<div style={{ display: "flex", gap: "8px" }}>
							<button type="submit" disabled={!isAdmin || saving || !message.trim()}>
								{saving ? "Saving..." : "Add log"}
							</button>
							<button type="button" onClick={() => setMessage("")}>Clear</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

const levelColor = (level) => {
	if (level === "error") return "#b91c1c";
	if (level === "warn") return "#b45309";
	return "#0f172a";
};

export default Logs;
