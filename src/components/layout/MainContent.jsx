import { useNavigation } from "../../redux/hooks/useRedux";
import HomeView from "../views/HomeView";
import SearchView from "../views/SearchView";
import PlaylistsView from "../views/PlaylistsView";
import AlbumsView from "../views/AlbumsView";
import GenresView from "../views/GenresView";

export default function MainContent() {
  const { currentView } = useNavigation();

  const renderView = () => {
    switch (currentView) {
      case "home":
        return <HomeView />;
      case "search":
        return <SearchView />;
      case "playlists":
        return <PlaylistsView />;
      case "albums":
        return <AlbumsView />;
      case "genres":
        return <GenresView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-gray-900 to-black overflow-y-auto">
      {renderView()}
    </div>
  );
}
