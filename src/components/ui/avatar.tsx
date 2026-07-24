"use client";

import { useState } from "react";
import Link from "next/link";
import profile from "@/data/profile";

interface AvatarProps {
  /** 头像图片地址，缺省使用 profile.avatar */
  src?: string;
  /** 用于回退字母与 alt，缺省使用 profile.name */
  name?: string;
  /** 像素尺寸（正方形），缺省 160 */
  size?: number;
  /** 额外的 className（作用于外层容器） */
  className?: string;
  /** 是否用链接包裹，点击回首页 */
  link?: boolean;
  /** 是否优先加载（eager） */
  priority?: boolean;
}

/**
 * 头像组件：优先展示图片，加载失败（或缺失）时回退为首字母 monogram。
 * 模块化、可复用：首页、简历页、互动版、页脚均可使用。
 */
export function Avatar({
  src = profile.avatar,
  name = profile.name,
  size = 160,
  className = "",
  link = false,
  priority = false,
}: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const showImage = Boolean(src) && !errored;
  const monogram = (name.trim().charAt(0) || "?").toUpperCase();

  const inner = (
    <span
      className={`relative inline-flex items-center justify-center overflow-hidden bg-[var(--bg-muted)] text-[var(--accent)] select-none ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: 9999,
        fontFamily: "var(--font-display)",
        fontSize: Math.round(size * 0.42),
        lineHeight: 1,
      }}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setErrored(true)}
          loading={priority ? "eager" : "lazy"}
        />
      ) : (
        <span aria-hidden>{monogram}</span>
      )}
    </span>
  );

  if (link) {
    return (
      <Link
        href="/"
        aria-label={`${name} 的主页`}
        className="inline-flex transition-transform duration-300 hover:scale-[1.03] cursor-pointer"
      >
        {inner}
      </Link>
    );
  }

  return inner;
}
