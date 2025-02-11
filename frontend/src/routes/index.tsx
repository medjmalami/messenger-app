import { createBrowserRouter, Navigate } from 'react-router-dom';
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';
import ChatPage from '../pages/ChatPage';
import FriendsPage from '../pages/FriendsPage';
import RequestsPage from '../pages/RequestsPage';
import ForgotPasswordPage from '../pages/ForgotPassPage';
import ResetPasswordPage from '../pages/ResetPassPage';

const isAuthenticated = () => {
  return localStorage.getItem('accessToken') !== null;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

export const router = createBrowserRouter([
  {
    path: '/signin',
    element: <SignInPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password/:token',
    element: <ResetPasswordPage />,
  },
  {
    path: '/chat',
    element: (
      <ProtectedRoute>
        <ChatPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/friends',
    element: (
      <ProtectedRoute>
        <FriendsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/requests',
    element: (
      <ProtectedRoute>
        <RequestsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/signin" replace />,
  },
]);