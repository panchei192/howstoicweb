import { Product } from "@/data/products"
import { Card } from "./Card"
import { Button } from "./Button"
import { useCart } from "@/context/CartContext"
import { useI18n } from "@/context/I18nContext"
import { ShoppingCart, Globe, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useState } from "react"

interface ProductCardProps {
    product: Product
    className?: string
    onPurchase?: () => void
}

export function ProductCard({ product, className, onPurchase }: ProductCardProps) {
    const { addItem } = useCart()
    const { t } = useI18n()
    const [isModalOpen, setIsModalOpen] = useState(false)

    const variants = product.variants || []
    const hasVariants = variants.length > 1 && variants[0].title !== "Default Title"

    return (
        <Card className={cn("overflow-hidden flex flex-col h-full group border-border/50 bg-secondary/10 hover:bg-secondary/20 transition-colors", className)}>
            <div className="relative aspect-square bg-muted overflow-hidden">
                {/* Placeholder for image */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center text-primary/20 font-serif font-bold text-4xl group-hover:scale-105 transition-transform duration-500">
                    {product.image ? (
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        "HS"
                    )}
                </div>
                {product.isNew && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        New
                    </div>
                )}
                {product.popular && (
                    <div className="absolute top-2 left-2 bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm dark:bg-primary/20 dark:text-primary dark:border-primary/50">
                        Popular
                    </div>
                )}
            </div>
            <div className="p-5 flex flex-col flex-1 gap-4">
                <div className="space-y-1">
                    <h3 className="font-serif font-bold text-xl leading-snug group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-lg text-foreground">${product.price}</span>
                            {product.oldPrice && (
                                <span className="text-xs text-muted-foreground line-through">${product.oldPrice}</span>
                            )}
                        </div>
                    </div>
                    <Button
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (hasVariants) {
                                setIsModalOpen(true);
                            } else {
                                addItem({
                                    id: product.id,
                                    name: product.name,
                                    price: product.price,
                                    image: product.image,
                                    variantId: product.variantId,
                                    variantTitle: variants.length > 0 ? variants[0].title : undefined
                                });
                            }
                        }}
                        className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold shadow-lg shadow-amber-900/20 border-none transition-all duration-300 hover:scale-105"
                    >
                        <span>{hasVariants ? "Select Option" : t("products.addToCart")}</span>
                        <ShoppingCart className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Variant Selection Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 cursor-default"
                        onClick={(e) => e.stopPropagation()} // Prevent card click propagation
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsModalOpen(false);
                            }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-sm bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-secondary/10">
                                <h3 className="font-serif font-bold text-lg flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-primary" />
                                    Select Option
                                </h3>
                                <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="h-8 w-8">
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="p-4 space-y-3">
                                <p className="text-muted-foreground text-xs">
                                    Select version for <strong>{product.name}</strong>
                                </p>
                                <div className="grid gap-2">
                                    {variants.map(variant => (
                                        <button
                                            key={variant.id}
                                            onClick={() => {
                                                addItem({
                                                    id: product.id,
                                                    name: product.name,
                                                    price: variant.price,
                                                    image: product.image,
                                                    variantId: variant.id,
                                                    variantTitle: variant.title
                                                });
                                                setIsModalOpen(false);
                                            }}
                                            className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/50 transition-all group text-left"
                                        >
                                            <span className="font-bold text-sm group-hover:text-primary transition-colors">
                                                {variant.title}
                                            </span>
                                            <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground">
                                                ${variant.price}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Card>
    )
}
