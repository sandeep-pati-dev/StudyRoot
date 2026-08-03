import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Heart, Lightbulb } from "lucide-react";

const AboutSection = () => {
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
      id="about"
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
        <div
          className={`grid lg:grid-cols-2 gap-16 items-center transition-all duration-1000 ease-in-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
                About
                <span className="bg-gradient-to-r from-uninote-blue to-uninote-purple bg-clip-text text-transparent ml-2">
                  UniNote
                </span>
              </h2>

              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                We understand the struggle of hunting for quality study materials across different platforms.
                UniNote was created to solve this problem by providing a centralized hub where students can
                focus more on learning and less on searching.
              </p>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Our mission is simple: empower students with easy access to verified, high-quality study
                materials so they can excel in their academic journey without the stress of resource hunting.
              </p>
            </div>

            <Button
              size="lg"
              className="bg-gradient-to-r from-uninote-blue to-uninote-purple hover:from-uninote-purple hover:to-uninote-blue text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Join UniNote Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Right Column - Values Cards */}
          <div
            className={`space-y-6 transition-all duration-1000 ease-in-out ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
          >
            <div className="bg-card/80 border border-white/30 rounded-2xl p-6 shadow-md backdrop-blur-md hover:shadow-xl hover:scale-[1.02] transition-transform duration-500">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-uninote-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="h-6 w-6 text-uninote-blue" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Our Mission</h3>
                  <p className="text-muted-foreground">
                    To democratize access to quality educational resources and help students achieve academic success.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card/80 border border-white/30 rounded-2xl p-6 shadow-md backdrop-blur-md hover:shadow-xl hover:scale-[1.02] transition-transform duration-500">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-uninote-purple/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart className="h-6 w-6 text-uninote-purple" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Our Values</h3>
                  <p className="text-muted-foreground">
                    Quality, accessibility, and student-first approach drive everything we do at UniNote.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card/80 border border-white/30 rounded-2xl p-6 shadow-md backdrop-blur-md hover:shadow-xl hover:scale-[1.02] transition-transform duration-500">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Our Vision</h3>
                  <p className="text-muted-foreground">
                    To become the go-to platform for university students worldwide for all their academic needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;