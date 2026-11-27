import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowBigRight } from "lucide-react";
import { programme } from "../data";

const EASE = [0.22, 1, 0.36, 1];

export default function Programme() {
    const [shown, setShown] = useState(false);

    return (
        <section id="party" className="px-4 py-24">
            <div className="mx-auto max-w-3xl">
                {/* En-tête */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mb-10 text-center"
                >
                    <span className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-1.5 font-script text-lg text-paper">
                        <span className="size-2 rounded-full bg-orange" />
                        Programme
                    </span>
                    <h2 className="mt-5 font-display text-6xl leading-[0.9] tracking-wide text-ink md:text-8xl">
                        Le programme <span className="text-orange">du jour</span>
                    </h2>
                </motion.div>

                {/* Bouton */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="flex justify-center"
                >
                    <button
                        type="button"
                        onClick={() => setShown((s) => !s)}
                        aria-expanded={shown}
                        aria-controls="programme-reveal"
                        className="group flex items-center gap-3 rounded-full bg-ink py-2 pl-6 pr-2 font-semibold text-paper transition active:scale-95"
                    >
                        {shown ? programme.hide : programme.button}
                        <span
                            className={`grid size-10 place-items-center rounded-full bg-orange text-ink transition ${shown ? "rotate-90" : "group-hover:rotate-90"
                                }`}
                        >
                            <ArrowBigRight size={18} />
                        </span>
                    </button>
                </motion.div>

                {/* Révélation */}
                <AnimatePresence initial={false}>
                    {shown && (
                        <motion.div
                            id="programme-reveal"
                            key="reveal"
                            initial={{ opacity: 0, height: 0, y: 20 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, y: 20 }}
                            transition={{ duration: 0.6, ease: EASE }}
                            className="overflow-hidden"
                        >
                            <div className="mt-8 rounded-card bg-orange p-8 text-center text-ink shadow-[0_30px_60px_-20px_rgba(26,31,36,0.45)] md:p-10">
                                <p className="font-display text-4xl leading-[1] tracking-wide md:text-6xl">
                                    {programme.reveal}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <h1 className="mx-auto mt-16 max-w-2xl text-center font-sensation font-display text-3xl leading-snug md:text-5xl">
                    Prends soin de Maka c'est une chouette fille mon fils garde la dans le sourire tant que tu peux profite de ta days
                </h1>
            </div>
        </section>
    );
}