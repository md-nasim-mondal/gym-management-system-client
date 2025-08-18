import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
      <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gray-900 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Transform Your Body</h1>
            <p className="text-xl md:text-2xl mb-8">Join our gym and achieve your fitness goals with expert trainers</p>
            <div className="flex gap-4 justify-center">
              <Button size="lg">Get Started</Button>
              <Button variant="outline" size="lg">Learn More</Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Expert Trainers",
                  description: "Certified professionals to guide you",
                  icon: "💪"
                },
                {
                  title: "Modern Equipment",
                  description: "State-of-the-art fitness machines",
                  icon: "🏋️"
                },
                {
                  title: "Flexible Plans",
                  description: "Membership options for everyone",
                  icon: "📅"
                }
              ].map((feature, index) => (
                <div key={index} className="bg-gray-100 p-6 rounded-lg text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Members Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Fitness Enthusiast",
                  quote: "This gym changed my life! The trainers are amazing."
                },
                {
                  name: "Mike Peterson",
                  role: "Bodybuilder",
                  quote: "Best equipment and community I've ever experienced."
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-700 italic mb-4">`&quot;{testimonial.quote}`&quot;</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
    // <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    //   <div className="max-w-4xl w-full px-4 py-8 bg-white rounded-lg shadow-lg text-center">
    //     <h1 className="text-4xl font-bold text-indigo-600 mb-6">Gym Management System</h1>
    //     <p className="text-xl text-gray-700 mb-8">
    //       Welcome to our state-of-the-art gym management system. Schedule classes, manage memberships,
    //       and book your favorite workouts all in one place.
    //     </p>
    //     <div className="flex flex-col sm:flex-row justify-center gap-4">
    //       <Link
    //         href="/login"
    //         className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
    //       >
    //         Login
    //       </Link>
    //       <Link
    //         href="/register"
    //         className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
    //       >
    //         Register
    //       </Link>
    //     </div>
    //   </div>
    // </div>
  );
}
