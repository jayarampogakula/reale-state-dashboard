import { useState, useEffect } from "react";
import api from "../api";

export default function SuperAdminDashboard() {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({ company_name: "", admin_username: "", admin_password: "" });

  // Fetch all companies
  const fetchCompanies = async () => {
    try {
      const res = await api.get("/companies.php");
      setCompanies(res.data);
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };

  // Create new company
  const createCompany = async () => {
    if (!form.company_name || !form.admin_username || !form.admin_password) {
      alert("All fields are required");
      return;
    }
    try {
      await api.post("/companies.php", form);
      alert("Company created successfully!");
      setForm({ company_name: "", admin_username: "", admin_password: "" });
      fetchCompanies();
    } catch (err) {
      alert("Error creating company");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Super Admin Dashboard</h1>

      {/* Create Company Form */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-lg font-semibold mb-2">Add New Company</h2>
        <input
          className="w-full border p-2 mb-2"
          placeholder="Company Name"
          value={form.company_name}
          onChange={(e) => setForm({ ...form, company_name: e.target.value })}
        />
        <input
          className="w-full border p-2 mb-2"
          placeholder="Admin Username"
          value={form.admin_username}
          onChange={(e) => setForm({ ...form, admin_username: e.target.value })}
        />
        <input
          type="password"
          className="w-full border p-2 mb-2"
          placeholder="Admin Password"
          value={form.admin_password}
          onChange={(e) => setForm({ ...form, admin_password: e.target.value })}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={createCompany}
        >
          Create Company
        </button>
      </div>

      {/* Companies List */}
      <h2 className="text-lg font-semibold mb-2">Companies</h2>
      <table className="w-full border bg-gray-50">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Name</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="border px-2 py-1">{c.id}</td>
              <td className="border px-2 py-1">{c.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
