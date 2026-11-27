import { motion } from "motion/react";
import { ArrowBigRight, ArrowDown } from "lucide-react";
import { config } from "../data";
import useCountdown from "./hooks/useCountdown";

const rise = {
    hidden: { y: "110%" },
    show: (i) => ({
        y: 0,
        transition: { duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] },
    }),
};

function Line({ children, i, className = "" }) {
    return (
        <span className="block overflow-hidden">
            <motion.span
                custom={i}
                variants={rise}
                initial="hidden"
                animate="show"
                className={`block ${className}`}
            >
                {children}
            </motion.span>
        </span>
    );
}

export default function Hero() {
    const { j, h, m, s, isToday } = useCountdown(config.birthday);
    const units = [["Jours", j], ["Heures", h], ["Min", m], ["Sec", s]];
    const ticker = Array(8).fill("JOYEUX ANNIVERSAIRE ✦");

    return (
        <section id="hero" className="relative overflow-hidden px-4 pb-0 pt-28 md:pt-32">
            <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                {/* Texte */}
                <div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-sensation inline-flex items-center gap-2 rounded-full bg-ink px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-paper"
                    >
                        joyeux anniversaire
                    </motion.h1>

                    <h1 className="mt-6 font-display text-[clamp(4.5rem,14vw,11rem)] leading-[0.85] tracking-wide text-ink">
                        <Line i={0}>Happy</Line>
                        <Line i={1} className="text-orange">Birthday</Line>
                        <Line i={2} className="font-script normal-case tracking-normal text-[0.8em] leading-[1.1] pt-2">
                            {config.name}
                        </Line>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="mt-6 max-w-md text-lg text-ink-soft"
                    >
                        {config.tagline}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.05 }}
                        className="mt-8 flex flex-wrap items-center gap-3"
                    >
                        <a
                            href="#gallery"
                            className="group flex items-center gap-3 rounded-full bg-ink py-2 pl-6 pr-2 font-semibold text-paper"
                        >
                            Découvrir
                            <span className="grid size-10 place-items-center rounded-full bg-orange text-ink transition group-hover:rotate-90">
                                <ArrowBigRight size={18} />
                            </span>
                        </a>
                        <a
                            href="#wishes"
                            className="rounded-full border-2 border-ink px-6 py-3 font-semibold transition hover:bg-ink hover:text-paper"
                        >
                            Envoyer un vœu
                        </a>
                    </motion.div>
                </div>

                {/* Carte photo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.92, rotate: 3 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="relative mx-auto w-full max-w-md"
                >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-ink-card shadow-[0_30px_60px_-20px_rgba(26,31,36,0.55)]">
                        <img
                            src={config.photo}
                            alt={config.name}
                            className="size-full object-cover"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />

                        {/* Compte à rebours / jour J */}
                        {isToday ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute inset-x-4 bottom-4 rounded-panel bg-orange p-4 text-center text-ink"
                            >
                                <div className="font-display text-4xl leading-none tracking-wide">
                                    C'est aujourd'hui 🎉
                                </div>
                                <div className="mt-1 text-xs font-semibold uppercase tracking-widest">
                                    Joyeux anniversaire {config.name}
                                </div>
                            </motion.div>
                        ) : (
                            <div className="absolute inset-x-4 bottom-4 grid grid-cols-4 gap-2 rounded-panel bg-ink/80 p-3 text-center text-paper backdrop-blur">
                                {units.map(([label, v]) => (
                                    <div key={label}>
                                        <div className="font-display text-4xl leading-none text-orange tabular-nums">
                                            {String(v).padStart(2, "0")}
                                        </div>
                                        <div className="mt-1 text-[10px] uppercase tracking-widest text-muted">
                                            {label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sticker âge */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
                        className="absolute -right-4 -top-6 grid size-28 place-items-center rounded-full bg-orange text-ink shadow-lg sm:-right-8"
                    >
                        <div className="-rotate-12 text-center">
                            <div className="font-display text-5xl leading-none">{config.age}</div>
                            <div className="text-[10px] font-semibold uppercase tracking-widest">ans</div>
                        </div>
                    </motion.div>

                    {/* Chip flottant */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                        className="absolute -left-4 top-16 rounded-full bg-sky px-4 py-2 text-sm font-semibold text-ink shadow-lg sm:-left-8"
                    >
                        🎉 Let's go
                    </motion.div>
                </motion.div>
            </div>

            {/* Bandeau défilant */}
            <div className="-mx-4 mt-16 overflow-hidden bg-ink py-4">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                    className="flex w-max gap-10 whitespace-nowrap font-display text-4xl tracking-wider text-paper"
                >
                    {[...ticker, ...ticker].map((t, i) => (
                        <span key={i} className={i % 2 ? "text-orange" : ""}>
                            {t}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}