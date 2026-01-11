import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Users, Sparkles, Heart, Star } from 'lucide-react';
import { Button } from '../components/Button';
import { MooglePom } from '../components/MooglePom';

export function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-20 left-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], y: [0, -30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-20 right-10 w-80 h-80 bg-primary/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Floating pom decorations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <MooglePom size="xl" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="gradient-text-moogle">Welcome, Kupo!</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-base-content/70 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Your cozy corner of Eorzea! Browse our wonderful Free Company members
            and stay connected with your fellow adventurers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/members">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                <Users className="w-5 h-5" />
                View Members
              </Button>
            </Link>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-2">
              <Sparkles className="w-5 h-5" />
              Learn More
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-base-200/50">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            What's in the <span className="text-primary">MogTome</span>?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: 'Member Directory',
                description: 'Browse all our FC members, search by name, and filter by rank. Find your friends easily!',
                gradient: 'from-primary to-primary/60',
                delay: 0.1,
              },
              {
                icon: Star,
                title: 'Rank Colors',
                description: 'Each rank has its own beautiful color theme. From Moogle Guardians to Bom Bokos!',
                gradient: 'from-secondary to-secondary/60',
                delay: 0.2,
              },
              {
                icon: Heart,
                title: 'Lodestone Links',
                description: 'Click any member to view their full Lodestone profile. Stay connected, kupo!',
                gradient: 'from-accent to-accent/60',
                delay: 0.3,
              },
            ].map(({ icon: Icon, title, description, gradient, delay }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay }}
                whileHover={{ y: -5 }}
                className="card bg-base-100 shadow-lg"
              >
                <div className="card-body items-center text-center">
                  <div className={`w-16 h-16 mb-4 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="card-title">{title}</h3>
                  <p className="text-base-content/70">{description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cute Footer Message */}
      <section className="py-16 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-3 bg-base-200 px-6 py-3 rounded-full shadow-sm">
            <span className="text-2xl">🎀</span>
            <p className="text-base-content/80 font-medium">
              Made with love for our FC family
            </p>
            <span className="text-2xl">🎀</span>
          </div>
          <p className="mt-4 text-sm text-base-content/60">
            Questions? Reach out to planedonut!
          </p>
        </motion.div>
      </section>
    </div>
  );
}
