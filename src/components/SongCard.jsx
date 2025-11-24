export default function SongCard({ song, instrumentId }) {
  const sections =
    song.sections?.filter((section) =>
      instrumentId ? section.instrumentId === instrumentId : true
    ) ?? [];

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-3">
      <div>
        <h3 className="text-lg font-semibold">{song.title}</h3>
        {song.artist && (
          <p className="text-sm text-gray-600 mt-0.5">{song.artist}</p>
        )}
      </div>

      {song.difficulty && (
        <span className="inline-flex text-xs font-medium px-2 py-1 bg-gray-100 rounded-full w-fit">
          난이도: {song.difficulty}
        </span>
      )}

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

      <div className="space-y-2">
        {(sections.length > 0 ? sections : song.sections || []).map(
          (section, idx) => (
            <div
              key={`${section.instrumentId}-${idx}`}
              className="border rounded-md p-2 bg-gray-50 flex items-center justify-between gap-3"
            >
              <div className="text-sm">
                <div className="font-medium">
                  역할: {section.role ?? "파트"}
                </div>
                {section.level && (
                  <div className="text-xs text-gray-600">
                    파트 난이도: {section.level}
                  </div>
                )}
                {section.note && (
                  <div className="text-xs text-gray-500 mt-1">
                    {section.note}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {section.youtubeUrl && (
                  <a
                    href={section.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs px-3 py-1 border rounded-full hover:bg-gray-200"
                  >
                    연주 영상
                  </a>
                )}
                {section.sheetUrl && (
                  <a
                    href={section.sheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs px-3 py-1 border rounded-full hover:bg-gray-200"
                  >
                    악보
                  </a>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
