import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "./data/DataContext";
import StudioApp from "./components/StudioApp";
import AdminPage from "./components/AdminPage";

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StudioApp />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
