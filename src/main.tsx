import React from 'react'
import ReactDOM from 'react-dom/client'
import { router } from './App.tsx'
import './index.scss'
import { RouterProvider } from 'react-router-dom'
import AuthProvider from './contexts/AuthContext'
import { Toaster } from 'react-hot-toast'
import { register } from 'swiper/element/bundle'
register();
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Toaster
    position="top-right"
    reverseOrder={false}
    />
    <AuthProvider>
      <RouterProvider router={router} />
      </AuthProvider>
  </React.StrictMode>,
)