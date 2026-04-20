import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight } from "lucide-react";
import heroImg from "@/assets/building.png";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language.startsWith('ar');

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroImg} alt="Fire protection systems" className="w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-hero opacity-90" />
      </div>

      <div className="container relative z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl ltr:text-left rtl:text-right"
        >
          <div className="flex items-center gap-2 mb-6 rtl:flex-row-reverse rtl:justify-end">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary tracking-wider uppercase">
              {t('home.hero.tagline')}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display text-secondary-foreground leading-[1.1] mb-6">
            {t('home.hero.titlePart1')}
            <span className="text-gradient-fire">{t('home.hero.titleHighlight')}</span>
            {t('home.hero.titlePart2')}
          </h1>

          <p className="text-lg md:text-xl text-secondary-foreground/70 max-w-2xl mb-10 leading-relaxed">
            {t('home.hero.subtitle')}
          </p>

          <div className="flex flex-wrap gap-4 rtl:flex-row-reverse rtl:justify-end">
            <Link to="/products">
              <Button size="lg" className="text-base px-8 h-12 flex items-center gap-2">
                {t('home.hero.explore')} <ArrowRight className={cn("w-4 h-4 transition-transform", isRtl && "rotate-180")} />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="ghost"
                size="lg"
                className="text-base px-8 h-12 border border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground"
              >
                {t('home.hero.contact')}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
