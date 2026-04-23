import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Bell, CloudDrizzle, Settings, ShieldCheck, HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { getApiBaseUrl } from "@/lib/apiBase";
import {
  localizedCategoryHomeDesc,
  localizedCategoryName,
} from "@/lib/localeContent";

const CategoriesSection = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language.startsWith('ar');
  const API_BASE = getApiBaseUrl();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data.data || []; // Extract the array from the paginated response
    }
  });

  const getIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('light')) return Flame;
    if (n.includes('device')) return Bell;
    if (n.includes('suppress')) return CloudDrizzle;
    if (n.includes('valve')) return Settings;
    if (n.includes('safety')) return ShieldCheck;
    if (n.includes('elect')) return Settings;
    return HelpCircle;
  };

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className={`mb-14 ${isRtl ? 'text-right' : 'text-center'}`}>
          <span className="text-sm font-semibold text-primary tracking-wider uppercase">{t('home.solutions.tagline')}</span>
          <h2 className="text-4xl lg:text-5xl font-display text-foreground mt-3">
            {t('home.solutions.title')}
          </h2>
          <p className={`mt-4 text-muted-foreground max-w-2xl ${isRtl ? 'mr-0' : 'mx-auto'}`}>
            {t('home.solutions.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-10 text-muted-foreground">Loading...</div>
          ) : (
            categories?.map((cat: any, i: number) => {
              const Icon = getIcon(cat.nameEn);
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={`/products/${cat.id}`}
                    className={`group flex flex-col h-full p-8 rounded-xl border border-border bg-card hover:shadow-xl hover:border-primary/30 transition-all duration-300 ${isRtl ? 'text-right items-end' : ''}`}
                  >
                    <div className="w-14 h-14 rounded-lg gradient-fire flex items-center justify-center mb-5 group-hover:scale-110 transition-transform overflow-hidden p-3">
                      {cat.icon ? (
                        <img 
                          src={cat.icon.startsWith('http') ? cat.icon : `${API_BASE}/uploads/${cat.icon}`} 
                          className="w-full h-full object-contain brightness-0 invert" 
                          alt="" 
                        />
                      ) : (
                        <Icon className="w-7 h-7 text-primary-foreground" />
                      )}
                    </div>
                    <h3 className="font-display text-xl text-foreground mb-2 tracking-wide">
                      {localizedCategoryName(cat, i18n.language)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {localizedCategoryHomeDesc(cat, i18n.language) ||
                        t(`home.solutions.categories.${cat.nameEn.toLowerCase()}.desc`)}
                    </p>
                  </Link>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
