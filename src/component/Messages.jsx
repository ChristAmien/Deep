import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { config, messages } from "../data";

const EASE = [0.22, 1, 0.36, 1];
const GAP = 8; // espace entre deux cartes (px)

/* ──────────────────────────────────────────────────────────
   Dimensions de la scène (px). Tout le "layout" est calculé ici,
   le reste du composant n'est que du style.
   thumbs[d] = taille de la miniature à la distance d de la carte active.
   ────────────────────────────────────────────────────────── */
function getSizes(vw, contentH = 0) {
    // Mobile / tablette : carte empilée (photo au-dessus, texte dessous)
    if (vw < 900) {
        const cardW = Math.min(vw - 72, 440);
        const pad = 6;
        const inner = cardW - pad * 2;
        const textH = Math.max(262, contentH);
        const photoH = Math.max(210, contentH);
        return {
            mobile: true,
            pad,
            textW: inner,
            textH,
            active: { w: inner, h: photoH },
            thumbs: [null, { w: 34, h: 300, pad: 4 }],
            maxD: 1,
            stageH: photoH + textH + pad * 2 + 56,
        };
    }

    // Desktop : carte horizontale (texte à gauche, photo à droite)
    const S = Math.min(1, (vw - 48) / 1044);
    const r = (n) => Math.round(n * S);
    const activeH = Math.max(r(440), contentH);
    const pad = r(8);
    return {
        mobile: false,
        pad,
        textW: r(380),
        active: { w: r(340), h: activeH },
        thumbs: [null, { w: r(70), h: r(270), pad: r(6) }, { w: r(46), h: r(170), pad: r(5) }],
        maxD: 2,
        stageH: activeH + pad * 2 + 56,
    };
}

function useViewportWidth() {
    const [vw, setVw] = useState(() => (typeof window === "undefined" ? 1280 : window.innerWidth));
    useEffect(() => {
        const on = () => setVw(window.innerWidth);
        window.addEventListener("resize", on);
        return () => window.removeEventListener("resize", on);
    }, []);
    return vw;
}

/* ──────────────────────────────────────────────────────────
   Une carte : soit "active" (texte + grande photo),
   soit miniature (photo seule, de plus en plus petite).
   ────────────────────────────────────────────────────────── */
