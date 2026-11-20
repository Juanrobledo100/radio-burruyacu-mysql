import React, { Suspense, useCallback, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/layout/Header";
import MobileNav from "../components/layout/MobileNav";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/layout/ScrollToTop";
import PantallaCarga from "../components/layout/PantallaCarga";
import IntroBienvenida from "../components/radio/IntroBienvenida";
import InstallPwaPrompt from "../components/pwa/InstallPwaPrompt";
import BannerAppRadio from "../components/pwa/BannerAppRadio";
import { useRadioConfig } from "../context/RadioConfigContext";
import { assetUrl } from "../config/api";

const CLAVE_INTRO = "intro_radio_burruyacu_vista";

const clasesContenido = (pathname) => {
  if (pathname === "/") return "flex-1 w-full";
  if (/^\/(nosotros|contacto)\/?$/.test(pathname)) return "flex-1 w-full max-w-none mx-0 px-0 py-0";
  return "flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8";
};

const PublicLayout = () => {
  const { pathname } = useLocation();
  const { configRadio } = useRadioConfig();
  const [mostrarIntro, setMostrarIntro] = useState(() => !sessionStorage.getItem(CLAVE_INTRO));

  const finalizarIntro = useCallback(() => {
    sessionStorage.setItem(CLAVE_INTRO, "1");
    setMostrarIntro(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-black text-slate-100 relative">
      <ScrollToTop />

      {mostrarIntro && (
        <IntroBienvenida
          onFinish={finalizarIntro}
          logoUrl={configRadio?.logoUrl ? assetUrl(configRadio.logoUrl) : null}
        />
      )}

      <div className="relative z-10 flex flex-col flex-1">
        <Header />
        <InstallPwaPrompt />

        <main className={clasesContenido(pathname)}>
          <Suspense fallback={<PantallaCarga />}>
            <Outlet />
          </Suspense>
        </main>

        <BannerAppRadio />
        <Footer />
        <MobileNav />
      </div>
    </div>
  );
};

export default PublicLayout;
