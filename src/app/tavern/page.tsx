"use client"

import React, { useState } from "react"
import { useGamification, StoreItem } from "@/context/GamificationContext"

import { motion } from "framer-motion"
import { Coins, Lock, Check } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Navbar } from "@/components/layout/Navbar"

export default function TavernPage() {
    const { oro, buyItem, inventory, equipFrame, equippedFrame, equipTheme, equippedTheme, storeItems, addOro } = useGamification()
    const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null)
    const [isBuying, setIsBuying] = useState(false)

    const handleBuy = async (item: StoreItem) => {
        setIsBuying(true)
        if (await buyItem(item)) {
            // Success feedback could go here
            setSelectedItem(null)
        }
        setIsBuying(false)
    }

    return (
        <div className="min-h-screen bg-black relative text-white pt-24 pb-12">
            <Navbar />
            {/* Background Image */}
            <div className="fixed inset-0 z-0">
                <Image
                    src="/tavern-bg.png"
                    alt="Greek Tavern Background"
                    fill
                    className="object-cover opacity-40 blur-[2px]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4"
                    >
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#FFD700] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                            The Stoic Tavern
                        </h1>
                        <p className="text-xl text-white/80 mt-2 font-light">
                            Spend your hard-earned Oro on legendary rewards.
                        </p>
                    </motion.div>

                    {/* Oro Display */}
                    <div className="flex items-center gap-3 bg-black/60 border border-[#FFD700]/30 px-6 py-3 rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                        <Coins className="w-6 h-6 text-[#FFD700]" />
                        <span className="text-2xl font-bold text-[#FFD700]">{oro}</span>
                        <span className="text-sm text-[#FFD700]/80 uppercase tracking-widest">Oro</span>
                    </div>
                </div>

                {/* Shop Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {storeItems.map((item, index) => {
                        const isOwned = inventory.includes(item.id)
                        const canAfford = oro >= item.price

                        // Theme helpers
                        const isEquipped = item.type === "frame" ? equippedFrame === item.id : item.type === "theme" ? equippedTheme === item.id : false

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={cn(
                                    "relative bg-[#1a1a1a]/80 backdrop-blur-md border rounded-xl overflow-hidden group hover:border-[#FFD700]/50 transition-all duration-300",
                                    isOwned ? "border-[#FFD700]/20" : "border-white/10"
                                )}
                            >
                                {/* Item Image Area */}
                                <div className="h-48 relative flex items-center justify-center bg-black/40 p-6">
                                    {item.type === "frame" && item.image ? (
                                        <div className="relative w-32 h-32">
                                            {/* Avatar Placeholder inside frame */}
                                            <div className="absolute inset-2 bg-neutral-800 rounded-full overflow-hidden flex items-center justify-center">
                                                <span className="text-4xl text-neutral-600">?</span>
                                            </div>
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-contain relative z-10"
                                                onError={(e) => {
                                                    // Fallback if image fails
                                                    e.currentTarget.style.display = 'none'
                                                }}
                                            />
                                        </div>
                                    ) : item.type === "theme" ? (
                                        // Theme Preview
                                        <div className="flex flex-col gap-2 w-full max-w-[120px]">
                                            <div className={cn("h-8 w-full rounded border overflow-hidden relative",
                                                item.id === "theme_spartan" && "bg-[hsl(0,0%,5%)] border-[hsl(45,30%,20%)]",
                                                item.id === "theme_marble" && "bg-[hsl(210,20%,98%)] border-[hsl(210,10%,85%)]",
                                                item.id === "theme_void" && "bg-[hsl(222,47%,11%)] border-[hsl(196,100%,50%)]",
                                                item.id === "theme_royal" && "bg-[hsl(260,20%,10%)] border-[hsl(45,93%,47%)]",
                                                item.id === "theme_forest" && "bg-[hsl(150,15%,10%)] border-[hsl(142,70%,50%)]",
                                                item.id === "theme_sunset" && "bg-[hsl(280,20%,15%)] border-[hsl(20,90%,60%)]"
                                            )}>
                                                <div className={cn("h-full w-1/3 border-r absolute left-0 top-0 bottom-0",
                                                    item.id === "theme_spartan" && "bg-[hsl(0,70%,40%)] border-[hsl(45,30%,20%)]",
                                                    item.id === "theme_marble" && "bg-[hsl(45,40%,60%)] border-[hsl(210,10%,85%)]",
                                                    item.id === "theme_void" && "bg-[hsl(196,100%,50%)] border-[hsl(196,80%,30%)]",
                                                    item.id === "theme_royal" && "bg-[hsl(260,30%,25%)] border-[hsl(45,93%,47%)]",
                                                    item.id === "theme_forest" && "bg-[hsl(142,70%,50%)] border-[hsl(145,20%,25%)]",
                                                    item.id === "theme_sunset" && "bg-[hsl(20,90%,60%)] border-[hsl(320,30%,25%)]"
                                                )} />
                                            </div>
                                            <div className={cn("h-4 w-2/3 rounded-full self-center",
                                                item.id === "theme_spartan" && "bg-[hsl(45,30%,90%)]",
                                                item.id === "theme_marble" && "bg-[hsl(210,10%,20%)]",
                                                item.id === "theme_void" && "bg-[hsl(210,40%,98%)]",
                                                item.id === "theme_royal" && "bg-[hsl(260,10%,95%)]",
                                                item.id === "theme_forest" && "bg-[hsl(140,20%,90%)]",
                                                item.id === "theme_sunset" && "bg-[hsl(20,20%,90%)]"
                                            )} />
                                        </div>
                                    ) : (
                                        <div className={cn(
                                            "w-24 h-24 rounded-full flex items-center justify-center border",
                                            item.id === "streak_freeze"
                                                ? "bg-blue-500/10 border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                                : "bg-[#FFD700]/10 border-[#FFD700]/30"
                                        )}>
                                            {item.id === "streak_freeze" ? (
                                                <div className="text-4xl">❄️</div>
                                            ) : (
                                                <Coins className="w-10 h-10 text-[#FFD700]/50" />
                                            )}
                                        </div>
                                    )}

                                    {isOwned && (
                                        <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded text-xs font-bold uppercase flex items-center gap-1">
                                            <Check className="w-3 h-3" /> Owned
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold font-serif text-[#f0e6d2]">{item.name}</h3>
                                        <div className="flex items-center gap-1 text-[#FFD700]">
                                            <Coins className="w-4 h-4" />
                                            <span className="font-bold">{item.price}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-6 min-h-[40px]">{item.description}</p>

                                    <Button
                                        disabled={isBuying || (isOwned && (item.type === "frame" ? equippedFrame === item.id : item.type === "theme" ? equippedTheme === item.id : false)) || (!canAfford && !isOwned)}
                                        className={cn(
                                            "w-full font-bold tracking-wide",
                                            isOwned && (item.type === "frame" || item.type === "theme")
                                                ? isEquipped
                                                    ? "bg-green-500 text-white hover:bg-green-600"
                                                    : "bg-neutral-700 text-neutral-400 hover:bg-neutral-600"
                                                : canAfford
                                                    ? "bg-[#FFD700] text-black hover:bg-[#FFD700]/90"
                                                    : "bg-neutral-800 text-neutral-500 hover:bg-neutral-800 cursor-not-allowed"
                                        )}
                                        onClick={() => {
                                            if (isOwned) {
                                                if (item.type === "frame") equipFrame(item.id)
                                                if (item.type === "theme") equipTheme(item.id)
                                            } else if (canAfford) {
                                                handleBuy(item)
                                            }
                                        }}
                                    >
                                        {isOwned && (item.type === "frame" || item.type === "theme") ? (
                                            isEquipped ? "Equipped" : "Equip"
                                        ) : (
                                            canAfford ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    {isBuying ? "Buying..." : `Purchase ${item.type === "powerup" && isOwned ? `(Owned: ${inventory.filter(id => id === item.id).length})` : ''}`}
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    <Lock className="w-3 h-3" /> Need {item.price - oro} more
                                                </span>
                                            )
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Buy Oro Section */}
                <div className="mt-20 max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-serif font-bold text-[#FFD700] mb-2">Treasury of the Empire</h2>
                        <p className="text-white/60">Acquire more wealth to show your status.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { amount: 1000, price: 4.99, name: "Pouch of coin", icon: Coins, color: "bg-amber-600" },
                            { amount: 5000, price: 9.99, name: "Merchant's sack", icon: Coins, color: "bg-slate-400" },
                            { amount: 15000, price: 24.99, name: "Emperor's Chest", icon: Coins, color: "bg-[#FFD700]" }
                        ].map((pack, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 flex flex-col items-center text-center hover:border-[#FFD700]/30 transition-colors group"
                            >
                                <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-4 text-black font-bold shadow-[0_0_15px_rgba(255,215,0,0.3)] group-hover:scale-110 transition-transform", pack.color)}>
                                    <pack.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-1">{pack.name}</h3>
                                <p className="text-[#FFD700] font-bold text-2xl mb-6">+{pack.amount} Oro</p>

                                <Button
                                    className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
                                    onClick={() => {
                                        addOro(pack.amount)
                                        // Ideally confirm payment
                                    }}
                                >
                                    ${pack.price}
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
