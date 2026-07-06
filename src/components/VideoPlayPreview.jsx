export default function VideoPlayPreview({ thumbnailUrl }) {
  return (
    <div
      className="relative mx-auto flex items-center justify-center shrink-0 overflow-hidden"
      style={{
        width: 158,
        height: 280,
        borderRadius: 8,
        background: thumbnailUrl ? "#000" : "linear-gradient(160deg, #6ea8ff, #274b9e)",
      }}
    >
      {thumbnailUrl && (
        <img src={thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div className="relative w-9 h-9 rounded-full bg-black/30 flex items-center justify-center">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M6 4l14 8-14 8V4z" fill="white" />
        </svg>
      </div>
    </div>
  );
}
