// "use client"

// import React, { useRef } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { ChevronLeft, ChevronRight, Play, Bookmark } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import moviesData from '../data/movies.json';

// export default function TvSeries() {
//   const router = useRouter();
//   const scrollContainerRef = useRef(null);
//   const series = moviesData['tv-series'] || [];

//   const scrollLeft = () => {
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.scrollBy({
//         left: -200,
//         behavior: "smooth",
//       });
//     }
//   };

//   const scrollRight = () => {
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.scrollBy({
//         left: 200,
//         behavior: "smooth",
//       });
//     }
//   };

//   const handleSeriesClick = (series) => {
//     router.push(`/tv-series/${series.slug}`);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#020b1f] via-[#0a2151] to-[#020b1f] text-white">
//       <div className="container mx-auto px-4 md:px-8 lg:px-4 py-8">
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-4">
//             <h3 className="text-2xl font-bold">TV Series</h3>
//             <span className="text-gray-400">({series.length} series)</span>
//           </div>
          
//           <div className="flex space-x-2 ml-105">
//             <button
//               onClick={scrollLeft}
//               className="bg-gray-700/50 hover:bg-gray-700 text-white p-2 rounded-full transition-colors"
//             >
//               <ChevronLeft className="h-5 w-5" />
//             </button>
//             <button
//               onClick={scrollRight}
//               className="bg-gray-700/50 hover:bg-gray-700 text-white p-2 rounded-full transition-colors"
//             >
//               <ChevronRight className="h-5 w-5" />
//             </button>
//           </div>
//         </div>

//         <div 
//           ref={scrollContainerRef} 
//           className="flex space-x-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
//         >
//           {series.map((item) => (
//             <div 
//               key={item.id}
//               className="flex-shrink-0 w-48 cursor-pointer group"
//               onClick={() => handleSeriesClick(item)}
//             >
//               <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
//                 <Image
//                   src={item.image || "/placeholder.svg"}
//                   alt={item.title}
//                   fill
//                   className="object-cover group-hover:scale-105 transition-transform duration-300"
//                 />
//                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
//                   <button className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors">
//                     <Play className="h-6 w-6 text-white" />
//                   </button>
//                 </div>
//                 <div className="absolute top-2 right-2">
//                   <button className="bg-black/50 hover:bg-black/70 p-1.5 rounded-full transition-colors">
//                     <Bookmark className="h-4 w-4 text-white" />
//                   </button>
//                 </div>
//               </div>
//               <div className="space-y-1">
//                 <p className="text-sm font-medium text-white group-hover:text-[#1D50A3] transition-colors">
//                   {item.title}
//                 </p>
//                 <div className="flex items-center space-x-2 text-xs text-gray-400">
//                   <span>{item.year}</span>
//                   <span>•</span>
//                   <span>{item.duration}</span>
//                 </div>
//                 <div className="flex items-center space-x-1">
//                   <span className="text-xs text-gray-400">Seasons: {item.seasons || 1}</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// } 