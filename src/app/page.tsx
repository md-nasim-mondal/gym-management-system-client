import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col items-center'>
      <div className='w-full'>
        <Navbar />
      </div>

      <main className='flex-1 w-full'>
        {/* Hero Section */}
        <section className='bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20'>
          <div className='container mx-auto px-4 text-center w-full md:max-w-[90%]'>
            <h1 className='text-4xl md:text-6xl font-bold mb-6'>
              Transform Your Body
            </h1>
            <p className='text-xl md:text-2xl mb-8 text-gray-300'>
              Join our gym and achieve your fitness goals with expert trainers
            </p>
            <div className='flex gap-4 justify-center'>
              <Button size='lg'>Get Started</Button>
              <Button variant='secondary' size='lg'>
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className='py-16 bg-background'>
          <div className='container mx-auto px-4 w-full md:max-w-[90%]'>
            <h2 className='text-3xl font-bold text-center mb-12'>
              Why Choose Us
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {[
                {
                  title: "Expert Trainers",
                  description: "Certified professionals to guide you",
                  icon: "💪",
                },
                {
                  title: "Modern Equipment",
                  description: "State-of-the-art fitness machines",
                  icon: "🏋️",
                },
                {
                  title: "Flexible Plans",
                  description: "Membership options for everyone",
                  icon: "📅",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className='p-6 text-center hover:shadow-lg transition-shadow'>
                  <div className='text-4xl mb-4'>{feature.icon}</div>
                  <h3 className='text-xl font-semibold mb-2'>
                    {feature.title}
                  </h3>
                  <p className='text-muted-foreground'>{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className='py-16 bg-gray-100 dark:bg-gray-800'>
          <div className='container mx-auto px-4 w-full md:max-w-[90%]'>
            <h2 className='text-3xl font-bold text-center mb-12'>
              What Our Members Say
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {[
                {
                  name: "Sarah Johnson",
                  role: "Fitness Enthusiast",
                  quote: "This gym changed my life! The trainers are amazing.",
                },
                {
                  name: "Mike Peterson",
                  role: "Bodybuilder",
                  quote: "Best equipment and community I've ever experienced.",
                },
              ].map((testimonial, index) => (
                <Card key={index} className='p-6'>
                  <p className='text-muted-foreground italic mb-4'>
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div>
                    <p className='font-semibold'>{testimonial.name}</p>
                    <p className='text-muted-foreground text-sm'>
                      {testimonial.role}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <div className='w-full'>
        <Footer />
      </div>
    </div>
  );
}
