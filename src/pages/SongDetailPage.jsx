import { useParams } from "react-router-dom";

export default function SongDetailPage() {
    const { id } = useParams();

    return (
        <main className="min-h-screen p-6">
            <h1 className="text-2xl font-bold mb-4">연습곡 상세</h1>
            <p className="text-slate-400 mb-4">id: {id}</p>
            {/* TODO: 곡 상세 정보 + 링크들 */}
        </main>
    );
}
