# Sabarin.ai

## Description
Sabarin.ai adalah platform SaaS berbasis kecerdasan buatan (AI) yang dirancang khusus untuk membantu pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) Indonesia dalam meredam emosi pelanggan, menangani komplain secara diplomatis, serta melindungi bisnis dari risiko kerugian finansial akibat salah janji atau sengketa konsumen.

## Problem & Target User
* **Masalah Utama:** Pelaku UMKM sering kali kewalahan dan berada di bawah tekanan psikologis yang tinggi saat menghadapi komplain atau tuntutan konsumen yang emosional di berbagai kanal digital. Keterbatasan waktu dan kurangnya panduan diplomatis berisiko memicu eskalasi konflik, ulasan negatif daring, hingga kerugian finansial akibat kesalahan pemberian *refund* atau kompensasi.
* **Target Pengguna:** Pemilik UMKM, pelaku usaha mandiri (*one-man show*), dan pengelola operasional kecil yang membutuhkan asisten respons pelanggan cepat yang tetap mematuhi kebijakan toko.

## Key Features
* **Smart Issue Classifier:** Analisis otomatis untuk mendeteksi kategori komplain, tingkat urgensi, dan tingkat emosi pelanggan.
* **Diplomatic Response Generator:** Generator draf balasan empatik instan dengan berbagai pilihan gaya bahasa yang profesional dan siap pakai.
* **AI Guardrails (Kebijakan Toko):** Sistem pengaman berbasis profil bisnis di *backend* yang memastikan AI selalu mematuhi aturan operasional dan batasan kebijakan toko secara ketat.
* **History & Storage:** Sistem penyimpanan riwayat penanganan komplain berbasis *localStorage* untuk memudahkan peninjauan ulang.
* **Fallback Engine:** Mekanisme penanganan gangguan API otomatis agar simulasi analisis tetap berjalan lancar.

## Tech Stack
* **Frontend:** React, TypeScript, Vite, Tailwind CSS, Lucide React Icons
* **Backend / API Integration:** Node.js / Express, Google Gemini API
* **Hosting / Deployment:** Vercel

## AI Implementation
* **Model:** Google Gemini API (Generative AI / LLM).
* **Peran AI:** Menganalisis teks komplain yang masuk secara kontekstual dan menyusun draf respons diplomatis yang disaring secara ketat melalui parameter *guardrails* kebijakan toko yang ditentukan pengguna.

## Architecture / Data Flow
User Input (Komplain & Profil Toko) -> Frontend (React) -> Backend / API Route -> Google Gemini AI Model -> Analisis & Draf Balasan Diplomatic -> Result (Tampil di Dashboard)

## Installation / Run Instructions
Ikuti langkah-langkah berikut untuk menjalankan proyek secara lokal:

1. Kloning repositori ini:
   ```bash
   git clone [https://github.com/username/sabarin-ai.git](https://github.com/username/sabarin-ai.git)
