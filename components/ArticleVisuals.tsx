import { Stethoscope, Compass, Wind, CloudRain, HeartHandshake, Flame, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";

export const categoryStyles: Record<string, { gradient: string; icon: LucideIcon; tint: string; accent: string }> = {
    "Access to Care": { gradient: "linear-gradient(135deg, #3d8b8b 0%, #245050 100%)", icon: Stethoscope, tint: "rgba(61,139,139,0.10)", accent: "#3d8b8b" },
    "Getting Started": { gradient: "linear-gradient(135deg, #7ba98b 0%, #45684f 100%)", icon: Compass, tint: "rgba(123,169,139,0.12)", accent: "#5a8a6b" },
    Anxiety: { gradient: "linear-gradient(135deg, #8fb4a8 0%, #4f7468 100%)", icon: Wind, tint: "rgba(143,180,168,0.15)", accent: "#6b9a8a" },
    Depression: { gradient: "linear-gradient(135deg, #6a8a9b 0%, #38505e 100%)", icon: CloudRain, tint: "rgba(106,138,155,0.12)", accent: "#5a7a8b" },
    Relationships: { gradient: "linear-gradient(135deg, #c98a8a 0%, #934f5c 100%)", icon: HeartHandshake, tint: "rgba(201,138,138,0.12)", accent: "#c17e8a" },
    Burnout: { gradient: "linear-gradient(135deg, #cf9f5e 0%, #94652f 100%)", icon: Flame, tint: "rgba(207,159,94,0.12)", accent: "#c99a5a" },
    Trauma: { gradient: "linear-gradient(135deg, #2d7a5a 0%, #16261f 100%)", icon: ShieldCheck, tint: "rgba(45,122,90,0.12)", accent: "#2d7a5a" },
    Default: { gradient: "linear-gradient(135deg, var(--sage-dark), var(--teal))", icon: Sparkles, tint: "rgba(123,169,139,0.10)", accent: "#7ba98b" },
};

export function getCategoryStyle(category: string) {
    return categoryStyles[category] ?? categoryStyles.Default;
}

/**
 * Cover image for an article. Uses `article.image` if provided,
 * otherwise renders a category-themed gradient + icon cover.
 */
export function ArticleCover({
    image,
    category,
    title,
    iconSize = 64,
    className = "",
}: {
    image: string | null;
    category: string;
    title: string;
    iconSize?: number;
    className?: string;
}) {
    if (image) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={image} alt={title} className={`w-full h-full object-cover ${className}`} />;
    }

    const style = getCategoryStyle(category);
    const Icon = style.icon;

    return (
        <div className={`relative w-full h-full overflow-hidden ${className}`} style={{ background: style.gradient }}>
            <div
                className="absolute inset-0"
                style={{ background: "radial-gradient(circle at 22% 28%, rgba(255,255,255,0.16), transparent 55%)" }}
            />
            <Icon
                size={iconSize}
                strokeWidth={1}
                style={{
                    position: "absolute",
                    right: "-10%",
                    bottom: "-14%",
                    color: "rgba(255,255,255,0.16)",
                }}
            />
        </div>
    );
}