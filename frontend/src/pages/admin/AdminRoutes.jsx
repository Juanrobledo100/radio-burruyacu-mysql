import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import Resumen from "./secciones/Resumen";
import Noticias from "./secciones/Noticias";
import Categorias from "./secciones/Categorias";
import Mensajes from "./secciones/Mensajes";
import Redes from "./secciones/Redes";
import Configuracion from "./secciones/Configuracion";
import Usuarios from "./secciones/Usuarios";
import Banners from "./secciones/Banners";
import FormularioNoticia from "./secciones/FormularioNoticia";
import RecuperarPassword from "./RecuperarPassword";
import RestablecerPassword from "./RestablecerPassword";
import { useAuthStore } from "../../stores/authStore";

const RutaSegunRol = ({ rolesPermitidos, children }) => {
  const usuario = useAuthStore((state) => state.usuario);
  if (!usuario || !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/PanelAdmin/noticias" replace />;
  }
  return children;
};

const AdminRoutes = () => (
  <Routes>
    <Route path="recuperar" element={<RecuperarPassword />} />
    <Route path="restablecer" element={<RestablecerPassword />} />
    <Route element={<AdminLayout />}>
      <Route
        index
        element={
          <RutaSegunRol rolesPermitidos={["admin"]}>
            <Resumen />
          </RutaSegunRol>
        }
      />
      <Route
        path="noticias"
        element={<RutaSegunRol rolesPermitidos={["admin"]}><Noticias /></RutaSegunRol>}
      />
      <Route
        path="noticias/nueva"
        element={<RutaSegunRol rolesPermitidos={["admin"]}><FormularioNoticia /></RutaSegunRol>}
      />
      <Route
        path="noticias/:id/editar"
        element={<RutaSegunRol rolesPermitidos={["admin"]}><FormularioNoticia /></RutaSegunRol>}
      />
      <Route
        path="categorias"
        element={<RutaSegunRol rolesPermitidos={["admin"]}><Categorias /></RutaSegunRol>}
      />
      <Route
        path="categorias/nueva"
        element={<RutaSegunRol rolesPermitidos={["admin"]}><Categorias modo="crear" /></RutaSegunRol>}
      />
      <Route
        path="categorias/:id/editar"
        element={<RutaSegunRol rolesPermitidos={["admin"]}><Categorias modo="editar" /></RutaSegunRol>}
      />
      <Route
        path="mensajes"
        element={<RutaSegunRol rolesPermitidos={["admin"]}><Mensajes /></RutaSegunRol>}
      />
      <Route
        path="mensajes/:id"
        element={<RutaSegunRol rolesPermitidos={["admin"]}><Mensajes /></RutaSegunRol>}
      />
      <Route
        path="redes"
        element={<RutaSegunRol rolesPermitidos={["admin"]}><Redes /></RutaSegunRol>}
      />
      <Route
        path="redes/nueva"
        element={<RutaSegunRol rolesPermitidos={["admin"]}><Redes modo="crear" /></RutaSegunRol>}
      />
      <Route
        path="redes/:id/editar"
        element={<RutaSegunRol rolesPermitidos={["admin"]}><Redes modo="editar" /></RutaSegunRol>}
      />
      <Route
        path="usuarios"
        element={<RutaSegunRol rolesPermitidos={["admin"]}><Usuarios /></RutaSegunRol>}
      />
      <Route
        path="usuarios/nueva"
        element={<RutaSegunRol rolesPermitidos={["admin"]}><Usuarios modo="crear" /></RutaSegunRol>}
      />
      <Route
        path="usuarios/:id/editar"
        element={<RutaSegunRol rolesPermitidos={["admin"]}><Usuarios modo="editar" /></RutaSegunRol>}
      />
      <Route
        path="banners"
        element={<RutaSegunRol rolesPermitidos={["admin"]}><Banners /></RutaSegunRol>}
      />
      <Route
        path="banners/nuevo"
        element={<RutaSegunRol rolesPermitidos={["admin"]}><Banners modo="crear" /></RutaSegunRol>}
      />
      <Route
        path="banners/:id/editar"
        element={<RutaSegunRol rolesPermitidos={["admin"]}><Banners modo="editar" /></RutaSegunRol>}
      />
      <Route
        path="configuracion"
        element={<RutaSegunRol rolesPermitidos={["admin"]}><Configuracion /></RutaSegunRol>}
      />
      <Route path="*" element={<Navigate to="/PanelAdmin" replace />} />
    </Route>
  </Routes>
);

export default AdminRoutes;
