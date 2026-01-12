import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Heart, ArrowRight, Sparkles, Star, 
  Compass, Feather, BookOpen, Gift
} from 'lucide-react';
import { Button } from '../components/Button';
import welcomingMoogle from '../assets/moogles/mooglef fly transparent.gif';
import jugglingMoogle from '../assets/moogles/final-fantasy-artemicion-moogle-amigurumi-on-storenvy-juggling-performer-bubble-transparent-png-2074996.png';
import happyMoogle from '../assets/moogles/kupo-moogle-moon-nature-pillow-cushion-transparent-png-1962056.png';
import moogleWithPig from '../assets/moogles/moogle with pig thing.png';
import wizardMoogle from '../assets/moogles/wizard moogle.png';
import flyingMoogles from '../assets/moogles/moogles flying.png';
import footerMoogle from '../assets/moogles/lil guy moogle.png';

// Rotating set of moogle one-liners
const kupoQuotes = [
  { text: "Welcome, kupo!", icon: Sparkles },
  { text: "Good to see you, kupo~", icon: Heart },
  { text: "Let's have fun, kupo!", icon: Star },
  { text: "Adventure awaits, kupo!", icon: Compass },
  { text: "Stay cozy, kupo~", icon: Feather },
];

// Page-local card wrapper with improved styling
function FeatureCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`
      bg-white/80 dark:bg-slate-800/80
      backdrop-blur-sm
      border border-[var(--bento-border)]
      rounded-3xl p-6 md:p-8
      shadow-sm hover:shadow-xl hover:shadow-[var(--bento-primary)]/5
      transition-all duration-300
      ${className}
    `}>
      {children}
    </div>
  );
}

