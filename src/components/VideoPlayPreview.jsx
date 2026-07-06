export default function VideoPlayPreview() {
  return (
    <div
      className="mx-auto flex items-center justify-center shrink-0"
      style={{
        width: 158,
        height: 280,
        borderRadius: 8,
        background: "linear-gradient(160deg, #6ea8ff, #274b9e)",
      }}
    >
      <div className="w-9 h-9 rounded-full bg-black/30 flex items-center justify-center">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M6 4l14 8-14 8V4z" fill="white" />
        </svg>
      </div>
    </div>
  );
}
