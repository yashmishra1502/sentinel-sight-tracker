import { Loader2, TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { StreamType } from "@/lib/sentinel/types";
import { cn } from "@/lib/utils";

/**
 * Real camera feed player. Handles the stream formats government NVRs and
 * gateways typically expose:
 *  - hls    → .m3u8 via hls.js (native on Safari/iOS)
 *  - mp4    → progressive/looping archive file
 *  - mjpeg  → snapshot/motion-JPEG endpoint rendered as an <img>
 *  - webrtc → played as-is when the URL is a direct playable source
 */
export function StreamPlayer({
  url,
  type,
  label,
  className,
}: {
  url: string;
  type: StreamType;
  label?: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [state, setState] = useState<"loading" | "playing" | "error">("loading");

  useEffect(() => {
    if (type === "mjpeg") return;
    const video = videoRef.current;
    if (!video) return;

    setState("loading");
    let destroy: (() => void) | undefined;
    let cancelled = false;

    const isHls = type === "hls" || url.includes(".m3u8");

    const attach = async () => {
      if (isHls && !video.canPlayType("application/vnd.apple.mpegurl")) {
        const { default: Hls } = await import("hls.js");
        if (cancelled) return;
        if (!Hls.isSupported()) {
          setState("error");
          return;
        }
        const hls = new Hls({ lowLatencyMode: true });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) setState("error");
        });
        destroy = () => hls.destroy();
      } else {
        video.src = url;
      }
      void video.play().catch(() => undefined);
    };

    void attach();

    return () => {
      cancelled = true;
      destroy?.();
      video.removeAttribute("src");
      video.load();
    };
  }, [url, type]);

  if (type === "mjpeg") {
    return (
      <div className={cn("relative h-full w-full overflow-hidden bg-navy", className)}>
        <img
          src={url}
          alt={label ? `Live feed from ${label}` : "Live camera feed"}
          className="h-full w-full object-cover"
          onError={() => setState("error")}
          onLoad={() => setState("playing")}
        />
        {state === "error" ? <StreamError /> : null}
      </div>
    );
  }

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-navy", className)}>
      <video
        ref={videoRef}
        muted
        playsInline
        autoPlay
        loop
        controls={false}
        aria-label={label ? `Live feed from ${label}` : "Live camera feed"}
        className="h-full w-full object-cover"
        onPlaying={() => setState("playing")}
        onError={() => setState("error")}
      />
      {state === "loading" ? (
        <div className="absolute inset-0 grid place-items-center bg-navy/70 text-navy-foreground/70">
          <Loader2 className="size-6 animate-spin" aria-hidden />
        </div>
      ) : null}
      {state === "error" ? <StreamError /> : null}
    </div>
  );
}

function StreamError() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-navy/80 px-4 text-center">
      <div className="flex flex-col items-center gap-1.5 text-critical">
        <TriangleAlert className="size-6" aria-hidden />
        <span className="text-xs font-semibold">Stream unreachable · check gateway URL</span>
      </div>
    </div>
  );
}
