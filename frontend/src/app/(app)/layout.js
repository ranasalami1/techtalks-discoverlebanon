import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full bg-cream">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
