import { IS_MOBILE } from "@/shared/lib/motionConfig";
import { DEFAULT_FAIRY_LIGHTS } from "@/features/home/homeData";

export function FairyLights({
  lights,
}: {
  lights: typeof DEFAULT_FAIRY_LIGHTS;
}) {
  // skip on mobile - drops animated glow overhead
  if (IS_MOBILE) return null;
  const displayLights = lights;

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {displayLights.map((light, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: light.left,
            top: light.top,
            width: light.size,
            height: light.size,
            backgroundColor: light.color,
            animation: `home-fairy-light ${light.dur}s ease-in-out ${light.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
