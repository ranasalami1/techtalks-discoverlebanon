import AppShell from "@/components/AppShell";
import TopBar from "@/components/TopBar";

// Pages under (app) share the sidebar from KAN-4 (AppShell) plus the top navigation bar.
export default function AppLayout({ children }) {
  return (
    <AppShell>
      <TopBar />
      <main className="flex-1">{children}</main>
    </AppShell>
  );
}
