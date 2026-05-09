import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';

export const AudioEngine: React.FC = () => {
  const { gameState, sanity, jumpscareActive } = useGameStore();
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // Oscillators
  const menuDroneRef = useRef<OscillatorNode | null>(null);
  const menuDroneGainRef = useRef<GainNode | null>(null);
  
  const droneOscRef = useRef<OscillatorNode | null>(null);
  const droneGainRef = useRef<GainNode | null>(null);
  
  const heartbeatOscRef = useRef<OscillatorNode | null>(null);
  const heartbeatGainRef = useRef<GainNode | null>(null);

  const isInitialized = useRef(false);

  const initAudio = () => {
    if (isInitialized.current) return;
    isInitialized.current = true;
    
    audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // --- Menu Drone (Unsettling dissonant chord) ---
    menuDroneRef.current = audioCtxRef.current.createOscillator();
    menuDroneGainRef.current = audioCtxRef.current.createGain();
    menuDroneRef.current.type = 'sawtooth';
    menuDroneRef.current.frequency.value = 65.41; // C2
    menuDroneGainRef.current.gain.value = 0; // Starts muted
    menuDroneRef.current.connect(menuDroneGainRef.current);
    menuDroneGainRef.current.connect(audioCtxRef.current.destination);
    menuDroneRef.current.start();

    // --- Playing Drone ---
    droneOscRef.current = audioCtxRef.current.createOscillator();
    droneGainRef.current = audioCtxRef.current.createGain();
    droneOscRef.current.type = 'sine';
    droneOscRef.current.frequency.value = 55; // Low A
    droneGainRef.current.gain.value = 0; 
    droneOscRef.current.connect(droneGainRef.current);
    droneGainRef.current.connect(audioCtxRef.current.destination);
    droneOscRef.current.start();

    // --- Heartbeat ---
    heartbeatOscRef.current = audioCtxRef.current.createOscillator();
    heartbeatGainRef.current = audioCtxRef.current.createGain();
    heartbeatOscRef.current.type = 'sine';
    heartbeatOscRef.current.frequency.value = 40; 
    heartbeatGainRef.current.gain.value = 0;
    heartbeatOscRef.current.connect(heartbeatGainRef.current);
    heartbeatGainRef.current.connect(audioCtxRef.current.destination);
    heartbeatOscRef.current.start();

    // Setup heartbeat pulsing logic
    let lastBeat = 0;
    const pulsing = () => {
      if (!audioCtxRef.current || !heartbeatGainRef.current) return;
      const now = audioCtxRef.current.currentTime;
      const state = useGameStore.getState();
      
      if (state.gameState === 'PLAYING') {
        const bpm = 160 - state.sanity; 
        const interval = 60 / bpm;

        if (now - lastBeat > interval) {
          lastBeat = now;
          heartbeatGainRef.current.gain.setValueAtTime(0.5, now);
          heartbeatGainRef.current.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          heartbeatGainRef.current.gain.setValueAtTime(0.3, now + 0.2);
          heartbeatGainRef.current.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        }
      }
      requestAnimationFrame(pulsing);
    };
    pulsing();
  };

  // Click anywhere to unblock AudioContext
  useEffect(() => {
    const unlockAudio = () => {
      if (!isInitialized.current) {
        initAudio();
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // Handle Game State Audio Transitions
  useEffect(() => {
    if (!audioCtxRef.current) return;
    const now = audioCtxRef.current.currentTime;

    if (gameState === 'MENU') {
      menuDroneGainRef.current?.gain.setTargetAtTime(0.05, now, 0.5); // Low volume creepy menu
      droneGainRef.current?.gain.setTargetAtTime(0, now, 0.5);
    } else if (gameState === 'PLAYING') {
      menuDroneGainRef.current?.gain.setTargetAtTime(0, now, 0.5);
      droneGainRef.current?.gain.setTargetAtTime(0.2, now, 0.5);
    } else {
      // LOADING, PAUSED, etc. Fade everything out slightly
      menuDroneGainRef.current?.gain.setTargetAtTime(0, now, 0.5);
      droneGainRef.current?.gain.setTargetAtTime(0.05, now, 1.0);
    }
  }, [gameState]);

  // Sanity Drone Effect
  useEffect(() => {
    if (gameState === 'PLAYING' && droneOscRef.current && droneGainRef.current && audioCtxRef.current) {
        droneOscRef.current.frequency.setTargetAtTime(55 + ((100 - sanity) * 0.5), audioCtxRef.current.currentTime, 0.5);
        droneGainRef.current.gain.setTargetAtTime(0.2 + ((100 - sanity) * 0.005), audioCtxRef.current.currentTime, 0.5);
    }
  }, [sanity, gameState]);
  
  // Jumpscare Effect!
  useEffect(() => {
    if (jumpscareActive && audioCtxRef.current) {
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      const now = audioCtxRef.current.currentTime;
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(2000, now + 0.1);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.8, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      
      osc.start(now);
      osc.stop(now + 0.6);
    }
  }, [jumpscareActive]);

  return null;
};
