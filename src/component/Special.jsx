import { motion } from "motion/react";
import { special } from "../data";

function Photo({ src, name }) {
    return (
        <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-panel bg-ink-card sm:w-48 md:w-56">
            {/* Initiale en fallback si la photo n'existe pas */}
            <div className="absolute inset-0 grid place-items-center font-sensation text-7xl text-orange">
                {name[0]}
            </div>
            <img
                src={src}
                alt={name}
                loading="lazy"
                className="relative size-full object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
            />
        </div>
    );
}

function MessageCard({ m, index }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5 rounded-card bg-sky/20 p-3 sm:flex-row sm:items-stretch sm:gap-8 sm:p-4 sm:pr-8"
        >
            <Photo src={m.photo} name={m.author} />

            <div className="flex flex-1 flex-col justify-center px-2 py-2 sm:px-0 sm:py-4">
                <p className="whitespace-pre-line text-[15px] leading-relaxed text-ink md:text-base">
                    {m.text}
                </p>

                <div className="mt-5 flex items-center gap-3">
                    <span className="h-px w-8 bg-orange" />
                    <div>
                        <div className="font-sensation text-2xl leading-none text-ink">{m.author}</div>
                        <div className="mt-1 text-xs text-muted">{m.role}</div>
                    </div>
                </div>
            </div>
        </motion.article>
    );
}

export default function Special() {
    return (
        <section id="specialy" className="px-4 py-24">
            <div className="mx-auto max-w-5xl">
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
                        Messages spéciaux
                    </span>
                    <h2 className="mt-5 font-display text-6xl leading-[0.9] tracking-wide text-ink md:text-8xl">
                        Des mots <span className="text-orange">du cœur</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-md font-script text-2xl text-ink-soft">
                        Ceux qui t'aiment ont quelque chose à te dire.
                    </p>
                </motion.div>

                {/* Cartes */}
                <div className="flex flex-col gap-6 md:gap-8">
                    {special.map((m, i) => (
                        <MessageCard key={m.id} m={m} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}