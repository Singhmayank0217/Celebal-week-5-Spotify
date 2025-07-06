"use client";

import { Play } from "lucide-react";

const genres = [
  { id: "1", name: "Pop", color: "bg-pink-500" },
  { id: "2", name: "Hip Hop", color: "bg-orange-500" },
  { id: "3", name: "Rock", color: "bg-red-500" },
  { id: "4", name: "Electronic", color: "bg-purple-500" },
  { id: "5", name: "Jazz", color: "bg-blue-500" },
  { id: "6", name: "Classical", color: "bg-green-500" },
  { id: "7", name: "Country", color: "bg-yellow-500" },
  { id: "8", name: "R&B", color: "bg-indigo-500" },
];

export default function GenresView() {
  const handlePlayGenre = (genre) => {
    console.log("Playing genre:", genre.name);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Browse Genres</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {genres.map((genre) => (
          <div
            key={genre.id}
            className={`${genre.color} rounded-lg p-6 h-32 relative overflow-hidden cursor-pointer hover:scale-105 transition-transform group`}
            onClick={() => handlePlayGenre(genre)}
          >
            <h3 className="text-2xl font-bold text-white mb-2">{genre.name}</h3>
            <p className="text-white/80 text-sm">Explore {genre.name}</p>
            <button className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 hover:bg-black/40 rounded-full p-2">
              <Play className="h-4 w-4 text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
