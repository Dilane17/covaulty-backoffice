import { create } from "zustand";

interface PinState {
  isOpen: boolean;
  resolvePromise: ((pin: string | null) => void) | null;
  requestPin: () => Promise<string | null>;
  close: () => void;
  submit: (pin: string) => void;
}

export const usePinStore = create<PinState>((set, get) => ({
  isOpen: false,
  resolvePromise: null,

  requestPin: () => {
    return new Promise((resolve) => {
      // S'il y a déjà une demande en cours, on la ferme
      const { resolvePromise } = get();
      if (resolvePromise) resolvePromise(null);

      set({ isOpen: true, resolvePromise: resolve });
    });
  },

  close: () => {
    const { resolvePromise } = get();
    if (resolvePromise) resolvePromise(null);
    set({ isOpen: false, resolvePromise: null });
  },

  submit: (pin: string) => {
    const { resolvePromise } = get();
    if (resolvePromise) resolvePromise(pin);
    set({ isOpen: false, resolvePromise: null });
  },
}));
