import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import ReactConfetti from "react-confetti";
import confetti from "canvas-confetti";
import party from "party-js";
import { Fireworks } from "fireworks-js";

const stickerSet = ["🌸", "💖", "✨", "🎀", "🍓", "🫧", "🌈", "⭐"];

function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window === "undefined" ? 1200 : window.innerWidth,
    height: typeof window === "undefined" ? 800 : window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}

export default function App() {
  const initParticles = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <ParticlesProvider init={initParticles}>
      <DukkalamaApp />
    </ParticlesProvider>
  );
}

function DukkalamaApp() {
  const prefersReducedMotion = useReducedMotion();
  const { width, height } = useWindowSize();
  const appRef = useRef(null);
  const cardRef = useRef(null);
  const fireworksRef = useRef(null);
  const noButtonRef = useRef(null);
  const [celebrating, setCelebrating] = useState(false);
  const [noScale, setNoScale] = useState(1);
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0, rotate: 0 });
  const [yesScale, setYesScale] = useState(1);

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({ defaults: { ease: "back.out(1.7)" } });
      tl.from(".brand-mark", { y: -28, opacity: 0, duration: 0.75 })
        .from(".nav-icon", { y: -18, opacity: 0, stagger: 0.08, duration: 0.45 }, "-=0.35")
        .from(cardRef.current, { scale: 0.82, y: 38, opacity: 0, duration: 0.85 }, "-=0.18")
        .from(".hero-word", { y: 22, opacity: 0, stagger: 0.08, duration: 0.45 }, "-=0.42")
        .fromTo(
          ".choice-row",
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, clearProps: "opacity,transform" },
          "-=0.18"
        );

      gsap.to(".drift-sticker", {
        y: "random(-34, 34)",
        x: "random(-22, 22)",
        rotate: "random(-14, 14)",
        duration: "random(3.4, 6.6)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.12,
      });
    },
    { scope: appRef, dependencies: [prefersReducedMotion] }
  );

  useEffect(() => {
    if (!celebrating || prefersReducedMotion || !fireworksRef.current) return undefined;

    const fireworks = new Fireworks(fireworksRef.current, {
      autoresize: true,
      opacity: 0.6,
      acceleration: 1.04,
      friction: 0.965,
      gravity: 1.45,
      particles: 72,
      traceLength: 3,
      traceSpeed: 10,
      explosion: 6,
      intensity: 24,
      flickering: 38,
      hue: { min: 315, max: 54 },
      delay: { min: 18, max: 36 },
      rocketsPoint: { min: 12, max: 88 },
      lineWidth: {
        explosion: { min: 1, max: 3 },
        trace: { min: 1, max: 2 },
      },
      brightness: { min: 68, max: 96 },
      decay: { min: 0.016, max: 0.032 },
    });

    fireworks.start();
    return () => fireworks.stop();
  }, [celebrating, prefersReducedMotion]);

  const particleOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      fpsLimit: width < 720 ? 38 : 60,
      detectRetina: true,
      particles: {
        number: {
          value: prefersReducedMotion ? 0 : width < 720 ? 38 : 95,
          density: { enable: true, area: 850 },
        },
        color: {
          value: ["#ff77ad", "#ffd166", "#69dbb5", "#8ec5ff", "#ffffff"],
        },
        shape: {
          type: ["circle", "star"],
        },
        opacity: {
          value: { min: 0.24, max: 0.78 },
          animation: { enable: true, speed: 0.45, sync: false },
        },
        size: {
          value: { min: 2, max: width < 720 ? 7 : 10 },
          animation: { enable: true, speed: 2.2, sync: false },
        },
        move: {
          enable: true,
          speed: width < 720 ? 0.8 : 1.25,
          direction: "none",
          random: true,
          straight: false,
          outModes: { default: "bounce" },
        },
        links: {
          enable: width >= 900 && !prefersReducedMotion,
          distance: 128,
          color: "#ff9fc2",
          opacity: 0.16,
          width: 1,
        },
      },
      interactivity: {
        events: {
          onHover: { enable: !prefersReducedMotion, mode: "bubble" },
          onClick: { enable: !prefersReducedMotion, mode: "push" },
        },
        modes: {
          bubble: { distance: 160, size: 13, duration: 0.55, opacity: 0.86 },
          push: { quantity: width < 720 ? 2 : 5 },
        },
      },
    }),
    [prefersReducedMotion, width]
  );

  const popFromElement = useCallback((element, intensity = 0.75) => {
    if (!element || prefersReducedMotion) return;

    party.confetti(element, {
      count: party.variation.range(18 * intensity, 42 * intensity),
      spread: party.variation.range(22, 52),
      speed: party.variation.range(260, 520),
      size: party.variation.range(0.7, 1.35),
    });
  }, [prefersReducedMotion]);

  const handleNo = useCallback(() => {
    const nextScale = Math.max(0.3, noScale - 0.13);
    const rangeX = width < 720 ? 82 : 190;
    const rangeY = width < 720 ? 48 : 105;

    setNoScale(nextScale);
    setYesScale((value) => Math.min(1.8, value + 0.075));
    setNoOffset({
      x: (Math.random() - 0.5) * rangeX,
      y: (Math.random() - 0.5) * rangeY,
      rotate: (Math.random() - 0.5) * 26,
    });
    popFromElement(noButtonRef.current, width < 720 ? 0.7 : 1);
  }, [noScale, popFromElement, width]);

  const fireSideCannons = useCallback(() => {
    if (prefersReducedMotion) return;

    const duration = 2400;
    const end = Date.now() + duration;
    const colors = ["#ff4f9a", "#ffb7ce", "#ffd166", "#69dbb5", "#8ec5ff"];

    const frame = () => {
      confetti({
        particleCount: width < 720 ? 3 : 7,
        angle: 58,
        spread: 72,
        origin: { x: 0, y: 0.78 },
        colors,
        ticks: 170,
      });
      confetti({
        particleCount: width < 720 ? 3 : 7,
        angle: 122,
        spread: 72,
        origin: { x: 1, y: 0.78 },
        colors,
        ticks: 170,
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    };

    frame();
  }, [prefersReducedMotion, width]);

  const handleYes = useCallback(() => {
    setCelebrating(true);
    fireSideCannons();

    if (!prefersReducedMotion) {
      gsap.fromTo(
        ".celebration-title span",
        { y: 64, rotate: -8, opacity: 0, scale: 0.72 },
        { y: 0, rotate: 0, opacity: 1, scale: 1, stagger: 0.045, duration: 0.72, ease: "elastic.out(1, 0.58)" }
      );
    }
  }, [fireSideCannons, prefersReducedMotion]);

  return (
    <div className={`app-shell ${celebrating ? "is-celebrating" : ""}`} ref={appRef}>
      <div className="aurora-field" aria-hidden="true" />
      <Particles
        id="sparkle-particles"
        className="particles-layer"
        options={particleOptions}
      />

      <header className="top-bar">
        <div className="brand-mark">Dukkalama</div>
        <nav className="top-actions" aria-label="Dukkalama efekt kontrolleri">
          <button className="nav-icon" type="button" onClick={(event) => popFromElement(event.currentTarget)}>
            <span aria-hidden="true">♡</span>
            <span className="sr-only">Kalp efekti</span>
          </button>
          <button className="nav-icon" type="button" onClick={(event) => popFromElement(event.currentTarget)}>
            <span aria-hidden="true">✦</span>
            <span className="sr-only">Parıltı efekti</span>
          </button>
        </nav>
      </header>

      <main className="stage">
        <div className="sticker-cloud" aria-hidden="true">
          {stickerSet.map((sticker, index) => (
            <span className={`drift-sticker sticker-${index + 1}`} key={`${sticker}-${index}`}>
              {sticker}
            </span>
          ))}
        </div>

        <motion.section
          className="invitation-panel"
          ref={cardRef}
          animate={{
            boxShadow: celebrating
              ? "0 34px 120px rgba(255, 79, 154, 0.42)"
              : "0 24px 80px rgba(134, 77, 97, 0.20)",
          }}
          transition={{ duration: 0.5 }}
          aria-labelledby="dukkalama-title"
        >
          <div className="micro-badge">
            <span>soft chaos mode</span>
            <strong>ON</strong>
          </div>

          <h1 id="dukkalama-title" className="hero-title">
            <span className="hero-word">Seni</span>
            <span className="hero-word">dukkalayabilir</span>
            <span className="hero-word">
              miyim?
              <span className="inline-bloom" aria-hidden="true">🌸</span>
            </span>
          </h1>

          <p className="hero-copy">(Lütfen evet de 🥺)</p>

          <div className="choice-row">
            <motion.button
              className="choice-button yes-button"
              type="button"
              onClick={handleYes}
              animate={{ scale: yesScale }}
              whileHover={prefersReducedMotion ? undefined : { scale: yesScale + 0.06, y: -3 }}
              whileTap={{ scale: Math.max(0.92, yesScale - 0.05), y: 3 }}
            >
              Evet
              <span aria-hidden="true">💖</span>
            </motion.button>

            <motion.button
              ref={noButtonRef}
              className="choice-button no-button"
              type="button"
              onMouseEnter={handleNo}
              onClick={handleNo}
              animate={{
                scale: noScale,
                x: noOffset.x,
                y: noOffset.y,
                rotate: noOffset.rotate,
              }}
              transition={{ type: "spring", stiffness: 360, damping: 16 }}
            >
              Hayır
            </motion.button>
          </div>
        </motion.section>
      </main>

      <footer className="footer-bar">
        <span>Made with 🎀 for sweet moments</span>
        <div>
          <a href="#privacy">Privacy</a>
          <a href="#love-policy">Love Policy</a>
        </div>
      </footer>

      <AnimatePresence>
        {celebrating && (
          <motion.div
            className="celebration-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="fireworks-layer" ref={fireworksRef} aria-hidden="true" />
            {!prefersReducedMotion && (
              <ReactConfetti
                width={width}
                height={height}
                numberOfPieces={width < 720 ? 160 : 360}
                recycle
                gravity={0.16}
                wind={0.01}
                colors={["#ff4f9a", "#ffb7ce", "#ffd166", "#69dbb5", "#8ec5ff"]}
              />
            )}
            <motion.div
              className="celebration-card"
              initial={{ scale: 0.74, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 210, damping: 15 }}
            >
              <h2 className="celebration-title" aria-label="Oley, dukkalama başlıyor">
                {"OLEY!!!".split("").map((letter, index) => (
                  <span key={`${letter}-${index}`}>{letter}</span>
                ))}
                <span aria-hidden="true">🎉</span>
                <span aria-hidden="true">💖</span>
              </h2>
              <p>Şimdi dukkalamaya geliyorum!</p>
              <button className="replay-button" type="button" onClick={fireSideCannons}>
                Bir tur daha patlat
                <span aria-hidden="true">✦</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
