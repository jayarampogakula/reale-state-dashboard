import ProjectsPanel from "./ProjectsPanel";
import LeadForm from "./LeadForm";
import LeadTable from "./LeadTable";

export default function CompanyAdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Company Admin Dashboard</h1>
      <ProjectsPanel />
      <LeadForm onLeadCreated={() => window.location.reload()} />
      <LeadTable />
    </div>
  );
}
