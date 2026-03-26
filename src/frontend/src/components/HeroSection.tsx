import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

interface HeroSectionProps {
  onDonate: () => void;
  onLearnMore: () => void;
}

export function HeroSection({ onDonate, onLearnMore }: HeroSectionProps) {
  return (
    <section
      id="about"
      className="relative w-full min-h-[380px] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(15,91,58,0.88) 0%, rgba(15,91,58,0.72) 50%, rgba(10,40,25,0.85) 100%), url('/assets/generated/mosque-hero.dim_1400x500.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-10 text-center px-4 sm:px-8 max-w-3xl mx-auto py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-white/80 text-sm font-medium uppercase tracking-widest mb-3">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-4">
            Strengthening Our Community
            <span className="block" style={{ color: "#F0C97A" }}>
              through Technology & Faith
            </span>
          </h1>
          <p className="text-white/85 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            Bugesera Muslim Community — guhuza abanyamuryango, guteza imbere
            transparency, no gutanga inkunga binyuze mu buryo bugezweho.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              size="lg"
              onClick={onDonate}
              data-ocid="hero.primary_button"
              className="rounded-xl px-8 text-white font-semibold"
              style={{ backgroundColor: "#B8944E" }}
            >
              Donate Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onLearnMore}
              data-ocid="hero.secondary_button"
              className="rounded-xl px-8 text-white border-white hover:bg-white/10"
            >
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
