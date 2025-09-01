import { useEffect, useState } from "react";
import api from "../api";

export default function LeadTable() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [projects, setProjects] = useState([]);
  const [agents, setAgents] = useState([]);
  const [filters, setFilters] = useState({ project: "", agent: "", status: "" });

  // Fetch leads, projects, agents
  const fetchData = async () => {
    try {
      const [leadsRes, projectsRes, agentsRes] = await Promise.all([
        api.get("/leads.php"),
        api.get("/projects.php"),
        api.get("/agents.php"),
      ]);
      setLeads(leadsRes.data);
      setFilteredLeads(leadsRes.data);
      setProjects(projectsRes.data);
      setAgents(agentsRes.data);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = leads;
    if (filters.project) {
      result = result.filter((l) => String(l.project_id) === filters.project);
    }
    if (filters.agent) {
      result = result.filter((l) => String(l.assigned_to) === filters.agent);
    }
    if (filters.status) {
      result = result.filter((l) => l.status === filters.status);
    }
    setFilteredLeads(result);
  }, [filters, leads]);

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Leads</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        {/* Project Filter */}
        <select
          className="border p-2"
          value={filters.project}
          onChange={(e) => setFilters({ ...filters, project: e.target.value })}
        >
          <option value="">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Agent Filter */}
        <select
          className="border p-2"
          value={filters.agent}
          onChange={(e) => setFilters({ ...filters, agent: e.target.value })}
        >
          <option value="">All Agents</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.username}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          className="border p-2"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="Hot">Hot</option>
          <option value="Warm">Warm</option>
          <option value="Cold">Cold</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Leads Table */}
      <table className="w-full border bg-gray-50">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Phone</th>
            <th className="border px-2 py-1">Budget</th>
            <th className="border px-2 py-1">Timeline</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Outcome</th>
            <th className="border px-2 py-1">Project</th>
            <th className="border px-2 py-1">Agent</th>
            <th className="border px-2 py-1">Site Visit</th>
            <th className="border px-2 py-1">Payment Due</th>
          </tr>
        </thead>
        <tbody>
          {filteredLeads.map((lead) => (
            <tr key={lead.id} className="border-b">
              <td className="border px-2 py-1">{lead.name}</td>
              <td className="border px-2 py-1">{lead.phone}</td>
              <td className="border px-2 py-1">{lead.budget}</td>
              <td className="border px-2 py-1">{lead.timeline}</td>
              <td className="border px-2 py-1">{lead.status}</td>
              <td className="border px-2 py-1">{lead.outcome}</td>
              <td className="border px-2 py-1">{lead.project_name || "-"}</td>
              <td className="border px-2 py-1">{lead.agent_name || "-"}</td>
              <td className="border px-2 py-1">
                {lead.site_visit_date
                  ? new Date(lead.site_visit_date).toLocaleString()
                  : "-"}
              </td>
              <td className="border px-2 py-1">
                {lead.payment_due_date
                  ? new Date(lead.payment_due_date).toLocaleDateString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
