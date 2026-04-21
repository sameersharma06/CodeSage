import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    Bug,
    ShieldAlert,
    Cloud,
    Lock,
    Zap,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ProblemSection() {
    const sectionRef = useRef(null);

    const pains = [
        {
            icon: Bug,
            title: "Bugs ship to production",
            desc: "Critical issues survive reviews and reach users.",
        },
        {
            icon: ShieldAlert,
            title: "Security leaks go live",
            desc: "Keys, injections, exposed endpoints, silent risks.",
        },
        {
            icon: Cloud,
            title: "Cloud AI costs pile up",
            desc: "$400+ monthly just to review private code.",
        },
        {
            icon: Lock,
            title: "Your code leaves the machine",
            desc: "Privacy disappears the moment files upload.",
        },
        {
            icon: Zap,
            title: "Feedback loops stay slow",
            desc: "Waiting days for reviews kills momentum.",
        },
    ];

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(".problem-head", {
                opacity: 0,
                y: 60,
            });

            gsap.set(".pain-card", {
                opacity: 0,
                y: 80,
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 72%",
                    end: "bottom 70%",
                    scrub: 1,
                },
            });

            tl.to(".problem-head", {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
            });

            tl.to(
                ".pain-card",
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.12,
                    duration: 1,
                    ease: "power3.out",
                },
                "-=0.5"
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative cinematic-section bg-gradient-to-b from-black to-zinc-950 overflow-hidden"
        >
            {/* Ambient red tension glow */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-red-500/10 blur-[180px]" />

            <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-8">
                {/* Header */}
                <div className="problem-head text-center max-w-5xl mx-auto mb-20">
                    <div className="text-red-400 text-xs md:text-sm tracking-[0.35em] mb-4">
                        THE OLD WAY
                    </div>

                    <h2 className="section-header mb-6">
                        Every day, developers ship problems they never saw coming.
                    </h2>

                    <p className="section-subtext mx-auto">
                        Hidden bugs. Silent security risks. Expensive review cycles.
                        Traditional workflows miss what matters most.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-5 md:gap-6">
                    {pains.map((pain, i) => {
                        const Icon = pain.icon;

                        return (
                            <div
                                key={i}
                                className="pain-card glass p-7 md:p-8 min-h-[280px] flex flex-col justify-between group hover:border-red-400/20 transition-all duration-500"
                            >
                                <div>
                                    <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-400/10 flex items-center justify-center mb-6">
                                        <Icon className="w-7 h-7 text-red-400" />
                                    </div>

                                    <h3 className="text-2xl font-medium tracking-tight mb-4">
                                        {pain.title}
                                    </h3>

                                    <p className="text-white/55 leading-relaxed">
                                        {pain.desc}
                                    </p>
                                </div>

                                <div className="mt-8 h-px w-full bg-gradient-to-r from-red-400/20 to-transparent" />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}