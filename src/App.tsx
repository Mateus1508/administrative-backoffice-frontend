import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/ui/toast";
import { MainLayout } from "./components/layout/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { Users } from "./pages/Users";
import { Orders } from "./pages/Orders";
import { Commissions } from "./pages/Commissions";
import { Error500 } from "./pages/Error500";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/usuarios" element={<Users />} />
            <Route path="/pedidos" element={<Orders />} />
            <Route path="/comissoes" element={<Commissions />} />
            <Route path="/erro-500" element={<Error500 />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
