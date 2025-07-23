
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<HomePage />} />
            </Routes>
          </Layout>
          <Toaster position="bottom-right" />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
