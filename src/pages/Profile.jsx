import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPosts,
  uploadImage,
  updateUserProfile,
  DeletePost,
  fetchComments,
} from "../store/Slices/profileSlice";
import { BASE_URL } from "../store/BaseUrl";
import { Heart, MessageCircle } from "lucide-react";

function Profile() {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const { posts, uploadData, status, error } = useSelector(
    (state) => state.profile
  );

  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [followers, setFollowers] = useState(0);
  const [preview, setPreview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", bio: "" });
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [postComments, setPostComments] = useState({}); // 🔥 store comments per post

  // === Fetch profile & posts ===
  useEffect(() => {
    dispatch(getPosts())
      .unwrap()
      .catch((err) => console.error("Error fetching posts:", err));
  }, [dispatch]);

  useEffect(() => {
    if (posts) {
      setFormData({
        name: posts?.name || "",
        bio: posts?.bio || "",
      });
      setFollowers(posts?.followersCount || 0);
      setName(posts?.name || "");
      setAvatarUrl(posts?.avatarUrl || "");
    }
  }, [posts]);

  // === Toggle dropdown ===
  const toggleDropdown = (postId) => {
    setOpenDropdownId((prevId) => (prevId === postId ? null : postId));
  };

  // === Delete post ===
  const handleDeletePost = async (postId) => {
    try {
      await dispatch(DeletePost(postId)).unwrap();
      await dispatch(getPosts()).unwrap();
      setOpenDropdownId(null);
    } catch (error) {
      console.error("❌ Delete failed:", error);
      alert("Failed to delete post. Try again.");
    }
  };

  // === Fetch comments ===
  const handleComments = async (postId) => {
    try {
      const commentData = await dispatch(fetchComments(postId)).unwrap();
      console.log("✅ Comments fetched:", commentData);

      // Save comments for that post
      setPostComments((prev) => ({
        ...prev,
        [commentData.postId]: commentData.comments,
      }));
    } catch (error) {
      console.error("❌ Error fetching comments:", error);
    }
  };

  // === Update post (placeholder) ===
  const handleUpdatePost = (postId) => {
    alert(`Update post with ID: ${postId}`);
    setOpenDropdownId(null);
  };

  // === Upload profile image ===
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));

    try {
      const uploadResult = await dispatch(
        uploadImage({ file, type: "profile" })
      ).unwrap();

      const payload = {
        image_url: uploadResult?.url || "",
        storageId: uploadResult?.storageId || "",
      };

      await dispatch(updateUserProfile(payload)).unwrap();
      await dispatch(getPosts()).unwrap();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Image upload failed. Please try again.");
    }
  };

  // === Save profile changes ===
  const handleSave = async () => {
    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      await dispatch(getPosts()).unwrap();
      setEditMode(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // === Loading & Error UI ===
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center pt-40">
        <div className="flex flex-col items-center">
          <div className="w-13 h-13 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="mt-3 text-gray-600 font-medium">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  // === Convert timestamp to “x time ago” ===
  const timeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const seconds = Math.floor((now - postDate) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
    }
    return "just now";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      {/* === PROFILE HEADER === */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg rounded-2xl p-6 w-full max-w-7xl h-96 flex flex-col">
        {/* Profile Picture */}
        <div className="relative w-32 h-32">
          <img
            src={
              preview ||
              uploadData?.url ||
              posts?.avatarUrl ||
              "/defaultpic.png"
            }
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow hover:bg-blue-700"
          >
            📷
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Profile Info */}
        {editMode ? (
          <div className="mt-4 w-full text-center">
            <input
              className="border rounded-md px-3 py-2 w-full mb-2"
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <textarea
              className="border rounded-md px-3 py-2 w-full"
              rows="3"
              name="bio"
              placeholder="Bio"
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
            />
            <div className="flex justify-center gap-4 mt-3">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="mt-4 text-xl font-semibold text-white">
              {posts?.name || "User Name"}
            </h2>
            <p className="text-white">
              {posts?.bio ||
                "This is your bio. You can edit it from your account settings."}
            </p>
            <button
              onClick={() => setEditMode(true)}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Edit Profile
            </button>

            <div className="flex gap-6 mt-4 text-white font-medium">
              <p>Followers: {followers}</p>
              <p>Following: {posts?.followingCount || 0}</p>
              <p>Posts: {posts?.postsCount || 0}</p>
            </div>
          </>
        )}
      </div>

      {/* === POSTS SECTION === */}
      <div className="mt-10 w-full max-w-3xl">
        <h3 className="text-xl font-bold text-gray-800 mb-4">My Posts</h3>

        {posts?.recentPosts?.length ? (
          <div className="flex flex-col gap-4">
            {posts.recentPosts.map((post) => (
              <div
                key={post._id}
                className="p-4 bg-white rounded-lg shadow relative"
              >
                <div className="flex gap-2 items-center">
                  <img
                    src={avatarUrl || "/defaultpic.png"}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h1 className="font-semibold">{name}</h1>
                    <p className="text-gray-500 text-sm">
                      <span className="text-gray-400 text-sm"> • </span>
                      <span className="text-gray-500 text-sm">
                        {timeAgo(post.createdAt)}
                      </span>
                    </p>
                  </div>
                </div>

                <p className="my-5">{post.text}</p>

                {post.imageUrl && (
                  <img
                    src={post.imageUrl || "/defaultpic.png"}
                    alt="post"
                    className="w-full h-64 object-cover rounded-md my-2"
                  />
                )}

                <div className="flex gap-4 items-center">
                  <button>
                    <Heart size={20} className="text-red-600" />
                  </button>

                  <button onClick={() => handleComments(post._id)}>
                    <MessageCircle size={20} />
                  </button>
                </div>

                {/* === COMMENTS === */}
                {postComments[post._id]?.length > 0 && (
                  <div className="mt-3 bg-gray-50 p-2 rounded">
                    {postComments[post._id].map((c) => (
                      <div key={c._id} className="flex items-start gap-2">
                        <img
                          src={c.user?.avatarUrl || "/defaultpic.png"}
                          alt="comment avatar"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <p className="text-sm text-gray-600">
                          <strong>{c.user?.name || "Anonymous"}:</strong>{" "}
                          {c.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* === Dropdown options === */}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => toggleDropdown(post._id)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    ...
                  </button>

                  {openDropdownId === post._id && (
                    <ul className="absolute right-0 mt-1 w-32 bg-white border rounded shadow-lg z-10">
                      <li
                        onClick={() => handleDeletePost(post._id)}
                        className="px-4 py-2 hover:bg-red-100 cursor-pointer text-red-500"
                      >
                        Delete
                      </li>
                      <li
                        onClick={() => handleUpdatePost(post._id)}
                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-blue-500"
                      >
                        Update
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No posts yet.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
