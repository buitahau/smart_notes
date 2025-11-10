import './style.css';
import { Login } from '@pages/login';
import { Signup } from '@pages/signup';
import { Home } from '@pages/home';
import { Loading } from '@pages/loading';
import { Settings } from '@pages/settings';

import { RouterProvider, useMiniRouter } from '@context/router-context';
import { RequiredAuth } from '@guard/require-auth';
import { CreateNote } from '@pages/create-note';
import { ChatProvider } from '@context/chat-context';

// This component contains the main app logic and uses the router
const AppContent: React.FC = () => {
  const { route } = useMiniRouter();

  const renderView = () => {
    switch (route) {
      case 'loading':
        return (
          <RequiredAuth>
            <Loading />
          </RequiredAuth>
        );
      case 'signup':
        return <Signup />;
      case 'home':
        return (
          <RequiredAuth>
            <Home />
          </RequiredAuth>
        );
      case 'create-note':
        return (
          <RequiredAuth>
            <CreateNote />
          </RequiredAuth>
        );
      case 'settings':
        return (
          <RequiredAuth>
            <Settings />
          </RequiredAuth>
        );
      case 'login':
      default:
        return <Login />;
    }
  };

  return renderView();
};

const App: React.FC = () => {
  return (
    <RouterProvider initial="loading">
      <ChatProvider>
        <div className="app-container">
          <div className="app-content">
            <AppContent />
          </div>
        </div>
      </ChatProvider>
    </RouterProvider>
  );
};

export default App;
