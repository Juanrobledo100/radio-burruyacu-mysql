import React from "react";

const PantallaCarga = () => (
  <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Cargando">
    <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-primary-accent" />
  </div>
);

export default PantallaCarga;
