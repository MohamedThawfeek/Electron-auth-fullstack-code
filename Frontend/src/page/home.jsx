import React, { useEffect, useState } from "react";
import { clearUser } from "../redux/slice/user";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "../components/NavBar";
import toast from "react-hot-toast";
import ApiRequest from "../services/http-service";

const home = () => {
  const dispatch = useDispatch();
  const ElectronAPI = window.electronAPI;
  const { userDetails: userData } = useSelector((state) => state.users);
  const [showPopup, setShowPopup] = useState(false);
  const [showUrlPopup, setShowUrlPopup] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [shortURLs, setShortURLs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit] = useState(10);
  const [refetch, setRefetch] = useState(false);



  useEffect(() => {
    if (userData && !refetch) {
      const getShortURLs = async (page = 1) => {
        try {
          setIsLoading(true);
          const { data } = await ElectronAPI.getShortURL({
            user_id: userData?._id,
          });
          const {
            success,
            message,
            data: shortURLs,
            currentPage,
            totalPages,
            totalCount,
          } = await ApiRequest.post("/auth/get_short_urls?page=" + page + "&limit=" + limit, data);
          if (success) {
            setShortURLs(shortURLs);
            setCurrentPage(currentPage);
            setTotalPages(totalPages);
            setTotalCount(totalCount);
            setIsLoading(false);
          }
        } catch (error) {
          console.log(error);
          toast.error(
            error?.response?.data?.message ||
              "Failed to get short URLs. Please try again."
          );
          setIsLoading(false);
        } finally {
          setRefetch(false);
        }
      };
      getShortURLs();

    }
  }, [userData, refetch]);

  // Function to get avatar - either actual avatar or first letter
  const getAvatar = (user) => {
    return (
      <div className="w-full h-full flex items-center justify-center text-white font-semibold text-lg">
        {user?.name?.charAt(0).toUpperCase()}
      </div>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(clearUser());
    setShowPopup(false);
  };

  const handleCreateUrl = async () => {
    try {
      const payload = {
        fullUrl: urlInput,
        user_id: userData?._id,
      };
      const { data } = await ElectronAPI.createShortURL(payload);

      const { success, message } = await ApiRequest.post(
        "/auth/create_short_url",
        data
      );

      if (success) {
        toast.success(message);
        setUrlInput("");
        setShowUrlPopup(false);
        setRefetch(true);
        setTimeout(() => {
          setRefetch(false);
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to create short URL. Please try again."
      );
    }
  };

  const handleCancelUrl = () => {
    setUrlInput("");
    setShowUrlPopup(false);
  };

  const handleDeleteUrl = async (urlId) => {
    if (window.confirm("Are you sure you want to delete this short URL?")) {
      try {
        const { data } = await ElectronAPI.deleteShortURL({ id: urlId });
        const { success, message } = await ApiRequest.delete(
          "/auth/delete_short_url",
          data
        );

        if (success) {
          toast.success(message);
          setRefetch(true);

          setTimeout(() => {
            setRefetch(false);
          }, 1000);
        }
      } catch (error) {
        console.log(error);
        toast.error(
          error?.response?.data?.message ||
            "Failed to delete short URL. Please try again."
        );
      }
    }
  };



  // if (!userData) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <p className="text-gray-600 mb-4">No user data available</p>
  //         <button
  //           onClick={() => dispatch(clearUser())}
  //           className="bg-blue-600 text-white px-4 py-2 rounded"
  //         >
  //           Go to Login
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="bg-gray-50 w-full h-full flex flex-col gap-0 overflow-hidden">
      <NavBar
        userData={userData}
        getAvatar={getAvatar}
        handleLogout={handleLogout}
        showPopup={showPopup}
        setShowPopup={setShowPopup}
      />
      <div className="bg-gray-100 w-full h-full overflow-auto relative">
        <div className="w-full h-[10%]">
        <button
          onClick={() => setShowUrlPopup(true)}
          className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200"
        >
          Create URL
        </button>

        {/* Popup Box */}
        {showUrlPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Create Short URL
              </h3>

              {/* URL Input */}
              <div className="mb-6">
                <label
                  htmlFor="url-input"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Enter URL
                </label>
                <input
                  id="url-input"
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancelUrl}
                  className="px-4 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateUrl}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        </div>
        {/* Button on the right side */}
        <div className="w-full h-[90%] p-4">
          {/* Table Container */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-3 gap-4 px-6 py-3 text-sm font-medium text-gray-700">
                <div>S.No</div>
                <div>Short URL</div>
                <div>Action</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading...</span>
                </div>
              ) : shortURLs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No short URLs created yet
                </div>
              ) : (
                shortURLs.map((url, index) => (
                  <div key={url._id} className="grid grid-cols-3 gap-4 px-6 py-4 text-sm text-gray-900 hover:bg-gray-50">
                    <div className="flex items-center">{index + 1}</div>
                    <div className="flex items-center">
                      <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                        {url.shortUrl || 'Generating...'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleDeleteUrl(url._id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded transition-colors duration-200"
                        title="Delete URL"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pagination Controls */}
          {
            shortURLs.length > 0 && 
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      const { data } = await ElectronAPI.getShortURL({
                        user_id: userData?._id,
                        page: currentPage - 1,
                        limit,
                      });
                      const {
                        success,
                        data: shortURLs,
                        currentPage: newCurrentPage,
                        totalPages: newTotalPages,
                        totalCount: newTotalCount,
                      } = await ApiRequest.post("/auth/get_short_urls?page=" + (currentPage - 1) + "&limit=" + limit, data);
                      if (success) {
                        setShortURLs(shortURLs);
                        setCurrentPage(newCurrentPage);
                        setTotalPages(newTotalPages);
                        setTotalCount(newTotalCount);
                        setIsLoading(false);
                      }
                    } catch (error) {
                      console.log(error);
                      setIsLoading(false);
                    }
                  }}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      const { data } = await ElectronAPI.getShortURL({
                        user_id: userData?._id,
                        page: currentPage + 1,
                        limit,
                      });
                      const {
                        success,
                        data: shortURLs,
                        currentPage: newCurrentPage,
                        totalPages: newTotalPages,
                        totalCount: newTotalCount,
                      } = await ApiRequest.post("/auth/get_short_urls?page=" + (currentPage + 1) + "&limit=" + limit, data);
                      if (success) {
                        setShortURLs(shortURLs);
                        setCurrentPage(newCurrentPage);
                        setTotalPages(newTotalPages);
                        setTotalCount(newTotalCount);
                        setIsLoading(false);
                      }
                    } catch (error) {
                      console.log(error);
                      setIsLoading(false);
                    }
                  }}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          }
        </div>


      </div>
    </div>
  );
};

export default home;
