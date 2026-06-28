"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoChatbubbleEllipsesOutline,
  IoSendSharp,
  IoClose,
  IoImageOutline,
  IoHappyOutline,
  IoCheckmarkDone,
  IoCheckmark,
} from "react-icons/io5";
import { useSupabaseAuth } from "@/context/SupabaseAuthProvider";

interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  senderType: "CUSTOMER" | "PROVIDER";
  message: string;
  messageType: "TEXT" | "IMAGE" | "LOCATION" | "CALL";
  mediaUrl?: string;
  isRead: boolean;
  createdAt: string;
}

interface ChatWindowProps {
  bookingId: string;
  providerName?: string;
  providerImage?: string;
  customerName?: string;
  isProvider?: boolean;
  /** If true, renders as a full panel rather than a floating popup */
  inline?: boolean;
}

const EMOJI_LIST = ["👍", "🙏", "😊", "✅", "🔧", "⏰", "📍", "💰"];

// Demo mock messages used when no bookingId is real
function generateMockMessages(isProvider: boolean): Message[] {
  const now = Date.now();
  return [
    {
      id: "m1",
      bookingId: "demo",
      senderId: "provider",
      senderType: "PROVIDER",
      message: "Hello! I'll be arriving at your location in approximately 30 minutes.",
      messageType: "TEXT",
      isRead: true,
      createdAt: new Date(now - 25 * 60000).toISOString(),
    },
    {
      id: "m2",
      bookingId: "demo",
      senderId: "customer",
      senderType: "CUSTOMER",
      message: "Great! I'll keep the door open. Please ring the bell when you arrive 🔔",
      messageType: "TEXT",
      isRead: true,
      createdAt: new Date(now - 22 * 60000).toISOString(),
    },
    {
      id: "m3",
      bookingId: "demo",
      senderId: "provider",
      senderType: "PROVIDER",
      message: "Sure! Could you please confirm the flat number?",
      messageType: "TEXT",
      isRead: true,
      createdAt: new Date(now - 18 * 60000).toISOString(),
    },
    {
      id: "m4",
      bookingId: "demo",
      senderId: "customer",
      senderType: "CUSTOMER",
      message: "It's Flat 405, 4th Floor. The elevator is on the left side of the lobby.",
      messageType: "TEXT",
      isRead: true,
      createdAt: new Date(now - 15 * 60000).toISOString(),
    },
    {
      id: "m5",
      bookingId: "demo",
      senderId: "provider",
      senderType: "PROVIDER",
      message: "Perfect, thank you! I'm on my way 🚗",
      messageType: "TEXT",
      isRead: false,
      createdAt: new Date(now - 5 * 60000).toISOString(),
    },
  ];
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatWindow({
  bookingId,
  providerName = "Service Partner",
  providerImage,
  customerName,
  isProvider = false,
  inline = false,
}: ChatWindowProps) {
  const { user } = useSupabaseAuth();
  const [open, setOpen] = useState(inline);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const useMock = !bookingId || bookingId.startsWith("US-");

  const fetchMessages = useCallback(async () => {
    if (useMock) {
      setMessages(generateMockMessages(isProvider));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch {
      setMessages(generateMockMessages(isProvider));
    } finally {
      setLoading(false);
    }
  }, [bookingId, useMock, isProvider]);

  useEffect(() => {
    if (open) {
      fetchMessages();
    }
  }, [open, fetchMessages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Poll every 8 seconds when chat is open
  useEffect(() => {
    if (!open || useMock) return;
    const interval = setInterval(fetchMessages, 8000);
    return () => clearInterval(interval);
  }, [open, fetchMessages, useMock]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setSending(true);

    const optimisticMsg: Message = {
      id: `opt-${Date.now()}`,
      bookingId,
      senderId: user?.id || "customer",
      senderType: isProvider ? "PROVIDER" : "CUSTOMER",
      message: text,
      messageType: "TEXT",
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setInput("");

    if (!useMock) {
      try {
        await fetch(`/api/bookings/${bookingId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        });
      } catch {
        // Optimistic update stays visible
      }
    }

    setSending(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleEmoji = (emoji: string) => {
    sendMessage(emoji);
    setShowEmoji(false);
  };

  const myType: "CUSTOMER" | "PROVIDER" = isProvider ? "PROVIDER" : "CUSTOMER";

  const chatContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-t-2xl shrink-0">
        <div className="relative shrink-0">
          <img
            src={providerImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(isProvider ? (customerName || "Customer") : providerName)}&background=2563EB&color=fff`}
            alt={isProvider ? customerName : providerName}
            className="w-9 h-9 rounded-full object-cover border-2 border-white/20"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-xs leading-none line-clamp-1">
            {isProvider ? (customerName || "Customer") : providerName}
          </p>
          <p className="text-[10px] text-blue-300 mt-0.5 font-semibold">
            {isProvider ? "Client" : "Service Partner"} • Online
          </p>
        </div>
        {!inline && (
          <button
            onClick={() => setOpen(false)}
            className="text-white/60 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <IoClose size={18} />
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-slate-50/50 min-h-0">
        {loading && (
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full py-10 text-center">
            <IoChatbubbleEllipsesOutline className="text-4xl text-slate-300 mb-2" />
            <p className="text-slate-400 text-xs font-semibold">No messages yet.</p>
            <p className="text-slate-300 text-[10px] mt-1">Start the conversation!</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const isMine = msg.senderType === myType;
            const showTime =
              i === 0 ||
              new Date(msg.createdAt).getTime() - new Date(messages[i - 1].createdAt).getTime() > 300000;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
              >
                {showTime && (
                  <div className="text-center text-[9px] text-slate-400 font-semibold my-2">
                    {formatTime(msg.createdAt)}
                  </div>
                )}
                <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${
                      isMine
                        ? "bg-[#2563EB] text-white rounded-br-sm"
                        : "bg-white text-[#1A1A2E] border border-slate-100 rounded-bl-sm"
                    }`}
                  >
                    {msg.message}
                    <div className={`flex items-center gap-1 justify-end mt-1 ${isMine ? "text-blue-200" : "text-slate-400"}`}>
                      <span className="text-[8px]">{formatTime(msg.createdAt)}</span>
                      {isMine && (
                        msg.isRead
                          ? <IoCheckmarkDone size={10} className="text-blue-200" />
                          : <IoCheckmark size={10} />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Emoji quick-reply row */}
      <AnimatePresence>
        {showEmoji && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-3 py-2 border-t border-slate-100 bg-white flex gap-2 overflow-hidden"
          >
            {EMOJI_LIST.map((e) => (
              <button
                key={e}
                onClick={() => handleEmoji(e)}
                className="text-xl hover:scale-125 transition-transform cursor-pointer"
              >
                {e}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Row */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 px-3 py-3 border-t border-slate-100 bg-white rounded-b-2xl shrink-0"
      >
        <button
          type="button"
          onClick={() => setShowEmoji((v) => !v)}
          className="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer shrink-0"
        >
          <IoHappyOutline size={20} />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-xs font-semibold text-[#1A1A2E] outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-slate-400 transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="w-8 h-8 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 text-white rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0"
        >
          <IoSendSharp size={14} />
        </button>
      </form>
    </div>
  );

  if (inline) {
    return (
      <div className="border border-slate-200 rounded-2xl overflow-hidden h-[420px] flex flex-col shadow-sm">
        {chatContent}
      </div>
    );
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 border border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
      >
        <IoChatbubbleEllipsesOutline size={14} />
        Chat
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed bottom-24 right-6 z-[200] w-[340px] h-[500px] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
            style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.25)" }}
          >
            {chatContent}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
