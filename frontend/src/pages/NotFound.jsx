import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => (
  <div className="flex flex-col items-center gap-4 py-24 text-center">
    <p className="text-6xl font-black text-primary-accent">404</p>
    <h1 className="text-2xl font-bold text-white">No encontramos esta página</h1>
    <p className="max-w-sm text-sm text-slate-400">Puede que el enlace esté mal escrito o que la página ya no exista.</p>
    <Link to="/" className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary-accent px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-hover">
      <Home className="h-4 w-4" /> Volver al inicio
    </Link>
  </div>
);

export default NotFound;
