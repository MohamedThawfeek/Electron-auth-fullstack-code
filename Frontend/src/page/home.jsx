import React, { useEffect } from 'react'
import { clearUser } from '../redux/slice/user'
import { useDispatch, useSelector } from 'react-redux'

const home = () => {
  const dispatch = useDispatch();
  const ElectronAPI = window.electronAPI;
  const { userDetails: userData } = useSelector((state) => state.users);



  // Function to get avatar - either actual avatar or first letter
  const getAvatar = (user) => {
    // if (user?.avatar) {
    //   return (
    //     <img 
    //       src={user?.avatar} 
    //       alt={`${user?.name}'s avatar`}
    //       className="w-full h-full object-cover rounded-full"
    //     />
    //   )
    // }
    return (
      <div className="w-full h-full flex items-center justify-center text-white font-semibold text-xl">
        {user?.name?.charAt(0).toUpperCase()}
      </div>
    )
  }


  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No user data available</p>
          <button 
            onClick={() => dispatch(clearUser())}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Welcome Home</h1>
        
        {/* User Profile Box */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            {
              userData &&
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full overflow-hidden shadow-md">
              {getAvatar(userData)}
            </div>
            }
            
            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {userData?.name}
              </h2>
              <p className="text-gray-600 text-sm mb-2">
                {userData?.email}
              </p>
              
              {/* Status Badge */}
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  userData?.verified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                    userData?.verified ? 'bg-green-400' : 'bg-yellow-400'
                  }`}></div>
                  {userData?.verified ? 'Verified' : 'Pending Verification'}
                </span>
                
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {userData?.provider}
                </span>
              </div>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Member since:</span>
                <p className="text-gray-800 font-medium">
                  {new Date(userData?.createdAt)?.toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Last updated:</span>
                <p className="text-gray-800 font-medium">
                  {new Date(userData?.updatedAt)?.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          
          {/* Logout Button */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button 
              onClick={() => {
                localStorage.removeItem("token");
                dispatch(clearUser());
              }}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default home
