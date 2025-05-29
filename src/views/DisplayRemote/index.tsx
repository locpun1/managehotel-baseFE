import { useParams } from 'react-router-dom';

export default function RoomDisplayPage() {
  const { roomId } = useParams();

  return (
    <div>
      <h1>Room: {roomId}</h1>
      {/* Hiển thị nội dung phòng */}
    </div>
  );
}