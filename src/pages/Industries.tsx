import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Factory, Plane, Ship, Building2, Heart, HardHat, Landmark } from "lucide-react";

const industries = [
  {
    icon: Factory,
    title: "Oil & Gas",
    desc: "Comprehensive fire protection for refineries, pipelines, offshore platforms, and petrochemical facilities. Our systems are designed to withstand extreme conditions and meet the strictest safety standards.",
    solutions: ["Foam suppression systems", "Gas detection networks", "Explosion-proof equipment", "Emergency shutdown systems"],
  },
  {
    icon: Plane,
    title: "Airports",
    desc: "Aviation-grade fire safety solutions for terminals, hangars, fuel storage, and runway facilities. Certified to ICAO and NFPA standards.",
    solutions: ["Aircraft rescue systems", "Terminal fire alarm networks", "Fuel farm protection", "Hangar suppression"],
  },
  {
    icon: Ship,
    title: "Marine",
    desc: "Marine-approved fire protection systems for commercial vessels, naval ships, offshore rigs, and port facilities.",
    solutions: ["CO2 engine room systems", "Water mist systems", "Marine-rated detectors", "SOLAS-compliant solutions"],
  },
  {
    icon: Building2,
    title: "Commercial Buildings",
    desc: "Full-spectrum fire protection for offices, malls, hotels, and high-rise buildings with integrated smart monitoring.",
    solutions: ["Addressable alarm systems", "Sprinkler networks", "Smoke management", "Voice evacuation"],
  },
  {
    icon: Heart,
    title: "Hospitals & Healthcare",
    desc: "Life-safety systems designed for healthcare environments, ensuring patient safety and regulatory compliance.",
    solutions: ["Clean agent suppression", "Early warning detection", "Emergency lighting", "Evacuation systems"],
  },
  {
    icon: HardHat,
    title: "Industrial Plants",
    desc: "Heavy-duty fire protection for manufacturing, warehousing, and processing facilities with hazardous materials.",
    solutions: ["Deluge systems", "Foam proportioning", "Heat-rated sprinklers", "Industrial gas detection"],
  },
  {
    icon: Landmark,
    title: "Infrastructure Projects",
    desc: "Fire safety engineering for tunnels, bridges, metro systems, and large-scale government infrastructure projects.",
    solutions: ["Tunnel fire protection", "Metro station systems", "Bridge monitoring", "Water supply networks"],
  },
];

const Industries = () => {
  return (
    <Layout>
      <section className="gradient-navy text-secondary-foreground py-20">
        <div className="container">
          <span className="text-sm font-semibold text-primary tracking-wider uppercase">Industries</span>
          <h1 className="text-5xl lg:text-6xl font-display mt-3 mb-6">INDUSTRIES WE SERVE</h1>
          <p className="text-lg text-secondary-foreground/70 max-w-2xl">
            Trusted by the world's most demanding sectors, delivering fire safety solutions tailored to each industry's unique requirements.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container space-y-8">
          {industries.map((ind, i) => (
            <motion.div
              key={ind.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8 p-8 rounded-xl border border-border bg-card"
            >
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg gradient-fire flex items-center justify-center">
                    <ind.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-2xl text-foreground">{ind.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{ind.desc}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-foreground mb-3">Key Solutions</h4>
                <ul className="space-y-2">
                  {ind.solutions.map(sol => (
                    <li key={sol} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {sol}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Industries;
