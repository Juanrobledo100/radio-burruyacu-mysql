import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import logoRadioFallback from "../../assets/Logos/logo-radio-transparente.png";

const IntroBienvenida = ({ onFinish, logoUrl }) => {
  const contenedorRef = useRef(null);
  const logoRef = useRef(null);
  const anilloRef = useRef(null);
  const tituloRef = useRef(null);
  const subtituloRef = useRef(null);
  const barraRef = useRef(null);
  const barrasRef = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(contenedorRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
          onComplete: () => onFinish && onFinish(),
        });
      },
    });

    gsap.set([tituloRef.current, subtituloRef.current], { opacity: 0, y: 16 });
    gsap.set(logoRef.current, { scale: 0.4, opacity: 0, rotate: -25 });
    gsap.set(anilloRef.current, { scale: 0.6, opacity: 0 });
    gsap.set(barrasRef.current, { scaleY: 0.15, transformOrigin: "bottom" });

    tl.to(anilloRef.current, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" })
      .to(logoRef.current, { scale: 1, opacity: 1, rotate: 0, duration: 0.7, ease: "back.out(1.8)" }, "-=0.35")
      .to(barrasRef.current, {
        scaleY: 1,
        duration: 0.5,
        stagger: { each: 0.06, yoyo: true, repeat: 3 },
        ease: "sine.inOut",
      }, "-=0.2")
      .to(tituloRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.7")
      .to(subtituloRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
      .fromTo(
        barraRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.1, ease: "power1.inOut", transformOrigin: "left" },
        "-=0.3"
      );

    return () => tl.kill();
  }, [onFinish]);

  return (
    <div
      ref={contenedorRef}
      className="fixed inset-0 z-[100] bg-[#08090d] flex flex-col items-center justify-center gap-6 px-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,46,99,0.16),transparent_55%)]" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative flex items-center justify-center">
          <div
            ref={anilloRef}
            className="absolute w-28 h-28 rounded-full border-2 border-primary-accent/40"
          />
          <div
            ref={logoRef}
            className="w-20 h-20 rounded-full bg-slate-950 border border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(255,46,99,0.35)] overflow-hidden"
          >
            <img
              src={logoUrl || logoRadioFallback}
              alt="Radio Del Rosario 100.7 FM"
              className="w-full h-full object-contain p-1.5"
            />
          </div>
        </div>

        <div className="flex items-end gap-[5px] h-8">
          {Array.from({ length: 7 }).map((_, i) => (
            <span
              key={i}
              ref={(el) => (barrasRef.current[i] = el)}
              className="w-[4px] h-8 rounded-full bg-gradient-to-t from-primary-accent to-pink-400"
            />
          ))}
        </div>

        <div className="text-center">
          <h1 ref={tituloRef} className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Bienvenido a Radio Del Rosario 100.7 FM
          </h1>
          <p ref={subtituloRef} className="text-sm text-slate-400 mt-2">
            La voz de nuestra gente, siempre presente.
          </p>
        </div>

        <div className="w-48 h-[3px] rounded-full bg-white/10 overflow-hidden mt-2">
          <div ref={barraRef} className="h-full w-full bg-gradient-to-r from-primary-accent to-purple-400" />
        </div>
      </div>
    </div>
  );
};

export default IntroBienvenida;