function Item({ m, i, cur, n, sizes, reduce, onSelect, onContentHeight }) {
    const d = Math.abs(i - cur);
    const active = d === 0;
    const t = active ? null : sizes.thumbs[d]; // undefined si trop loin
    const hidden = !active && !t;
    const { mobile } = sizes;

    const pad = active ? sizes.pad : t?.pad ?? 0;
    const photo = active ? sizes.active : t ? { w: t.w, h: t.h } : { w: 0, h: 0 };
    const nextVisible = i < n - 1 && Math.abs(i + 1 - cur) <= sizes.maxD;
    const showConnector = !hidden && nextVisible;

    const tr = reduce ? { duration: 0 } : { duration: 0.8, ease: EASE };
    const textTr = {
        ...tr,
        opacity: {
            duration: reduce ? 0 : active ? 0.45 : 0.15,
            delay: reduce ? 0 : active ? 0.4 : 0,
        },
    };

    const contentRef = useRef(null);
    useEffect(() => {
        if (!active) return;
        const content = contentRef.current;
        if (!content) return;

        const measure = () => onContentHeight(i, content.scrollHeight + 16);
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(content);
        return () => observer.disconnect();
    }, [active, i, m.role, m.author, m.text, mobile, sizes.textW, sizes.active.w, onContentHeight]);

    const headline = m.role || `Un mot de ${m.author.toLowerCase()}`;
    const hasText = Boolean(m.text?.trim());
    const clickable = !active && !hidden;

    return (
        <motion.li
            initial={false}
            animate={{
                marginLeft: hidden ? 0 : GAP / 2,
                marginRight: hidden ? 0 : GAP / 2,
                opacity: hidden ? 0 : 1,
            }}
            transition={tr}
            className="relative shrink-0"
            style={{ zIndex: active ? 10 : 1, pointerEvents: hidden ? "none" : "auto" }}
        >
            {/* Petit raccord entre deux cartes voisines */}
            <motion.span
                aria-hidden
                initial={false}
                animate={{ opacity: showConnector ? 1 : 0 }}
                transition={tr}
                className="absolute -right-2 top-1/2 h-7 w-2 -translate-y-1/2 bg-paper"
            />

            <motion.div
                role={clickable ? "button" : undefined}
                tabIndex={clickable ? 0 : -1}
                aria-label={clickable ? `Voir le message de ${m.author}` : undefined}
                onClick={clickable ? () => onSelect(i) : undefined}
                onKeyDown={
                    clickable
                        ? (e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  onSelect(i);
                              }
                          }
                        : undefined
                }
                initial={false}
                animate={{ padding: pad, borderRadius: active ? 30 : 20 }}
                whileHover={clickable ? { y: -6, transition: { duration: 0.25 } } : undefined}
                transition={tr}
                className={`flex overflow-hidden bg-paper ${mobile ? "flex-col" : "flex-row"} ${
                    active
                        ? "shadow-[0_30px_70px_-24px_rgba(26,31,36,0.55)]"
                        : "cursor-pointer shadow-[0_14px_30px_-14px_rgba(26,31,36,0.45)]"
                }`}
            >
                {/* Panneau texte : se déplie quand la carte devient active */}
                <motion.div
                    initial={false}
                    aria-hidden={!active}
                    animate={
                        mobile
                            ? { height: active ? "auto" : 0, width: photo.w, opacity: active ? 1 : 0 }
                            : { width: active ? sizes.textW : 0, opacity: active ? 1 : 0 }
                    }
                    transition={textTr}
                    className="shrink-0 overflow-hidden"
                >
                    <div
                        ref={contentRef}
                        className={`flex flex-col ${mobile ? "px-3 pb-2 pt-4" : "px-8 pb-7 pt-8"}`}
                        style={{ width: mobile ? sizes.active.w : sizes.textW }}
                    >
                        <h3
                            className={`shrink-0 font-display leading-[0.92] tracking-wide text-ink ${
                                mobile ? "text-4xl" : "text-[2.6rem]"
                            }`}
                        >
                            {headline}
                        </h3>

                        <div className="mt-4 pr-2">
                            {hasText ? (
                                <p className="break-words whitespace-pre-line text-[15px] leading-relaxed text-ink/85">
                                    <span
                                        aria-hidden
                                        className="float-left mr-2 h-9 font-display text-6xl leading-[0.9] text-orange"
                                    >
                                        “
                                    </span>
                                    {m.text}
                                </p>
                            ) : (
                                <p className="text-[15px] italic leading-relaxed text-muted">
                                    Son message arrive très bientôt…
                                </p>
                            )}
                        </div>

                        <div className="mt-4 flex shrink-0 flex-wrap items-center gap-2">
                            <span className="rounded-lg bg-ink/[0.07] px-3 py-1.5 font-sensation text-xl leading-none text-ink">
                                {m.author}
                            </span>
                            <span className="rounded-lg bg-ink/[0.07] px-2.5 py-1.5 text-xs font-medium text-ink/70">
                                Pour tes {config.age} ans
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Photo : grande sur la carte active, étroite en miniature */}
                <motion.div
                    initial={false}
                    animate={{ width: photo.w, height: photo.h, borderRadius: active ? 22 : 14 }}
                    transition={tr}
                    className="relative shrink-0 overflow-hidden bg-ink-card"
                >
                    {/* Initiale en fallback si la photo n'existe pas */}
                    <div className="absolute inset-0 grid place-items-center font-sensation text-5xl text-orange">
                        {m.author[0]}
                    </div>
                    <img
                        src={m.photo}
                        alt={active ? m.author : ""}
                        draggable={false}
                        decoding="async"
                        className="relative size-full object-cover object-[50%_30%]"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    <motion.div
                        initial={false}
                        animate={{ opacity: active ? 1 : 0 }}
                        transition={textTr}
                        className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent"
                    />
                    <motion.span
                        initial={false}
                        animate={{ opacity: active ? 1 : 0 }}
                        transition={textTr}
                        className="absolute right-3 top-3 rounded-full bg-ink/60 px-3 py-1 font-display text-lg leading-none tracking-wider text-paper backdrop-blur"
                    >
                        {String(i + 1).padStart(2, "0")}
                        <span className="text-paper/50"> / {String(n).padStart(2, "0")}</span>
                    </motion.span>
                </motion.div>
            </motion.div>
        </motion.li>
    );
}

/* ────────────────────────────────────────────────────────── */

