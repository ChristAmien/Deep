import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { gallery } from "../data";

const EASE = [0.22, 1, 0.36, 1];

const RATIOS = {
    tall: "aspect-[3/4]",
    wide: "aspect-[4/3]",
    square: "aspect-square",
};

/* ──────────────────────────────────────────────────────────
   Une vignette de la grille
   ────────────────────────────────────────────────────────── */
function Tile({ p, index, onOpen }) {
    return (
        <motion.button
            type="button"
            onClick={() => onOpen(index)}
            aria-label={`Agrandir la photo : ${p.caption}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: (index % 4) * 0.06, ease: EASE }}
            whileHover={{ y: -6 }}
            className={`group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-panel bg-ink-card shadow-[0_14px_30px_-14px_rgba(26,31,36,0.45)] ${
                RATIOS[p.shape] ?? RATIOS.square
            }`}
        >
            {/* Initiale en fallback si la photo n'existe pas */}
            <div className="absolute inset-0 grid place-items-center font-display text-6xl text-orange">
                {String(index + 1).padStart(2, "0")}
            </div>
            <img
                src={p.src}
                alt={p.caption}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="relative size-full object-cover transition duration-700 group-hover:scale-105"
                onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
            <span className="absolute inset-x-3 bottom-3 translate-y-2 text-left font-script text-xl leading-tight text-paper opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {p.caption}
            </span>
        </motion.button>
    );
}

/* ──────────────────────────────────────────────────────────
   Visionneuse plein écran
   ────────────────────────────────────────────────────────── */
function Lightbox({ index, onClose, onPrev, onNext }) {
    const p = gallery[index];

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") onNext();
            if (e.key === "ArrowLeft") onPrev();
        };
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [onClose, onNext, onPrev]);

    return (
        <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Visionneuse de photos"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] grid place-items-center bg-ink/90 p-4 backdrop-blur-md"
        >
            <button
                onClick={onClose}
                aria-label="Fermer"
                className="absolute right-4 top-4 grid size-12 place-items-center rounded-full bg-paper text-ink shadow-lg transition hover:scale-105 active:scale-95"
            >
                <X size={22} />
            </button>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                }}
                aria-label="Photo précédente"
                className="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-paper text-ink shadow-lg transition hover:scale-105 active:scale-95 md:left-6"
            >
                <ChevronLeft size={22} />
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                }}
                aria-label="Photo suivante"
                className="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-paper text-ink shadow-lg transition hover:scale-105 active:scale-95 md:right-6"
            >
                <ChevronRight size={22} />
            </button>

            <motion.figure
                key={p.id}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: EASE }}
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-full max-w-3xl flex-col items-center gap-4"
            >
                <img
                    src={p.src}
                    alt={p.caption}
                    draggable={false}
                    className="max-h-[75vh] w-auto rounded-card object-contain shadow-[0_30px_70px_-24px_rgba(0,0,0,0.7)]"
                />
                <figcaption className="flex items-center gap-3 text-paper">
                    <span className="font-script text-2xl">{p.caption}</span>
                    <span className="rounded-full bg-paper/15 px-3 py-1 font-display text-lg leading-none tracking-wider">
                        {String(index + 1).padStart(2, "0")}
                        <span className="text-paper/50"> / {String(gallery.length).padStart(2, "0")}</span>
                    </span>
                </figcaption>
            </motion.figure>
        </motion.div>
    );
}

/* ────────────────────────────────────────────────────────── */

export default function Gallery() {
    const [open, setOpen] = useState(null);
    const n = gallery.length;

    const close = useCallback(() => setOpen(null), []);
    const prev = useCallback(() => setOpen((i) => (i === null ? i : (i - 1 + n) % n)), [n]);
    const next = useCallback(() => setOpen((i) => (i === null ? i : (i + 1) % n)), [n]);

    return (
        <section id="gallery" className="px-4 py-24">
            <div className="mx-auto max-w-6xl">
                {/* En-tête */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mb-12 text-center"
                >
                    <span className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-1.5 font-script text-lg text-paper">
                        <span className="size-2 rounded-full bg-orange" />
                        Souvenirs
                    </span>
                    <h2 className="mt-5 font-display text-6xl leading-[0.9] tracking-wide text-ink md:text-8xl">
                        Nos plus <span className="text-orange">beaux moments</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-md font-script text-2xl text-ink-soft">
                        Vingt ans de sourires, en quelques images.
                    </p>
                </motion.div>

                {/* Grille */}
                <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
                    {gallery.map((p, i) => (
                        <Tile key={p.id} p={p} index={i} onOpen={setOpen} />
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {open !== null && <Lightbox index={open} onClose={close} onPrev={prev} onNext={next} />}
            </AnimatePresence>
        </section>
    );
}