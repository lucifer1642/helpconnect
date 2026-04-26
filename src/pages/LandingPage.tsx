import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Droplet, Heart, Activity, Users, ArrowRight, ShieldCheck, Star, MapPin } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const yPos = useTransform(scrollYProgress, [0, 1], [0, 200]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-gradient-to-br from-red-50 via-background to-orange-50 dark:from-red-950/20 dark:via-background dark:to-orange-950/20 overflow-hidden">

      {/* Hero Section */}
      <section className="relative pt-20 pb-40 overflow-hidden">
        {/* Dynamic Gradient Background */}
        <div className="absolute inset-0 bg-background/50">
          <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-primary/20 blur-[100px] rounded-full mix-blend-multiply opacity-50 animate-blob" />
          <div className="absolute left-0 bottom-0 h-[500px] w-[500px] bg-secondary/30 blur-[100px] rounded-full mix-blend-multiply opacity-50 animate-blob animation-delay-2000" />
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 bg-rose-400/20 blur-[100px] rounded-full mix-blend-multiply opacity-50 animate-blob animation-delay-4000" />
        </div>

        {/* Blood Graffiti / Decorative Elements */}
        <motion.div style={{ y: yPos }} className="absolute inset-0 overflow-hidden pointer-events-none opacity-10 dark:opacity-5">
          <Droplet className="absolute top-20 left-[10%] w-24 h-24 text-rose-600 -rotate-12" />
          <Heart className="absolute top-40 right-[15%] w-32 h-32 text-rose-600 rotate-12" />
          <Activity className="absolute bottom-20 left-[20%] w-40 h-40 text-rose-600 -rotate-6" />
          <div className="absolute top-1/2 right-[5%] w-16 h-16 border-4 border-rose-600 rounded-full opacity-50" />
          <Droplet className="absolute bottom-40 right-[25%] w-20 h-20 text-rose-600 rotate-45" />
          <div className="absolute top-32 left-[30%] text-9xl font-black text-rose-600 opacity-20 select-none hidden lg:block">O+</div>
          <div className="absolute bottom-20 right-[10%] text-9xl font-black text-rose-600 opacity-20 select-none hidden lg:block">AB-</div>
        </motion.div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left side: Hero Text */}
            <motion.div
              className="flex flex-col items-start text-left space-y-8"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-background/50 backdrop-blur-md px-6 py-2 text-sm font-bold text-primary shadow-[0_0_20px_rgba(255,0,72,0.15)] hover:shadow-[0_0_25px_rgba(255,0,72,0.25)] transition-all cursor-default">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-primary mr-3 animate-pulse shadow-[0_0_10px_currentColor]"></span>
                  Emergency Blood Coordination 🇮🇳
                </div>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-5xl font-black tracking-tight sm:text-6xl md:text-7xl lg:text-7xl text-foreground drop-shadow-sm pb-2 leading-[1.1]"
              >
                Every Drop <span className="text-primary transparent bg-clip-text bg-gradient-to-r from-primary to-rose-600">Counts</span>, <br />
                Every Life <span className="text-primary transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-500">Matters</span>.
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="max-w-[600px] text-lg text-muted-foreground md:text-xl font-medium leading-relaxed"
              >
                The real-time bridge connecting those in need with local heroes across India.
                <span className="block mt-4 text-foreground font-bold">Secure. Fast. Life-saving.</span>
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-6 min-w-[340px] pt-4"
              >
                <Button
                  size="lg"
                  onClick={() => navigate({ to: '/request-blood' })}
                  className="h-14 px-8 text-lg font-bold rounded-full bg-gradient-to-r from-primary to-rose-600 hover:from-primary/90 hover:to-rose-600/90 text-white shadow-[0_10px_30px_rgba(255,0,72,0.3)] hover:shadow-[0_15px_40px_rgba(255,0,72,0.4)] transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95 border-0"
                >
                  <Heart className="mr-2 h-5 w-5 fill-current" />
                  Request Blood
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate({ to: '/donor-dashboard' })}
                  className="h-14 px-8 text-lg font-bold rounded-full border-2 border-primary/20 bg-background/50 backdrop-blur-sm hover:bg-primary/5 hover:border-primary text-primary transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95 shadow-lg"
                >
                  <Droplet className="mr-2 h-5 w-5" />
                  I Want to Donate
                </Button>
              </motion.div>
            </motion.div>

            {/* Right side: Floater & Radar */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative hidden lg:block h-[500px]"
            >
              {/* Central Radar Component instead of Chart */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] flex items-center justify-center">
                {/* Radar ripples */}
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute border-2 border-primary/30 rounded-full"
                    initial={{ width: 0, height: 0, opacity: 0.8 }}
                    animate={{ width: 350, height: 350, opacity: 0 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: i * 1,
                    }}
                  />
                ))}
                
                {/* Center Pulse Node */}
                <div className="relative z-10 w-24 h-24 bg-card/80 backdrop-blur-md rounded-full shadow-2xl border border-white/20 flex items-center justify-center">
                  <Heart className="w-10 h-10 text-primary animate-pulse fill-current" />
                </div>

                {/* Simulated Donor Nodes */}
                <RadarNode delay={0.5} top="20%" left="20%" icon="🩸" name="A+ Donor" location="Andheri" />
                <RadarNode delay={1.5} top="70%" left="80%" icon="👨" name="B- Donor" location="Bandra" />
                <RadarNode delay={2.5} top="80%" left="30%" icon="🏥" name="Hospital" location="Juhu" />
              </div>

              {/* Floating Element 1 - Blood Type (Emojis) */}
              <motion.div 
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-[5%] right-[0%] bg-white text-foreground p-4 rounded-3xl shadow-2xl shadow-primary/20 flex items-center gap-4 border border-rose-100 z-20"
              >
                <div className="text-4xl animate-bounce">
                  🩸
                </div>
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">Needed Now 🚨</p>
                  <p className="font-black text-xl">O- Negative</p>
                </div>
              </motion.div>

              {/* Floating Element 2 - Alert (India Focus & Emojis) */}
              <motion.div 
                animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[5%] left-[0%] bg-card p-4 rounded-3xl shadow-2xl border border-white/20 flex items-center gap-4 z-20"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                  <div className="text-4xl relative z-10 bg-green-50/50 p-2 rounded-full">
                    🤝
                  </div>
                </div>
                <div>
                  <p className="font-bold text-sm text-green-600">Match Found! ✨</p>
                  <p className="text-xs text-muted-foreground font-medium">2 mins ago in Mumbai 📍</p>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white/50 dark:bg-background/50 backdrop-blur-sm border-t border-rose-100 dark:border-rose-900/20">
        <div className="container px-4 md:px-6">
          <motion.div
            className="grid gap-8 md:grid-cols-3"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, staggerChildren: 0.2 }}
          >
            <FeatureCard
              icon={<Activity className="h-10 w-10 text-rose-500" />}
              title="Real-Time Availability"
              description="Instantly find donors who are currently available and nearby. No more outdated lists."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-10 w-10 text-rose-500" />}
              title="Verified Donors"
              description="A trusted community of verified volunteers ready to step up when seconds count."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-rose-500" />}
              title="Direct Connection"
              description="Remove the middleman. Connect directly with donors for faster coordination."
            />
          </motion.div>
        </div>
      </section>

      {/* Stories Section (Indian Context) */}
      <section className="py-24 bg-rose-50/50 dark:bg-rose-950/10 border-t border-rose-100 dark:border-rose-900/20">
        <div className="container px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold md:text-5xl mb-4">Real Impact. <span className="text-primary">Real Stories.</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">See how the HelpConnect community is changing lives across India every single day.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <StoryCard 
              delay={0.1}
              name="Priya Sharma"
              role="Recipient"
              story="HelpConnect found an O- donor for my father's surgery within 15 minutes in Delhi. They are literal lifesavers. ❤️"
              rating={5}
            />
            <StoryCard 
              delay={0.3}
              name="Rahul Verma"
              role="Frequent Donor"
              story="The platform makes it so easy to know when and where I'm needed. I've donated 4 times this year in Bangalore! 🩸"
              rating={5}
            />
            <StoryCard 
              delay={0.5}
              name="Dr. Ananya Desai"
              role="Surgeon"
              story="In emergencies, we rely on HelpConnect's verified donors. The direct connection bypasses critical delays. 🏥"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* Stats / Impact Section */}
      <section className="py-24 md:py-32 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=2883&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>

        <div className="container relative z-10 px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
              Ready to Save a Life? 🌟
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mb-8">
              Join thousands of donors who are making a difference in their community today.
            </p>
            <Button
              size="lg"
              onClick={() => navigate({ to: '/donor-dashboard' })}
              className="h-14 px-8 bg-white text-rose-600 hover:bg-gray-100 font-bold text-lg rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all transform hover:scale-105"
            >
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Footer removed from here because Layout.tsx already renders the global Footer component */}
    </div>
  );
}

