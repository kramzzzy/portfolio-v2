import { useEffect, useRef, useState } from 'react'

interface EntranceLoaderProps {
  loadedFrames: number
  totalFrames: number
  onComplete?: () => void
}

const PAGE_IMAGES = [
  '/images/icons/Logo.svg',
  '/images/icons/site.svg',
  '/images/profile-about.png',
  '/images/credentials.webp',
  '/images/jblee-preview.png',
  '/images/keynest-preview.png',
  '/images/elite-assistant.webp',
  '/images/Portfolio.jpg',
]

const VIDEO_W = 592
const VIDEO_H = 686

const VERT_SRC = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  v_uv.y = 1.0 - v_uv.y;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

const FRAG_SRC = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_tex;
void main() {
  vec4 c = texture2D(u_tex, v_uv);
  float luma = max(c.r, max(c.g, c.b));
  if (luma <= 0.062) {
    gl_FragColor = vec4(0.0);
    return;
  }
  float alpha = clamp((luma - 0.062) * 2.4, 0.0, 1.0);
  vec3 rgb = min(vec3(1.0), c.rgb * vec3(1.15, 1.15, 1.22));
  gl_FragColor = vec4(rgb * alpha, alpha);
}
`

export default function EntranceLoader({
  loadedFrames,
  totalFrames,
  onComplete,
}: EntranceLoaderProps) {
  const [percent, setPercent] = useState(0)
  const [loadedAssets, setLoadedAssets] = useState(0)
  const [totalAssets, setTotalAssets] = useState(totalFrames + PAGE_IMAGES.length + 2)
  const [exiting, setExiting] = useState(false)
  const [unmounted, setUnmounted] = useState(false)
  const [loadedImages, setLoadedImages] = useState(0)
  const [fontsReady, setFontsReady] = useState(false)
  const [windowReady, setWindowReady] = useState(
    typeof document !== 'undefined' && document.readyState === 'complete'
  )

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const stateRef = useRef({
    loadedFrames: 0,
    totalFrames,
    loadedImages: 0,
    fontsReady: false,
    windowReady: typeof document !== 'undefined' && document.readyState === 'complete',
    displayed: 0,
    doneTriggered: false,
  })

  useEffect(() => {
    stateRef.current.loadedFrames = loadedFrames
    stateRef.current.totalFrames = totalFrames
    stateRef.current.loadedImages = loadedImages
    stateRef.current.fontsReady = fontsReady
    stateRef.current.windowReady = windowReady
  }, [loadedFrames, totalFrames, loadedImages, fontsReady, windowReady])

  // Lock page scroll while the entrance loader is active
  useEffect(() => {
    if (unmounted) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.scrollTo(0, 0)
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [unmounted])

  // Track real portfolio images + web fonts + window load completion
  useEffect(() => {
    let cancelled = false

    PAGE_IMAGES.forEach((src) => {
      const img = new Image()
      img.decoding = 'async'
      const markDone = () => {
        if (!cancelled) {
          setLoadedImages((prev) => prev + 1)
        }
      }
      img.onload = () => {
        if (typeof img.decode === 'function') {
          img.decode().then(markDone).catch(markDone)
        } else {
          markDone()
        }
      }
      img.onerror = markDone
      img.src = src
    })

    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready
        .then(() => {
          if (!cancelled) setFontsReady(true)
        })
        .catch(() => {
          if (!cancelled) setFontsReady(true)
        })
    } else {
      setFontsReady(true)
    }

    const onWindowLoad = () => {
      if (!cancelled) setWindowReady(true)
    }
    if (typeof document !== 'undefined' && document.readyState === 'complete') {
      setWindowReady(true)
    } else if (typeof window !== 'undefined') {
      window.addEventListener('load', onWindowLoad, { once: true })
    }

    return () => {
      cancelled = true
      if (typeof window !== 'undefined') {
        window.removeEventListener('load', onWindowLoad)
      }
    }
  }, [])

  // GPU-accelerated WebGL luma-key renderer (zero CPU getImageData overhead on phones & laptops)
  useEffect(() => {
    if (unmounted) return
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    video.play().catch(() => undefined)

    const gl =
      (canvas.getContext('webgl', {
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        powerPreference: 'low-power',
      }) as WebGLRenderingContext | null) || null

    let rafId = 0

    if (gl) {
      const compile = (type: number, src: string) => {
        const s = gl.createShader(type)
        if (!s) return null
        gl.shaderSource(s, src)
        gl.compileShader(s)
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
          gl.deleteShader(s)
          return null
        }
        return s
      }

      const vs = compile(gl.VERTEX_SHADER, VERT_SRC)
      const fs = compile(gl.FRAGMENT_SHADER, FRAG_SRC)
      const prog = gl.createProgram()

      if (vs && fs && prog) {
        gl.attachShader(prog, vs)
        gl.attachShader(prog, fs)
        gl.linkProgram(prog)
        gl.useProgram(prog)

        const buf = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buf)
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
          gl.STATIC_DRAW
        )

        const posLoc = gl.getAttribLocation(prog, 'a_pos')
        gl.enableVertexAttribArray(posLoc)
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

        const tex = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, tex)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

        gl.viewport(0, 0, VIDEO_W, VIDEO_H)

        const renderGL = () => {
          if (video.readyState >= 2 && !video.paused && !video.ended) {
            gl.clearColor(0, 0, 0, 0)
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.bindTexture(gl.TEXTURE_2D, tex)
            gl.texImage2D(
              gl.TEXTURE_2D,
              0,
              gl.RGBA,
              gl.RGBA,
              gl.UNSIGNED_BYTE,
              video
            )
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
          }
          rafId = requestAnimationFrame(renderGL)
        }

        rafId = requestAnimationFrame(renderGL)
        return () => {
          cancelAnimationFrame(rafId)
          if (!gl.isContextLost()) {
            gl.deleteTexture(tex)
            gl.deleteBuffer(buf)
            gl.deleteProgram(prog)
            gl.deleteShader(vs)
            gl.deleteShader(fs)
          }
        }
      }
    }

    // 2D fallback only if WebGL is unavailable
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    const render2D = () => {
      if (video.readyState >= 2 && !video.paused && !video.ended) {
        ctx.clearRect(0, 0, VIDEO_W, VIDEO_H)
        ctx.drawImage(video, 0, 0, VIDEO_W, VIDEO_H)
        const frame = ctx.getImageData(0, 0, VIDEO_W, VIDEO_H)
        const data = frame.data
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          const luma = r > g ? (r > b ? r : b) : g > b ? g : b
          data[i + 3] = luma <= 16 ? 0 : Math.min(255, (luma - 16) * 2.4)
        }
        ctx.putImageData(frame, 0, 0)
      }
      rafId = requestAnimationFrame(render2D)
    }

    rafId = requestAnimationFrame(render2D)
    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [unmounted])

  // 100% Real Asset Synchronization Loop (no fake timeouts)
  useEffect(() => {
    let rafId = 0
    let exitTimer: number | undefined
    let unmountTimer: number | undefined

    const tick = () => {
      const s = stateRef.current
      const total = Math.max(1, s.totalFrames + PAGE_IMAGES.length + 2)
      const done =
        Math.min(s.loadedFrames, s.totalFrames) +
        s.loadedImages +
        (s.fontsReady ? 1 : 0) +
        (s.windowReady ? 1 : 0)

      const truePercent = (done / total) * 100
      const allAssetsLoaded = done >= total

      // Smoothly approach the real asset percentage without ever exceeding it
      const step = allAssetsLoaded ? 0.25 : 0.18
      s.displayed += (truePercent - s.displayed) * step

      if (allAssetsLoaded && s.displayed >= 99.2) {
        s.displayed = 100
      }

      const rounded = Math.min(
        allAssetsLoaded ? 100 : 99,
        Math.floor(s.displayed + 0.05)
      )

      setPercent((prev) => (prev !== rounded ? rounded : prev))
      setLoadedAssets((prev) => (prev !== done ? done : prev))
      setTotalAssets((prev) => (prev !== total ? total : prev))

      if (allAssetsLoaded && s.displayed >= 100 && !s.doneTriggered) {
        s.doneTriggered = true
        exitTimer = window.setTimeout(() => {
          setExiting(true)
          document.body.style.overflow = ''
          onCompleteRef.current?.()
          unmountTimer = window.setTimeout(() => {
            setUnmounted(true)
          }, 600)
        }, 120)
        return
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      if (exitTimer !== undefined) window.clearTimeout(exitTimer)
      if (unmountTimer !== undefined) window.clearTimeout(unmountTimer)
    }
  }, [])

  if (unmounted) return null

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Loading portfolio: ${percent}%`}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-neutral-950 select-none transition-opacity duration-500 ease-out ${
        exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <video
        ref={videoRef}
        src="/videos/loader-globe.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="hidden"
      />

      {/* Centered Rotating Particle Globe (GPU WebGL Alpha Transparency) */}
      <div
        className={`relative flex flex-col items-center transition-transform duration-600 ease-out ${
          exiting ? 'scale-105' : 'scale-100'
        }`}
      >
        <div className="relative w-[240px] sm:w-[300px] md:w-[350px] aspect-[592/686] flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={VIDEO_W}
            height={VIDEO_H}
            className="h-full w-full object-contain pointer-events-none"
          />
        </div>

        {/* Brand Logo + Solid Progress Bar + Real Asset Telemetry */}
        <div className="-mt-4 flex flex-col items-center gap-3.5 px-4">
          <img
            src="/images/icons/Logo.svg"
            alt="KramZ"
            className="h-6 sm:h-7 w-auto object-contain opacity-95"
          />

          <div className="w-52 sm:w-64 space-y-2">
            <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-[#0219EA] transition-[width] duration-75 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em]">
              <span className="text-neutral-400">
                {percent < 100
                  ? `Syncing (${loadedAssets}/${totalAssets})`
                  : 'System Ready'}
              </span>
              <span className="text-[#4f6bff] tabular-nums font-semibold">
                {String(percent).padStart(3, '0')}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
