import mementoLogo from "@shared/assets/images/logo/memento-logo.svg";
import { CENTRAL_SCALE, MOVE_MS } from "@shared/config/splash";
import { motion } from "framer-motion";

export function LogoMover({
  prefersReducedMotion,
  boxDone,
}: {
  prefersReducedMotion: boolean;
  boxDone: boolean;
}) {
  if (prefersReducedMotion) return null;

  return (
    <div className="fixed z-40" style={{ left: "6vw", top: "3vh" }}>
      <motion.div
        initial={{ x: "44vw", y: "47vh", scale: CENTRAL_SCALE, opacity: 1 }}
        animate={{
          x: boxDone ? 0 : "44vw",
          y: boxDone ? 0 : "47vh",
          scale: boxDone ? 1 : CENTRAL_SCALE,
          opacity: 1,
        }}
        transition={{ duration: boxDone ? MOVE_MS / 1000 : 0, ease: [0.22, 1, 0.36, 1] }}>
        <img
          src={mementoLogo}
          alt="memento logo intro"
          className="h-auto w-[110px] sm:w-[150px] md:w-[180px]"
        />
      </motion.div>
    </div>
  );
}
