import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "./redux/store";
import SpotifyApp from "./components/SpotifyApp";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SpotifyApp />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
