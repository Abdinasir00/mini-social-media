import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage, createPost } from "../store/slices/PostSlices";
import { Image } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CreatePostForm() {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.post);
    const navigate = useNavigate();

  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const fileInputRef = useRef(null);
  const maxChars = 280;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith("image/")) {
      alert("Invalid image file.");
      return;
    }
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async () => {
    if (!text.trim()) return alert("Post text is required");

    let imageData = null;

    if (file) {
      const uploadResult = await dispatch(uploadImage({ file, type: "post" }));
      if (uploadResult.error) {
        alert("Image upload failed");
        return;
      }
      imageData = uploadResult.payload;
    }

    const payload = {
      text,
      image_url: imageData?.url || "",
      storageId: imageData?.storageId || "",
    };

    await dispatch(createPost(payload));

    setText("");
    setFile(null);
    setPreview("");
    navigate("/home")
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-white shadow-md rounded-lg flex flex-col gap-3">
      <h2 className="text-lg font-bold">Create Post</h2>

      <div className="flex-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          maxLength={maxChars}
          className="border border-blue-500 rounded-md h-40 w-full p-2 focus:outline-blue-500 resize-none"
        />
      </div>

      <hr className="my-6 border-gray-300" />

      <div className=" flex justify-center items-center">
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-40 h-40  object-cover rounded-lg border   "
          />
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="bg-gray-100 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg cursor-pointer flex items-center gap-2"
        >
          <Image size={20} />
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-500">
          {text.length}/{maxChars}
        </p>

        <button
          onClick={handleSubmit}
          disabled={status === "uploading" || status === "loading"}
          className={`${
            status === "uploading" || status === "loading"
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white font-semibold py-2 px-6 rounded-full`}
        >
          {status === "uploading" || status === "loading"
            ? "Posting..."
            : "Post"}
        </button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {status === "succeeded" && (
        <p className="text-green-600 mt-2">✅ Post created successfully!</p>
      )}
    </div>
  );
}

export default CreatePostForm;
