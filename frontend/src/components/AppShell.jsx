"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function AppShell({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="app-content">
        <header className="mobile-header">
          <button className="menu-button" type="button" aria-label="Open navigation" aria-expanded={isSidebarOpen} onClick={() => setIsSidebarOpen(true)}>
            <span /><span /><span />
          </button>
          <span className="mobile-brand">Discover Lebanon</span>
        </header>
        {children}
      </div>
    </div>
  );
}