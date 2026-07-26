"use client";

import { useState } from "react";
import { FloatingLines } from "@/components/reactbits/floating-lines";
import { SideRays } from "@/components/reactbits/side-rays";
import { LightRays } from "@/components/reactbits/light-rays";

type TabKey = "floating-lines" | "side-rays" | "light-rays";
type WaveKey = "top" | "middle" | "bottom";
type SideOrigin = "top-right" | "top-left" | "bottom-right" | "bottom-left";
type LightOrigin = "top-center" | "top-left" | "top-right" | "right" | "left" | "bottom-center" | "bottom-right" | "bottom-left";

const TABS: { key: TabKey; label: string; desc: string }[] = [
  { key: "floating-lines", label: "Floating Lines", desc: "WebGL 波纹线条 · three.js" },
  { key: "side-rays", label: "Side Rays", desc: "侧边光束 · OGL" },
  { key: "light-rays", label: "Light Rays", desc: "射线光柱 · OGL" },
];

export default function DemoPage() {
  const [tab, setTab] = useState<TabKey>("floating-lines");

  /* ── FloatingLines state ── */
  const [flCount, setFlCount] = useState(8);
  const [flDistance, setFlDistance] = useState(8);
  const [flSpeed, setFlSpeed] = useState(0.8);
  const [flInteractive, setFlInteractive] = useState(true);
  const [flBendRadius, setFlBendRadius] = useState(8);
  const [flBendStrength, setFlBendStrength] = useState(-2);
  const [flWaves, setFlWaves] = useState<WaveKey[]>(["top", "middle", "bottom"]);
  const [flColors, setFlColors] = useState(["#6b8cff", "#7c5cff", "#ff6b8c"]);

  /* ── SideRays state ── */
  const [srSpeed, setSrSpeed] = useState(2.5);
  const [srColor1, setSrColor1] = useState("#EAB308");
  const [srColor2, setSrColor2] = useState("#96c8ff");
  const [srIntensity, setSrIntensity] = useState(2);
  const [srSpread, setSrSpread] = useState(2);
  const [srOrigin, setSrOrigin] = useState<SideOrigin>("top-right");
  const [srTilt, setSrTilt] = useState(0);
  const [srBlend, setSrBlend] = useState(0.75);
  const [srFalloff, setSrFalloff] = useState(2);
  const [srOpacity, setSrOpacity] = useState(1);

  /* ── LightRays state ── */
  const [lrOrigin, setLrOrigin] = useState<LightOrigin>("top-center");
  const [lrColor, setLrColor] = useState("#ffffff");
  const [lrSpeed, setLrSpeed] = useState(1);
  const [lrSpread, setLrSpread] = useState(1);
  const [lrLength, setLrLength] = useState(2);
  const [lrPulsating, setLrPulsating] = useState(false);
  const [lrFollowMouse, setLrFollowMouse] = useState(true);
  const [lrMouseInfluence, setLrMouseInfluence] = useState(0.1);
  const [lrNoise, setLrNoise] = useState(0);
  const [lrDistortion, setLrDistortion] = useState(0);

  const toggleFlWave = (w: WaveKey) =>
    setFlWaves((p) => (p.includes(w) ? p.filter((x) => x !== w) : [...p, w]));

  return (
    <div className="relative min-h-screen bg-[#06060e] text-white overflow-hidden">
      {/* ── 全屏背景 ── */}
      <div className="fixed inset-0 z-0">
        {tab === "floating-lines" && (
          <FloatingLines
            linesGradient={flColors}
            enabledWaves={flWaves}
            lineCount={flCount}
            lineDistance={flDistance}
            animationSpeed={flSpeed}
            interactive={flInteractive}
            bendRadius={flBendRadius}
            bendStrength={flBendStrength}
          />
        )}
        {tab === "side-rays" && (
          <SideRays
            speed={srSpeed}
            rayColor1={srColor1}
            rayColor2={srColor2}
            intensity={srIntensity}
            spread={srSpread}
            origin={srOrigin}
            tilt={srTilt}
            blend={srBlend}
            falloff={srFalloff}
            opacity={srOpacity}
          />
        )}
        {tab === "light-rays" && (
          <LightRays
            raysOrigin={lrOrigin}
            raysColor={lrColor}
            raysSpeed={lrSpeed}
            lightSpread={lrSpread}
            rayLength={lrLength}
            pulsating={lrPulsating}
            followMouse={lrFollowMouse}
            mouseInfluence={lrMouseInfluence}
            noiseAmount={lrNoise}
            distortion={lrDistortion}
          />
        )}
      </div>

      {/* ── 内容层 (pointer-events-none 让鼠标事件穿透到背景 canvas) ── */}
      <div className="relative z-10 flex flex-col min-h-screen pointer-events-none">
        {/* 顶部：Tab 切换 */}
        <header className="px-4 pt-5 pb-3 pointer-events-auto">
          <div className="max-w-4xl mx-auto flex items-center gap-2">
            <span className="text-sm font-bold tracking-wide opacity-60 mr-2">ReactBits</span>
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`text-xs px-4 py-2 rounded-lg border transition-all ${
                  tab === t.key
                    ? "border-white/20 bg-white/10 text-white shadow-sm"
                    : "border-white/5 text-white/35 hover:text-white/60 hover:border-white/10"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </header>

        {/* 中心标题 */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-2xl">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-3">
              {tab === "floating-lines" && (
                <span className="bg-gradient-to-r from-[#6b8cff] via-[#7c5cff] to-[#ff6b8c] bg-clip-text text-transparent">
                  Floating Lines
                </span>
              )}
              {tab === "side-rays" && (
                <span className="bg-gradient-to-r from-[#EAB308] via-[#f0d060] to-[#96c8ff] bg-clip-text text-transparent">
                  Side Rays
                </span>
              )}
              {tab === "light-rays" && (
                <span className="bg-gradient-to-r from-white via-white/80 to-white/50 bg-clip-text text-transparent">
                  Light Rays
                </span>
              )}
            </h1>
            <p className="text-white/40 text-base leading-relaxed mb-6">
              {TABS.find((t) => t.key === tab)?.desc}
            </p>
            <div className="flex gap-2 justify-center flex-wrap">
              {tab === "floating-lines" && (
                <>
                  <Tag>three.js</Tag><Tag>GLSL Shader</Tag><Tag>Mouse Bend</Tag><Tag>Parallax</Tag>
                </>
              )}
              {tab === "side-rays" && (
                <>
                  <Tag>OGL</Tag><Tag>Dual Beam</Tag><Tag>Origin Control</Tag><Tag>Tilt</Tag>
                </>
              )}
              {tab === "light-rays" && (
                <>
                  <Tag>OGL</Tag><Tag>8 Origins</Tag><Tag>Mouse Follow</Tag><Tag>Distortion</Tag>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 底部控制面板 */}
        <div className="px-4 pb-6 pointer-events-auto">
          <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-xl border border-white/[.08] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Controls</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            {/* ── FloatingLines controls ── */}
            {tab === "floating-lines" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                <Slider label="Line Count" value={flCount} min={1} max={20} step={1} onChange={setFlCount} />
                <Slider label="Line Distance" value={flDistance} min={1} max={20} step={0.5} onChange={setFlDistance} />
                <Slider label="Speed" value={flSpeed} min={0.1} max={3} step={0.1} onChange={setFlSpeed} />
                <Slider label="Bend Radius" value={flBendRadius} min={1} max={30} step={0.5} onChange={setFlBendRadius} />
                <Slider label="Bend Strength" value={flBendStrength} min={-15} max={15} step={0.5} onChange={setFlBendStrength} />

                <div className="space-y-2">
                  <div className="text-xs text-white/40">Waves</div>
                  <div className="flex gap-2">
                    {(["top", "middle", "bottom"] as WaveKey[]).map((w) => (
                      <button key={w} onClick={() => toggleFlWave(w)}
                        className={`text-xs px-3 py-1.5 rounded-md border transition-all ${
                          flWaves.includes(w)
                            ? "border-[#6b8cff]/50 bg-[#6b8cff]/10 text-white/80"
                            : "border-white/10 text-white/25"
                        }`}>
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-white/40">Mouse</div>
                  <button onClick={() => setFlInteractive(!flInteractive)}
                    className={`text-xs px-4 py-1.5 rounded-md border transition-all ${
                      flInteractive
                        ? "border-green-500/50 bg-green-500/10 text-green-300"
                        : "border-white/10 text-white/25"
                    }`}>
                    {flInteractive ? "Interactive ON" : "Interactive OFF"}
                  </button>
                </div>

                <ColorPickers colors={flColors} onChange={setFlColors} />
              </div>
            )}

            {/* ── SideRays controls ── */}
            {tab === "side-rays" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                <Slider label="Speed" value={srSpeed} min={0.1} max={8} step={0.1} onChange={setSrSpeed} />
                <Slider label="Intensity" value={srIntensity} min={0.1} max={5} step={0.1} onChange={setSrIntensity} />
                <Slider label="Spread" value={srSpread} min={0.5} max={6} step={0.1} onChange={setSrSpread} />
                <Slider label="Tilt" value={srTilt} min={-45} max={45} step={1} onChange={setSrTilt} />
                <Slider label="Blend" value={srBlend} min={0} max={1} step={0.05} onChange={setSrBlend} />
                <Slider label="Falloff" value={srFalloff} min={0.5} max={5} step={0.1} onChange={setSrFalloff} />
                <Slider label="Opacity" value={srOpacity} min={0} max={1} step={0.05} onChange={setSrOpacity} />

                <div className="space-y-2">
                  <div className="text-xs text-white/40">Origin</div>
                  <div className="flex gap-1.5 flex-wrap">
                    {(["top-right", "top-left", "bottom-right", "bottom-left"] as SideOrigin[]).map((o) => (
                      <button key={o} onClick={() => setSrOrigin(o)}
                        className={`text-[10px] px-2.5 py-1 rounded border transition-all ${
                          srOrigin === o
                            ? "border-[#EAB308]/50 bg-[#EAB308]/10 text-white/80"
                            : "border-white/10 text-white/25"
                        }`}>
                        {o}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-white/40">Colors</div>
                  <div className="flex gap-2">
                    <ColorDot color={srColor1} onChange={setSrColor1} />
                    <ColorDot color={srColor2} onChange={setSrColor2} />
                  </div>
                </div>
              </div>
            )}

            {/* ── LightRays controls ── */}
            {tab === "light-rays" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                <Slider label="Speed" value={lrSpeed} min={0.1} max={5} step={0.1} onChange={setLrSpeed} />
                <Slider label="Spread" value={lrSpread} min={0.1} max={3} step={0.1} onChange={setLrSpread} />
                <Slider label="Ray Length" value={lrLength} min={0.5} max={5} step={0.1} onChange={setLrLength} />
                <Slider label="Mouse Influence" value={lrMouseInfluence} min={0} max={1} step={0.05} onChange={setLrMouseInfluence} />
                <Slider label="Noise" value={lrNoise} min={0} max={1} step={0.05} onChange={setLrNoise} />
                <Slider label="Distortion" value={lrDistortion} min={0} max={2} step={0.05} onChange={setLrDistortion} />

                <Toggle label="Pulsating" value={lrPulsating} onChange={setLrPulsating} />
                <Toggle label="Follow Mouse" value={lrFollowMouse} onChange={setLrFollowMouse} />

                <div className="space-y-2">
                  <div className="text-xs text-white/40">Origin</div>
                  <div className="flex gap-1.5 flex-wrap">
                    {(["top-center", "top-left", "top-right", "left", "right", "bottom-center", "bottom-left", "bottom-right"] as LightOrigin[]).map((o) => (
                      <button key={o} onClick={() => setLrOrigin(o)}
                        className={`text-[10px] px-2 py-1 rounded border transition-all ${
                          lrOrigin === o
                            ? "border-white/40 bg-white/10 text-white/80"
                            : "border-white/10 text-white/25"
                        }`}>
                        {o}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-white/40">Color</div>
                  <ColorDot color={lrColor} onChange={setLrColor} />
                </div>
              </div>
            )}

            {/* 用法提示 */}
            <div className="mt-4 pt-3 border-t border-white/5">
              <p className="text-[10px] font-mono text-white/20 leading-relaxed">
                {tab === "floating-lines" && (
                  <>
                    {`import { FloatingLines } from "@/components/reactbits/floating-lines";`}
                    <br />
                    {`<FloatingLines linesGradient={${JSON.stringify(flColors)}} lineCount={${flCount}} animationSpeed={${flSpeed}} />`}
                  </>
                )}
                {tab === "side-rays" && (
                  <>
                    {`import { SideRays } from "@/components/reactbits/side-rays";`}
                    <br />
                    {`<SideRays rayColor1="${srColor1}" rayColor2="${srColor2}" intensity={${srIntensity}} origin="${srOrigin}" />`}
                  </>
                )}
                {tab === "light-rays" && (
                  <>
                    {`import { LightRays } from "@/components/reactbits/light-rays";`}
                    <br />
                    {`<LightRays raysOrigin="${lrOrigin}" raysColor="${lrColor}" raysSpeed={${lrSpeed}} followMouse={${lrFollowMouse}} />`}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ───────────────────────────── */

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-mono px-3 py-1.5 border border-white/10 rounded-full text-white/40 bg-white/5 backdrop-blur">
      {children}
    </span>
  );
}

function Slider({
  label, value, min, max, step, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <span className="text-xs text-white/40">{label}</span>
        <span className="text-xs font-mono text-white/60">
          {Number.isInteger(step) ? value : value.toFixed(step < 0.1 ? 2 : 1)}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 rounded-full appearance-none cursor-pointer bg-white/10
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#6b8cff]
          [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(107,140,255,0.5)]
          [&::-webkit-slider-thumb]:cursor-pointer"
      />
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="space-y-2">
      <div className="text-xs text-white/40">{label}</div>
      <button onClick={() => onChange(!value)}
        className={`text-xs px-4 py-1.5 rounded-md border transition-all ${
          value
            ? "border-green-500/50 bg-green-500/10 text-green-300"
            : "border-white/10 text-white/25"
        }`}>
        {value ? "ON" : "OFF"}
      </button>
    </div>
  );
}

function ColorDot({ color, onChange }: { color: string; onChange: (c: string) => void }) {
  return (
    <label className="relative cursor-pointer">
      <div className="w-8 h-8 rounded-lg border border-white/10" style={{ background: color }} />
      <input type="color" value={color} onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
    </label>
  );
}

function ColorPickers({ colors, onChange }: { colors: string[]; onChange: (c: string[]) => void }) {
  return (
    <div className="space-y-2">
      <div className="text-xs text-white/40">Gradient</div>
      <div className="flex gap-2">
        {colors.map((c, i) => (
          <label key={i} className="relative cursor-pointer">
            <div className="w-8 h-8 rounded-lg border border-white/10" style={{ background: c }} />
            <input type="color" value={c}
              onChange={(e) => {
                const next = [...colors];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
          </label>
        ))}
      </div>
    </div>
  );
}
