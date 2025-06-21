import { Search, Calendar, User, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import blog01 from './../public/assets/images/blog/blog01.png';
import blog02 from './../public/assets/images/blog/blog02.png';
import blog03 from './../public/assets/images/blog/blog03.png';
import blog04 from './../public/assets/images/blog/blog04.png';
import blog05 from './../public/assets/images/blog/blog05.png';
import blog06 from './../public/assets/images/blog/blog06.png';
import blog07 from './../public/assets/images/blog/blog11.jpg';
import blog08 from './../public/assets/images/blog/blog8.jpg';
import blog09 from './../public/assets/images/blog/blog10.jpg';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020D1E] via-[#071A38] to-[#020D1E] text-white">
      <div className="container mx-auto px-4 py-8">
        
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Article */}
            <article className="group">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <Image
                  src={blog09}
                  alt="Cozy movie watching scene"
                  width={600}
                  height={400}
                  className="w-full h-48 sm:h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#1D50A3] text-white px-3 py-1 rounded text-xs sm:text-sm font-medium">ENTERTAINMENT</span>
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 group-hover:text-blue-400 transition-colors">
                Movies That Will Make Your Holidays The Best
              </h2>
              {/* <p className="text-gray-300 mb-4 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p> */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-400 space-y-2 sm:space-y-0 mb-2">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4 sm:h-4 sm:w-4" />
                  <span>April 26, 2023</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4 sm:h-4 sm:w-4" />
                  <span>Jane Doe</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Tag className="h-4 w-4 sm:h-4 sm:w-4" />
                  <span>Entertainment</span>
                </div>
              </div>
            </article>

            {/* Second Article */}
            <article className="group">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <Image
                  src={blog07}
                  alt="Thriller movie poster"
                  width={600}
                  height={400}
                  className="w-full h-48 sm:h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#1D50A3] text-white px-3 py-1 rounded text-xs sm:text-sm font-medium">MOVIES NEWS</span>
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 group-hover:text-blue-400 transition-colors">
                Thriller Movies That You Should Not Miss
              </h2>
              {/* <p className="text-gray-300 mb-4 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p> */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-400 space-y-2 sm:space-y-0 mb-2">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4 sm:h-4 sm:w-4" />
                  <span>April 26, 2023</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4 sm:h-4 sm:w-4" />
                  <span>Jane Doe</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Tag className="h-4 w-4 sm:h-4 sm:w-4" />
                  <span>Entertainment</span>
                </div>
              </div>
            </article>

            {/* Third Article */}
            <article className="group">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <Image
                  src={blog08}
                  alt="Film making behind the scenes"
                  width={600}
                  height={400}
                  className="w-full h-48 sm:h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#1D50A3] text-white px-3 py-1 rounded text-xs sm:text-sm font-medium">MOVIES NEWS</span>
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 group-hover:text-blue-400 transition-colors">
                Film Making Can Give You Everything
              </h2>
              {/* <p className="text-gray-300 mb-4 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p> */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-400 space-y-2 sm:space-y-0 mb-2">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4 sm:h-4 sm:w-4" />
                  <span>April 26, 2023</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4 sm:h-4 sm:w-4" />
                  <span>Jane Doe</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Tag className="h-4 w-4 sm:h-4 sm:w-4" />
                  <span>Entertainment</span>
                </div>
              </div>
            </article>

          
          </div>

        
      </div>
    </div>
  );
}

function PopularPost({ image, title, date, href }) {
  return (
    <Link href={href} className="flex space-x-3 group">
      <Image
        src={image || "/placeholder.svg"}
        alt={title}
        width={60}
        height={60}
        className="w-15 h-15 object-cover rounded flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors line-clamp-2">
          {title}
        </h4>
        <p className="text-xs text-gray-400 mt-1">{date}</p>
      </div>
    </Link>
  );
}