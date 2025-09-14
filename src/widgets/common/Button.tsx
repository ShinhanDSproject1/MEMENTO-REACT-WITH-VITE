import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import React from "react";
import { twMerge } from "tailwind-merge";

// cva를 사용하여 variant와 size를 체계적으로 관리
const buttonVariants = cva(
  "max-w-[360px] rounded-[10px] font-semibold flex justify-center items-center whitespace-pre-wrap",
  {
    variants: {
      variant: {
        primary: "bg-[#005EF9] text-white hover:bg-[#004BC7]",
        danger: "bg-[#DF001F] text-white hover:bg-[#AD0017]",
        cancelGray: "bg-[#C6C8D5] text-white hover:bg-[#A7AABE]",
        light: "bg-[#F0F4FA] text-[#334054] hover:bg-[#C9D8ED]",
        refund: "bg-[#0C7CA9] text-white hover:bg-[#085877]",
        lightBlue: "bg-[#94ABFA] text-white hover:bg-[#6386F8]",
        cancelWhite:
          "bg-white text-black border-solid border-[1px] border-[#E6E7EA] shadow-xs shadow-(color: rgba(5,32,81,0.05)) hover:shadow-sm hover:border-gray-400 hover:bg-gray-50",
      },
      size: {
        xs: "h-[20px] px-2 text-xs",
        sm: "h-[28px] px-3 text-sm",
        md: "h-[36px] px-4 text-sm",
        lg: "h-[40px] px-5 text-base",
        xl: "h-[44px] px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  className?: string;
  actionType?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant,
  size,
  onClick,
  actionType,
  ...props
}) => {
  const finalClassName = twMerge(clsx(buttonVariants({ variant, size }), className));

  return (
    <button className={finalClassName} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Button;
