import { useEffect, useRef } from "react";

export default function ParticleBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrame;
        let particles = [];
        let width = 0;
        let height = 0;

        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 45 : 90;
        const linkDistance = isMobile ? 110 : 145;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        class Particle {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                this.x = Math.random() * width;
                this.y = initial
                    ? Math.random() * height
                    : height + Math.random() * 80;

                this.size = Math.random() * 2 + 0.8;

                this.speedX = (Math.random() - 0.5) * 0.12;
                this.speedY = -(Math.random() * 0.18 + 0.05);

                this.alpha = Math.random() * 0.45 + 0.15;

                this.hue = Math.random() > 0.5 ? 190 : 265;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < -20 || this.x > width + 20 || this.y < -20) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();

                ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.alpha})`;
                ctx.shadowBlur = 18;
                ctx.shadowColor = `hsla(${this.hue}, 100%, 70%, 0.45)`;

                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];

            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const connect = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;

                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < linkDistance) {
                        const opacity = (1 - distance / linkDistance) * 0.08;

                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
                        ctx.lineWidth = 0.6;
                        ctx.shadowBlur = 0;

                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // subtle ambient gradient
            const gradient = ctx.createRadialGradient(
                width * 0.5,
                height * 0.45,
                0,
                width * 0.5,
                height * 0.45,
                width * 0.6
            );

            gradient.addColorStop(0, "rgba(0,255,255,0.03)");
            gradient.addColorStop(0.5, "rgba(168,85,247,0.025)");
            gradient.addColorStop(1, "rgba(0,0,0,0)");

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            particles.forEach((particle) => {
                particle.update();
                particle.draw();
            });

            connect();

            animationFrame = requestAnimationFrame(animate);
        };

        resize();
        init();
        animate();

        window.addEventListener("resize", resize);

        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 pointer-events-none opacity-70"
        />
    );
}