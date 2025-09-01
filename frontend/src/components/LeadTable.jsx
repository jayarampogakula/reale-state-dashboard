import React, { useEffect, useState } from "react";
import api from "../api";

export default function LeadTable() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    api.get("/leads.php").then(res => setLeads(res.data));
  }, []);

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Leads</h2>
      <table className="w-full bg-gray-50 border">
        <thead className="bg-gray-200">
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Budget</th>
            <th>Timeline</th>
            <th>Status</th>
            <th>Outcome</th>
            <th>Project</th>
            <th>Site Visit</th>
            <th>Payment Due</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b">
              <td>{lead.name}</td>
              <td>{lead.phone}</td>
              <td>{lead.budget}</td>
              <td>{lead.timeline}</td>
              <td>{lead.status}</td>
              <td>{lead.outcome}</td>
              <td>{lead.project_name || "-"}</td>
              <td>{lead.site_visit_date ? new Date(lead.site_visit_date).toLocaleString() : "-"}</td>
              <td>{lead.payment_due_date ? new Date(lead.payment_due_date).toLocaleDateString() : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
