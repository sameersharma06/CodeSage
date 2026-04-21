import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 30);
                    ticking = false;
                });

                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const links = [
        { label: "Why CodeSage", href: "#why" },
        { label: "Pipeline", href: "#how" },
        { label: "Compare", href: "#compare" },
        { label: "Performance", href: "#performance" },
    ];

    const closeMenu = () => setIsOpen(false);

    return (
        <>
            <motion.nav
                initial={{ y: -90, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                    duration: 1,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                        ? "bg-black/55 backdrop-blur-2xl border-b border-white/10"
                        : "bg-transparent"
                    }`}
            >
                <div className="max-w-screen-2xl mx-auto px-6 md:px-8 py-5 flex items-center justify-between">
                    {/* Logo */}
                    <a
                        href="#hero"
                        className="flex items-center gap-3 group shrink-0"
                    >
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-neon-blue to-electric-purple flex items-center justify-center text-xl shadow-neon transition-transform duration-300 group-hover:scale-105">
                            ⚡
                        </div>

                        <span className="font-space text-2xl md:text-3xl tracking-[-0.04em]">
                            CodeSage
                        </span>
                    </a>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-10 text-sm font-medium text-white/70">
                        {links.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="hover:text-white transition-colors duration-300"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noreferrer"
                            className="hidden md:inline-flex px-5 py-3 rounded-2xl border border-white/15 text-sm text-white/80 hover:border-white/40 transition-all duration-300"
                        >
                            GitHub
                        </a>

                        <a
                            href="#cta"
                            className="hidden md:inline-flex neon-button text-sm px-6 py-3 rounded-2xl"
                        >
                            Download
                        </a>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl border border-white/10"
                            aria-label="Toggle Menu"
                        >
                            {isOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.35 }}
                        className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl pt-28 px-8 lg:hidden"
                    >
                        <div className="flex flex-col gap-8">
                            {links.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={closeMenu}
                                    className="text-3xl font-medium text-white/85"
                                >
                                    {link.label}
                                </a>
                            ))}

                            <div className="pt-8 border-t border-white/10 flex flex-col gap-4">
                                <a
                                    href="#cta"
                                    onClick={closeMenu}
                                    className="neon-button justify-center text-xl py-5 rounded-2xl"
                                >
                                    Download Now
                                </a>

                                <a
                                    href="https://github.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-center py-4 rounded-2xl border border-white/15 text-white/70"
                                >
                                    GitHub
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}