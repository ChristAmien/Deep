import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { Menu, X, Gift } from "lucide-react";
import { config, navLinks } from "../data";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (y) => {
        const prev = scrollY.getPrevious() ?? 0;
        setHidden(y > prev && y > 120 && !open);
    });

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => (document.body.style.overflow = "");
    }, [open]);

    return (
        <>
            <motion.header
                animate={{ y: hidden ? -120 : 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-x-0 top-4 z-50 px-4"
            >
                <nav className="mx-auto flex w-fit max-w-full items-center rounded-full bg-ink px-2.5 py-2.5 text-paper shadow-[0_12px_40px_-12px_rgba(26,31,36,0.6)]">
                    {/* Liens desktop */}
                    <ul className="hidden items-center gap-1 md:flex">
                        {navLinks.map((l) => (
                            <li key={l.href}>
                                <a
                                    href={l.href}
                                    className="rounded-full px-4 py-2 text-sm font-medium text-paper/70 transition hover:bg-ink-soft hover:text-paper"
                                >
                                    {l.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* CTA + burger */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setOpen(true)}
                            aria-label="Ouvrir le menu"
                            className="grid size-10 place-items-center rounded-full bg-ink-soft md:hidden"
                        >
                            <Menu size={20} />
                        </button>
                    </div>
                </nav>
            </motion.header>

            {/* Menu mobile */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ clipPath: "circle(0% at 90% 5%)" }}
                        animate={{ clipPath: "circle(150% at 90% 5%)" }}
                        exit={{ clipPath: "circle(0% at 90% 5%)" }}
                        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
                        className="fixed inset-0 z-[60] flex flex-col bg-ink p-6 text-paper md:hidden"
                    >
                        <div className="flex justify-end">
                            <button
                                onClick={() => setOpen(false)}
                                aria-label="Fermer"
                                className="grid size-11 place-items-center rounded-full bg-ink-soft"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        <ul className="mt-10 flex flex-1 flex-col gap-2">
                            {navLinks.map((l, i) => (
                                <motion.li
                                    key={l.href}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 + i * 0.08 }}
                                >
                                    <a
                                        href={l.href}
                                        onClick={() => setOpen(false)}
                                        className="flex items-baseline justify-between border-b border-ink-card py-4 font-display text-6xl tracking-wide hover:text-orange"
                                    >
                                        {l.label}
                                        <span className="font-body text-sm text-muted">0{i + 1}</span>
                                    </a>
                                </motion.li>
                            ))}
                        </ul>

                        <a
                            href="#wishes"
                            onClick={() => setOpen(false)}
                            className="rounded-full bg-orange py-4 text-center font-semibold text-ink"
                        >
                            Laisser un vœu
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}