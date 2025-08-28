import './style.css';
import { Login } from '@pages/login';
import { Signup } from '@pages/signup';
import { Home } from '@pages/home';

import { RouterProvider, useMiniRouter } from '@context/router-context';
import { RequiredAuth } from '@guard/require-auth';

// This component contains the main app logic and uses the router
const AppContent: React.FC = () => {
  const { route } = useMiniRouter();

  const renderView = () => {
    switch (route) {
      case 'signup':
        return <Signup />;
      case 'home':
        return (
          <RequiredAuth>
            <Home />
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
    <RouterProvider initial="login">
      <div className="app-container">
        <div className="app-content">
          <AppContent />
        </div>
      </div>
    </RouterProvider>
  );
};

export default App;