// Helper component for the Radar Map
function RadarNode({ delay, top, left, icon, name, location }: { delay: number, top: string, left: string, icon: string, name: string, location: string }) {
  return (
    <motion.div
      className="absolute flex flex-col items-center gap-1 z-10"
      style={{ top, left }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.2, 1, 0.5] }}
      transition={{ duration: 4, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      <div className="w-10 h-10 bg-white dark:bg-card border border-rose-200 rounded-full shadow-lg flex items-center justify-center text-xl relative">
        {icon}
        <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
      </div>
      <div className="bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-center border border-white/20 shadow-sm">
        <p className="whitespace-nowrap text-foreground">{name}</p>
        <p className="text-muted-foreground flex items-center gap-1 justify-center"><MapPin className="w-2 h-2"/> {location}</p>
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="p-8 rounded-[32px] bg-white/60 dark:bg-card/60 backdrop-blur-xl border border-white/20 dark:border-rose-900/30 shadow-xl shadow-rose-100/20 dark:shadow-rose-900/10 transition-all duration-300 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="mb-6 p-4 bg-rose-50/80 dark:bg-rose-950/30 w-fit rounded-2xl shadow-inner relative z-10">
        {icon}
      </div>
      <h3 className="text-2xl font-black tracking-tight mb-3 relative z-10">{title}</h3>
      <p className="text-muted-foreground leading-relaxed relative z-10 text-lg font-medium">
        {description}
      </p>
    </motion.div>
  );
}

function StoryCard({ delay, name, role, story, rating }: { delay: number, name: string, role: string, story: string, rating: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="p-8 rounded-[32px] bg-card/60 backdrop-blur-xl border border-rose-100 dark:border-rose-900/20 shadow-lg relative overflow-hidden"
    >
      <div className="flex text-yellow-400 mb-6">
        {[...Array(rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
      </div>
      <p className="italic text-muted-foreground mb-8 line-clamp-4 relative z-10 text-lg font-medium leading-relaxed">"{story}"</p>
      <div className="flex items-center gap-4 mt-auto">
        <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-white font-black text-xl shadow-lg">
          {name.charAt(0)}
        </div>
        <div>
          <p className="font-black text-lg leading-none mb-1">{name}</p>
          <p className="text-sm font-bold text-primary uppercase tracking-wider">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}
