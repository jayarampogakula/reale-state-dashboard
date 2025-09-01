import React, { useState, useEffect } from "react";
import api from "../api";

export default function LeadForm({ onLeadCreated }) {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", budget: "", timeline: "", project_id: "" });

  useEffect(() => {
    api.get("/projects.php").then(res => setProjects(res.data));
  }, []);

  const createLead = async () => {
    await api.post("/leads.php", form);
    setForm({ name: "", phone: "", budget: "", timeline: "", project_id: "" });
    onLeadCreated();
  };

  return (
    <div className="mb-4">
      <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/>
      <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}/>
      <input placeholder="Budget" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })}/>
      <input placeholder="Timeline" value={form.timeline} onChange={e => setForm({ ...form, timeline: e.target.value })}/>
      <select value={form.project_id} onChange={e => setForm({ ...form, project_id: e.target.value })}>
        <option value="">Select Project</option>
        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <button onClick={createLead} className="bg-blue-500 text-white px-3 py-1 rounded">Add Lead</button>
    </div>
  );
}
