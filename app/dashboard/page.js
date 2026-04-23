'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardShell from '@/components/DashboardShell';
import { useCurrentUser } from '@/hooks/useAuth';
import { useCategories, useSubcategoriesByCategory, useTopicsBySubcategory, useLettersByTopic } from '@/hooks/useContent';

export default function Dashboard() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Navigation state
  const [currentLevel, setCurrentLevel] = useState('categories'); // categories, subcategories, topics, letters
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Use our custom hooks
  const { data: userData, isLoading: userLoading, error: userError } = useCurrentUser();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();

  const { data: subcategoriesData, isLoading: subcategoriesLoading } = useSubcategoriesByCategory(
    selectedCategory?._id || null
  );
  
  const { data: topicsData, isLoading: topicsLoading } = useTopicsBySubcategory(
    selectedSubcategory?._id || null
  );
  
  const { data: lettersData, isLoading: lettersLoading } = useLettersByTopic(
    selectedTopic?._id || null
  );

  const user = userData;
  const categories = Array.isArray(categoriesData) ? categoriesData : [];
  const subcategories = Array.isArray(subcategoriesData) ? subcategoriesData : [];
  const topics = Array.isArray(topicsData) ? topicsData : [];
  const letters = Array.isArray(lettersData) ? lettersData : [];

  useEffect(() => {
    if (userError) {
      router.push('/login');
    }
  }, [userError, router]);

  if (!isClient || userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center animate-fade-in">
        <div className="space-y-6">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-primary-200 border-t-primary-600 mx-auto shadow-glow"></div>
          <p className="text-secondary-900 text-center text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  const handleBack = () => {
    if (currentLevel === 'subcategories') {
      setCurrentLevel('categories');
      setSelectedCategory(null);
    } else if (currentLevel === 'topics') {
      setCurrentLevel('subcategories');
      setSelectedSubcategory(null);
    } else if (currentLevel === 'letters') {
      setCurrentLevel('topics');
      setSelectedTopic(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  // Navigation handlers
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setSelectedTopic(null);
    setCurrentLevel('subcategories');
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setSelectedTopic(null);
    setCurrentLevel('topics');
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setCurrentLevel('letters');
  };

  // Combined loading state
  const contentLoading = categoriesLoading || subcategoriesLoading || topicsLoading || lettersLoading;

  // Filter items based on search
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredSubcategories = subcategories.filter(sub => 
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredTopics = topics.filter(topic => 
    topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredLetters = letters.filter(letter => 
    letter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    letter.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (contentLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4 animate-fade-in">
        <div className="rounded-3xl bg-white/95 px-8 py-12 text-center shadow-2xl shadow-primary-500/20 max-w-md card">
          <div className="space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="w-20 h-20 border-4 border-primary-200 rounded-full animate-spin border-t-primary-600"></div>
              <div className="absolute inset-2 w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl shadow-glow">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900">Loading amazing content...</p>
              <p className="text-secondary-600 mt-2">Please wait while we fetch the latest data for you</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardShell title="" subtitle="">
      <div className="space-y-8">
        {/* Welcome Header with Stats */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-40 w-80 h-80 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-4xl lg:text-5xl font-bold mb-3">
                  Welcome back, <span className="bg-gradient-to-r from-yellow-200 via-yellow-300 to-orange-200 bg-clip-text text-transparent">{user?.name}</span>! 👋
                </h1>
                <p className="text-purple-100 text-lg lg:text-xl font-medium">Discover amazing content organized just for you</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/20 backdrop-blur-md border border-white/40 rounded-xl px-8 py-3 text-base font-semibold text-white hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                🚪 Logout
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Categories', value: categories.length, icon: '📚', color: 'bg-blue-500/20', border: 'border-blue-300/50' },
                { label: 'Subcategories', value: subcategories.length, icon: '📁', color: 'bg-green-500/20', border: 'border-green-300/50' },
                { label: 'Topics', value: topics.length, icon: '📋', color: 'bg-purple-500/20', border: 'border-purple-300/50' },
                { label: 'Letters', value: letters.length, icon: '📄', color: 'bg-orange-500/20', border: 'border-orange-300/50' }
              ].map((stat, idx) => (
                <div key={idx} className={`${stat.color} backdrop-blur-sm rounded-xl p-5 border ${stat.border} hover:bg-white/15 transition-all duration-300 transform hover:scale-105`}>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-white/90 flex items-center gap-2">
                    <span className="text-xl">{stat.icon}</span>
                    <span className="font-medium">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-xl">🔍</span>
          </div>
          <input
            type="text"
            placeholder={`Search ${currentLevel}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-5 py-4 text-base border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
          />
        </div>

        {/* Main Content Area */}
        <div className="space-y-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg">
                  {currentLevel === 'categories' && '📚'}
                  {currentLevel === 'subcategories' && '📁'}
                  {currentLevel === 'topics' && '📋'}
                  {currentLevel === 'letters' && '📄'}
                </div>
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {currentLevel === 'categories' && 'All Categories'}
                    {currentLevel === 'subcategories' && selectedCategory?.name}
                    {currentLevel === 'topics' && selectedSubcategory?.name}
                    {currentLevel === 'letters' && selectedTopic?.name}
                  </h2>
                  <p className="text-gray-600 text-lg font-medium">
                    {currentLevel === 'categories' && `${categories.length} categories available`}
                    {currentLevel === 'subcategories' && `${subcategories.length} subcategories found`}
                    {currentLevel === 'topics' && `${topics.length} topics available`}
                    {currentLevel === 'letters' && `${letters.length} letters available`}
                  </p>
                </div>
              </div>
            </div>
            {currentLevel !== 'categories' && (
              <button
                onClick={handleBack}
                className="group flex items-center space-x-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-indigo-100 hover:to-purple-100 rounded-xl px-6 py-3 font-semibold text-gray-700 hover:text-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
              >
                <span>←</span>
                <span>Back</span>
              </button>
            )}
          </div>

          {/* Empty State */}
          {!contentLoading && ((currentLevel === 'categories' && filteredCategories.length === 0) || 
                              (currentLevel === 'subcategories' && filteredSubcategories.length === 0) || 
                              (currentLevel === 'topics' && filteredTopics.length === 0) || 
                              (currentLevel === 'letters' && filteredLetters.length === 0)) && (
            <div className="col-span-full">
              <div className="text-center py-16 space-y-6">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center text-5xl shadow-lg">
                  {currentLevel === 'categories' && '📚'}
                  {currentLevel === 'subcategories' && '📁'}
                  {currentLevel === 'topics' && '📋'}
                  {currentLevel === 'letters' && '📄'}
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-2">
                    {searchQuery ? 'No results found' : `No ${currentLevel} available`}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    {searchQuery ? 'Try a different search query' : `${currentLevel} will appear here once they're added.`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Categories Grid */}
          {!contentLoading && currentLevel === 'categories' && filteredCategories.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCategories.map((cat, index) => (
                <div
                  key={cat._id}
                  onClick={() => handleCategoryClick(cat)}
                  className="group cursor-pointer bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-200/50 hover:-translate-y-2 transition-all duration-300 shadow-lg"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      📚
                    </div>
                    <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                      Category
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-xl mb-3 group-hover:text-indigo-700 transition-colors line-clamp-2">{cat.name}</h3>
                  {cat.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{cat.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500">{new Date(cat.createdAt).toLocaleDateString()}</span>
                    <div className="flex items-center space-x-1 text-indigo-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                      <span>Explore</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Subcategories Grid */}
          {!contentLoading && currentLevel === 'subcategories' && filteredSubcategories.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredSubcategories.map((sub, index) => (
                <div
                  key={sub._id}
                  onClick={() => handleSubcategoryClick(sub)}
                  className="group cursor-pointer bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-green-300 hover:shadow-2xl hover:shadow-green-200/50 hover:-translate-y-2 transition-all duration-300 shadow-lg"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      📁
                    </div>
                    <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                      Subcategory
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-xl mb-3 group-hover:text-green-700 transition-colors line-clamp-2">{sub.name}</h3>
                  {sub.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{sub.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500">{new Date(sub.createdAt).toLocaleDateString()}</span>
                    <div className="flex items-center space-x-1 text-green-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                      <span>Explore</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Topics Grid */}
          {!contentLoading && currentLevel === 'topics' && filteredTopics.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTopics.map((topic, index) => (
                <div
                  key={topic._id}
                  onClick={() => handleTopicClick(topic)}
                  className="group cursor-pointer bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-200/50 hover:-translate-y-2 transition-all duration-300 shadow-lg"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      📋
                    </div>
                    <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                      Topic
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-xl mb-3 group-hover:text-purple-700 transition-colors line-clamp-2">{topic.name}</h3>
                  {topic.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{topic.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500">{new Date(topic.createdAt).toLocaleDateString()}</span>
                    <div className="flex items-center space-x-1 text-purple-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                      <span>View</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Letters Grid */}
          {!contentLoading && currentLevel === 'letters' && filteredLetters.length > 0 && (
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {filteredLetters.map((letter, index) => (
                <div
                  key={letter._id}
                  className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-orange-300 hover:shadow-2xl hover:shadow-orange-200/50 hover:-translate-y-2 transition-all duration-300 shadow-lg group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-white text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      📄
                    </div>
                    <span className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 px-4 py-2 rounded-full text-sm font-bold">
                      Letter
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-xl mb-4 group-hover:text-orange-700 transition-colors line-clamp-2">{letter.title}</h3>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-4 leading-relaxed">{letter.content}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <span className="text-xs text-gray-500">{new Date(letter.createdAt).toLocaleDateString()}</span>
                    <button className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-orange-200/50 transition-all duration-300 transform hover:scale-105">
                      Read More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
