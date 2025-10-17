import { useState, useCallback, useRef, useEffect } from 'react';
import { generateSpeech } from '../services/geminiService';

// Helper function to decode base64 string to Uint8Array
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper function to decode raw PCM audio data into an AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
): Promise<AudioBuffer> {
  // Gemini TTS returns 24000Hz, 1 channel (mono), 16-bit PCM audio.
  const sampleRate = 24000;
  const numChannels = 1;

  // The raw data is 16-bit, so we need to interpret it as such
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  const channelData = buffer.getChannelData(0);
  
  // Convert 16-bit integer samples to 32-bit float samples (-1.0 to 1.0)
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}


export const useSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

    // Lazily initialize AudioContext on the first user gesture to comply with browser autoplay policies.
    useEffect(() => {
        // FIX: Replaced usage of `{ once: true }` which was causing a TypeScript compilation error.
        // The `initAudioContext` function now manually removes itself after the first click
        // to ensure it only runs once.
        const initAudioContext = () => {
             if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
             }
             document.removeEventListener('click', initAudioContext);
        }
        document.addEventListener('click', initAudioContext);
        
        return () => {
            // Clean up: remove the listener if the component unmounts before a click to prevent memory leaks.
            document.removeEventListener('click', initAudioContext);
            // Clean up: stop any playing audio and close the context when the component unmounts.
            sourceNodeRef.current?.stop();
            audioContextRef.current?.close();
        }
    }, []);


    const speak = useCallback(async (text: string) => {
        if (!text.trim() || isLoading) return;

        // Wait for AudioContext to be initialized by a user gesture.
        if (!audioContextRef.current) {
            console.warn("AudioContext not ready. User must interact with the page first.");
            return;
        }
        
        // Ensure the AudioContext is running.
        if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
        }

        cancel(); // Stop any currently playing narration.
        setIsLoading(true);
        setIsSpeaking(false);

        try {
            const base64Audio = await generateSpeech(text);
            const audioBytes = decode(base64Audio);
            const audioBuffer = await decodeAudioData(audioBytes, audioContextRef.current);

            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContextRef.current.destination);
            
            source.onended = () => {
                setIsSpeaking(false);
                sourceNodeRef.current = null;
            };

            source.start();
            sourceNodeRef.current = source;
            setIsSpeaking(true);

        } catch (error) {
            console.error("Failed to generate or play speech:", error);
            setIsSpeaking(false);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    const cancel = useCallback(() => {
        if (sourceNodeRef.current) {
            sourceNodeRef.current.stop();
            // onended will fire, which sets isSpeaking to false.
        }
    }, []);

    return { speak, cancel, isSpeaking, isLoadingSpeech: isLoading };
};