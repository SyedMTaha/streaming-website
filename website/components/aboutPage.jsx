import Image from "next/image"
import Link from "next/link"
import { Check, Shield, Star, Users, Clock, Award, Globe, Heart } from "lucide-react"
import about01 from './../public/assets/images/about/about01.png';
import about02 from './../public/assets/images/about/about02.png';
import about03 from './../public/assets/images/about/about03.png';
import about04 from './../public/assets/images/about/about04.png';
import about05 from './../public/assets/images/about/about05.png';
import about06 from './../public/assets/images/about/about06.png';
import about07 from './../public/assets/images/about/about07.png';
import about08 from './../public/assets/images/about/about08.png';
import about09 from './../public/assets/images/about/about09.png';
import about10 from './../public/assets/images/about/about10.png';
import about11 from './../public/assets/images/about/about11.png';
import about12 from './../public/assets/images/about/about12.png';
import about13 from './../public/assets/images/about/about13.png';


export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020b1f] via-[#0a2151] to-[#020b1f] text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="absolute inset-0 opacity-30">
          <Image
            src={about01}
            alt="Hollywood background"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 container mx-auto">
          <h1 className="text-4xl md:text-4xl font-bold mb-6">About Us</h1>
          <p className="text-lg md:text-md text-gray-300 max-w-3xl mx-auto mb-8">
          This comedy feature follows two best friends in their final year of college while they transition into adulthood. One embraces her sexuality and…
          </p>
          <Link
            href="/explore"
            className="bg-[#1D50A3]  text-white px-8 py-3 rounded-lg font-medium  inline-block hover:bg-blue-900  transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            Explore Now
          </Link>
        </div>
      </section>

      {/* Content Library Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#020D1E] to-[#0A2043]">
        <div className="container mx-auto ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center  ">
            <div className="relative group w-full ">
              <Image
                src={about02}
                alt="Story telling with books and glasses"
                width={500}
                height={500}
                className="rounded-xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300 object-cover w-full h-[385px]"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-[#1D50A3]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              </div>
            </div>
            <div>
              <h2 className="text-2xl md:text-xl font-bold mb-4">
                World-Class Library Of Captivating Crime Thrillers, Addictive Dramas, And Intriguing Mysteries
              </h2>
              <p className="text-gray-300 mb-4 leading-relaxed text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-4 ">
                  <div className="bg-[#1D50A3] p-1.5 rounded-full mt-1">
                    <Check className="h-4 w-4 text-[#ffffff]  " />
                  </div>
                  <span className="text-gray-200 text-sm">Be the first to catch the latest movie drops as they go live.</span>
                </div>
                <div className="flex items-center space-x-4 ">
                  <div className="bg-[#1D50A3] p-1.5 rounded-full mt-1 ">
                    <Check className="h-4 w-4 text-[#ffffff]" />
                  </div>
                  <span className="text-gray-200">From timeless classics to the latest releases</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-[#1D50A3] p-1.5 rounded-full mb-3">
                    <Check className="h-4 w-4 text-[#ffffff]" />
                  </div>
                  <span className="text-gray-200">New shows added weekly so there's always something to watch.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why You'll Love Us Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#020D1E] to-[#0A2043]">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-left mb-12">Why You'll Love Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="The Best Deals"
              description="Many exclusive discounts including personalized offers and Mix & Match bundles"
            />
            <FeatureCard
              icon={<Star className="h-8 w-8" />}
              title="The Best Deals"
              description="Many exclusive discounts including personalized offers and Mix & Match bundles"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="The Best Deals"
              description="Many exclusive discounts including personalized offers and Mix & Match bundles"
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8" />}
              title="The Best Deals"
              description="Many exclusive discounts including personalized offers and Mix & Match bundles"
            />
            <FeatureCard
              icon={<Award className="h-8 w-8" />}
              title="The Best Deals"
              description="Many exclusive discounts including personalized offers and Mix & Match bundles"
            />
            <FeatureCard
              icon={<Globe className="h-8 w-8" />}
              title="The Best Deals"
              description="Many exclusive discounts including personalized offers and Mix & Match bundles"
            />
            <FeatureCard
              icon={<Heart className="h-8 w-8" />}
              title="The Best Deals"
              description="Many exclusive discounts including personalized offers and Mix & Match bundles"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="The Best Deals"
              description="Many exclusive discounts including personalized offers and Mix & Match bundles"
            />
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E4D9B] to-transparent z-10"></div>
          <Image
            src={about03}
            alt="Movie posters background"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What are you waiting for</h2>
          <h3 className="text-2xl md:text-3xl font-bold mb-8">Subscribe Now</h3>
          <Link
            href="/subscribe"
            className="      bg-[#1D50A3]  text-white px-8 py-3 rounded-lg font-medium  inline-block hover:bg-blue-900  transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            SUBSCRIBE
          </Link>
        </div>
      </section>

      {/* Leadership and Content Section */}
      <section className="py-10 px-4 bg-[#020b1f]">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Leadership</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-20">
            <TeamMember
              image={about04}
              name="Leslie Alexander"
              position="Founder & CEO"
            />
            <TeamMember
              image={about07}
              name="Leslie Alexander"
              position="Founder & CEO"
            />
            <TeamMember
              image={about06}
              name="Leslie Alexander"
              position="Founder & CEO"
            />
            <TeamMember
              image={about05}
              name="Leslie Alexander"
              position="Founder & CEO"
            />
          </div>

          {/* Movie Posters and Company Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side - Movie Posters Grid (taking 2/3 of the width) */}
            <div className="lg:col-span-2">
              <div className="relative">
                {/* First row - 3 posters with middle one higher */}
                <div className="flex justify-center items-end mb-8">
                  <div className="w-1/3 px-2 flex justify-center">
                    <div className="w-full max-w-[180px]">
                      <Image
                        src={about08}
                        alt="Movie poster"
                        width={200}
                        height={300}
                        className="rounded-lg w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                  <div className="w-1/3 px-2 flex justify-center transform -translate-y-8">
                    <div className="w-full max-w-[180px]">
                      <Image
                        src={about09}
                        alt="Movie poster"
                        width={200}
                        height={300}
                        className="rounded-lg w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                  <div className="w-1/3 px-2 flex justify-center">
                    <div className="w-full max-w-[180px]">
                      <Image
                        src={about10}
                        alt="Movie poster"
                        width={200}
                        height={300}
                        className="rounded-lg w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Second row - 3 posters with middle one higher */}
                <div className="flex justify-center items-end">
                  <div className="w-1/3 px-2 flex justify-center">
                    <div className="w-full max-w-[180px]">
                      <Image
                        src={about11}
                        alt="Movie poster"
                        width={200}
                        height={300}
                        className="rounded-lg w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                  <div className="w-1/3 px-2 flex justify-center transform -translate-y-8">
                    <div className="w-full max-w-[180px]">
                      <Image
                        src={about12}
                        alt="Movie poster"
                        width={200}
                        height={300}
                        className="rounded-lg w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                  <div className="w-1/3 px-2 flex justify-center">
                    <div className="w-full max-w-[180px]">
                      <Image
                        src={about13}
                        alt="Movie poster"
                        width={200}
                        height={300}
                        className="rounded-lg w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Company Info (taking 1/3 of the width) */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                <p className="text-gray-300 text-sm">Make modern television and stay at our fingertips.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
                <p className="text-gray-300 text-sm">Make modern television and stay at our fingertips.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Corporate Culture</h3>
                <p className="text-gray-300 text-sm mb-4">Make modern television and stay at our fingertips.</p>
                <Link
                  href="/community"
                  className="bg-[#1D50A3] text-white px-6 py-3 rounded-lg font-medium inline-block hover:bg-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  Join Our Community
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

{/* Update the FeatureCard component */}
function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-[#1a1a3a]/50 rounded-lg p-6">
      <div className="bg-[#1D50A3] rounded-full w-16 h-16 flex items-center justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  )
}

function TeamMember({ image, name, position }) {
  return (
    <div className="text-center">
      <Image
        src={image || "/placeholder.svg"}
        alt={name}
        width={120}
        height={120}
        className="rounded-full mx-auto mb-3 w-20 h-20 object-cover"
      />
      <h4 className="font-semibold">{name}</h4>
      <p className="text-gray-400 text-sm">{position}</p>
    </div>
  )
}