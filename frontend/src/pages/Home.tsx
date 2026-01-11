import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Heart, ArrowRight, Sparkles, Star, 
  Compass, Feather, BookOpen, Gift
} from 'lucide-react';
import { Button } from '../components/Button';

// Moogle quotes that rotate
const kupoQuotes = [
  { text: "Welcome, kupo!", icon: Sparkles },
  { text: "Good to see you, kupo~", icon: Heart },
  { text: "Let's have fun, kupo!", icon: Star },
  { text: "Adventure awaits, kupo!", icon: Compass },
  { text: "Stay cozy, kupo~", icon: Feather },
];

// Simple card component for this page
function FeatureCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`
      bg-white dark:bg-slate-800/90
      border border-[var(--bento-border)]
      rounded-2xl p-6
      shadow-sm hover:shadow-lg
      transition-all duration-300
      ${className}
    `}>
      {children}
    </div>
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
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center relative">
          {/* Rotating Kupo Quote */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={quoteIndex}
              className="inline-flex items-center gap-2 mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <QuoteIcon className="w-6 h-6 text-[var(--bento-primary)]" />
              <span className="font-accent text-2xl md:text-3xl text-[var(--bento-primary)]">
                {currentQuote.text}
              </span>
            </motion.div>
          </AnimatePresence>
          
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6">
            <motion.span 
              className="text-[var(--bento-text)] block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Welcome to
            </motion.span>
            <motion.span 
              className="relative inline-flex items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="bg-gradient-to-r from-[var(--bento-primary)] via-pink-500 to-[var(--bento-secondary)] bg-clip-text text-transparent pb-2">
                MogTome
              </span>
              <motion.span
                initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.4, delay: 0.4, ease: "backOut" }}
              >
                <Sparkles className="w-6 h-6 md:w-10 md:h-10 text-amber-400" />
              </motion.span>
            </motion.span>
          </h1>

          {/* Subtitle */}
          <motion.p 
            className="text-lg md:text-xl text-[var(--bento-text-muted)] font-soft max-w-2xl mx-auto mb-4 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Your cozy corner of Eorzea where moogles gather, 
            adventures are shared, and everyone's welcome!
          </motion.p>
          
          {/* Fun sub-note */}
          <motion.p 
            className="font-accent text-xl text-[var(--bento-text-subtle)] mb-10 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <Feather className="w-4 h-4" />
            <span>No pom-pom pulling allowed!</span>
            <Feather className="w-4 h-4 scale-x-[-1]" />
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Link to="/members">
              <Button size="lg" className="w-full sm:w-auto gap-2 px-8 group">
                <Users className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                Meet the Family
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4 }}
          >
            <p className="font-accent text-2xl text-[var(--bento-secondary)] mb-2 flex items-center justify-center gap-2">
              <Gift className="w-5 h-5" />
              What's inside?
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-[var(--bento-text)] flex items-center justify-center gap-3">
              The Good Stuff
              <Sparkles className="w-8 h-8 text-amber-400" />
            </h2>
          </motion.div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Users,
                gradient: 'from-[var(--bento-primary)] to-rose-600',
                shadowColor: 'shadow-[var(--bento-primary)]/20',
                blobColor: 'bg-[var(--bento-primary)]/5',
                title: 'The Roster',
                description: 'Meet all our wonderful FC members! Search by name, filter by rank, or just scroll and admire the glamours.',
                quote: "Everyone's beautiful, kupo~",
                quoteColor: 'text-[var(--bento-primary)]',
                quoteIcon: Heart,
              },
              {
                icon: BookOpen,
                gradient: 'from-[var(--bento-secondary)] to-purple-600',
                shadowColor: 'shadow-[var(--bento-secondary)]/20',
                blobColor: 'bg-[var(--bento-secondary)]/5',
                title: 'The Chronicle',
                description: 'Our story unfolds here! See who joined, who got promoted, and all the shenanigans in between.',
                quote: 'Memories are treasures, kupo!',
                quoteColor: 'text-[var(--bento-secondary)]',
                quoteIcon: Star,
              },
              {
                icon: Compass,
                gradient: 'from-pink-500 to-rose-600',
                shadowColor: 'shadow-pink-500/20',
                blobColor: 'bg-pink-500/5',
                title: 'Quick Links',
                description: "Jump straight to anyone's Lodestone profile with a single click. Check out gear, achievements, and more!",
                quote: 'Clicking is caring, kupo!',
                quoteColor: 'text-pink-500',
                quoteIcon: Sparkles,
              },
            ].map((card, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
              >
                <FeatureCard className="group relative overflow-hidden h-full hover:-translate-y-1">
                  <div className={`absolute top-0 right-0 w-32 h-32 ${card.blobColor} rounded-full -translate-y-1/2 translate-x-1/2 transition-transform duration-300 group-hover:scale-125`} />
                  <div className="relative">
                    <div className={`w-14 h-14 mb-5 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center shadow-lg ${card.shadowColor} transition-transform duration-200 group-hover:scale-105`}>
                      <card.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-display font-semibold text-xl mb-2 text-[var(--bento-text)]">
                      {card.title}
                    </h3>
                    <p className="font-soft text-[var(--bento-text-muted)] leading-relaxed mb-4">
                      {card.description}
                    </p>
                    <p className={`font-accent text-lg ${card.quoteColor} flex items-center gap-2`}>
                      <card.quoteIcon className="w-4 h-4" />
                      {card.quote}
                    </p>
                  </div>
                </FeatureCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fun Call-out Section */}
      <motion.section 
        className="py-16 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-3xl mx-auto">
          <FeatureCard className="text-center relative overflow-hidden hover:scale-[1.01]">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--bento-primary)]/5 via-transparent to-[var(--bento-secondary)]/5" />
            
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
          <p className="font-soft text-[var(--bento-text-muted)] flex items-center justify-center gap-2 text-sm mb-2">
            Made with 
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            by moogles, for moogles
          </p>
          <p className="font-accent text-lg text-[var(--bento-text-subtle)] flex items-center justify-center gap-1">
            Kupo!
            <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
          </p>
        </div>
      </footer>
    </div>
  );
}
