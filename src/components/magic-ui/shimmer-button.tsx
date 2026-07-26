"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 渲染为单一子元素（如 <Link>），而非 <button> */
  asChild?: boolean;
  /** 扫光颜色 */
  shimmerColor?: string;
  /** 单次扫光周期 */
  shimmerDuration?: string;
  /** 圆角 */
  borderRadius?: string;
  /** 按钮底色（默认用站点品牌蓝 var(--accent)） */
  background?: string;
}

/**
 * Magic UI 风格 ShimmerButton —— 一道扫过按钮的高光。
 * 扫光用 ::before 伪元素实现，组件只保留单一子节点，
 * 这样 asChild 模式（包 <Link>）能被 Radix Slot 正确合并。
 */
const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      asChild = false,
      className,
      children,
      shimmerColor = "#ffffff",
      shimmerDuration = "2.5s",
      borderRadius = "999px",
      background = "var(--accent)",
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "sb-shimmer-btn relative z-0 inline-flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/15 px-7 py-3 text-base font-semibold text-white transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]",
          className
        )}
        style={
          {
            "--sb-shimmer-color": shimmerColor,
            "--sb-shimmer-duration": shimmerDuration,
            "--sb-radius": borderRadius,
            background,
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
ShimmerButton.displayName = "ShimmerButton";

export { ShimmerButton };
