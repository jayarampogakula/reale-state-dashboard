import React, { useEffect, useState } from "react";
import api from "../api";

export default function ProjectsPanel() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: "", location: "", price_range: "", amenities: "" });

  const fetchProjects = async () => {
    const res = await api.get("/projects.php");
    setProjects(res.data);
  };

  const createProject = async () => {
    await api.post("/projects.php", form);
    setForm({ name: "", location: "", price_range: "", amenities: "" });
    fetchProjects();
  };

  const deleteProject = async (id) => {
    await api.delete("/projects.php", { data: { id } });
    fetchProjects();
  };

  useEffect(() => { fetchProjects(); }, []);

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Manage Projects</h2>

      {/* New Project Form */}
      <div className="mb-4 space-y-2">
        <input placeholder="Project Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/>
        <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}/>
        <input placeholder="Price Range" value={form.price_range} onChange={e => setForm({ ...form, price_range: e.target.value })}/>
        <textarea placeholder="Amenities" value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })}/>
        <button onClick={createProject} className="bg-green-500 text-white px-4 py-2 rounded">Add Project</button>
      </div>

      {/* Project List */}
      <table className="w-full bg-gray-50">
        <thead className="bg-gray-200">
          <tr><th>Name</th><th>Location</th><th>Price</th><th>Amenities</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr key={p.id} className="border-b">
              <td>{p.name}</td>
              <td>{p.location}</td>
              <td>{p.price_range}</td>
              <td>{p.amenities}</td>
              <td>
                <button onClick={() => deleteProject(p.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
