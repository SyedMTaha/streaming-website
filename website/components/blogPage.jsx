import { Search, Calendar, User, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import blog01 from './../public/assets/images/blog/blog01.png';
import blog02 from './../public/assets/images/blog/blog02.png';
import blog03 from './../public/assets/images/blog/blog03.png';
import blog04 from './../public/assets/images/blog/blog04.png';
import blog05 from './../public/assets/images/blog/blog05.png';
import blog06 from './../public/assets/images/blog/blog06.png';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020D1E] via-[#071A38] to-[#020D1E] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Article */}
            <article className="group">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <Image
                  src={blog01}
                  alt="Cozy movie watching scene"
                  width={600}
                  height={400}
                  className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#1D50A3] text-white px-3 py-1 rounded text-sm font-medium">ENTERTAINMENT</span>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                <Link href="/blog/movies-holidays-best">Movies That Will Make Your Holidays The Best</Link>
              </h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>April 26, 2023</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Jane Doe</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Tag className="h-4 w-4" />
                  <span>Entertainment</span>
                </div>
              </div>
            </article>

            {/* Second Article */}
            <article className="group">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <Image
                  src={blog02}
                  alt="Thriller movie poster"
                  width={600}
                  height={400}
                  className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#1D50A3] text-white px-3 py-1 rounded text-sm font-medium">MOVIES NEWS</span>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                <Link href="/blog/thriller-movies-not-miss">Thriller Movies That You Should Not Miss</Link>
              </h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>April 26, 2023</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Jane Doe</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Tag className="h-4 w-4" />
                  <span>Entertainment</span>
                </div>
              </div>
            </article>

            {/* Third Article */}
            <article className="group">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <Image
                  src={blog03}
                  alt="Film making behind the scenes"
                  width={600}
                  height={400}
                  className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#1D50A3] text-white px-3 py-1 rounded text-sm font-medium">MOVIES NEWS</span>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                <Link href="/blog/film-making-everything">Film Making Can Give You Everything</Link>
              </h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>April 26, 2023</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Jane Doe</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Tag className="h-4 w-4" />
                  <span>Entertainment</span>
                </div>
              </div>
            </article>

            {/* Pagination */}
            <div className=" space-x-2 pt-8">
              <button className="bg-[#1D50A3] text-white px-3 py-2 size-10 rounded font-medium">1</button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded transition-colors size-10">
                2
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded transition-colors size-10">
                &gt;
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Search */}
            <div className="bg-[#1a1a3a]/50 rounded-lg p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Popular Posts */}
            <div className="bg-[#1a1a3a]/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Popular Posts</h3>
              <div className="space-y-4">
                <PopularPost
                  image={blog04}
                  title="Best Movie To Cheer Your Mood Up In 2023"
                  date="April 26, 2023"
                  href="/blog/best-movie-cheer-mood-2023"
                />
                <PopularPost
                  image={blog05}
                  title="Movies That Will Make Your Holidays The Best"
                  date="April 26, 2023"
                  href="/blog/movies-holidays-best"
                />
                <PopularPost
                  image={blog06}
                  title="Must Watch Your Fav Web Series With Us"
                  date="April 26, 2023"
                  href="/blog/must-watch-web-series"
                />
              </div>
            </div>
          </div>
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