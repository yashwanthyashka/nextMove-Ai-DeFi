
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Account } from "@aptos-labs/ts-sdk"; // Aptos SDK
import { aptos } from '../services/aptosService';
import type { ChatMessage, Wallet, Network } from '../types';
import { MessageSender } from '../types';
import { ai, transactionFunctionDeclaration } from '../services/geminiService';
import { GenerateContentResponse, Modality, LiveServerMessage } from '@google/genai';
import { BotIcon, MicIcon, SendIcon, SparklesIcon } from './Icons';

// ... (Audio Helpers: decode, decodeAudioData, encode, createBlob - same as before) ...
function decode(base64: string) { const binaryString = atob(base64); const len = binaryString.length; const bytes = new Uint8Array(len); for (let i = 0; i < len; i++) { bytes[i] = binaryString.charCodeAt(i); } return bytes; }
async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> { const dataInt16 = new Int16Array(data.buffer); const frameCount = dataInt16.length / numChannels; const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate); for (let channel = 0; channel < numChannels; channel++) { const channelData = buffer.getChannelData(channel); for (let i = 0; i < frameCount; i++) { channelData[i] = dataInt16[i * numChannels + channel] / 32768.0; } } return buffer; }
function encode(bytes: Uint8Array) { let binary = ''; const len = bytes.byteLength; for (let i = 0; i < len; i++) { binary += String.fromCharCode(bytes[i]); } return btoa(binary); }
function createBlob(data: Float32Array): any { const l = data.length; const int16 = new Int16Array(l); for (let i = 0; i < l; i++) { int16[i] = data[i] * 32768; } return { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' }; }

interface AssistantProps { wallet: Wallet; signer: Account; activeNetwork: Network; }

export const Assistant: React.FC<AssistantProps> = ({ wallet, signer, activeNetwork }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: '1', sender: MessageSender.AI, text: "I'm your Aptos Agent. I can send APT, check balances, or execute swaps. How can I help?" }]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ type: string, args: any } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Minimal Audio Ref for brevity in this update
  const audioRef = useRef<any>({});

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const addMessage = useCallback((message: Omit<ChatMessage, 'id'>) => { setMessages(prev => [...prev, { ...message, id: Date.now().toString() }]); }, []);

  const executeTransaction = async (args: any) => {
    try {
        const { recipientAddress, amount } = args;
        const transaction = await aptos.transaction.build.simple({
            sender: signer.accountAddress,
            data: { function: "0x1::coin::transfer", typeArguments: ["0x1::aptos_coin::AptosCoin"], functionArguments: [recipientAddress, Math.floor(parseFloat(amount) * 100000000)] },
        });
        const pendingTx = await aptos.transaction.signAndSubmitTransaction({ signer, transaction });
        await aptos.waitForTransaction({ transactionHash: pendingTx.hash });
        addMessage({ sender: MessageSender.AI, text: `Success! ✅ Transaction confirmed: ${pendingTx.hash}` });
    } catch (err: any) {
        addMessage({ sender: MessageSender.AI, text: `Transaction failed: ${err.message}` });
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setUserInput('');
    addMessage({ sender: MessageSender.USER, text });
    
    if (pendingAction && ['confirm', 'yes'].some(k => text.toLowerCase().includes(k))) {
        await executeTransaction(pendingAction.args);
        setPendingAction(null);
        return;
    }

    setIsLoading(true);
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: `User: ${text}. You are an Aptos Wallet Agent.`,
            config: { tools: [{ functionDeclarations: [transactionFunctionDeclaration] }] },
        });
        
        const fc = response.functionCalls?.[0];
        if (fc && fc.name === 'execute_transaction') {
            setPendingAction({ type: 'tx', args: fc.args });
            addMessage({ sender: MessageSender.AI, text: `I'll send ${fc.args['amount']} APT to ${fc.args['recipientAddress']}. Reply "confirm" to execute.` });
        } else {
            addMessage({ sender: MessageSender.AI, text: response.text });
        }
    } catch (e) {
        addMessage({ sender: MessageSender.AI, text: "AI Error." });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="flex-grow p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
                  <div key={msg.id} className={`p-3 rounded-xl max-w-[80%] ${msg.sender === MessageSender.USER ? 'ml-auto bg-[#f4ffb8] text-black' : 'mr-auto bg-white dark:bg-slate-800 text-slate-800 dark:text-white'}`}>{msg.text}</div>
            ))}
            <div ref={messagesEndRef} />
        </div>
        <div className="p-4 bg-white/80 dark:bg-black/50 backdrop-blur-md flex gap-2">
            <input type="text" value={userInput} onChange={e => setUserInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend(userInput)} className="flex-grow bg-transparent border border-gray-300 dark:border-gray-700 rounded-full px-4 text-black dark:text-white" placeholder="Send 1 APT..." />
              <button onClick={() => handleSend(userInput)} className="p-2 bg-[#f4ffb8] rounded-full"><SendIcon className="w-5 h-5 text-black" /></button>
        </div>
    </div>
  );
};
