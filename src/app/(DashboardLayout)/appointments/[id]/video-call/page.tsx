'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSocket } from '@/context/SocketContext';
import { useAppDispatch } from '../../../../../../redux/store/hook';
import { StartCall } from '../../../../../../redux/videocall/videocallThunks';
import api from '../../../../../../api/axios';
import {
    FiArrowLeft, FiMic, FiMicOff, FiVideo, FiVideoOff,
    FiPhoneOff, FiClock, FiArrowRight,
} from 'react-icons/fi';
import { FaVideo } from 'react-icons/fa6';

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
    ],
};

export default function DoctorVideoCallPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const appointmentId = params?.id;
    const dispatch = useAppDispatch();
    const { socket } = useSocket();

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const pipVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const [phase, setPhase] = useState<'idle' | 'starting' | 'waiting' | 'in-call' | 'ended'>('idle');
    const [micMuted, setMicMuted] = useState(false);
    const [camOff, setCamOff] = useState(false);
    const [error, setError] = useState<string | null>(null);



    // ── Create Peer Connection ────────────────────────────────────────────────
    const createPC = useCallback(() => {
        const pc = new RTCPeerConnection(ICE_SERVERS);

        pc.onicecandidate = ({ candidate }) => {
            if (candidate) {
                socket?.emit('video:signal', {
                    type: 'candidate',
                    candidate: candidate.candidate,
                    sdpMid: candidate.sdpMid,
                    sdpMLineIndex: candidate.sdpMLineIndex,
                });
            }
        };

        pc.ontrack = ({ streams }) => {
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = streams[0];
            setPhase('in-call');
        };

        pc.onconnectionstatechange = () => {
            if (['disconnected', 'failed', 'closed'].includes(pc.connectionState)) {
                setPhase('ended');
            }
        };

        return pc;
    }, [socket]);

    // ── Socket events ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (!socket) return;

        const handleSignal = async ({ type, sdp, candidate, sdpMid, sdpMLineIndex }: any) => {
            const pc = pcRef.current;
            if (!pc) return;
            if (type === 'answer') await pc.setRemoteDescription({ type: 'answer', sdp });
            if (type === 'candidate') {
                try { await pc.addIceCandidate({ candidate, sdpMid, sdpMLineIndex }); } catch { }
            }
        };

        const handleCreateOffer = async () => {
            const pc = pcRef.current;
            if (!pc) return;
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit('video:signal', { type: 'offer', sdp: offer.sdp });
        };

        socket.on('video:signal', handleSignal);
        socket.on('video:create-offer', handleCreateOffer);
        socket.on('video:peer-joined', ({ role }: { role: string }) => { if (role === 'CUSTOMER') setPhase('in-call'); });
        socket.on('video:peer-left', () => setPhase('ended'));
        socket.on('video:ended', () => setPhase('ended'));
        socket.on('video:error', ({ message }: { message: string }) => setError(message));

        return () => {
            socket.off('video:signal', handleSignal);
            socket.off('video:create-offer', handleCreateOffer);
            socket.off('video:peer-joined');
            socket.off('video:peer-left');
            socket.off('video:ended');
            socket.off('video:error');
        };
    }, [socket]);

    // ── Start Call ────────────────────────────────────────────────────────────
    const startCall = async () => {
        try {
            setPhase('starting');
            setError(null);

            const res = await dispatch(StartCall(appointmentId));
            if (res.meta.requestStatus !== 'fulfilled') throw new Error('Failed to start session');
            const { token } = res.payload;

            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;
            if (pipVideoRef.current) pipVideoRef.current.srcObject = stream;

            const pc = createPC();
            pcRef.current = pc;
            stream.getTracks().forEach(track => pc.addTrack(track, stream));

            socket?.emit('video:join', { token });
            socket?.once('video:joined', () => setPhase('waiting'));
        } catch (err: any) {
            setError(err.message || 'Could not start video call');
            setPhase('idle');
        }
    };

    // ── End Call ──────────────────────────────────────────────────────────────
    const endCall = async () => {
        try { await api.post(`/doctors/appointments/${appointmentId}/video/end`); } catch { }
        pcRef.current?.close();
        pcRef.current = null;
        localStreamRef.current?.getTracks().forEach(t => t.stop());
        socket?.emit('video:leave');
        socket?.off('video:signal');
        socket?.off('video:create-offer');
        socket?.off('video:peer-joined');
        socket?.off('video:peer-left');
        setPhase('ended');
        router.back();
    };

    const toggleMic = () => {
        localStreamRef.current?.getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
        setMicMuted(m => !m);
    };

    const toggleCam = () => {
        localStreamRef.current?.getVideoTracks().forEach(t => { t.enabled = !t.enabled; });
        setCamOff(c => !c);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-slate-900/80 backdrop-blur border-b border-slate-800">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm"
                >
                    <FiArrowLeft size={16} /> Back
                </button>

                <div className="flex items-center gap-2">
                    <span className="text-white font-semibold text-sm">Consultation</span>
                </div>

                <div className="w-16" />
            </div>

            {/* Video Area */}
            <div className="flex-1 relative overflow-hidden bg-slate-950">

                <video
                    ref={remoteVideoRef}
                    autoPlay playsInline
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${phase === 'in-call' ? 'opacity-100' : 'opacity-0'}`}
                />

                {/* idle */}
                {phase === 'idle' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                        <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center">
                            <FaVideo className="w-10 h-10 text-primary" />
                        </div>
                        <div className="text-center">
                            <p className="text-white text-xl font-bold">Ready to start?</p>
                            <p className="text-slate-400 text-sm mt-1">Patient will be notified when you start</p>
                        </div>
                        <button
                            onClick={startCall}
                            className="px-8 py-3.5 bg-primary hover:bg-primary/90 text-white rounded-2xl font-semibold transition flex items-center gap-2"
                        >
                            <FaVideo size={18} /> Start Video Call
                        </button>
                    </div>
                )}

                {/* starting */}
                {phase === 'starting' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <p className="text-white font-semibold">Setting up session…</p>
                    </div>
                )}

                {/* waiting */}
                {phase === 'waiting' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <video ref={localVideoRef} autoPlay muted playsInline
                            className="absolute inset-0 w-full h-full object-cover opacity-30 scale-x-[-1]" />
                        <div className="relative z-10 flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-white animate-spin" />
                            <div className="bg-slate-900/80 backdrop-blur rounded-2xl px-6 py-4 text-center">
                                <p className="text-white font-bold">Waiting for patient…</p>
                                <p className="text-slate-400 text-sm mt-1">Patient has been notified</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ended */}
                {phase === 'ended' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                        <div className="text-center">
                            <p className="text-white text-xl font-bold">Call Ended</p>
                        </div>
                        <button
                            onClick={() => router.back()}
                            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl font-semibold transition"
                        >
                            Back to Appointment
                        </button>
                    </div>
                )}

                {/* Local PiP */}
                {(phase === 'in-call' || phase === 'waiting') && (
                    <div className="absolute bottom-28 right-4 w-32 h-44 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                        <video
                            ref={pipVideoRef}
                            autoPlay muted playsInline
                            className="w-full h-full object-cover scale-x-[-1]"
                        />
                        {camOff && (
                            <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                                <FiVideoOff className="text-slate-400" size={20} />
                            </div>
                        )}
                    </div>
                )}

                {/* Error toast */}
                {error && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg">
                        {error}
                    </div>
                )}
            </div>

            {/* Controls */}
            {(phase === 'waiting' || phase === 'in-call') && (
                <div className="flex items-center justify-center gap-4 py-5 bg-slate-900 border-t border-slate-800">
                    <button
                        onClick={toggleMic}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition ${micMuted ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                    >
                        {micMuted ? <FiMicOff size={20} /> : <FiMic size={20} />}
                    </button>

                    <button
                        onClick={endCall}
                        className="w-16 h-16 rounded-2xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition shadow-lg shadow-red-900/30"
                    >
                        <FiPhoneOff size={22} />
                    </button>

                    <button
                        onClick={toggleCam}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition ${camOff ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                    >
                        {camOff ? <FiVideoOff size={20} /> : <FiVideo size={20} />}
                    </button>
                </div>
            )}
        </div>
    );
}