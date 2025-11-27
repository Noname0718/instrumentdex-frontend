import { Link } from "react-router-dom";

export default function SongCard({ song }) {
  const songId = song.id || song._id;

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{song.title}</h3>
          {song.artist && (
            <p className="text-sm text-gray-600 mt-0.5">{song.artist}</p>
          )}
        </div>
        {song.level && (
          <span className="inline-flex text-xs font-medium px-2 py-1 bg-gray-100 rounded-full">
            난이도 {song.level}
          </span>
        )}
      </div>

      {song.description && (
        <p className="text-sm text-gray-600 line-clamp-3">{song.description}</p>
      )}

      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
        {song.bpm && (
          <span className="px-2 py-0.5 rounded-full bg-gray-100">
            {song.bpm} BPM
          </span>
        )}
        {song.key && (
          <span className="px-2 py-0.5 rounded-full bg-gray-100">
            Key {song.key}
          </span>
        )}
      </div>

      {song.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {song.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <Link
          to={`/songs/${songId}`}
          className="text-xs font-semibold text-blue-600 hover:underline"
        >
          자세히 보기 →
        </Link>
      </div>
    </div>
  );
}
