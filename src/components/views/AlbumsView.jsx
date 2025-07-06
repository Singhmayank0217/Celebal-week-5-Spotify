"use client";

import { Play } from "lucide-react";

const albums = [
  {
    id: "1",
    title: "Popular Albums",
    artist: "Various Artists",
    cover: "https://via.placeholder.com/300x300/1f2937/ffffff?text=Popular",
    year: "2024",
  },
  {
    id: "2",
    title: "Top Charts",
    artist: "Billboard",
    cover: "https://via.placeholder.com/300x300/1f2937/ffffff?text=Charts",
    year: "2024",
  },
  {
    id: "3",
    title: "New Releases",
    artist: "Fresh Music",
    cover: "https://via.placeholder.com/300x300/1f2937/ffffff?text=New",
    year: "2024",
  },
  {
    id: "4",
    title: "Classic Hits",
    artist: "Timeless",
    cover: "https://via.placeholder.com/300x300/1f2937/ffffff?text=Classic",
    year: "All Time",
  },
];

export default function AlbumsView() {
  const handlePlayAlbum = (album) => {
    console.log("Playing album:", album.title);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Albums</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {albums.map((album) => (
          <div
            key={album.id}
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer group"
            onClick={() => handlePlayAlbum(album)}
          >
            <div className="relative mb-4">
              <img
                src={album.cover || "/placeholder.svg"}
                alt={album.title}
                className="rounded-lg w-full aspect-square object-cover"
              />
              <button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-green-500 hover:bg-green-600 rounded-full p-2">
                <Play className="h-4 w-4" />
              </button>
            </div>
            <h3 className="font-semibold text-sm mb-1 truncate">
              {album.title}
            </h3>
            <p className="text-gray-400 text-xs truncate">{album.artist}</p>
            <p className="text-gray-500 text-xs mt-1">{album.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
