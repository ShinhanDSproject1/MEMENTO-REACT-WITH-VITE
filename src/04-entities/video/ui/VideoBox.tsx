import bgVideo from "@shared/assets/video/mainVideo3.mp4";
import {
  BORDER_OPACITY,
  BORDER_WIDTH_DESKTOP,
  BORDER_WIDTH_MOBILE,
  BOX_MS,
} from "@shared/config/splash";
import { useIsMobile } from "@shared/lib/useIsMobile";
import { motion } from "framer-motion";

export function VideoBox({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  const isMobile = useIsMobile();
  const borderWidth = isMobile ? BORDER_WIDTH_MOBILE : BORDER_WIDTH_DESKTOP;

  return (
    <motion.div
      className="fixed top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-black/10"
      style={{
        boxShadow: "0 30px 70px rgba(0,0,0,0.25)",
        borderStyle: "solid",
        borderWidth,
        borderColor: `rgba(0,0,0,${BORDER_OPACITY})`,
        WebkitMaskImage: "radial-gradient(white, black)",
      }}
      initial={{ width: "42vw", height: "22vh", borderRadius: 24 }}
      animate={{ width: "100vw", height: "100vh", borderRadius: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : BOX_MS / 1000, ease: [0.2, 0.9, 0.2, 1] }}>
      <video
        aria-hidden
        className="h-full w-full object-cover"
        src={bgVideo}
        autoPlay
        muted
        loop
        playsInline
      />
    </motion.div>
  );
}
