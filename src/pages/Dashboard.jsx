import { useState, useEffect } from "react";
import DocumentUploadModal from "../components/AddOuterContent/DocumentUploadModal";
import Categories from "./Categories";
import UserGreeting from "../components/UserGreeting";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useLanguage } from "../hooks/useLanguage";

const Dashboard = () => {
  const [searchValue, setSearchValue] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  
  const language = useLanguage();

  // Fetch all categories for search
  const fetchAllCategories = async () => {
    try {
      const response = await api.post(
        "/categories",
        {
          headers: {"X-Locale": language },
        },
      );

      if (response.data && response.data.data) {
        setAllCategories(response.data.data);
        setFilteredCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Filter categories based on search
  const filterCategories = (query) => {
    if (!query.trim()) {
      setFilteredCategories(allCategories);
      setShowResults(false);
      return;
    }

    const filtered = allCategories.filter(category =>
      category.category_name.toLowerCase().includes(query.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(query.toLowerCase()))
    );

    setFilteredCategories(filtered);
    setShowResults(true);
  };

  // Handle search input change with debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      filterCategories(searchValue);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchValue, allCategories]);

  // Fetch categories on component mount
  useEffect(() => {
    fetchAllCategories();
  }, [language]);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const clearSearch = () => {
    setSearchValue("");
    setFilteredCategories(allCategories);
    setShowResults(false);
  };

  return (
    <>
      {/* Main Content */}
      <MainLayout>
        <div>
          {/* ✅ Greeting (User name from API) */}
          <UserGreeting />

          {/* ➕ Add Content Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-white text-blue-600 px-8 py-4 rounded-full shadow-lg transition flex items-center space-x-2 cursor-pointer hover:bg-blue-50"
            >
              <span>Add content</span>
              <span className="flex items-center">
                <img
                  src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMC43MzciIGhlaWdodD0iMzEuNjYiIHZpZXdCb3g9IjAgMCAzMC43MzcgMzEuNjYiPgogICAgPGRlZnM+CiAgICAgICAgPHN0eWxlPi5he2ZpbGw6bm9uZTtzdHJva2U6IzAwNTc5ODtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9PC9zdHlsZT4KICAgIDwvZGVmcz4KICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xLjcxNiAtMS4wODQpIj4KICAgICAgICA8cGF0aCBjbGFzcz0iYSIKICAgICAgICAgICAgICBkPSJNMTUuOTUsMzIuMjQ0YS43MDcuNzA3LDAsMCwxLS43MDctLjcwN1YxOS4yOTNhLjcwNy43MDcsMCwwLDAtLjcwNy0uNzA3SDIuOTIzYS43MDcuNzA3LDAsMCwxLS43MDctLjcwN1YxNS44MzRhLjcwNy43MDcsMCwwLDEsLjcwNy0uNzA3SDE0LjUzNWEuNzA4LjcwOCwwLDAsMCwuNzA3LS43MDdWMi4yOTFhLjcwNy43MDcsMCwwLDEsLjcwNy0uNzA3aDIuMjc0YS43MDguNzA4LDAsMCwxLC43MDcuNzA3VjE0LjQyYS43MDcuNzA3LDAsMCwwLC43MDcuNzA3SDMxLjI0NmEuNzA3LjcwNywwLDAsMSwuNzA3LjcwN3YyLjA0NGEuNzA3LjcwNywwLDAsMS0uNzA3LjcwN0gxOS42MzhhLjcwNy43MDcsMCwwLDAtLjcwNy43MDd2OS4yNjEiCiAgICAgICAgICAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAwKSIvPgogICAgPC9nPgo8L3N2Zz4K"
                  alt="Upload"
                  className="w-6 h-6"
                />
              </span>
            </button>
          </div>

          {/* 🔍 Category Search */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-700">Category Search</span>
              <p className="text-xs text-gray-500 mt-1">
                Search categories by name or description
              </p>
            </div>
            <div className="relative">
              <input
                id="search-input"
                type="text"
                placeholder="Search categories..."
                value={searchValue}
                onChange={handleSearch}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {searchValue && (
                <button
                  onClick={clearSearch}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  title="Clear"
                >
                  ✕
                </button>
              )}
              {loading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
          </div>

          {/* Search Results Info */}
          {/* {showResults && (
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Search Results for "{searchValue}"
                </h3>
                <span className="text-sm text-gray-600">
                  {filteredCategories.length} category(s) found
                </span>
              </div>
            </div>
          )} */}

          {/* 🏷️ Categories */}
          <Categories filteredCategories={filteredCategories} searchActive={showResults} />
        </div>
      </MainLayout>

      {/* 📤 Upload Modal */}
      <DocumentUploadModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />
    </>
  );
};

export default Dashboard;