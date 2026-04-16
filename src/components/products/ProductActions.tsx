"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/Button"
import { ShoppingCart, Check, ShieldCheck, X, Globe } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/context/CartContext"

interface Variant {
    id: string
    title: string
    price: number
}

interface ProductActionsProps {
    product: {
        id: string
        title: string
        image: string
        price: number
    }
    variants: Variant[]
}

export function ProductActions({ product, variants }: ProductActionsProps) {
    const { addItem } = useCart()
    const hasVariants = variants.length > 1 && variants[0].title !== "Default Title"
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedVariantId, setSelectedVariantId] = useState<string>(
        variants.length > 0 ? variants[0].id : ""
    )

    const selectedVariant = variants.find(v => v.id === selectedVariantId)
    const currentPrice = selectedVariant ? selectedVariant.price : product.price

    // If has variants, clicking Buy opens modal. If not, add to cart directly.
    const handleMainClick = (e: React.MouseEvent) => {
        if (hasVariants) {
            e.preventDefault()
            setIsModalOpen(true)
        } else {
            // Direct add
            addItem({
                id: product.id,
                name: product.title,
                price: product.price,
                image: product.image,
                variantId: variants.length > 0 ? variants[0].id : undefined,
                variantTitle: variants.length > 0 ? variants[0].title : undefined
            })
        }
    }

    const handleConfirmVariant = (variantId: string) => {
        const variant = variants.find(v => v.id === variantId)
        if (variant) {
            addItem({
                id: product.id,
                name: product.title,
                price: variant.price,
                image: product.image,
                variantId: variant.id,
                variantTitle: variant.title
            })
            setIsModalOpen(false)
        }
    }

    return (
        <div className="space-y-6 max-w-xl">
            <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-primary">
                    ${currentPrice}
                </span>
            </div>

            {/* Main Buy Button */}
            <Button
                className="w-full text-lg py-6 relative overflow-hidden group gap-2 bg-gradient-to-r from-[var(--gold)] to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold shadow-[0_0_20px_rgba(234,179,8,0.3)] border-none transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)]"
                size="lg"
                onClick={handleMainClick}
            >
                {hasVariants ? "Select Option & Add to Cart" : "Add to Cart"}
                <ShoppingCart className="w-6 h-6 ml-2 group-hover:scale-110 transition-transform" />
            </Button>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                    <span>Secure checkout via Shopify</span>
                </div>
                <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>Instant digital delivery</span>
                </div>
            </div>

            {/* Variant Selection Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-10"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-border/50">
                                <h3 className="font-serif font-bold text-xl flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-primary" />
                                    Select Option
                                </h3>
                                <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="p-6 space-y-4">
                                <p className="text-muted-foreground text-sm">
                                    Please select your preferred version to add to cart.
                                </p>
                                <div className="grid gap-3">
                                    {variants.map(variant => (
                                        <button
                                            key={variant.id}
                                            onClick={() => handleConfirmVariant(variant.id)}
                                            className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/50 transition-all group text-left"
                                        >
                                            <span className="font-bold text-lg group-hover:text-primary transition-colors">
                                                {variant.title}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground group-hover:text-foreground">
                                                    ${variant.price}
                                                </span>
                                                <ShoppingCart className="w-4 h-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
