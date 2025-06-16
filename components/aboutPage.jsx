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
import about14 from './../public/assets/images/about/about14.jpg';
import about15 from './../public/assets/images/about/about15.jpg';


export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020b1f] via-[#0a2151] to-[#020b1f] text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="absolute inset-0 opacity-30">
          <Image
            src={about14}
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
                src={about15}
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
              At INBV TV, we bring you the edge of your seat with a premium selection of gripping crime thrillers, intense dramas, and brain-twisting mysteries. Whether you're into detective sagas, courtroom battles, or psychological suspense, there's something in our lineup to satisfy your curiosity and craving for drama. Dive into compelling storytelling that keeps you guessing — and bingeing.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-4 ">
                  <div className="bg-[#1D50A3] p-1.5 rounded-full mt-1">
                    <Check className="h-4 w-4 text-[#ffffff]  " />
                  </div>
                  <span className="text-gray-200 text-sm">Stream the newest blockbusters the moment they drop.</span>
                </div>
                <div className="flex items-center space-x-4 ">
                  <div className="bg-[#1D50A3] p-1.5 rounded-full mt-1 ">
                    <Check className="h-4 w-4 text-[#ffffff]" />
                  </div>
                  <span className="text-gray-200">Discover award-winning series from top creators around the world.</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-[#1D50A3] p-1.5 rounded-full mb-3">
                    <Check className="h-4 w-4 text-[#ffffff]" />
                  </div>
                  <span className="text-gray-200">Fresh content every week so your watchlist never runs dry.</span>
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
              title="Personalized Entertainment"
              description="Enjoy tailor-made movie and series recommendations curated just for you — because your time deserves content you actually love."
            />
            <FeatureCard
              icon={<Star className="h-8 w-8" />}
              title="Exclusive Content"
              description="Gain access to INBV TV originals and exclusive releases you won't find anywhere else. Your next obsession starts here."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Family-Friendly Features"
              description="Create individual profiles for family members, so everyone can watch their favorites without overlap."
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8" />}
              title="Stream Anytime, Anywhere"
              description="Watch instantly on any device — at home or on the go. Your entertainment, your schedule."
            />
            <FeatureCard
              icon={<Award className="h-8 w-8" />}
              title="Award-Winning Titles"
              description="From global blockbusters to indie gems, explore an ever-expanding library of critically acclaimed shows and films."
            />
            <FeatureCard
              icon={<Globe className="h-8 w-8" />}
              title="Global Reach"
              description="Enjoy content from around the world with multilingual support and subtitles — entertainment without borders."
            />
            <FeatureCard
              icon={<Heart className="h-8 w-8" />}
              title="Ad-Free Experience"
              description="Binge without interruptions. No ads, no distractions — just pure storytelling."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Safe & Secure"
              description="Your data and preferences are protected with enterprise-grade security. You watch, we guard."
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
        <div className="container mx-auto ">

          {/* Movie Posters and Company Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
            {/* Left side - Movie Posters Grid (taking 2/3 of the width) */}
            <div className="lg:col-span-2">
              <div className="relative">
                {/* First row - 3 posters with middle one higher */}
                <div className="flex justify-center items-end mb-8">
                  <div className="w-1/3 px-2 flex justify-center">
                    <div className="w-full max-w-[180px] aspect-[2/3] relative">
                      <Image
                        src={about08}
                        alt="Movie poster"
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                  </div>
                  <div className="w-1/3 px-2 flex justify-center transform -translate-y-8">
                    <div className="w-full max-w-[180px] aspect-[2/3] relative">
                      <Image
                        src={about09}
                        alt="Movie poster"
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                  </div>
                  <div className="w-1/3 px-2 flex justify-center">
                    <div className="w-full max-w-[180px] aspect-[2/3] relative">
                      <Image
                        src={about13}
                        alt="Movie poster"
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Second row - 3 posters with middle one higher */}
                <div className="flex justify-center items-end">
                  <div className="w-1/3 px-2 flex justify-center">
                    <div className="w-full max-w-[180px] aspect-[2/3] relative">
                      <Image
                        src={about12}
                        alt="Movie poster"
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                  </div>
                  <div className="w-1/3 px-2 flex justify-center transform -translate-y-8">
                    <div className="w-full max-w-[180px] aspect-[2/3] relative">
                      <Image
                        src={about11}
                        alt="Movie poster"
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                  </div>
                  <div className="w-1/3 px-2 flex justify-center">
                    <div className="w-full max-w-[180px] aspect-[2/3] relative">
                      <Image
                        src={about10}
                        alt="Movie poster"
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Company Info (taking 1/3 of the width) */}
            <div className="space-y-6 mt-24">
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
                <button
                  href="/community"
                  className="bg-[#1D50A3] text-white px-6 py-3 mt-3 rounded-lg font-medium inline-block hover:bg-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  Join Our Community
                </button>
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
        width={220}
        height={220}
        className="rounded-full mx-auto mb-3 w-35 h-35 object-cover  border-1 border-[#1D50A2]"
      />
      <h4 className="font-semibold">{name}</h4>
      <p className="text-gray-400 text-sm">{position}</p>
    </div>
  )
}