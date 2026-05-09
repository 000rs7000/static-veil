import { create } from 'zustand';

export type GameState = 'MENU' | 'LOADING' | 'PLAYING' | 'PAUSED' | 'GAMEOVER';

interface GameStore {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  chapter: number;
  setChapter: (chapter: number) => void;
  inventory: string[];
  addToInventory: (item: string) => void;
  sanity: number;
  setSanity: (sanity: number) => void;
  flashlightOn: boolean;
  toggleFlashlight: () => void;
  glitchActive: boolean;
  setGlitchActive: (active: boolean) => void;
  loadingMessage: string;
  setLoadingMessage: (msg: string) => void;
  interactPrompt: string | null;
  setInteractPrompt: (prompt: string | null) => void;
  jumpscareActive: boolean;
  triggerJumpscare: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: 'MENU',
  setGameState: (state) => set({ gameState: state }),
  chapter: 1,
  setChapter: (chapter) => set({ chapter }),
  inventory: [],
  addToInventory: (item) => set((state) => {
    if (state.inventory.length >= 3) return state; // Ignore if inventory is full
    return { inventory: [...state.inventory, item] };
  }),
  sanity: 100,
  setSanity: (sanity) => set({ sanity }),
  flashlightOn: false,
  toggleFlashlight: () => set((state) => ({ flashlightOn: !state.flashlightOn })),
  glitchActive: false,
  setGlitchActive: (glitchActive) => set({ glitchActive }),
  loadingMessage: 'Initializing STATIC VEIL...',
  setLoadingMessage: (loadingMessage) => set({ loadingMessage }),
  interactPrompt: null,
  setInteractPrompt: (interactPrompt) => set({ interactPrompt }),
  jumpscareActive: false,
  triggerJumpscare: () => {
    set({ jumpscareActive: true });
    setTimeout(() => {
      set({ jumpscareActive: false });
    }, 600);
  },
}));
