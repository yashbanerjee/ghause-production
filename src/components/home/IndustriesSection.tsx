import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Factory, Plane, Ship, Building2, Heart, HardHat, Landmark } from "lucide-react";
import { useTranslation } from "react-i18next";

const IndustriesSection = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const industries = [
    { icon: Factory, title: t('home.industries.names.oilGas'), href: "/industries" },
    { icon: Plane, title: t('home.industries.names.airports'), href: "/industries" },
    { icon: Ship, title: t('home.industries.names.marine'), href: "/industries" },
    { icon: Building2, title: t('home.industries.names.commercial'), href: "/industries" },
    { icon: Heart, title: t('home.industries.names.hospitals'), href: "/industries" },
    { icon: HardHat, title: t('home.industries.names.industrial'), href: "/industries" },
    { icon: Landmark, title: t('home.industries.names.infrastructure'), href: "/industries" },
  ];

  return (
    <section className="py-20 bg-muted">
      <div className="container">
        <div className={`mb-14 ${isRtl ? 'text-right' : 'text-center'}`}>
          <span className="text-sm font-semibold text-primary tracking-wider uppercase">{t('home.industries.tagline')}</span>
          <h2 className="text-4xl lg:text-5xl font-display text-foreground mt-3">
            {t('home.industries.title')}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {industries.map((ind, i) => (
            <motion.div
              key={ind.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              viewport={{ once: true }}
            >
              <Link
                to={ind.href}
                className="group flex flex-col items-center gap-3 p-6 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary transition-colors">
                  <ind.icon className="w-6 h-6 text-secondary-foreground group-hover:text-primary-foreground transition-colors" />
                </div>
                <span className="text-xs font-semibold text-foreground text-center">{ind.title}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustriesSection;
