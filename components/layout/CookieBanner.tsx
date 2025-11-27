"use client";
import {
    useEffect,
    useState,
} from 'react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  const handleClose = () => {
    localStorage.setItem("cookieConsent", "dismissed");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              Pemberitahuan LocalStorage
            </h3>
            <p className="text-sm text-gray-600">
              Website ini menggunakan browser local storage untuk menyimpan data todo list kamu secara lokal di perangkat. 
              Tidak ada data yang dikirim ke server. Informasi kamu tetap aman dan privat di browser kamu.
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={handleAccept}
              className="px-6 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition font-semibold border-t border-l border-r-[6px] border-b-[6px] border-sky-700"
            >
              Terima
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition font-bold text-xl"
              aria-label="Close banner"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