// Subtle decorative moogle for background
function DecorativeMoogle({ 
  src, 
  className = ''
}: { 
  src: string; 
  className?: string;
}) {
  return (
    <motion.img
      src={src}
      alt=""
      className={`absolute pointer-events-none select-none ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.08 }}
      transition={{ duration: 1.5 }}
    />
  );
}

export function Home() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % kupoQuotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentQuote = kupoQuotes[quoteIndex];
  const QuoteIcon = currentQuote.icon;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Subtle decorative moogles in background */}
      <DecorativeMoogle 
        src={flyingMoogles} 
        className="w-40 md:w-56 top-32 -right-8 md:right-8 rotate-12 opacity-[0.08] dark:opacity-[0.04]" 
      />
      <DecorativeMoogle 
        src={wizardMoogle} 
        className="w-24 md:w-32 bottom-[20%] -left-4 md:left-8 -rotate-6 opacity-[0.08] dark:opacity-[0.04]" 
      />

      {/* Hero with rotating quote */}
      <section className="relative py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center relative">
          {/* Moogle mascot with speech bubble */}
          <motion.div 
            className="flex items-center justify-center gap-1 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Animated Moogle with floating effect */}
            <motion.div 
              className="relative flex-shrink-0"
              animate={{ 
                y: [0, -8, 0],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Soft glow behind moogle */}
              <div className="absolute inset-0 bg-gradient-radial from-[var(--bento-primary)]/20 via-transparent to-transparent blur-xl scale-150" />
              <img 
                src={welcomingMoogle} 
                alt="Welcoming moogle" 
                className="relative w-24 md:w-32 lg:w-36 drop-shadow-xl"
              />
            </motion.div>

            {/* Polished speech bubble with improved design */}
            <motion.div 
              className="relative"
              initial={{ scale: 0.9, opacity: 0, x: -10 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
            >
              {/* Outer glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[var(--bento-primary)]/20 to-[var(--bento-secondary)]/20 rounded-3xl blur-md" />
              
              {/* Fixed width container to prevent jumping */}
              <div className="relative bg-white dark:bg-slate-800 border border-[var(--bento-primary)]/15 dark:border-[var(--bento-primary)]/25 rounded-2xl px-5 md:px-6 py-3 shadow-xl shadow-[var(--bento-primary)]/10 min-w-[200px] md:min-w-[260px]">
                {/* Inner gradient overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-transparent to-[var(--bento-primary)]/5 dark:from-slate-700/50 dark:to-transparent pointer-events-none" />
                
                {/* Speech bubble tail - curved style */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2">
                  <svg 
                    className="w-4 h-6 -ml-3 drop-shadow-sm" 
                    viewBox="0 0 16 24" 
                    fill="none"
                  >
                    <path 
                      d="M16 12C16 12 8 10 4 6C0 2 0 0 0 0C0 0 2 8 2 12C2 16 0 24 0 24C0 24 0 22 4 18C8 14 16 12 16 12Z" 
                      className="fill-white dark:fill-slate-800"
                    />
                  </svg>
                </div>
                
                {/* Rotating quote content - centered */}
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={quoteIndex}
                    className="flex items-center justify-center gap-2.5 relative z-10"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.25 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      key={`icon-${quoteIndex}`}
                    >
                      <QuoteIcon className="w-5 h-5 md:w-6 md:h-6 text-[var(--bento-primary)] flex-shrink-0" />
                    </motion.div>
                    <span className="font-accent text-lg md:text-xl text-[var(--bento-text)] whitespace-nowrap">
                      {currentQuote.text}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>

          {/* Main heading with improved typography */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
            <motion.span 
              className="text-[var(--bento-text)] block mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Welcome to
            </motion.span>
            <motion.span 
              className="relative inline-block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="bg-gradient-to-r from-[var(--bento-primary)] via-pink-500 to-[var(--bento-secondary)] bg-clip-text text-transparent">
                MogTome
              </span>
              {/* Decorative sparkle */}
              <span className="absolute -top-1 -right-6 md:-right-8">
                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-amber-400 drop-shadow-sm" />
              </span>
            </motion.span>
          </h1>

          {/* Subtitle */}
          <motion.p 
            className="text-base md:text-lg text-[var(--bento-text-muted)] font-soft max-w-2xl mx-auto mb-4 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Your cozy corner of Eorzea where moogles gather, 
            adventures are shared, and everyone's welcome!
          </motion.p>
          
          {/* Fun tagline with decorative line */}
          <motion.div 
            className="flex items-center justify-center gap-3 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--bento-border)]" />
            <p className="font-accent text-base md:text-lg text-[var(--bento-text-subtle)] flex items-center gap-2">
              <Feather className="w-3.5 h-3.5 text-[var(--bento-secondary)]" />
              <span>No pom-pom pulling allowed!</span>
              <Feather className="w-3.5 h-3.5 text-[var(--bento-secondary)] scale-x-[-1]" />
            </p>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--bento-border)]" />
          </motion.div>

          {/* CTA button */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link to="/members">
              <Button size="lg" className="w-full sm:w-auto gap-2.5 px-8 group shadow-lg shadow-[var(--bento-primary)]/20 hover:shadow-xl hover:shadow-[var(--bento-primary)]/30">
                <Users className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                Meet the Family
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="py-12 md:py-16 px-4 relative">
        {/* Subtle gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bento-primary)]/[0.02] to-transparent pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative">
          <motion.div 
            className="text-center mb-10 md:mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            <motion.p 
              className="font-accent text-2xl text-[var(--bento-secondary)] mb-3 flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Gift className="w-5 h-5" />
              What's inside?
            </motion.p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-[var(--bento-text)] flex items-center justify-center gap-3">
              The Good Stuff
              <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-amber-400" />
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Users,
                gradient: 'from-[var(--bento-primary)] to-rose-500',
                shadowColor: 'shadow-[var(--bento-primary)]/25',
                blobColor: 'bg-[var(--bento-primary)]/8',
                title: 'The Roster',
                description: 'Meet all our wonderful FC members! Search by name, filter by rank, or just scroll and admire the glamours.',
                quote: "Everyone's beautiful, kupo~",
                quoteColor: 'text-[var(--bento-primary)]',
                quoteIcon: Heart,
                moogle: jugglingMoogle,
              },
              {
                icon: BookOpen,
                gradient: 'from-[var(--bento-secondary)] to-violet-500',
                shadowColor: 'shadow-[var(--bento-secondary)]/25',
                blobColor: 'bg-[var(--bento-secondary)]/8',
                title: 'The Chronicle',
                description: 'Our story unfolds here! See who joined, who got promoted, and all the shenanigans in between.',
                quote: 'Memories are treasures, kupo!',
                quoteColor: 'text-[var(--bento-secondary)]',
                quoteIcon: Star,
                moogle: happyMoogle,
              },
              {
                icon: Compass,
                gradient: 'from-pink-500 to-rose-500',
                shadowColor: 'shadow-pink-500/25',
                blobColor: 'bg-pink-500/8',
                title: 'Quick Links',
                description: "Jump straight to anyone's Lodestone profile with a single click. Check out gear, achievements, and more!",
                quote: 'Clicking is caring, kupo!',
                quoteColor: 'text-pink-500',
                quoteIcon: Sparkles,
                moogle: moogleWithPig,
              },
            ].map((card, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <FeatureCard className="group relative overflow-hidden h-full hover:-translate-y-2">
                  {/* Background blob */}
                  <div className={`absolute top-0 right-0 w-40 h-40 ${card.blobColor} rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl transition-transform duration-500 group-hover:scale-150`} />
                  
                  {/* Moogle accent */}
                  <img 
                    src={card.moogle} 
                    alt="" 
                    className="absolute bottom-3 right-3 w-20 h-20 md:w-24 md:h-24 object-contain opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                  />
                  
                  <div className="relative">
                    {/* Icon with improved styling */}
                    <div className={`w-14 h-14 mb-6 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center shadow-lg ${card.shadowColor}`}>
                      <card.icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <h3 className="font-display font-bold text-xl md:text-2xl mb-3 text-[var(--bento-text)]">
                      {card.title}
                    </h3>
                    <p className="font-soft text-[var(--bento-text-muted)] leading-relaxed mb-5">
                      {card.description}
                    </p>
                    
                    {/* Quote with icon */}
                    <div className={`font-accent text-lg ${card.quoteColor} flex items-center gap-2`}>
                      <card.quoteIcon className="w-4 h-4 flex-shrink-0" />
                      <span>{card.quote}</span>
                    </div>
                  </div>
                </FeatureCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-out */}
      <motion.section 
        className="py-12 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-3xl mx-auto">
          <FeatureCard className="text-center relative overflow-hidden hover:scale-[1.01]">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--bento-primary)]/5 via-transparent to-[var(--bento-secondary)]/5" />
            <img src={wizardMoogle} alt="" className="absolute -left-6 bottom-4 w-16 h-16 opacity-30" />
            
            <div className="relative">
              <div className="flex justify-center gap-3 mb-4">
                <Star className="w-7 h-7 text-amber-500" />
                <Heart className="w-7 h-7 text-pink-500" />
                <Star className="w-7 h-7 text-amber-500" />
              </div>
              
              <h3 className="font-display font-bold text-2xl md:text-3xl text-[var(--bento-text)] mb-3">
                We're glad you're here!
              </h3>
              
              <p className="font-soft text-[var(--bento-text-muted)] max-w-xl mx-auto mb-6 leading-relaxed">
                Whether you're a sprout finding your way or a seasoned adventurer 
                taking a break, there's always room for one more in our cozy corner.
              </p>
              
              <p className="font-accent text-xl text-[var(--bento-text-subtle)] flex items-center justify-center gap-2">
                May your pom-pom always bounce high!
                <Feather className="w-5 h-5 text-[var(--bento-secondary)]" />
              </p>
            </div>
          </FeatureCard>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-10 md:py-12 px-4 border-t border-[var(--bento-border)]">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-3">
            <img src={footerMoogle} alt="" className="w-10 h-10 object-contain opacity-60" />
            <p className="font-soft text-[var(--bento-text-muted)] flex items-center gap-2 text-sm">
              Made with 
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
              by moogles, for moogles
            </p>
            <img src={footerMoogle} alt="" className="w-10 h-10 object-contain opacity-60 scale-x-[-1]" />
          </div>
          <p className="font-accent text-lg text-[var(--bento-text-subtle)] flex items-center justify-center gap-1">
            Kupo!
            <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
          </p>
        </div>
      </footer>
    </div>
  );
}
