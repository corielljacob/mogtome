import { Link } from 'react-router-dom';
import { Users, Sparkles, Heart } from 'lucide-react';
import { Button } from '../components/Button';
import { Card, CardBody } from '../components/Card';
import { MooglePom } from '../components/MooglePom';

export function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-moogle-pink/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-moogle-lavender/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-moogle-gold/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Floating pom decoration */}
          <div className="flex justify-center mb-6">
            <div className="animate-float">
              <MooglePom size="lg" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-moogle-purple via-moogle-pink to-moogle-coral bg-clip-text text-transparent">
              Welcome, Kupo!
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-text-light max-w-2xl mx-auto mb-8 leading-relaxed">
            Your cozy corner of Eorzea! Browse our wonderful Free Company members
            and stay connected with your fellow adventurers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/members">
              <Button size="lg" className="w-full sm:w-auto">
                <Users className="w-5 h-5" />
                View Members
              </Button>
            </Link>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              <Sparkles className="w-5 h-5" />
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            What's in the <span className="text-moogle-purple">MogTome</span>?
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center p-6">
              <CardBody>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-moogle-purple to-moogle-lavender rounded-2xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Member Directory</h3>
                <p className="text-text-light">
                  Browse all our FC members, search by name, and filter by rank.
                  Find your friends easily!
                </p>
              </CardBody>
            </Card>

            <Card className="text-center p-6">
              <CardBody>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-moogle-pink to-moogle-coral rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Rank Colors</h3>
                <p className="text-text-light">
                  Each rank has its own beautiful color theme. From Moogle Guardians
                  to Bom Bokos!
                </p>
              </CardBody>
            </Card>

            <Card className="text-center p-6">
              <CardBody>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-moogle-gold to-moogle-gold-dark rounded-2xl flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Lodestone Links</h3>
                <p className="text-text-light">
                  Click any member to view their full Lodestone profile. Stay
                  connected, kupo!
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Cute Footer Message */}
      <section className="py-12 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-moogle-lavender/30 px-6 py-3 rounded-full">
            <span className="text-2xl">🎀</span>
            <p className="text-text-light font-medium">
              Made with love for our FC family
            </p>
            <span className="text-2xl">🎀</span>
          </div>
          <p className="mt-4 text-sm text-text-light">
            Questions? Reach out to planedonut!
          </p>
        </div>
      </section>
    </div>
  );
}
