"use client"

import React, { useState, useEffect } from "react"
import { useGamification, StoreItem } from "@/context/GamificationContext"
import { motion } from "framer-motion"
import { Shield, Trophy, Check, User, Settings, Bell, Lock, Mail, UserCircle, Eye, EyeOff, Save, ChevronDown } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Navbar } from "@/components/layout/Navbar"
import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabase"

export default function ProfilePage() {
    const {
        level,
        xp,
        achievements,
        inventory,
        equippedFrame,
        equipFrame,
        equippedTheme,
        equipTheme,
        storeItems
    } = useGamification()

    const { user } = useAuth()

    const userEmail = user?.email ?? ""

    // Account settings state
    const [username, setUsername] = useState("")
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showCurrentPwd, setShowCurrentPwd] = useState(false)
    const [showNewPwd, setShowNewPwd] = useState(false)
    const [showConfirmPwd, setShowConfirmPwd] = useState(false)
    const [notifOrders, setNotifOrders] = useState(true)
    const [notifPromos, setNotifPromos] = useState(false)
    const [notifXP, setNotifXP] = useState(true)
    const [savedMsg, setSavedMsg] = useState<string | null>(null)
    const [saveError, setSaveError] = useState<string | null>(null)
    const [activeSection, setActiveSection] = useState<string | null>("personal")
    const [loadingProfile, setLoadingProfile] = useState(true)

    // Load display_name from users_profile table
    useEffect(() => {
        if (!user) return
        const fetchProfile = async () => {
            setLoadingProfile(true)
            const { data, error } = await (supabase as any)
                .from("users_profile")
                .select("display_name")
                .eq("id", user.id)
                .single()
            if (!error && data?.display_name) {
                setUsername(data.display_name as string)
            } else {
                // Fallback to metadata or email prefix
                setUsername(
                    user.user_metadata?.full_name
                    ?? user.user_metadata?.name
                    ?? userEmail.split("@")[0]
                    ?? "Stoic Warrior"
                )
            }
            setLoadingProfile(false)
        }
        fetchProfile()
    }, [user])

    const handleSavePersonal = async () => {
        setSaveError(null)
        if (!user) return
        const { error } = await (supabase as any)
            .from("users_profile")
            .update({ display_name: username })
            .eq("id", user.id)
        if (error) {
            setSaveError("No se pudo guardar. Intentá de nuevo.")
        } else {
            setSavedMsg("personal")
            setTimeout(() => setSavedMsg(null), 2500)
        }
    }

    const handleSave = (section: string) => {
        setSavedMsg(section)
        setTimeout(() => setSavedMsg(null), 2500)
    }

    const toggleSection = (section: string) => {
        setActiveSection(prev => prev === section ? null : section)
    }

    // Filter store items to only show owned frames
    const ownedFrames = storeItems.filter(
        item => item.type === "frame" && inventory.includes(item.id)
    )

    // Filter store items to only show owned themes
    const ownedThemes = storeItems.filter(
        item => item.type === "theme" && inventory.includes(item.id)
    )

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <Navbar />
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                        {/* Profile Picture with Frame */}
                        <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
                            {/* User Avatar Placeholder */}
                            <div className="absolute inset-2 bg-secondary rounded-full overflow-hidden flex items-center justify-center">
                                <User className="w-16 h-16 text-muted-foreground" />
                            </div>

                            {/* Equipped Frame */}
                            {equippedFrame && (
                                <div className="absolute inset-0 pointer-events-none z-10 w-[140%] h-[140%] top-[-20%] left-[-20%]">
                                    {(() => {
                                        const frame = storeItems.find(i => i.id === equippedFrame);
                                        return frame?.image ? (
                                            <Image
                                                src={frame.image}
                                                alt="Equipped Frame"
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

                        {/* User Info */}
                        <div className="text-center md:text-left space-y-2">
                            <h1 className="text-4xl font-serif font-bold">{username}</h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm">
                                    Level {level}
                                </div>
                                <div className="px-3 py-1 rounded-full bg-secondary border border-border text-muted-foreground font-medium text-sm">
                                    {xp} XP
                                </div>
                            </div>
                            <p className="text-muted-foreground max-w-md">
                                "The happiness of your life depends upon the quality of your thoughts."
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Frames Inventory */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Shield className="w-5 h-5 text-primary" />
                                <h2 className="text-2xl font-serif font-bold">Frame Collection</h2>
                            </div>

                            {ownedFrames.length === 0 ? (
                                <div className="p-8 border border-dashed rounded-xl text-center text-muted-foreground">
                                    You don't own any frames yet. Visit the Tavern to buy some!
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {ownedFrames.map((frame) => (
                                        <div
                                            key={frame.id}
                                            className={cn(
                                                "relative aspect-square rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:bg-secondary/50",
                                                equippedFrame === frame.id
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border bg-card"
                                            )}
                                            onClick={() => equipFrame(frame.id)}
                                        >
                                            <div className="relative w-full h-full flex items-center justify-center">
                                                {frame.image && (
                                                    <div className="relative w-full h-full">
                                                        <Image
                                                            src={frame.image}
                                                            alt={frame.name}
                                                            fill
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-xs font-bold text-center truncate w-full">{frame.name}</p>

                                            {equippedFrame === frame.id && (
                                                <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                                    Equipped
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Themes Inventory */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl">🎨</span>
                                <h2 className="text-2xl font-serif font-bold">Theme Collection</h2>
                            </div>

                            {ownedThemes.length === 0 ? (
                                <div className="p-8 border border-dashed rounded-xl text-center text-muted-foreground">
                                    You don't own any themes yet. Visit the Treasury to unlock them!
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {ownedThemes.map((theme) => (
                                        <div
                                            key={theme.id}
                                            className={cn(
                                                "relative aspect-square rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:bg-secondary/50",
                                                equippedTheme === theme.id
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border bg-card"
                                            )}
                                            onClick={() => equipTheme(theme.id)}
                                        >
                                            <div className="flex flex-col gap-2 w-full max-w-[80%] items-center justify-center h-full">
                                                <div className={cn("h-12 w-full rounded border shadow-lg overflow-hidden relative",
                                                    theme.id === "theme_spartan" && "bg-[hsl(0,0%,5%)] border-[hsl(45,30%,20%)]",
                                                    theme.id === "theme_marble" && "bg-[hsl(210,20%,98%)] border-[hsl(210,10%,85%)]",
                                                    theme.id === "theme_void" && "bg-[hsl(222,47%,11%)] border-[hsl(196,100%,50%)]",
                                                    theme.id === "theme_royal" && "bg-[hsl(260,20%,10%)] border-[hsl(45,93%,47%)]",
                                                    theme.id === "theme_forest" && "bg-[hsl(150,15%,10%)] border-[hsl(142,70%,50%)]",
                                                    theme.id === "theme_sunset" && "bg-[hsl(280,20%,15%)] border-[hsl(20,90%,60%)]"
                                                )}>
                                                    <div className={cn("h-full w-1/3 border-r absolute left-0 top-0 bottom-0",
                                                        theme.id === "theme_spartan" && "bg-[hsl(0,70%,40%)] border-[hsl(45,30%,20%)]",
                                                        theme.id === "theme_marble" && "bg-[hsl(45,40%,60%)] border-[hsl(210,10%,85%)]",
                                                        theme.id === "theme_void" && "bg-[hsl(196,100%,50%)] border-[hsl(196,80%,30%)]",
                                                        theme.id === "theme_royal" && "bg-[hsl(260,30%,25%)] border-[hsl(45,93%,47%)]",
                                                        theme.id === "theme_forest" && "bg-[hsl(142,70%,50%)] border-[hsl(145,20%,25%)]",
                                                        theme.id === "theme_sunset" && "bg-[hsl(20,90%,60%)] border-[hsl(320,30%,25%)]"
                                                    )} />
                                                </div>
                                            </div>

                                            <p className="text-xs font-bold text-center truncate w-full">{theme.name}</p>

                                            {equippedTheme === theme.id && (
                                                <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                                    Active
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Achievements */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Trophy className="w-5 h-5 text-[#FFD700]" />
                                <h2 className="text-2xl font-serif font-bold">Achievements</h2>
                            </div>

                            <div className="space-y-3">
                                {achievements.map((achievement) => (
                                    <div
                                        key={achievement.id}
                                        className={cn(
                                            "flex items-start gap-4 p-4 rounded-xl border transition-all",
                                            achievement.completed
                                                ? "bg-secondary/30 border-primary/20"
                                                : "bg-muted/30 border-transparent opacity-60"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                                            achievement.completed ? "bg-[#FFD700]/10 text-[#FFD700]" : "bg-muted text-muted-foreground"
                                        )}>
                                            {achievement.completed ? <Check className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className={cn("font-bold", achievement.completed ? "text-foreground" : "text-muted-foreground")}>
                                                {achievement.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">{achievement.description}</p>

                                            {!achievement.completed && (
                                                <div className="mt-2 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary/50 transition-all duration-500"
                                                        style={{ width: `${Math.min(100, (achievement.progress / achievement.target) * 100)}%` }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            {achievement.completed && (
                                                <div className="text-xs font-bold text-primary flex flex-col items-end">
                                                    <span>+{achievement.rewardXp} XP</span>
                                                    <span>+{achievement.rewardOro} Oro</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Account Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-12 space-y-4"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <Settings className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-serif font-bold">Configuración de Cuenta</h2>
                                <p className="text-sm text-muted-foreground">Administrá y modificá tu información personal</p>
                            </div>
                        </div>

                        {/* Personal Info */}
                        <div className="rounded-2xl border border-border bg-card overflow-hidden">
                            <button
                                onClick={() => toggleSection("personal")}
                                className="w-full flex items-center justify-between px-6 py-4 hover:bg-secondary/30 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <UserCircle className="w-5 h-5 text-primary" />
                                    <span className="font-semibold">Información Personal</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${activeSection === "personal" ? "rotate-180" : ""}`} />
                            </button>
                            {activeSection === "personal" && (
                                <div className="px-6 pb-6 space-y-4 border-t border-border pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                                                <UserCircle className="w-3.5 h-3.5" /> Nombre de usuario
                                            </label>
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={e => setUsername(e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
                                                placeholder="Tu nombre de usuario"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                                                <Mail className="w-3.5 h-3.5" /> Email
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    value={userEmail}
                                                    readOnly
                                                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-muted-foreground text-sm cursor-not-allowed select-none"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                                                    Solo lectura
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-muted-foreground/70">El email se gestiona desde Supabase Auth</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        {saveError && (
                                            <p className="text-xs text-red-400">{saveError}</p>
                                        )}
                                        <button
                                            onClick={handleSavePersonal}
                                            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95"
                                        >
                                            <Save className="w-4 h-4" />
                                            {savedMsg === "personal" ? "¡Guardado!" : "Guardar cambios"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Password */}
                        <div className="rounded-2xl border border-border bg-card overflow-hidden">
                            <button
                                onClick={() => toggleSection("password")}
                                className="w-full flex items-center justify-between px-6 py-4 hover:bg-secondary/30 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Lock className="w-5 h-5 text-primary" />
                                    <span className="font-semibold">Contraseña</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${activeSection === "password" ? "rotate-180" : ""}`} />
                            </button>
                            {activeSection === "password" && (
                                <div className="px-6 pb-6 space-y-4 border-t border-border pt-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-muted-foreground">Contraseña actual</label>
                                        <div className="relative">
                                            <input
                                                type={showCurrentPwd ? "text" : "password"}
                                                value={currentPassword}
                                                onChange={e => setCurrentPassword(e.target.value)}
                                                className="w-full px-4 py-2.5 pr-11 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
                                                placeholder="••••••••"
                                            />
                                            <button onClick={() => setShowCurrentPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                                {showCurrentPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-muted-foreground">Nueva contraseña</label>
                                            <div className="relative">
                                                <input
                                                    type={showNewPwd ? "text" : "password"}
                                                    value={newPassword}
                                                    onChange={e => setNewPassword(e.target.value)}
                                                    className="w-full px-4 py-2.5 pr-11 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
                                                    placeholder="••••••••"
                                                />
                                                <button onClick={() => setShowNewPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                                    {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-muted-foreground">Confirmar contraseña</label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPwd ? "text" : "password"}
                                                    value={confirmPassword}
                                                    onChange={e => setConfirmPassword(e.target.value)}
                                                    className={`w-full px-4 py-2.5 pr-11 rounded-xl bg-secondary border text-foreground text-sm focus:outline-none focus:ring-2 transition-all ${confirmPassword && newPassword !== confirmPassword
                                                        ? "border-red-500/50 focus:ring-red-500/30"
                                                        : "border-border focus:ring-primary/40 focus:border-primary/50"
                                                        }`}
                                                    placeholder="••••••••"
                                                />
                                                <button onClick={() => setShowConfirmPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                                    {showConfirmPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            {confirmPassword && newPassword !== confirmPassword && (
                                                <p className="text-xs text-red-400">Las contraseñas no coinciden</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => handleSave("password")}
                                            disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
                                            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <Save className="w-4 h-4" />
                                            {savedMsg === "password" ? "¡Guardado!" : "Actualizar contraseña"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Notifications */}
                        <div className="rounded-2xl border border-border bg-card overflow-hidden">
                            <button
                                onClick={() => toggleSection("notifications")}
                                className="w-full flex items-center justify-between px-6 py-4 hover:bg-secondary/30 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Bell className="w-5 h-5 text-primary" />
                                    <span className="font-semibold">Notificaciones</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${activeSection === "notifications" ? "rotate-180" : ""}`} />
                            </button>
                            {activeSection === "notifications" && (
                                <div className="px-6 pb-6 space-y-3 border-t border-border pt-4">
                                    {[
                                        { label: "Pedidos y envíos", desc: "Actualizaciones sobre el estado de tus pedidos", value: notifOrders, set: setNotifOrders },
                                        { label: "Promociones y ofertas", desc: "Descuentos exclusivos y novedades de la tienda", value: notifPromos, set: setNotifPromos },
                                        { label: "XP y logros", desc: "Notificaciones cuando ganás experiencia o desbloqueás logros", value: notifXP, set: setNotifXP },
                                    ].map(({ label, desc, value, set }) => (
                                        <div key={label} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                                            <div>
                                                <p className="text-sm font-medium">{label}</p>
                                                <p className="text-xs text-muted-foreground">{desc}</p>
                                            </div>
                                            <button
                                                onClick={() => set((v: boolean) => !v)}
                                                className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${value ? "bg-primary" : "bg-secondary border border-border"
                                                    }`}
                                            >
                                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${value ? "translate-x-5" : "translate-x-0"
                                                    }`} />
                                            </button>
                                        </div>
                                    ))}
                                    <div className="flex justify-end pt-2">
                                        <button
                                            onClick={() => handleSave("notifications")}
                                            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95"
                                        >
                                            <Save className="w-4 h-4" />
                                            {savedMsg === "notifications" ? "¡Guardado!" : "Guardar preferencias"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Danger Zone */}
                        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 overflow-hidden">
                            <div className="px-6 py-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                                    <span className="text-red-400 text-sm">⚠️</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-red-400 text-sm">Zona de peligro</p>
                                    <p className="text-xs text-muted-foreground">Estas acciones son irreversibles</p>
                                </div>
                                <button className="px-4 py-1.5 rounded-xl border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/10 transition-colors">
                                    Eliminar cuenta
                                </button>
                            </div>
                        </div>

                    </motion.div>

                </motion.div>
            </div>
        </div>
    )
}
