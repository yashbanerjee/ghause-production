import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { MapPin, Building2, Factory, Plane } from "lucide-react";

const projects = [
  { title: "Dubai International Airport - Terminal 3", industry: "Airports", location: "Dubai, UAE", scope: "Complete fire alarm, suppression, and emergency lighting systems for one of the world's busiest airport terminals.", icon: Plane },
  { title: "ADNOC Oil Refinery Expansion", industry: "Oil & Gas", location: "Abu Dhabi, UAE", scope: "Foam suppression, gas detection, and fire water network for 15,000 sq.m refinery expansion.", icon: Factory },
  { title: "King Fahd Medical City", industry: "Hospitals", location: "Riyadh, Saudi Arabia", scope: "Addressable fire alarm system, clean agent suppression, and voice evacuation for 1,200-bed medical facility.", icon: Building2 },
  { title: "Marina Bay Commercial Tower", industry: "Commercial", location: "Singapore", scope: "Full fire protection package including sprinklers, alarms, emergency lighting for 52-story tower.", icon: Building2 },
  { title: "Lagos LNG Terminal", industry: "Oil & Gas", location: "Lagos, Nigeria", scope: "Hazardous area fire detection, deluge systems, and emergency shutdown integration.", icon: Factory },
  { title: "London Underground Extension", industry: "Infrastructure", location: "London, UK", scope: "Tunnel fire suppression, platform detection systems, and emergency evacuation systems.", icon: Building2 },
];

const Projects = () => {
  return (
    <Layout>
      <section className="gradient-navy text-secondary-foreground py-20">
        <div className="container">
          <span className="text-sm font-semibold text-primary tracking-wider uppercase">Our Work</span>
          <h1 className="text-5xl lg:text-6xl font-display mt-3 mb-6">PROJECTS & CASE STUDIES</h1>
          <p className="text-lg text-secondary-foreground/70 max-w-2xl">
            A selection of landmark projects showcasing our engineering capabilities across industries and continents.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className="p-8 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                  {project.industry}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" /> {project.location}
                </span>
              </div>
              <h3 className="font-display text-xl text-foreground mb-3">{project.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{project.scope}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
