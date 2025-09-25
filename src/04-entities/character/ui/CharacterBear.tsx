import characterGom from "@shared/assets/images/character/character-gom-blue.png";
import { motion } from "framer-motion";

export function CharacterBear() {
  return (
    <div className="relative z-10 flex justify-center">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-[-6%] -z-10 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(59,130,246,0.48), rgba(59,130,246,0.22) 52%, rgba(59,130,246,0) 70%)",
          filter: "blur(22px)",
        }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 rounded-full"
        style={{
          bottom: 40,
          width: "100%",
          maxWidth: 360,
          height: 24,
          background:
            "radial-gradient(50% 60% at 50% 50%, rgba(173, 216, 230, 0.6), rgba(255,255,255,0.35) 60%, rgba(255,255,255,0) 100%)",
          opacity: 1,
        }}
      />
      <img
        src={characterGom}
        alt="메멘토 캐릭터 토리"
        className="z-30 mx-auto block h-auto w-full max-w-[300px]"
      />
    </div>
  );
}
