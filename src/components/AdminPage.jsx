import { useState } from "react";
import { Link } from "react-router-dom";
import { useAnalyticsData } from "../data/DataContext";
import { getUploadedVideos, deleteUploadedVideo } from "../data/videoStore";

export default function AdminPage() {
  const { addUploadedVideo } = useAnalyticsData();
  const [title, setTitle] = useState("");
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [videos, setVideos] = useState(() => getUploadedVideos());
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !preview) return;
    addUploadedVideo(title.trim(), preview);
    setVideos(getUploadedVideos());
    setTitle("");
    setFile(null);
    setPreview(null);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  const handleDelete = (id) => {
    deleteUploadedVideo(id);
    setVideos(getUploadedVideos());
  };

  return (
    <div className="min-h-screen bg-[var(--tt-bg)] px-6 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-[20px] font-semibold text-[var(--tt-text)]">
            Upload video
          </h1>
          <Link to="/" className="text-[13px] text-[var(--tt-accent)]">
            &larr; Back to Studio
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-[var(--tt-border)] bg-white p-5 space-y-4"
        >
          <div>
            <label className="text-[13px] font-medium text-[var(--tt-text)] block mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. #mynewvideo #tiktok"
              className="w-full border border-[var(--tt-border)] rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[var(--tt-accent)]"
            />
          </div>

          <div>
            <label className="text-[13px] font-medium text-[var(--tt-text)] block mb-1.5">
              Thumbnail image
            </label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="text-[13px]" />
          </div>

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="object-cover rounded"
              style={{ width: 84, height: 112 }}
            />
          )}

          <button
            type="submit"
            disabled={!title.trim() || !preview}
            className="bg-[var(--tt-accent)] text-white text-[14px] font-medium rounded-lg px-4 py-2 disabled:opacity-40"
          >
            Add to Studio
          </button>

          {success && (
            <div className="text-[13px] text-emerald-600">
              Added. It now appears at the top of the sidebar in Studio.
            </div>
          )}
        </form>

        <div>
          <h2 className="text-[14px] font-semibold text-[var(--tt-text)] mb-3">
            Uploaded videos ({videos.length})
          </h2>
          <div className="space-y-2">
            {videos.map((v) => (
              <div
                key={v.id}
                className="flex items-center gap-3 rounded-lg border border-[var(--tt-border)] bg-white px-3 py-2"
              >
                <img
                  src={v.thumbnailUrl}
                  alt=""
                  className="object-cover rounded shrink-0"
                  style={{ width: 32, height: 42 }}
                />
                <div className="flex-1 text-[13px] text-[var(--tt-text)] truncate">
                  {v.title}
                </div>
                <button
                  onClick={() => handleDelete(v.id)}
                  className="text-[12px] text-red-500"
                >
                  Delete
                </button>
              </div>
            ))}
            {videos.length === 0 && (
              <div className="text-[13px] text-[var(--tt-text-secondary)]">
                No uploads yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
