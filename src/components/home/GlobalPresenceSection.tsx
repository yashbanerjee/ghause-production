import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

const GlobalPresenceSection = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language.startsWith('ar');

  const locations = [
    { city: t('home.reach.locations.usaCanada'), country: t('home.reach.locations.northAmerica'), region: "Regional Support" },
    { city: t('home.reach.locations.dubai'), country: t('home.reach.locations.uae'), region: "Middle East HQ" },
    { city: t('home.reach.locations.birmingham'), country: t('home.reach.locations.uk'), region: "Europe Support" },
    { city: t('home.reach.locations.bangalore'), country: t('home.reach.locations.india'), region: "Regional Support" },
  ];

  return (
    <section className="py-20 gradient-navy text-secondary-foreground">
      <div className="container">
        <div className={`mb-14 ${isRtl ? 'text-right' : 'text-center'}`}>
          <span className="text-sm font-semibold text-primary tracking-wider uppercase">{t('home.reach.tagline')}</span>
          <h2 className="text-4xl lg:text-5xl font-display mt-3">
            {t('home.reach.title')}
          </h2>
          <p className={`mt-4 text-secondary-foreground/60 max-w-xl ${isRtl ? 'mr-0' : 'mx-auto'}`}>
            {t('home.reach.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {locations.map((loc, i) => (
            <motion.div
              key={loc.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              viewport={{ once: true }}
              className={`flex items-center gap-4 p-5 rounded-xl border border-secondary-foreground/10 bg-secondary-foreground/5 ${isRtl ? 'flex-row-reverse text-right' : ''}`}
            >
              <div className="w-10 h-10 rounded-full gradient-fire flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <div className="font-display text-lg tracking-wide">
                  {loc.country}
                </div>
                <div className="text-sm text-secondary-foreground/60">
                  {loc.city}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GlobalPresenceSection;
