import ChatRoom from "@/components/chat/ChatRoom";

export default function ForumGeneral() {
  return (
    <div className="w-full h-full">
      <ChatRoom 
        title="Forum Musyawarah" 
        isForum={true} 
      />
    </div>
  );
}
