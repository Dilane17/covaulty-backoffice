"use client";

import { useState, useRef, useEffect } from "react";
import { Ic } from "@/components/ui/Icons";
import { usePinStore } from "@/store/pin.store";

export function ActionPinModal() {
  const { isOpen, close, submit } = usePinStore();
  const [pin, setPin] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPin("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length >= 4) {
      submit(pin);
    }
  };

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal max-w-[400px]" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="title">Action Sensible</div>
          <button className="btn-icon" aria-label="Fermer" onClick={close}><Ic.X /></button>
        </div>
        
        <div className="modal-body">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-[var(--red-10)] text-red flex items-center justify-center mx-auto mb-4 text-2xl">
              <Ic.Shield />
            </div>
            <p className="muted">Veuillez saisir votre PIN de sécurité pour autoriser cette opération.</p>
          </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="input-group">
            <input 
              ref={inputRef}
              type="password" 
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="••••"
              className="text-center text-2xl tracking-[8px]"
              required
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button type="button" className="btn btn-ghost flex-1 justify-center" onClick={close}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary flex-1 justify-center" disabled={pin.length < 4}>
              Valider
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
