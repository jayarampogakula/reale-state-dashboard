import ProjectsPanel from "./ProjectsPanel";
import CompanyAdminPanel from "./CompanyAdminPanel";
import LeadForm from "./LeadForm";
import LeadTable from "./LeadTable";

export default function CompanyAdminDashboard() {
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🏢 Company Admin Dashboard</h1>

      {/* Manage Projects */}
      <section className="p-6 border rounded bg-white shadow">
        <h2 className="text-xl font-semibold mb-4">Projects</h2>
        <ProjectsPanel />
      </section>

      {/* Manage Agents */}
      <section className="p-6 border rounded bg-white shadow">
        <h2 className="text-xl font-semibold mb-4">Agents</h2>
        <CompanyAdminPanel />
      </section>

      {/* Manage Leads */}
      <section className="p-6 border rounded bg-white shadow">
        <h2 className="text-xl font-semibold mb-4">Leads</h2>
        <LeadForm onLeadCreated={() => window.location.reload()} />
        <LeadTable />
      </section>
    </div>
  );
}
