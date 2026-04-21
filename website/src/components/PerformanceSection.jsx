import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cpu, Gauge, MemoryStick, ShieldCheck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function PerformanceSection() {
    const sectionRef = useRef(null);
    const countersRef = useRef([]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(".perf-copy", {
                opacity: 0,
                x: -60,
            });

            gsap.set(".perf-card", {
                opacity: 0,
                y: 70,
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 72%",
                    end: "bottom 75%",
                    scrub: 1,
                },
            });

            tl.to(".perf-copy", {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: "power3.out",
            });

            tl.to(
                ".perf-card",
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.1,
                    duration: 0.9,
                    ease: "power3.out",
                },
                "-=0.55"
            );

            countersRef.current.forEach((el, i) => {
                if (!el) return;

                const target = Number(el.dataset.target || 0);

                ScrollTrigger.create({
                    trigger: el,
                    start: "top 85%",
                    once: true,
                    onEnter: () => {
                        gsap.to(
                            { value: 0 },
                            {
                                value: target,
                                duration: 2,
                                ease: "power2.out",
                                onUpdate() {
                                    const val = Math.round(this.targets()[0].value);

                                    if (i === 0) el.textContent = `${val}s`;
                                    if (i === 1) el.textContent = `${val}+`;
                                    if (i === 2) el.textContent = `${val}MB`;
                                },
                            }
                        );
                    },
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const stats = [
        {
            icon: Gauge,
            value: "90",
            label: "Monorepo Review Time",
            suffix: "s",
        },
        {
            icon: Cpu,
            value: "80",
            label: "Files Analyzed",
            suffix: "+",
        },
        {
            icon: MemoryStick,
            value: "420",
            label: "Peak RAM Usage",
            suffix: "MB",
        },
        {
            icon: ShieldCheck,
            value: "Native",
            label: "Apple Silicon Optimized",
            static: true,
        },
    ];

    return (
        <section
            id="performance"
            ref={sectionRef}
            className="relative cinematic-section bg-zinc-950 overflow-hidden"
        >
            {/* ambient glow */}
            <div className="absolute left-0 top-1/3 w-[650px] h-[650px] bg-neon-blue/10 blur-[180px]" />

            <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-8">
                <div className="grid xl:grid-cols-2 gap-14 xl:gap-20 items-center">
                    {/* Left Copy */}
                    <div className="perf-copy">
                        <div className="text-neon-blue text-xs md:text-sm tracking-[0.35em] mb-4">
                            BLISTERING SPEED
                        </div>

                        <h2 className="section-header mb-8">
                            80-file monorepo reviewed in under 90 seconds.
                        </h2>

                        <p className="text-xl md:text-3xl text-white/70 leading-snug max-w-2xl mb-10">
                            Optimized for local silicon.
                            No upload delays.
                            No queue times.
                            No cloud latency.
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm tracking-[0.2em] text-white/35">
                            <span>PRIVATE</span>
                            <span>•</span>
                            <span>NATIVE</span>
                            <span>•</span>
                            <span>FAST</span>
                            <span>•</span>
                            <span>OFFLINE</span>
                        </div>
                    </div>

                    {/* Right Grid */}
                    <div className="grid sm:grid-cols-2 gap-5">
                        {stats.map((stat, i) => {
                            const Icon = stat.icon;

                            return (
                                <div
                                    key={i}
                                    className="perf-card glass p-8 md:p-10 min-h-[240px] flex flex-col justify-between"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                                        <Icon className="w-6 h-6 text-neon-blue" />
                                    </div>

                                    <div>
                                        <div
                                            ref={(el) => (countersRef.current[i] = el)}
                                            data-target={stat.static ? "" : stat.value}
                                            className="text-5xl md:text-6xl font-space text-neon-blue mb-3 tracking-tight"
                                        >
                                            {stat.static ? stat.value : "0"}
                                        </div>

                                        <div className="text-white/55 uppercase text-xs tracking-[0.22em] leading-relaxed">
                                            {stat.label}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}