
import { useState } from "react";

function SearchCard({ user }) {
  const [isFollowing, setIsFollowing] = useState(user.is_following);

  const handleFollow = async () => {
    const token = localStorage.getItem("token");
    const url = isFollowing
      ? `/api/users/${user.id}/unfollow`
      : `/api/users/${user.id}/follow`;

    await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    setIsFollowing(!isFollowing);
  };

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-xl shadow-md p-8 hover:shadow-lg hover:shadow-blue-200/50 dark:hover:shadow-blue-500/20 transition-all duration-300 border border-transparent dark:border-gray-800">
      <div className="flex items-center mb-4">
        <img
          src={user.avatar || "/default-avatar.png"}
          alt={user.name}
          className="h-12 w-12 rounded-full mr-3 object-cover"
        />
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-100 mr-4">
          {user.name}
        </h2>
        <button
          onClick={handleFollow}
          className={`font-bold rounded-md p-1 px-2 transition-colors duration-200 ${
            isFollowing
              ? "bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
              : "bg-blue-600 text-white"
          }`}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-2">@{user.username}</p>
      <p className="text-gray-600 dark:text-gray-300 mb-2">{user.bio}</p>

      <div className="text-gray-400 dark:text-gray-400 text-sm flex space-x-4">
        <span>{user.followers_count || 0} followers</span>
        <span>{user.following_count || 0} following</span>
      </div>
    </div>
  );
}

export default SearchCard;