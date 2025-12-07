// src/pages/dashboard/AddBlog.jsx
import React, { useRef, useState } from "react";
import JoditEditor from "jodit-react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import PageTitle from "../../components/PageTitle";

const AddBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    thumbnail: "",
    content: "",
  });
  const editor = useRef(null);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic field validation
    if (!formData.title || !formData.thumbnail || !formData.content) {
      return toast.error("All fields are required");
    }

    try {
      const blogData = {
        ...formData,
        status: "draft", // always store as draft by default
        createdAt: new Date(),
      };

      const res = await axiosSecure.post("/add-blog", blogData);

      if (res.data.insertedId || res.data.acknowledged) {
        toast.success("Blog created successfully as draft");
        navigate("/dashboard/content-management");
      }
    } catch (err) {
      toast.error("Failed to create blog");
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageTitle title={"Add Blog"} />
      <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
        Add New Blog
      </h2>
      <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl space-y-6">
        {/* Title input */}
        <div>
          <label className="block font-medium mb-2 text-slate-700">
            Blog Title
          </label>
          <input
            type="text"
            name="title"
            placeholder="Enter blog title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full border-2 border-rose-200 p-3 rounded-lg focus:ring-2 focus:ring-rose-400 transition-all"
            required
          />
        </div>

        {/* Image URL input */}
        <div>
          <label className="block font-medium mb-2 text-slate-700">
            Thumbnail Image URL
          </label>
          <input
            type="text"
            name="thumbnail"
            placeholder="https://example.com/image.jpg"
            value={formData.thumbnail}
            onChange={(e) =>
              setFormData({ ...formData, thumbnail: e.target.value })
            }
            className="w-full border-2 border-rose-200 p-3 rounded-lg focus:ring-2 focus:ring-rose-400 transition-all"
            required
          />
        </div>

        {/* Preview thumbnail if provided */}
        {formData.thumbnail && (
          <div className="flex justify-center">
            <img
              src={formData.thumbnail}
              alt="Thumbnail Preview"
              className="max-w-xs h-auto rounded-lg shadow-md border-2 border-rose-200"
            />
          </div>
        )}

        {/* Rich text editor for blog content */}
        <div>
          <label className="block font-medium mb-2 text-slate-700">
            Blog Content
          </label>
          <div className="border-2 border-rose-200 rounded-lg overflow-hidden">
            <JoditEditor
              ref={editor}
              value={formData.content}
              onChange={(newContent) =>
                setFormData({ ...formData, content: newContent })
              }
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
        >
          Create Blog
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
