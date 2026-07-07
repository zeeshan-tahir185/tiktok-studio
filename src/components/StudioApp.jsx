import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import OverviewTab from "./OverviewTab";
import ViewersTab from "./ViewersTab";
import EngagementTab from "./EngagementTab";

export default function StudioApp() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="flex min-h-screen bg-[var(--tt-bg)]">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="w-full max-w-[1608px] mx-auto">
          {activeTab === "Overview" && <OverviewTab />}
          {activeTab === "Viewers" && <ViewersTab />}
          {activeTab === "Engagement" && <EngagementTab />}
        </main>
      </div>
    </div>
  );
}
