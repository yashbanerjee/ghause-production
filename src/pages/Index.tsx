import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import CertificationsSection from "@/components/home/CertificationsSection";
import GlobalPresenceSection from "@/components/home/GlobalPresenceSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <StatsSection />
      <CategoriesSection />
      <CertificationsSection />
      <GlobalPresenceSection />
    </Layout>
  );
};

export default Index;
