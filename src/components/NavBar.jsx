import React from 'react'

const NavBar = ({userData, getAvatar, handleLogout, showPopup, setShowPopup}) => {
  return (
    <>
     {/* Navbar */}
     <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - ShortURL title */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800">ShortURL</h1>
            </div>
            
            {/* Right side - User info and logo */}
            <div className="flex items-center space-x-3">
              <span className="text-gray-700 font-medium">{userData?.name}</span>
              <div className="relative">
                <button
                  onClick={() => setShowPopup(!showPopup)}
                  className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                >
                  {getAvatar(userData)}
                </button>
                
                {/* Popup */}
                {showPopup && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">{userData?.name}</p>
                      <p className="text-xs text-gray-500">{userData?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      
      
      {/* Overlay to close popup when clicking outside */}
      {showPopup && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowPopup(false)}
        />
      )}
    </>
  )
}

export default NavBar