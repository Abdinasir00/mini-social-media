import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsWithUsers, fetchComments } from "../store/slices/PostSlices";
import { fetchConnections, checkStatus } from "../store/slices/auth";
import Postcard from "../components/posts/Postcard";
import { Link } from "react-router-dom";
import defaultAvatar from "../assets/defaultimage.png";

function Home() {
  const dispatch = useDispatch();
  const [imageLoading, setImageLoading] = useState(true);

  const { user } = useSelector((state) => state.auth);
  // console.log("USER in Home:", user);
  // console.log("User avatar URL:", user?.avatarUrl);
  const { posts, status, error } = useSelector((state) => state.post);

  const loggedInUserId = user?._id || user?.id;

  const fetchedCommentsRef = useRef(new Set());

  useEffect(() => {
    posts.forEach((post) => {
      const postId = post._id || post.id;
      if (!fetchedCommentsRef.current.has(postId)) {
        fetchedCommentsRef.current.add(postId);
        dispatch(fetchComments(postId));
      }
    });
  }, [posts, dispatch]);

  useEffect(() => {
    if (user?.id && (!user.followingIds || !user.followerIds)) {
      dispatch(fetchConnections(user.id));
    }
    if (status === "idle") {
      dispatch(fetchPostsWithUsers());
      dispatch(checkStatus());
    }
  }, [status, dispatch, user?.id]);

  // Refresh user data when component mounts to ensure latest profile picture
  useEffect(() => {
    if (user?.id) {
      dispatch(checkStatus());
    }
  }, [dispatch, user?.id]);

  // Force refresh user data when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user?.id) {
        dispatch(checkStatus());
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [dispatch, user?.id]);

  const followingIds = user?.followingIds || [];

  // Show all posts from everyone (like in the image)
  const filteredPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Counts how many posts belong to the logged-in user

  const userPostCount = posts.filter(
    (p) => p.user?.id === loggedInUserId
  ).length;
  // Total posts in the feed

  const feedPostCount = filteredPosts.length;
  const stats = [
    { label: "Your Posts", value: userPostCount, accent: "text-blue-500" },
    { label: "Following", value: followingIds.length, accent: "text-green-500" },
    { label: "All Posts", value: posts.length, accent: "text-purple-500" },
  ];

  return (
    <div className="w-full">
      <main className="flex flex-col gap-8 w-full max-w-5xl mx-auto px-4 py-8 mb-8 min-h-[calc(100vh-5rem)]">
        {/* Welcome */}
        <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 rounded-2xl shadow-2xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="relative shrink-0">
              {imageLoading && (
                <div className="w-20 h-20 rounded-full bg-white/10 animate-pulse flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white/70 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <img
                src={user?.avatarUrl || defaultAvatar}
                alt="Profile"
                className={`w-20 h-20 rounded-full object-cover border-4 border-white shadow-xl hover:shadow-2xl transition-all duration-300 ${
                  imageLoading ? "hidden" : "block"
                }`}
                onLoad={() => {
                  setImageLoading(false);
                }}
                onError={(e) => {
                  e.target.src = defaultAvatar;
                  setImageLoading(false);
                }}
              />
            </div>
            <div>
              <p className="text-sm uppercase tracking-widest text-blue-100">
                Dashboard
              </p>
              <h2 className="text-3xl font-bold mb-1">
                Welcome back, {user?.name || "Guest"}! 👋
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                Discover what’s happening across the entire community and share your voice.
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 p-6 text-center transition hover:shadow-lg"
            >
              <p className={`text-3xl font-bold mb-2 ${stat.accent}`}>{stat.value}</p>
              <p className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Posts Feed */}
        {status === "loading" && (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Loading your feed...</p>
          </div>
        )}

        {status === "failed" && (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-red-600 mb-4">Error loading posts: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {status === "succeeded" && filteredPosts.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">📱</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                Welcome to ConnectHub!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                Be the first to create a post and start sharing with the community!
              </p>
              <Link
                to="/create"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
              >
                Create Your First Post
              </Link>
            </div>
          </div>
        )}

        {status === "succeeded" && filteredPosts.length > 0 && (
          <div className="w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">🌍 All Posts</h2>
              <span className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                {filteredPosts.length} posts
              </span>
            </div>
            <div className="space-y-6">
              {filteredPosts.map((post, index) => (
                <Postcard
                  key={post._id || post.id || post.createdAt || index}
                  post={post}
                />
              ))}
            </div>
          </div>
        )}
      </main>
      {/* Footer is only visible on mobile devices */}
      {/* <Footer /> */}
    </div>
  );
}

export default Home;
