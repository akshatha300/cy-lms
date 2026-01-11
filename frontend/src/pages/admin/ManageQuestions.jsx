import { useCallback, useEffect, useMemo, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { getModules } from "../../api/moduleApi";
import {
	getQuestionsByModule,
	createQuestion,
	updateQuestion,
	deleteQuestion,
} from "../../api/questionApi";

const initialForm = {
	moduleId: "",
	questionText: "",
	optionsText: "",
	correctAnswer: "",
	explanation: "",
	difficulty: 1,
	type: "mcq",
};

const ManageQuestions = () => {
	const { user } = useAuth();
	const [modules, setModules] = useState([]);
	const [selectedModuleId, setSelectedModuleId] = useState("");
	const [questions, setQuestions] = useState([]);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [form, setForm] = useState(initialForm);
	const [editId, setEditId] = useState(null);
	const [deletingId, setDeletingId] = useState(null);

	const isAdmin = useMemo(() => user?.role === "admin", [user]);

	const loadModules = useCallback(async () => {
		try {
			setLoading(true);
			const data = await getModules();
			setModules(data || []);
			// Select first module by default
			if (data?.length) {
				setSelectedModuleId((prev) => prev || data[0]._id);
			}
		} catch (err) {
			setError(err.response?.data?.message || "Failed to load modules");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadModules();
	}, [loadModules]);

	const loadQuestions = async (moduleId) => {
		if (!moduleId) return;
		try {
			setLoading(true);
			const data = await getQuestionsByModule(moduleId);
			setQuestions(data || []);
			setError("");
		} catch (err) {
			setError(err.response?.data?.message || "Failed to load questions");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (selectedModuleId) {
			loadQuestions(selectedModuleId);
			setForm((p) => ({ ...p, moduleId: selectedModuleId }));
		}
	}, [selectedModuleId]);

	const resetForm = () => {
		setForm({ ...initialForm, moduleId: selectedModuleId });
		setEditId(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!selectedModuleId) {
			setError("Select a module first");
			return;
		}
		setSaving(true);
		setError("");

		const options = form.optionsText
			.split("\n")
			.map((o) => o.trim())
			.filter(Boolean);

		const payload = {
			moduleId: selectedModuleId,
			questionText: form.questionText.trim(),
			options,
			correctAnswer: form.correctAnswer.trim(),
			explanation: form.explanation.trim(),
			difficulty: Number(form.difficulty) || 1,
			type: form.type || "mcq",
		};

		try {
			if (!payload.questionText || !payload.options.length || !payload.correctAnswer) {
				setError("Question, options, and correct answer are required");
				return;
			}

			if (editId) {
				await updateQuestion(editId, payload);
			} else {
				await createQuestion(payload);
			}
			await loadQuestions(selectedModuleId);
			resetForm();
		} catch (err) {
			setError(err.response?.data?.message || "Failed to save question");
		} finally {
			setSaving(false);
		}
	};

	const handleEdit = (q) => {
		setEditId(q._id);
		setForm({
			moduleId: selectedModuleId,
			questionText: q.questionText || "",
			optionsText: Array.isArray(q.options) ? q.options.join("\n") : "",
			correctAnswer: q.correctAnswer || "",
			explanation: q.explanation || "",
			difficulty: q.difficulty ?? 1,
			type: q.type || "mcq",
		});
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Delete this question?")) return;
		try {
			setDeletingId(id);
			await deleteQuestion(id);
			await loadQuestions(selectedModuleId);
		} catch (err) {
			setError(err.response?.data?.message || "Failed to delete question");
		} finally {
			setDeletingId(null);
		}
	};

	return (
		<div>
			<h2 style={{ marginBottom: "12px" }}>Manage Questions</h2>
			{!isAdmin && (
				<p style={{ color: "red", marginBottom: "12px" }}>
					Admin role required to manage questions.
				</p>
			)}
			{error && <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>}

			<div style={{ marginBottom: "12px" }}>
				<label>
					Select module
					<select
						value={selectedModuleId}
						onChange={(e) => setSelectedModuleId(e.target.value)}
						style={{ marginLeft: "8px", padding: "6px" }}
					>
						<option value="">-- choose --</option>
						{modules.map((m) => (
							<option key={m._id} value={m._id}>
								{m.title}
							</option>
						))}
					</select>
				</label>
			</div>

			<div
				style={{
					border: "1px solid #e5e7eb",
					borderRadius: "8px",
					padding: "16px",
					marginBottom: "16px",
					background: "#f9fafb",
				}}
			>
				<h3 style={{ marginTop: 0 }}>{editId ? "Edit question" : "Create question"}</h3>
				<form onSubmit={handleSubmit}>
					<div style={{ display: "grid", gap: "10px" }}>
						<label>
							Question text
							<textarea
								rows={3}
								value={form.questionText}
								onChange={(e) => setForm((p) => ({ ...p, questionText: e.target.value }))}
								style={{ width: "100%", padding: "8px", marginTop: "4px" }}
							/>
						</label>
						<label>
							Options (one per line)
							<textarea
								rows={4}
								value={form.optionsText}
								onChange={(e) => setForm((p) => ({ ...p, optionsText: e.target.value }))}
								style={{ width: "100%", padding: "8px", marginTop: "4px" }}
							/>
						</label>
						<label>
							Correct answer
							<input
								type="text"
								value={form.correctAnswer}
								onChange={(e) => setForm((p) => ({ ...p, correctAnswer: e.target.value }))}
								style={{ width: "100%", padding: "8px", marginTop: "4px" }}
							/>
						</label>
						<label>
							Explanation (optional)
							<textarea
								rows={2}
								value={form.explanation}
								onChange={(e) => setForm((p) => ({ ...p, explanation: e.target.value }))}
								style={{ width: "100%", padding: "8px", marginTop: "4px" }}
							/>
						</label>
						<label>
							Difficulty
							<input
								type="number"
								min={1}
								max={5}
								value={form.difficulty}
								onChange={(e) => setForm((p) => ({ ...p, difficulty: e.target.value }))}
								style={{ width: "100%", padding: "8px", marginTop: "4px" }}
							/>
						</label>
						<label>
							Type
							<select
								value={form.type}
								onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
								style={{ width: "100%", padding: "8px", marginTop: "4px" }}
							>
								<option value="mcq">Multiple choice</option>
								<option value="short">Short answer</option>
								<option value="ai_generated">AI generated</option>
							</select>
						</label>

						<div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
							<button type="submit" disabled={saving || !isAdmin}>
								{saving ? "Saving..." : editId ? "Update question" : "Create question"}
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
				<h3 style={{ marginTop: 0 }}>Questions for this module</h3>
				{loading ? (
					<p>Loading...</p>
				) : !selectedModuleId ? (
					<p>Select a module to view questions.</p>
				) : questions.length === 0 ? (
					<p>No questions yet.</p>
				) : (
					<div style={{ display: "grid", gap: "10px" }}>
						{questions.map((q) => (
							<div
								key={q._id}
								style={{
									border: "1px solid #e5e7eb",
									borderRadius: "6px",
									padding: "12px",
									background: "#fff",
								}}
							>
								<div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
									<div style={{ flex: 1 }}>
										<p style={{ margin: "0 0 6px" }}>{q.questionText}</p>
										<ul style={{ margin: "0 0 6px", paddingLeft: "18px" }}>
											{(q.options || []).map((opt, idx) => (
												<li key={idx} style={{ color: opt === q.correctAnswer ? "#16a34a" : "#334155" }}>
													{opt}
													{opt === q.correctAnswer ? " (correct)" : ""}
												</li>
											))}
										</ul>
										{q.explanation && (
											<p style={{ margin: 0, color: "#475569", fontSize: "0.9rem" }}>
												Explanation: {q.explanation}
											</p>
										)}
										<p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "#475569" }}>
											Difficulty: {q.difficulty ?? 1} · Type: {q.type}
										</p>
									</div>
									<div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
										<button type="button" onClick={() => handleEdit(q)} disabled={!isAdmin}>
											Edit
										</button>
										<button
											type="button"
											onClick={() => handleDelete(q._id)}
											disabled={!isAdmin || deletingId === q._id}
											style={{ color: "#b91c1c" }}
										>
											{deletingId === q._id ? "Deleting..." : "Delete"}
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

export default ManageQuestions;
