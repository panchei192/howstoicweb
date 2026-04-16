import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getProduct, getProductsInCollection } from "@/lib/shopify"
import { Button } from "@/components/ui/Button"
import { ArrowLeft, Check, ShieldCheck, Zap } from "lucide-react"

interface ProductPageProps {
    params: Promise<{
        handle: string
    }>
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { handle } = await params
    const product = await getProduct(handle)

    if (!product) {
        // Fallback to local data search if Shopify fetch fails or for static items
        // This handles the "tomo" items if they aren't on Shopify yet or if we want to fallback
        // For now, if not found in Shopify, we 404. 
        // In a real scenario, we might want to check the static list too, 
        // but the goal is Shopify integration.
        return notFound()
    }

    const buyUrl = product.onlineStoreUrl || "#"

    return (
        <div className="min-h-screen bg-background pt-16 md:pt-24 pb-12">
            <div className="container mx-auto px-4">
                <Link
                    href="/#products"
                    className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Products
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-start">
                    {/* Image Section */}
                    <div className="relative aspect-square bg-secondary/10 rounded-2xl overflow-hidden border border-border/50 shadow-lg w-full sm:max-w-md lg:max-w-none mx-auto">
                        {product.image ? (
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-primary/20 font-serif font-bold text-6xl">
                                HS
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col space-y-6 lg:space-y-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-foreground break-words">
                                {product.name}
                            </h1>
                            <div className="mt-4 flex items-center gap-4">
                                <span className="text-3xl font-bold text-primary">
                                    ${product.price}
                                </span>
                                {product.oldPrice && (
                                    <span className="text-xl text-muted-foreground line-through">
                                        ${product.oldPrice}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="prose prose-base md:prose-lg dark:prose-invert text-muted-foreground break-words">
                            <p>{product.description}</p>
                        </div>

                        <div className="border-t border-border pt-8 space-y-6">
                            <Button
                                className="w-full text-lg py-6 shadow-xl shadow-primary/20"
                                size="lg"
                                asChild
                            >
                                <a href={buyUrl} target="_blank" rel="noopener noreferrer">
                                    Buy Now on Shopify
                                    <Zap className="w-5 h-5 ml-2" />
                                </a>
                            </Button>

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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
