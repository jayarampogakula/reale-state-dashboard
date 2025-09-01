import { useEffect, useState } from "react";
import api from "../api";

export default function LeadTable() {
  const [leads, setLeads] = useState([]);

  const fetchLeads = async () => {
    try {
      const res = await api.get("/leads.php");
      setLeads(res.data);
    } catch (err) {
      console.error("Error fetching leads:", err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Leads</h2>
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
          {leads.map((lead) => (
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
