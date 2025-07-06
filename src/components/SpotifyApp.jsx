import { useNavigation } from "../redux/hooks/useRedux";
import Sidebar from "./layout/Sidebar";
import MainContent from "./layout/MainContent";
import MusicPlayer from "./player/MusicPlayer";
import ApiStatusBanner from "./ui/ApiStatusBanner";

export default function SpotifyApp() {
  const { currentView } = useNavigation();

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <ApiStatusBanner />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MainContent />
      </div>
      <MusicPlayer />
    </div>
  );
}
