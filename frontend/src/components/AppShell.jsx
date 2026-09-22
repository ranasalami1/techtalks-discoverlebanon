"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="app-main">

        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="page-content">
          {children}
        </main>

      </div>

    </div>
  );
}