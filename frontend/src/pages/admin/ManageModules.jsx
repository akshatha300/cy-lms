import { useEffect, useMemo, useState } from "react";
import useAuth from "../../hooks/useAuth";
import {
	getModules,
	createModule,
	updateModule,
	deleteModule,
} from "../../api/moduleApi";

const emptyMaterial = () => ({
	title: "",
	type: "article",
	url: "",
	content: "",
});

const initialForm = {
	title: "",
	description: "",
	difficulty: 1,
	tagsText: "",
	published: true,
	materials: [emptyMaterial()],
};

const ManageModules = () => {
	const { user } = useAuth();
	const inputStyle = {
		width: "100%",
		padding: "8px",
		marginTop: "4px",
		color: "#111827",
		border: "1px solid #d1d5db",
		borderRadius: "6px",
		background: "white",
	};
	const [modules, setModules] = useState([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [form, setForm] = useState(initialForm);
	const [editId, setEditId] = useState(null);
	const [deletingId, setDeletingId] = useState(null);

	const isAdmin = useMemo(() => user?.role === "admin", [user]);

	const loadModules = async () => {
		try {
			setLoading(true);
			const data = await getModules();
			setModules(data || []);
			setError("");
		} catch (err) {
			setError(err.response?.data?.message || "Failed to load modules");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadModules();
	}, []);

	const resetForm = () => {
		setForm({ ...initialForm, materials: [emptyMaterial()] });
		setEditId(null);
	};

	const handleMaterialChange = (idx, field, value) => {
		setForm((prev) => {
			const nextMaterials = prev.materials.map((m, i) =>
				i === idx ? { ...m, [field]: value } : m
			);
			return { ...prev, materials: nextMaterials };
		});
	};

	const handleAddMaterial = () => {
		setForm((prev) => ({
			...prev,
			materials: [...prev.materials, emptyMaterial()],
		}));
	};

	const handleRemoveMaterial = (idx) => {
		setForm((prev) => ({
			...prev,
			materials: prev.materials.filter((_, i) => i !== idx),
		}));
	};

	const handleEdit = (mod) => {
		setEditId(mod._id);
		setForm({
			title: mod.title || "",
			description: mod.description || "",
			difficulty: mod.difficulty ?? 1,
			tagsText: Array.isArray(mod.tags) ? mod.tags.join(", ") : "",
			published: mod.published !== undefined ? mod.published : true,
			materials: mod.materials?.length ? mod.materials : [emptyMaterial()],
		});
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Delete this module?")) return;
		try {
			setDeletingId(id);
			await deleteModule(id);
			await loadModules();
		} catch (err) {
			setError(err.response?.data?.message || "Failed to delete module");
		} finally {
			setDeletingId(null);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSaving(true);
		setError("");
		const payload = {
			title: form.title.trim(),
			description: form.description.trim(),
			difficulty: Number(form.difficulty) || 1,
			published: !!form.published,
			tags: form.tagsText
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean),
			materials: (form.materials || []).map((m) => ({
				title: m.title.trim(),
				type: m.type || "article",
				url: m.url?.trim() || "",
				content: m.content?.trim() || "",
			})),
		};

		try {
			if (!payload.title || !payload.description) {
				setError("Title and description are required");
				return;
			}

			if (editId) {
				await updateModule(editId, payload);
			} else {
				await createModule(payload);
			}
			await loadModules();
			resetForm();
		} catch (err) {
			setError(err.response?.data?.message || "Failed to save module");
		} finally {
			setSaving(false);
		}
	};

	return (
		<div>
			<h2 style={{ marginBottom: "12px" }}>Manage Modules</h2>
			{!isAdmin && (
				<p style={{ color: "red", marginBottom: "12px" }}>
					Admin role required to manage modules.
				</p>
			)}

			{error && (
				<p style={{ color: "red", marginBottom: "12px" }}>{error}</p>
			)}

			<div
				style={{
					border: "1px solid #e5e7eb",
					borderRadius: "8px",
					padding: "16px",
					marginBottom: "16px",
					background: "#f9fafb",
				}}
			>
				<h3 style={{ marginTop: 0 }}>
					{editId ? "Edit module" : "Create module"}
				</h3>
				<form onSubmit={handleSubmit}>
					<div style={{ display: "grid", gap: "10px" }}>
						<label>
							Title
							<input
								type="text"
								value={form.title}
								onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
								style={inputStyle}
							/>
						</label>
						<label>
							Description
							<textarea
								value={form.description}
								onChange={(e) =>
									setForm((p) => ({ ...p, description: e.target.value }))
								}
								rows={3}
								style={inputStyle}
							/>
						</label>
						<label>
							Difficulty (1-5)
							<input
								type="number"
								min={1}
								max={5}
								value={form.difficulty}
								onChange={(e) =>
									setForm((p) => ({ ...p, difficulty: e.target.value }))
								}
								style={inputStyle}
							/>
						</label>
						<label>
							Tags (comma separated)
							<input
								type="text"
								value={form.tagsText}
								onChange={(e) => setForm((p) => ({ ...p, tagsText: e.target.value }))}
								style={inputStyle}
								placeholder="phishing, passwords"
							/>
						</label>
						<label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
							<input
								type="checkbox"
								checked={form.published}
								onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))}
							/>
							<span>Published</span>
						</label>

						<div>
							<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
								<button type="button" onClick={handleAddMaterial}>
									+ Add material
								</button>
							</div>
							<div style={{ display: "grid", gap: "10px", marginTop: "8px" }}>
								{form.materials.map((mat, idx) => (
									<div
										style={{
											border: "1px solid #e5e7eb",
											borderRadius: "6px",
											padding: "10px",
											background: "white",
										}}
									>
										<div style={{ display: "grid", gap: "8px" }}>
											<label>
												Title
												<input
													type="text"
													value={mat.title}
													onChange={(e) => handleMaterialChange(idx, "title", e.target.value)}
													style={inputStyle}
												/>
											</label>
											<label>
												Type
												<select
													value={mat.type}
													onChange={(e) => handleMaterialChange(idx, "type", e.target.value)}
													style={inputStyle}
												>
													<option value="article">Article</option>
													<option value="video">Video</option>
													<option value="pdf">PDF</option>
													<option value="link">Link</option>
													<option value="text">Text</option>
												</select>
											</label>
											<label>
												URL (for video/pdf/link)
												<input
													type="text"
													value={mat.url}
													onChange={(e) => handleMaterialChange(idx, "url", e.target.value)}
													style={inputStyle}
												/>
											</label>
											<label>
												Inline content (for text/notes)
												<textarea
													rows={2}
													value={mat.content}
													onChange={(e) => handleMaterialChange(idx, "content", e.target.value)}
													style={inputStyle}
												/>
											</label>
										</div>
										{form.materials.length > 1 && (
											<button
												type="button"
												onClick={() => handleRemoveMaterial(idx)}
												style={{ marginTop: "8px", color: "#b91c1c" }}
											>
												Remove material
											</button>
										)}
									</div>
								))}
							</div>
						</div>

						<div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
							<button type="submit" disabled={saving || !isAdmin}>
								{saving ? "Saving..." : editId ? "Update module" : "Create module"}
							</button>
							{editId && (
								<button type="button" onClick={resetForm}>
									Cancel
								</button>
							)}
						</div>
					</div>
				</form>
			</div>

			<div
				style={{
					border: "1px solid #e5e7eb",
					borderRadius: "8px",
					padding: "16px",
				}}
			>
				<h3 style={{ marginTop: 0 }}>Existing modules</h3>
				{loading ? (
					<p>Loading modules...</p>
				) : modules.length === 0 ? (
					<p>No modules yet.</p>
				) : (
					<div style={{ display: "grid", gap: "10px" }}>
						{modules.map((mod) => (
							<div
								key={mod._id}
								style={{
									border: "1px solid #e5e7eb",
									borderRadius: "6px",
									padding: "12px",
									background: "#fff",
								}}
							>
								<div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
									<div>
										<h4 style={{ margin: 0 }}>{mod.title}</h4>
										<p style={{ margin: "4px 0", color: "#475569" }}>{mod.description}</p>
										<p style={{ margin: 0, fontSize: "0.9rem", color: "#475569" }}>
											Difficulty: {mod.difficulty ?? 1} · Tags: {(mod.tags || []).join(", ") || "none"}
										</p>
										<p style={{ margin: "4px 0", fontSize: "0.9rem", color: "#475569" }}>
											Materials: {mod.materials?.length || 0}
										</p>
										<p style={{ margin: 0, fontSize: "0.85rem", color: "#475569" }}>
											Published: {mod.published ? "yes" : "no"}
										</p>
									</div>
									<div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
										<button type="button" onClick={() => handleEdit(mod)} disabled={!isAdmin}>
											Edit
										</button>
										<button
											type="button"
											onClick={() => handleDelete(mod._id)}
											disabled={!isAdmin || deletingId === mod._id}
											style={{ color: "#b91c1c" }}
										>
											{deletingId === mod._id ? "Deleting..." : "Delete"}
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default ManageModules;
