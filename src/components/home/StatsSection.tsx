import AnimatedCounter from "./AnimatedCounter";
import { useTranslation } from "react-i18next";

const StatsSection = () => {
  const { t } = useTranslation();

  return (
    <section className="gradient-fire py-16">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <AnimatedCounter end={15} suffix="+" label={t('home.stats.mena')} />
          <AnimatedCounter end={150} suffix="+" label={t('home.stats.projects')} />
          <AnimatedCounter end={17} suffix="+" label={t('home.stats.years')} />
          <AnimatedCounter end={100} suffix="+" label={t('home.stats.products')} />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
