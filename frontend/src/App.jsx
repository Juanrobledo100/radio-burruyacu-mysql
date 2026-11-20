import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AudioProvider } from "./context/AudioContext";
import { RadioConfigProvider } from "./context/RadioConfigContext";
import PublicLayout from "./layouts/PublicLayout";
import PantallaCarga from "./components/layout/PantallaCarga";
import Inicio from "./pages/Inicio";
import Noticias from "./pages/Noticias";
import NoticiaDetalle from "./pages/NoticiaDetalle";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import Registro from "./pages/Registro";
import Ingresar from "./pages/Ingresar";
import NotFound from "./pages/NotFound";

const AdminRoutes = lazy(() => import("./pages/admin/AdminRoutes"));

const App = () => (
  <AudioProvider>
    <RadioConfigProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<Inicio />} />
            <Route path="noticias" element={<Noticias />} />
            <Route path="noticias/:id" element={<NoticiaDetalle />} />
            <Route path="nosotros" element={<Nosotros />} />
            <Route path="contacto" element={<Contacto />} />
            <Route path="registro" element={<Registro />} />
            <Route path="ingresar" element={<Ingresar />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route
            path="PanelAdmin/*"
            element={
              <Suspense fallback={<div className="min-h-screen bg-dark-deep"><PantallaCarga /></div>}>
                <AdminRoutes />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </RadioConfigProvider>
  </AudioProvider>
);

export default App;
