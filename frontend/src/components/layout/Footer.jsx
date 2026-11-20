import React from "react";
import { MessageCircle, Radio } from "lucide-react";
import { Facebook, Instagram, Youtube } from "../ui/BrandIcons";
import { useRadioConfig } from "../../context/RadioConfigContext";
import logoBurruyacu from "../../assets/Logos/logo de burruyacu.jpg";

const EnlaceRed = ({ href, nombre, color, Icono }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    aria-label={nombre}
    className={`flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 transition-colors ${color}`}
  >
    <Icono className="w-5 h-5" />
    <span className="text-slate-300">{nombre}</span>
  </a>
);

const Footer = () => {
  const { configRadio } = useRadioConfig();
  const redes = configRadio?.redesSociales || {};

  return (
    <footer className="w-full border-t border-white/5 bg-[#06070a] py-6 text-center text-xs text-slate-500 pb-20 md:pb-6">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-wrap items-center justify-center md:justify-between gap-5">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-primary-accent" />
            <span className="font-bold text-slate-400">Radio Del Rosario 100.7 FM © {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-3 text-left md:translate-x-4">
            <img
              src={logoBurruyacu}
              alt="Escudo de la Municipalidad de Burruyacu"
              className="h-14 w-14 rounded-full border-2 border-white/20 object-cover shadow-lg shadow-black/30"
            />
            <div>
              <p className="font-semibold text-slate-300">Intendente Jorge Leal</p>
              <p className="text-[11px] text-slate-500">Municipalidad de Burruyacú</p>
            </div>
          </div>
          <p className="text-slate-500 leading-normal">Municipalidad de Burruyacú • Tucumán, Argentina</p>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 border-t border-white/10 pt-4" aria-label="Redes sociales">
          {redes.facebook && <EnlaceRed href={redes.facebook} nombre="Facebook" Icono={Facebook} color="text-[#1877F2] hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10" />}
          {redes.instagram && <EnlaceRed href={redes.instagram} nombre="Instagram" Icono={Instagram} color="text-[#E1306C] hover:border-[#E1306C]/50 hover:bg-[#E1306C]/10" />}
          {redes.youtube && <EnlaceRed href={redes.youtube} nombre="YouTube" Icono={Youtube} color="text-[#FF0000] hover:border-[#FF0000]/50 hover:bg-[#FF0000]/10" />}
          {redes.whatsapp && <EnlaceRed href={redes.whatsapp} nombre="WhatsApp" Icono={MessageCircle} color="text-[#25D366] hover:border-[#25D366]/50 hover:bg-[#25D366]/10" />}
        </div>

      </div>
    </footer>
  );
};

export default Footer;
