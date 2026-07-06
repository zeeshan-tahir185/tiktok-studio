import { useState } from "react";
import { DataProvider } from "./data/DataContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import OverviewTab from "./components/OverviewTab";
import ViewersTab from "./components/ViewersTab";
import EngagementTab from "./components/EngagementTab";

function App() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <DataProvider>
      <div className="flex min-h-screen bg-[var(--tt-bg)]">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <Header activeTab={activeTab} onTabChange={setActiveTab} />
          {activeTab === "Overview" && <OverviewTab />}
          {activeTab === "Viewers" && <ViewersTab />}
          {activeTab === "Engagement" && <EngagementTab />}
        </main>
      </div>
    </DataProvider>
  );
}

export default App;
