import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { User } from 'lucide-react';

export default function Login() {
  const { loginAs } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-100 p-4 rounded-full text-blue-600 mb-4">
            <User size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Select a user to continue</p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={() => loginAs('Mansi')}
            className="w-full py-4 px-6 border-2 border-blue-500 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition flex justify-between items-center"
          >
            <span>Login as Mansi</span>
            <span className="text-2xl">👩🏻‍💻</span>
          </button>
          
          <button 
            onClick={() => loginAs('Rahul')}
            className="w-full py-4 px-6 border-2 border-purple-500 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition flex justify-between items-center"
          >
            <span>Login as Rahul</span>
            <span className="text-2xl">👨🏽‍💻</span>
          </button>
        </div>
      </div>
    </div>
  );
}
