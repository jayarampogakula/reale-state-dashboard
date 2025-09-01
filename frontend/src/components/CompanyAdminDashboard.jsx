import { useState, useEffect } from "react";
import api from "../api";

export default function CompanyAdminPanel() {
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState({ username: "", password: "" });

  // Fetch agents
  const fetchAgents = async () => {
    try {
      const res = await api.get("/agents.php");
      setAgents(res.data);
    } catch (err) {
      console.error("Error fetching agents:", err);
    }
  };

  // Add agent
  const createAgent = async () => {
    if (!form.username || !form.password) {
      alert("Both fields required");
      return;
    }
    try {
      await api.post("/agents.php", form);
      alert("Agent created!");
      setForm({ username: "", password: "" });
      fetchAgents();
    } catch (err) {
      alert("Error creating agent");
    }
  };

  // Reset password
  const resetPassword = async (id) => {
    const newPass = prompt("Enter new password:");
    if (!newPass) return;
    try {
      await api.post(`/agents.php?id=${id}&action=reset`, { password: newPass });
      alert("Password reset successfully!");
    } catch (err) {
      alert("Error resetting password");
    }
  };

  // Delete agent
  const deleteAgent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this agent?")) return;
    try {
      await api.delete(`/agents.php?id=${id}`);
      fetchAgents();
    } catch (err) {
      alert("Error deleting agent");
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div className="p-6 bg-white shadow rounded mt-6">
      <h2 className="text-xl font-bold mb-4">Manage Agents</h2>

      {/* Add new agent form */}
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="password"
          className="border p-2 flex-1"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={createAgent}
        >
          Add
        </button>
      </div>

      {/* Agents list */}
      <table className="w-full border bg-gray-50">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Username</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((a) => (
            <tr key={a.id} className="border-b">
              <td className="border px-2 py-1">{a.id}</td>
              <td className="border px-2 py-1">{a.username}</td>
              <td className="border px-2 py-1">
                <button
                  className="bg-blue-500 text-white px-2 py-1 mr-2 rounded"
                  onClick={() => resetPassword(a.id)}
                >
                  Reset
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => deleteAgent(a.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
