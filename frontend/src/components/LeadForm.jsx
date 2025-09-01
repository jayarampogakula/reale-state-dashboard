import { useState, useEffect } from "react";
import api from "../api";

export default function LeadForm({ onLeadCreated }) {
  const [projects, setProjects] = useState([]);
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    budget: "",
    timeline: "",
    project_id: "",
    assigned_to: "",
  });

  // Fetch projects + agents for dropdowns
  const fetchData = async () => {
    try {
      const [projRes, agentRes] = await Promise.all([
        api.get("/projects.php"),
        api.get("/agents.php"),
      ]);
      setProjects(projRes.data);
      setAgents(agentRes.data);
    } catch (err) {
      console.error("Error loading dropdown data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Create new lead
  const createLead = async () => {
    if (!form.name || !form.phone || !form.project_id || !form.assigned_to) {
      alert("Name, Phone, Project, and Agent are required");
      return;
    }
    try {
      await api.post("/leads.php", form);
      alert("Lead added!");
      setForm({
        name: "",
        phone: "",
        budget: "",
        timeline: "",
        project_id: "",
        assigned_to: "",
      });
      onLeadCreated();
    } catch (err) {
      alert("Error adding lead");
    }
  };

  return (
    <div className="mb-6 space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <input
          className="border p-2"
          placeholder="Lead Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border p-2"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          className="border p-2"
          placeholder="Budget"
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
        />
        <input
          className="border p-2"
          placeholder="Timeline (e.g. Immediate, 3 months)"
          value={form.timeline}
          onChange={(e) => setForm({ ...form, timeline: e.target.value })}
        />

        {/* Project Dropdown */}
        <select
          className="border p-2"
          value={form.project_id}
          onChange={(e) => setForm({ ...form, project_id: e.target.value })}
        >
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Agent Dropdown */}
        <select
          className="border p-2"
          value={form.assigned_to}
          onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
        >
          <option value="">Assign Agent</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.username}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={createLead}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Lead
      </button>
    </div>
  );
}
