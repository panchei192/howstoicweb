"use client"
import { useI18n } from "@/context/I18nContext"
import { Button } from "@/components/ui/Button"
import { motion } from "framer-motion"
import { ArrowRight, Download, Infinity as InfinityIcon, Sliders } from "lucide-react"
import { Card } from "@/components/ui/Card"

export function Hero() {
    const { t } = useI18n()

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    }

    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay"
                    style={{ backgroundImage: "url('/stoic_background.png')" }}
                />
                <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="space-y-8"
                    >
                        <motion.div variants={item} className="inline-block">
                            <span className="px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-serif tracking-widest uppercase">
                                For the Modern Stoic
                            </span>
                        </motion.div>

                        <motion.h1 variants={item} className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight text-foreground pb-2">
                            {t("hero.headline")}
                        </motion.h1>

                        <motion.p variants={item} className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            {t("hero.subheadline")}
                        </motion.p>

                        <motion.div variants={item} className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                            <Button
                                size="lg"
                                className="h-14 px-10 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 font-serif transition-all duration-300 hover:scale-105"
                            >
                                {t("hero.ctaPrimary")}
                            </Button>
                            <a href="#products" className="inline-block">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-14 px-10 text-lg rounded-full border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-foreground backdrop-blur-sm transition-all duration-300 font-serif"
                                >
                                    {t("hero.ctaSecondary")}
                                </Button>
                            </a>
                        </motion.div>

                        <motion.div variants={item} className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-12 text-muted-foreground max-w-5xl mx-auto border-t border-white/5 mt-16">
                            <div className="flex flex-col items-center gap-4">
                                <Download className="w-10 h-10 text-primary opacity-80" />
                                <span className="font-serif tracking-wide text-lg">{t("hero.bullets.instant")}</span>
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <InfinityIcon className="w-10 h-10 text-primary opacity-80" />
                                <span className="font-serif tracking-wide text-lg">{t("hero.bullets.lifetime")}</span>
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <Sliders className="w-10 h-10 text-primary opacity-80" />
                                <span className="font-serif tracking-wide text-lg">{t("hero.bullets.custom")}</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
