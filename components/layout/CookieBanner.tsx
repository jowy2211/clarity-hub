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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-stone-800 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
              🔒 Privasi & Penyimpanan Data Lokal
            </h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p className="font-medium">
                ClarityHub menggunakan <strong>Local Storage</strong> browser untuk menyimpan semua data Anda secara lokal di perangkat Anda sendiri:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
                <li><strong>Deep Work:</strong> Timer pomodoro, sesi fokus, dan statistik produktivitas</li>
                <li><strong>SpendSmart:</strong> Catatan pengeluaran dan analisis keuangan</li>
                <li><strong>To-Do List:</strong> Daftar tugas dan status penyelesaian</li>
                <li><strong>Preferensi:</strong> Pengaturan aplikasi dan preferensi pengguna</li>
              </ul>
              <p className="font-semibold text-gray-800 mt-3">
                ✅ <strong>100% Privat:</strong> Semua data tersimpan di browser Anda. 
                <span className="text-green-700"> Tidak ada pengiriman data ke server, tidak ada pengumpulan data anonim, tidak ada tracking.</span> Data Anda sepenuhnya aman dan terjaga privasinya.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-center self-end sm:self-center">
            <button
              onClick={handleAccept}
              className="px-6 py-2.5 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition font-semibold border-t border-l border-r-[6px] border-b-[6px] border-sky-700 whitespace-nowrap"
            >
              Saya Mengerti
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition font-bold text-xl"
              aria-label="Close banner"
              title="Tutup"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

