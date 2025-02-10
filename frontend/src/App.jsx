import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import LoadingSpinner from "./components/common/LoadingSpinner";
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/common/Layout';
import ErrorBoundary from './components/common/ErrorBoundary';
import ErrorPage from './pages/ErrorPage';

// Lazy-loaded components
const HomePage = lazy(() => import("./pages/home/HomePage"));
const LoginPage = lazy(() => import("./pages/auth/login/LoginPage"));
const SignUpPage = lazy(() => import("./pages/auth/signup/SignUpPage"));
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));
const NotificationPage = lazy(() => import("./pages/notification/NotificationPage"));
const Chats = lazy(() => import("./pages/chats/Chats"));
const Messages = lazy(() => import("./pages/chats/Messages"));
const Post = lazy(() => import("./pages/home/Post"));
const PhoneChat = lazy(() => import("./pages/phone/phoneChat"));
const PhoneAdd = lazy(() => import("./pages/phone/PhoneAdd"));

function App() {
  const { data: authUser, isLoading, isError, error } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/myaccount");
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Authentication failed");
        }
        return await res.json();
      } catch (error) {
        console.error("Authentication error:", error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" aria-label="Loading authentication..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen flex justify-center items-center">
        <ErrorPage message={error.message || "Failed to authenticate"} />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className='max-w-6xl mx-auto flex'>
        <Suspense fallback={
          <div className="h-screen flex justify-center items-center">
            <LoadingSpinner size="lg" />
          </div>
        }>
          <Routes>
            <Route element={<Layout authUser={authUser} />}>
              {/* Protected routes */}
              <Route element={<ProtectedRoute authUser={authUser} />}>
                <Route path='/' element={<HomePage />} />
                <Route path='/notifications' element={<NotificationPage />} />
                <Route path='/profile/:username' element={<ProfilePage />} />
                <Route path='/chats' element={<Chats />} />
                <Route path='/chats/:id' element={<Messages />} />
                <Route path='/post/:id' element={<Post />} />
                <Route path='/message' element={<PhoneChat />} />
                <Route path='/add' element={<PhoneAdd />} />
              </Route>

              {/* Auth routes */}
              <Route path='/login' element={
                authUser ? <Navigate to="/" replace /> : <LoginPage />
              } />
              <Route path='/signup' element={
                authUser ? <Navigate to="/" replace /> : <SignUpPage />
              } />

              {/* Error route */}
              <Route path='*' element={<ErrorPage />} />
            </Route>
          </Routes>
        </Suspense>
        
        <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
      </div>
    </ErrorBoundary>
  );
}

export default App;