"use client";

import { useState } from "react";
import { useMusicPlayer, usePlaylists } from "../../redux/hooks/useRedux";
import { Play, Plus, Trash2 } from "lucide-react";

export default function PlaylistsView() {
  const { playTrack } = useMusicPlayer();
  const {
    playlists,
    selectedPlaylist,
    createNewPlaylist,
    removeTrackFromPlaylist,
    getCurrentPlaylist,
    selectPlaylist,
  } = usePlaylists();
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const currentPlaylist = getCurrentPlaylist();

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createNewPlaylist({
        name: newPlaylistName,
        description: newPlaylistDescription,
        cover:
          "https://via.placeholder.com/200x200/1f2937/ffffff?text=Playlist",
      });
      setNewPlaylistName("");
      setNewPlaylistDescription("");
      setShowCreateDialog(false);
    }
  };

  const handlePlayTrack = (track) => {
    playTrack(track);
  };

  if (currentPlaylist) {
    return (
      <div className="p-8">
        <div className="flex items-end space-x-6 mb-8">
          <img
            src={
              currentPlaylist.cover ||
              "https://via.placeholder.com/200x200/1f2937/ffffff?text=Playlist"
            }
            alt={currentPlaylist.name}
            className="w-50 h-50 rounded-lg shadow-lg object-cover"
          />
          <div>
            <p className="text-sm text-gray-400 uppercase tracking-wide">
              Playlist
            </p>
            <h1 className="text-4xl font-bold mb-2">{currentPlaylist.name}</h1>
            <p className="text-gray-400 mb-4">{currentPlaylist.description}</p>
            <p className="text-sm text-gray-400">
              {currentPlaylist.tracks.length} songs
            </p>
          </div>
        </div>

        <div className="mb-6">
          <button className="bg-green-500 hover:bg-green-600 rounded-full px-8 py-3 flex items-center transition-colors">
            <Play className="mr-2 h-4 w-4" />
            Play
          </button>
        </div>

        <div className="space-y-2">
          {currentPlaylist.tracks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">This playlist is empty</p>
              <p className="text-sm text-gray-500">
                Add some songs to get started
              </p>
            </div>
          ) : (
            currentPlaylist.tracks.map((track, index) => (
              <div
                key={track.id}
                className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800 group"
              >
                <div className="w-8 text-gray-400 text-sm">{index + 1}</div>
                <img
                  src={
                    track.cover ||
                    "https://via.placeholder.com/40x40/1f2937/ffffff?text=♪"
                  }
                  alt={track.title}
                  className="w-10 h-10 rounded object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{track.title}</h3>
                  <p className="text-gray-400 text-sm">{track.artist}</p>
                </div>
                <div className="text-gray-400 text-sm">{track.album}</div>
                <div className="text-gray-400 text-sm">{track.duration}</div>
                <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                  <button
                    onClick={() => handlePlayTrack(track)}
                    className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <Play className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() =>
                      removeTrackFromPlaylist(currentPlaylist.id, track.id)
                    }
                    className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Library</h1>
        <button
          onClick={() => setShowCreateDialog(true)}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Playlist
        </button>
      </div>

      {showCreateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Create New Playlist</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Playlist name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newPlaylistDescription}
                onChange={(e) => setNewPlaylistDescription(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleCreatePlaylist}
                  className="flex-1 bg-green-500 hover:bg-green-600 py-2 rounded-lg transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreateDialog(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer group"
            onClick={() => selectPlaylist(playlist.id)}
          >
            <div className="relative mb-4">
              <img
                src={
                  playlist.cover ||
                  "https://via.placeholder.com/150x150/1f2937/ffffff?text=Playlist"
                }
                alt={playlist.name}
                className="rounded-lg w-full aspect-square object-cover"
              />
              <button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-green-500 hover:bg-green-600 rounded-full p-2">
                <Play className="h-4 w-4" />
              </button>
            </div>
            <h3 className="font-semibold text-sm mb-1 truncate">
              {playlist.name}
            </h3>
            <p className="text-gray-400 text-xs truncate">
              {playlist.description}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {playlist.tracks.length} songs
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
