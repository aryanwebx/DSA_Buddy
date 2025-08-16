import { useState, useEffect, useRef } from "react";
import { PaperAirplaneIcon, ClipboardIcon, CheckIcon, MicrophoneIcon } from "@heroicons/react/24/solid";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { BotIcon, UserIcon } from "../utils/Icon";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import TextareaAutosize from 'react-textarea-autosize';
const API_URL = import.meta.env.VITE_API_URL;


const getSessionId = () => {
  let sessionId = sessionStorage.getItem('dsaBuddySessionId');
  if (!sessionId) {
    sessionId = crypto.randomUUID(); // Modern way to get a unique ID
    sessionStorage.setItem('dsaBuddySessionId', sessionId);
  }
  return sessionId;
};

const CodeCopyButton = ({ codeString }) => {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy} className='flex items-center space-x-1 text-xs text-stone-300 hover:text-white'>
      {isCopied ? (
        <CheckIcon className='h-4 w-4 text-green-400' />
      ) : (
        <ClipboardIcon className='h-4 w-4' />
      )}
      <span>{isCopied ? "Copied!" : "Copy"}</span>
    </button>
  );
};

export default function Chatbot() {
  const [chat, setChat] = useState([]);
  const [bot, setBot] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const chatEndRef = useRef(null);
  const [listen, setListen] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [bot]);

  async function handleSend() {
    if (!inputText.trim() || isStreaming) return;
    const userMessage = inputText;
    setChat([...chat, userMessage]);
    setBot([...bot, "..."]);
    setInputText("");
    setIsStreaming(true);
    const sessionId = getSessionId();
    try {
      const response = await fetch(`${API_URL}/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userQues: userMessage ,session:sessionId}),
      });
      if (!response.body) throw new Error("No response body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let resultText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        resultText += chunk;
        setBot((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = resultText;
          return updated;
        });
      }
    } catch (err) {
      console.error("Streaming failed", err);
      setBot((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = "⚠️ Error: Could not receive response from the server.";
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  function handleKeyPress(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  async function handleMicrophone() {
    if (listen) {
      setListen(false);
      setInputText(transcript);
      await SpeechRecognition.stopListening();
    } else {
      setListen(true);
      await resetTranscript();
      await SpeechRecognition.startListening();
    }
  }

  return (
    <div className='flex flex-col h-screen bg-[#0B251A] text-stone-100 font-sans'>
      <div className='flex-grow p-6 overflow-y-auto'>
        <div className='max-w-4xl mx-auto flex flex-col space-y-8'>
          {chat.length === 0 ? (
            <div className='flex justify-center items-center h-full pt-20'>
              <div className='text-center p-10 bg-[#163E2C]/50 rounded-xl shadow-xl border border-green-900/50'>
                <h2 className='text-3xl font-bold mb-2 text-amber-400'>Your DSA Buddy</h2>
                <p className='text-green-200 text-lg'>Decode, Learn, Conquer!</p>
              </div>
            </div>
          ) : (
            chat.map((msg, index) => (
              <div key={index}>
                <div className='flex justify-end items-start space-x-3'>
                  <div className='bg-amber-600 text-white px-5 py-3 rounded-2xl rounded-tr-none shadow-lg max-w-2xl'>
                    {msg}
                  </div>
                  <UserIcon />
                </div>
                <div className='flex justify-start items-start space-x-3 mt-4'>
                  <BotIcon />
                  <div className='bg-[#163E2C] text-stone-200 px-5 py-3 rounded-2xl rounded-tl-none shadow-lg max-w-2xl prose prose-invert prose-base prose-p:my-3 prose-headings:my-5 flex gap-3 flex-col'>
                    {bot[index] === "..." ? (
                      <div className='flex items-center space-x-1 py-1'>
                        <div className='w-2 h-2 bg-amber-400 rounded-full animate-bounce' />
                        <div className='w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:0.15s]' />
                        <div className='w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:0.3s]' />
                      </div>
                    ) : (
                      <ReactMarkdown
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const codeString = String(children).trim();
                            const match = /language-(\w+)/.exec(className || "");
                            const isBlock = !inline && (codeString.includes("\n") || codeString.length > 25);

                            if (isBlock) {
                              return (
                                <div className='bg-[#0A1D13] rounded-lg my-4 overflow-hidden border border-green-900'>
                                  <div className='flex justify-between items-center px-4 py-1 bg-[#163E2C]'>
                                    <span className="text-xs text-green-300">{match?.[1] || "code"}</span>
                                    <CodeCopyButton codeString={codeString} />
                                  </div>
                                  <SyntaxHighlighter
                                    style={oneDark}
                                    language={match?.[1]}
                                    PreTag='div'
                                    customStyle={{
                                      margin: 0,
                                      background: "transparent",
                                      padding: "1rem",
                                    }}
                                    {...props}>
                                    {codeString.replace(/\n$/, "")}
                                  </SyntaxHighlighter>
                                </div>
                              );
                            }
                            return (
                              <code className='text-amber-200 font-semibold font-mono bg-green-900/60 px-1 py-0.5 rounded' {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}>
                        {bot[index]}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>
      </div>
      <div className='p-4 bg-[#0B251A]/80 backdrop-blur-sm border-t border-green-900/50'>
        <div className='flex items-center max-w-4xl mx-auto relative'>
          <TextareaAutosize
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={isStreaming ? "Your buddy is thinking..." : "Ask your DSA query..."}
            disabled={isStreaming}
            minRows={1}
            maxRows={6}
            className='flex-grow rounded-lg px-4 py-3 bg-[#163E2C] text-stone-100 placeholder-green-300/50 outline-none focus:ring-2 focus:ring-orange-500 transition-shadow disabled:cursor-not-allowed resize-none'
          />
          <button onClick={handleMicrophone} className={`ml-2 p-3 rounded-full transition-colors ${listen ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'}`}>
            <MicrophoneIcon className='h-5 w-5 text-white' />
          </button>
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isStreaming}
            className='ml-2 p-3 bg-orange-500 rounded-full hover:bg-orange-600 disabled:bg-green-800 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#0B251A] transition-all'>
            <PaperAirplaneIcon className='h-5 w-5 text-white' />
          </button>
        </div>
      </div>
    </div>
  );
}