import { useEffect, useRef, useState } from "react";

interface CounterProps {
  end: number;
  suffix?: string;
  label: string;
  duration?: number;
}

const AnimatedCounter = ({ end, suffix = "", label, duration = 2000 }: CounterProps) => {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [visible, end, duration]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-5xl lg:text-6xl text-primary-foreground">
        {count}{suffix}
      </div>
      <div className="mt-2 text-sm font-medium text-primary-foreground/70 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
};

export default AnimatedCounter;
