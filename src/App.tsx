import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './firebase/auth';
import { PublicLayout } from './components/layout/PublicLayout';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { Home } from './pages/Home';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { Nosotros } from './pages/Nosotros';
import { Contacto } from './pages/Contacto';
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { Editor } from './pages/admin/Editor';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
          <Route path="/blog/:slug" element={<PublicLayout><BlogPost /></PublicLayout>} />
          <Route path="/nosotros" element={<PublicLayout><Nosotros /></PublicLayout>} />
          <Route path="/contacto" element={<PublicLayout><Contacto /></PublicLayout>} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/editor" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
          <Route path="/admin/editor/:id" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
