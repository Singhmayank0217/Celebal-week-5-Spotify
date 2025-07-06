"use client";

import { useNavigation, usePlaylists } from "../../redux/hooks/useRedux";
import { Home, Search, Library, Plus, Heart } from "lucide-react";

export default function Sidebar() {
  const { currentView, navigateTo } = useNavigation();
  const { playlists, selectPlaylist } = usePlaylists();

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "search", label: "Search", icon: Search },
    { id: "playlists", label: "Your Library", icon: Library },
  ];

  const handlePlaylistClick = (playlistId) => {
    navigateTo("playlists");
    selectPlaylist(playlistId);
  };

  return (
    <div className="w-64 bg-black border-r border-gray-800 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-8">Spotify 2.0</h1>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center justify-start px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors ${
                currentView === item.id ? "text-white bg-gray-800" : ""
              }`}
              onClick={() => {
                navigateTo(item.id);
                selectPlaylist(null);
              }}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-8">
          <button
            className="w-full flex items-center justify-start px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors mb-4"
            onClick={() => navigateTo("genres")}
          >
            <Plus className="mr-3 h-5 w-5" />
            Browse Genres
          </button>

          <button
            className="w-full flex items-center justify-start px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            onClick={() => navigateTo("albums")}
          >
            <Heart className="mr-3 h-5 w-5" />
            Albums
          </button>
        </div>
      </div>

      <div className="flex-1 px-6 pb-6">
        <div className="border-t border-gray-800 pt-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">
            PLAYLISTS
          </h3>
          <div className="space-y-1">
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                className="w-full text-left px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-sm"
                onClick={() => handlePlaylistClick(playlist.id)}
              >
                {playlist.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