export default function Message() {
    const [cur, setCur] = useState(0);
    const [contentMeasurement, setContentMeasurement] = useState({ index: -1, width: 0, height: 0 });
    const vw = useViewportWidth();
    const reduce = useReducedMotion();
    const contentH =
        contentMeasurement.index === cur && contentMeasurement.width === vw ? contentMeasurement.height : 0;
    const sizes = getSizes(vw, contentH);
    const n = messages.length;

    const go = useCallback((i) => setCur(((i % n) + n) % n), [n]);
    const reportContentHeight = useCallback(
        (index, height) => setContentMeasurement({ index, width: vw, height }),
        [vw]
    );

    // Garde la carte active centrée : on compense le côté le plus léger
    let left = 0;
    let right = 0;
    messages.forEach((_, i) => {
        const d = Math.abs(i - cur);
        if (d === 0 || d > sizes.maxD) return;
        const t = sizes.thumbs[d];
        const w = t.w + t.pad * 2 + GAP;
        if (i < cur) left += w;
        else right += w;
    });
    const spacerTr = reduce ? { duration: 0 } : { duration: 0.8, ease: EASE };

    return (
        <section id="messages" className="px-3 py-16 md:px-4 md:py-24">
            <div
                className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[36px] pb-12 pt-16 md:rounded-[48px] md:pt-20"
                style={{
                    background:
                        "linear-gradient(180deg, #4f7fc8 0%, #7f9fdc 34%, #cdbfea 62%, #f8e2d2 100%)",
                }}
            >
                {/* Halos de couleur façon "mesh gradient" */}
                <motion.div
                    aria-hidden
                    animate={reduce ? undefined : { x: [0, 60, 0], y: [0, -30, 0] }}
                    transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
                    className="pointer-events-none absolute -left-24 top-1/3 size-[420px] rounded-full bg-[#e9a6dc]/50 blur-3xl"
                />
                <motion.div
                    aria-hidden
                    animate={reduce ? undefined : { x: [0, -50, 0], y: [0, 40, 0] }}
                    transition={{ repeat: Infinity, duration: 17, ease: "easeInOut" }}
                    className="pointer-events-none absolute -right-20 bottom-10 size-[380px] rounded-full bg-orange/35 blur-3xl"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-24 left-1/4 size-[420px] rounded-full bg-white/60 blur-3xl"
                />

                {/* En-tête */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="relative mb-8 px-4 text-center md:mb-10"
                >
                    <span className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-1.5 font-script text-lg text-paper">
                        <span className="size-2 rounded-full bg-orange" />
                        Messages
                    </span>
                    <h2 className="mt-5 font-display text-6xl leading-[0.9] tracking-wide text-white md:text-8xl">
                        Des mots <span className="text-ink">d'amis</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-md font-script text-2xl text-white/85">
                        Tes amis et proches ont un petit mot pour toi.
                    </p>
                </motion.div>

                {/* Carrousel */}
                <motion.div
                    role="region"
                    aria-roledescription="carrousel"
                    aria-label="Messages"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: EASE }}
                    onKeyDown={(e) => {
                        if (e.key === "ArrowRight") go(cur + 1);
                        if (e.key === "ArrowLeft") go(cur - 1);
                    }}
                    onPanEnd={(_, info) => {
                        const { x, y } = info.offset;
                        if (Math.abs(x) > 60 && Math.abs(x) > Math.abs(y)) go(cur + (x < 0 ? 1 : -1));
                    }}
                    className="relative touch-pan-y"
                >
                    <ul className="flex items-center justify-center" style={{ height: sizes.stageH }}>
                        <motion.li
                            aria-hidden
                            initial={false}
                            animate={{ width: Math.max(0, right - left) }}
                            transition={spacerTr}
                            className="shrink-0"
                        />
                        {messages.map((m, i) => (
                            <Item
                                key={m.id}
                                m={m}
                                i={i}
                                cur={cur}
                                n={n}
                                sizes={sizes}
                                reduce={reduce}
                                onSelect={go}
                                onContentHeight={reportContentHeight}
                            />
                        ))}
                        <motion.li
                            aria-hidden
                            initial={false}
                            animate={{ width: Math.max(0, left - right) }}
                            transition={spacerTr}
                            className="shrink-0"
                        />
                    </ul>
                </motion.div>

                {/* Navigation : flèches + points */}
                <div className="relative mt-8 flex items-center justify-center gap-4 md:mt-10">
                    <button
                        onClick={() => go(cur - 1)}
                        aria-label="Message précédent"
                        className="grid size-12 place-items-center rounded-full bg-ink text-paper shadow-lg ring-2 ring-white transition hover:scale-105 hover:bg-ink-soft active:scale-95"
                    >
                        <ChevronLeft size={22} />
                    </button>

                    <div className="flex items-center gap-2">
                        {messages.map((m, i) => (
                            <motion.button
                                key={m.id}
                                onClick={() => go(i)}
                                aria-label={`Message de ${m.author}`}
                                aria-current={i === cur}
                                initial={false}
                                animate={{
                                    width: i === cur ? 32 : 8,
                                    backgroundColor: i === cur ? "#1a1f24" : "rgba(26,31,36,0.28)",
                                }}
                                transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
                                className="h-2 rounded-full"
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => go(cur + 1)}
                        aria-label="Message suivant"
                        className="grid size-12 place-items-center rounded-full bg-ink text-paper shadow-lg ring-2 ring-white transition hover:scale-105 hover:bg-ink-soft active:scale-95"
                    >
                        <ChevronRight size={22} />
                    </button>
                </div>
            </div>
        </section>
    );
}