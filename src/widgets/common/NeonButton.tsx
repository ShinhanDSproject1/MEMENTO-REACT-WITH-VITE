import clsx from "clsx";
import React, { useId, useMemo } from "react";

type NeonButtonProps = {
  as?: "button" | "a";
  href?: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;

  /** 라인 기본색 */
  accentColor?: string; // 기본: #005EF9
  /** 라인 호버색 */
  accentHoverColor?: string; // 기본: #00BBA8
  /** 배경 기본색 */
  bgColor?: string; // 기본: #7D98E4
  /** 배경 호버색 */
  bgHoverColor?: string; // 기본: accentHoverColor
  /** 전체 hue 회전(선택) */
  hueRotate?: number;
};

export default function NeonButton({
  as = "button",
  href,
  children = "채팅하기",
  className,
  onClick,
  ariaLabel,
  target,
  rel,
  accentColor = "#005EF9",
  accentHoverColor = "#00BBA8",
  bgColor = "#7D98E4",
  bgHoverColor,
  hueRotate = 0,
}: NeonButtonProps) {
  const rid = useId().replace(/[:]/g, "");
  const scope = useMemo(() => `neon-${rid}`, [rid]);
  const Comp: any = as;

  const styleCSS = useMemo(
    () => `
.${scope}-btn {
  position: relative;
  display: inline-block;
  overflow: hidden;
  text-transform: uppercase;
  padding: 0.3rem 0.7rem;
  transition: background .2s ease, color .2s ease;
  background: var(--bg);
}
.${scope}-btn:hover {
  background: var(--bg-hover);
}

/* 라인 컨테이너: currentColor를 라인 색으로 사용 */
.${scope}-lines {
  position: absolute; inset: 0;
  color: var(--accent);
  transition: color .2s ease;
  pointer-events: none;
}
.${scope}-btn:hover .${scope}-lines {
  color: var(--accent-hover);
}

.${scope}-span { position: absolute; display: block; content: ""; }

/* top */
.${scope}-top {
  left: 0; top: 0; height: 2px; width: 100%;
  background: linear-gradient(90deg, transparent, currentColor);
  animation: ${scope}-animate-1 1s linear infinite;
}
/* right */
.${scope}-right {
  right: 0; top: -100%; width: 2px; height: 100%;
  background: linear-gradient(180deg, transparent, currentColor);
  animation: ${scope}-animate-2 1s linear infinite;
  animation-delay: .25s;
}
/* bottom */
.${scope}-bottom {
  right: 0; bottom: 0; height: 2px; width: 100%;
  background: linear-gradient(270deg, transparent, currentColor);
  animation: ${scope}-animate-3 1s linear infinite;
  animation-delay: .5s;
}
/* left */
.${scope}-left {
  left: 0; bottom: -100%; width: 2px; height: 100%;
  background: linear-gradient(360deg, transparent, currentColor);
  animation: ${scope}-animate-4 1s linear infinite;
  animation-delay: .75s;
}

/* keyframes */
@keyframes ${scope}-animate-1 {
  0% { left: -100%; }
  50%, 100% { left: 100%; }
}
@keyframes ${scope}-animate-2 {
  0% { top: -100%; }
  50%, 100% { top: 100%; }
}
@keyframes ${scope}-animate-3 {
  0% { right: -100%; }
  50%, 100% { right: 100%; }
}
@keyframes ${scope}-animate-4 {
  0% { bottom: -100%; }
  50%, 100% { bottom: 100%; }
}
`,
    [scope],
  );

  return (
    <>
      <style>{styleCSS}</style>
      <Comp
        {...(as === "a" ? { href, target, rel } : { type: "button" })}
        onClick={onClick}
        aria-label={ariaLabel || (typeof children === "string" ? children : "button")}
        {...(as === "a" && !href ? { role: "button", tabIndex: 0 } : {})}
        className={clsx(
          `${scope}-btn`,
          "relative inline-block overflow-hidden px-6 py-3 font-bold text-white",
          className,
        )}
        style={{
          // 인라인에는 변수만 세팅 → hover가 자유롭게 override 가능
          ["--bg" as any]: bgColor,
          ["--bg-hover" as any]: bgHoverColor ?? accentHoverColor,
          ["--accent" as any]: accentColor,
          ["--accent-hover" as any]: accentHoverColor,
          filter: hueRotate ? `hue-rotate(${hueRotate}deg)` : undefined,
        }}>
        {/* 라인들은 별도 컨테이너로 묶고 currentColor 사용 */}
        <span className={`${scope}-lines`} aria-hidden>
          <span className={`${scope}-span ${scope}-top`} />
          <span className={`${scope}-span ${scope}-right`} />
          <span className={`${scope}-span ${scope}-bottom`} />
          <span className={`${scope}-span ${scope}-left`} />
        </span>

        {/* 텍스트는 라인 위에 안전하게 */}
        <span className="relative z-10">{children}</span>
      </Comp>
    </>
  );
}
