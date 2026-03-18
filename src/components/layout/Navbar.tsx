"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useI18n } from "@/context/I18nContext"
import { useCart } from "@/context/CartContext"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ShoppingCart, User, Sun, Moon, Globe, Trophy, LogOut } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { useGamification } from "@/context/GamificationContext"
import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabase"

export function Navbar() {
    const { theme, setTheme } = useTheme()
    const { t, locale, setLocale } = useI18n()
    const { items, toggleCart } = useCart()
    const { user, loading: authLoading } = useAuth()
    const { level, xp, equippedFrame, storeItems, oro } = useGamification()
    const pathname = usePathname()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true)
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navLinks = [
        { label: t("nav.home"), href: "#hero" },
        { label: t("nav.products"), href: "#products" },
        { label: t("nav.packs"), href: "#packs" },
        { label: t("nav.community"), href: "#community" },
        { label: t("nav.library"), href: "#library" },
    ]

    const toggleLanguage = () => {
        setLocale(locale === "es" ? "en" : "es")
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        // Clear gamification data from localStorage
        localStorage.removeItem("howstoic_gamification")
        // Redirect to home page
        window.location.href = "/"
    }

    const scrollToSection = (e: React.MouseEvent, href: string) => {
        e.preventDefault()
        setIsMobileMenuOpen(false)
        // If not on home page, redirect to home with hash
        if (pathname !== "/") {
            window.location.href = "/" + href
            return
        }
        const element = document.querySelector(href)
        if (element) {
            const yOffset = -80 // Offset for sticky header
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
            window.scrollTo({ top: y, behavior: 'smooth' })
        }
    }

    if (!mounted) {
        return (
            <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-background/80 backdrop-blur-md" />
        )
    }

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-background/80 backdrop-blur-md shadow-sm border-b border-border/50 py-2"
                    : "bg-transparent py-4"
            )}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-20 h-20 transition-transform group-hover:scale-110">
                            <Image
                                src="/logo1.png"
                                alt="HowStoic Ratio Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-serif font-bold tracking-tight leading-none text-foreground group-hover:text-primary transition-colors">HOWSTOIC</span>
                            <span className="text-[10px] uppercase tracking-widest text-primary leading-none mt-0.5">Digital</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors cursor-pointer"
                                onClick={(e) => scrollToSection(e, link.href)}
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Language Switch */}
                        <Button variant="ghost" size="sm" onClick={toggleLanguage} className="gap-2">
                            <Globe className="w-4 h-4" />
                            <span className="uppercase text-xs font-bold">{locale}</span>
                        </Button>

                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        >
                            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </Button>

                        {/* Cart */}
                        <Button variant="ghost" size="icon" onClick={toggleCart} className="relative">
                            <ShoppingCart className="w-5 h-5" />
                            {items.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                                    {items.length}
                                </span>
                            )}
                        </Button>

                        {/* Auth & Gamification Stats */}
                        {!user ? (
                            <Link href="/login">
                                <Button variant="default" size="sm" className="font-bold">
                                    Sign In
                                </Button>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2">
                                {/* Oro Balance */}
                                <Link href="/tavern" className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 hover:bg-[#FFD700]/20 transition-colors group/oro">
                                    <span className="w-4 h-4 rounded-full bg-[#FFD700] flex items-center justify-center text-[10px] font-bold text-black group-hover/oro:scale-110 transition-transform">$</span>
                                    <span className="text-xs font-bold text-[#FFD700]">{oro}</span>
                                </Link>

                                {/* User & Level */}
                                <div className="flex items-center gap-4">
                                    {/* Level/Dashboard Button (Restored) */}
                                    <Link href="/dashboard" className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors">
                                        <Trophy className="w-4 h-4 text-primary" />
                                        <span className="text-xs font-bold text-primary">Lvl {level}</span>
                                    </Link>



                                    <Link href="/profile" className="relative group">
                                        <div className={cn("relative w-9 h-9 flex items-center justify-center rounded-full bg-secondary transition-all group-hover:bg-primary/10",
                                            (equippedFrame && storeItems) ? "overflow-visible" : "overflow-hidden"
                                        )}>
                                            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                                                <User className="w-5 h-5 text-foreground/80 group-hover:text-primary transition-colors" />
                                            </div>

                                            {/* Equipped Frame Overlay */}
                                            {equippedFrame && (
                                                <div className="absolute pointer-events-none z-10 w-[160%] h-[160%] top-[-30%] left-[-30%]">
                                                    {(() => {
                                                        const frame = storeItems?.find(i => i.id === equippedFrame);
                                                        return frame?.image ? (
                                                            <Image
                                                                src={frame.image}
                                                                alt="Frame"
                                                                fill
                                                                className={cn("object-contain",
                                                                    frame.visualEffect === "shine" && "animate-pulse",
                                                                    frame.visualEffect === "pulse" && "animate-pulse"
                                                                )}
                                                            />
                                                        ) : null;
                                                    })()}
                                                </div>
                                            )}
                                        </div>
                                    </Link>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleLogout}
                                        className="hidden md:flex text-muted-foreground hover:text-destructive transition-colors ml-2"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </Button>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-background/95 backdrop-blur-xl border-l border-border z-50 p-6 shadow-2xl md:hidden flex flex-col gap-6"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-serif font-bold text-lg">Menu</span>
                                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="flex flex-col gap-4">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2 border-b border-border/50"
                                        onClick={(e) => scrollToSection(e, link.href)}
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>

                            <div className="mt-auto flex flex-col gap-4 border-t pt-6">
                                {/* Authentication Section */}
                                {!user ? (
                                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant="default" size="sm" className="w-full font-bold">
                                            Sign In
                                        </Button>
                                    </Link>
                                ) : (
                                    <div className="space-y-3 pb-3 border-b border-border">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                                                <User className="w-5 h-5 text-foreground/80" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">Stoic Warrior</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-primary font-bold">Lvl {level}</span>
                                                    <span className="text-xs text-muted-foreground">•</span>
                                                    <span className="text-xs text-[#FFD700] font-bold">{oro} Oro</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button variant="secondary" size="sm" className="w-full">
                                                View Profile
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => {
                                                setIsMobileMenuOpen(false)
                                                handleLogout()
                                            }}
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Logout
                                        </Button>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Theme</span>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                    >
                                        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Language</span>
                                    <Button variant="secondary" size="sm" onClick={toggleLanguage} className="gap-2">
                                        <Globe className="w-4 h-4" />
                                        <span className="uppercase text-xs font-bold">{locale}</span>
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Cart</span>
                                    <Button variant="secondary" size="icon" onClick={() => { setIsMobileMenuOpen(false); toggleCart(); }}>
                                        <ShoppingCart className="w-4 h-4" />
                                        {items.length > 0 && (
                                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                                                {items.length}
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    )
}
