import { useState, useEffect, useRef } from "react";
import { Send, Loader2, Users, ChevronLeft } from "lucide-react";
import { useChatSocket } from "@/hooks/useChatSocket";
import { chatService, type ChatMessage } from "@/api/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatRoomProps {
  title: string;
  isForum: boolean;
  teamId?: string;
}

export default function ChatRoom({ title, isForum, teamId }: ChatRoomProps) {
  const [historyLoading, setHistoryLoading] = useState(true);
  const [inputMessage, setInputMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    setMessages, 
    typingUsers, 
    sendMessage, 
    sendTyping, 
    sendStopTyping 
  } = useChatSocket(isForum, teamId);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = isForum 
        ? await chatService.getForumHistory()
        : await chatService.getTeamHistory(teamId!);
      setMessages(response.data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [isForum, teamId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typingUsers]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    sendMessage(inputMessage);
    setInputMessage("");
    sendStopTyping();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    if (e.target.value.length > 0) {
      sendTyping();
    } else {
      sendStopTyping();
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col h-screen bg-[#FDFBF7] relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 p-4 md:p-6 bg-[#800000] text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            onClick={() => window.history.back()}
            className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-[#D4AF37]" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex w-10 h-10 rounded-xl bg-white/10 items-center justify-center backdrop-blur-sm border border-white/20">
              <Users className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-base md:text-xl font-black tracking-tight uppercase leading-tight">{title}</h2>
              <p className="text-[9px] text-[#D4AF37] font-bold tracking-widest uppercase">Digital Discussion</p>
            </div>
          </div>
        </div>
        
        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
           <Users className="w-5 h-5 text-white/40" />
        </div>
      </div>

      {/* Chat Messages Area */}
      <div 
        ref={scrollRef}
        className="relative z-10 flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-[#F5E6CA]/30 custom-scrollbar"
      >
        {historyLoading ? (
          <div className="h-full flex flex-col items-center justify-center gap-3">
             <Loader2 className="w-8 h-8 text-[#800000] animate-spin" />
             <p className="text-gray-400 font-bold text-[10px] animate-pulse uppercase tracking-[0.2em]">Menyiapkan Ruang Perundingan...</p>
          </div>
        ) : (
          messages.map((msg: ChatMessage) => {
            const isOwn = msg.sender_id === currentUser.id;
            return (
              <div 
                key={msg.id} 
                className={`flex gap-4 ${isOwn ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-3 duration-500`}
              >
                {/* Avatar */}
                <Avatar className="w-9 h-9 md:w-12 md:h-12 border-2 border-white shadow-md flex-shrink-0">
                  <AvatarImage src={msg.sender.avatar_url || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-[#800000] to-[#600000] text-white text-xs font-black">
                    {getInitials(msg.sender.full_name)}
                  </AvatarFallback>
                </Avatar>

                {/* Message Card */}
                <div className={`relative flex flex-col max-w-[85%] md:max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>
                  <div className={`
                    bg-white p-4 md:p-5 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col gap-1
                    ${isOwn ? "rounded-tr-none border-r-[#800000]/20" : "rounded-tl-none border-l-[#D4AF37]/40"}
                  `}>
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <span className={`text-[10px] font-black uppercase tracking-tight ${isOwn ? "text-[#800000]" : "text-gray-500"}`}>
                        {msg.sender.full_name}
                      </span>
                      <span className="text-[9px] text-gray-400 font-bold">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm md:text-base text-gray-800 font-medium leading-relaxed">
                      {msg.message_body}
                    </p>
                  </div>
                  
                  {/* Decorative tail */}
                  <div className={`
                    absolute top-0 w-3 h-3 bg-white border-t border-gray-100
                    ${isOwn ? "-right-1 rounded-bl-full border-r" : "-left-1 rounded-br-full border-l"}
                  `} />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="relative z-10 px-8 py-2 bg-white/40 backdrop-blur-md">
           <p className="text-[10px] text-[#800000] font-black italic animate-pulse tracking-wide uppercase">
             {typingUsers.length === 1 
               ? `${typingUsers[0].fullName} sedang mengetik...`
               : `${typingUsers.length} orang sedang bermusyawarah...`}
           </p>
        </div>
      )}

      {/* Input Area */}
      <div className="relative z-10 p-5 md:p-8 bg-white/80 backdrop-blur-xl border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
        <div className="relative flex items-center gap-4">
          <Input
            placeholder="Tambah Komentar..."
            value={inputMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={sendStopTyping}
            className="flex-1 h-12 md:h-16 bg-gray-50/50 border-gray-200 rounded-2xl px-6 focus-visible:ring-2 focus-visible:ring-[#800000]/10 transition-all font-medium text-sm md:text-base pr-16"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="absolute right-2 w-10 h-10 md:w-12 md:h-12 bg-[#800000] hover:bg-[#600000] text-white rounded-xl shadow-lg shadow-[#800000]/20 transition-all active:scale-[0.95] cursor-pointer"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
