import React from 'react';

export const LoginPage: React.FC = () => {
  const handleLogin = (): void => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth/google`;
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='mb-8 text-3xl font-semibold'>WebApp Template</h1>
      <button
        onClick={handleLogin}
        className='bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-200 ease-in-out'
      >
        Login with Google
      </button>
    </div>
  );
};

export default LoginPage;
