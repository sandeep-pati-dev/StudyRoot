import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Download, Shield, CheckCircle } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Browse Notes by Course & Semester",
    description:
      "Easily navigate through organized course materials sorted by semester and subject for quick access to what you need.",
    gradient: "from-uninote-blue to-blue-400"
  },
  {
    icon: Download,
    title: "Download Verified Study Materials",
    description:
      "Access high-quality, peer-reviewed notes and study materials that have been verified by our academic team.",
    gradient: "from-uninote-purple to-pink-400"
  },
  {
    icon: Shield,
    title: "Secure Login & Dashboard Access",
    description:
      "Your personal dashboard with secure authentication keeps your study progress and bookmarks safe and synchronized.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: CheckCircle,
    title: "Admin-Verified Uploads",
    description:
      "Every piece of content goes through our quality assurance process to ensure accuracy and relevance for your studies.",
    gradient: "from-orange-500 to-red-500"
  }
];

const FeaturesSection = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const offsetX = (clientX - centerX) / 40;
      const offsetY = (clientY - centerY) / 40;
      setMousePos({ x: offsetX, y: offsetY });
    };

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
      }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="py-24 bg-background relative overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-20 transition-transform duration-200"
        style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
      >
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-uninote-blue to-uninote-purple rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-uninote-purple to-pink-300 rounded-full filter blur-3xl animate-float delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ease-in-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Platform
            <span className="bg-gradient-to-r from-uninote-blue to-uninote-purple bg-clip-text text-transparent ml-2">
              Features
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to ace your studies, all in one platform designed specifically for university students.
          </p>
        </div>

        {/* Features Grid */}
        <div
          className={`grid md:grid-cols-2 lg:grid-cols-4 gap-10 transition-all duration-1000 ease-in-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border border-white/20 backdrop-blur-sm bg-card rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
            >
              <CardHeader className="text-center pb-4">
                <div
                  className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-foreground group-hover:text-uninote-blue transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-center leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>

              {/* Hover overlay light effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl`}
              ></div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;