import { GoogleGenAI } from "@google/genai";
import { getSecret } from "astro:env/server";

const apiKey = getSecret("GEMINI_API_KEY");

if (!apiKey) {
    throw new Error("GEMINI_API_KEY tidak ditemukan.");
}

const ai = new GoogleGenAI({
    apiKey,
});

const MIMI_INSTRUCTIONS = `
Kamu adalah Mimi, teman belajar matematika untuk anak-anak Indonesia.

IDENTITAS MIMI:
- Namamu Mimi.
- Selalu menyebut dirimu sebagai Mimi.
- Jangan mengatakan bahwa kamu adalah ChatGPT.
- Jangan mengaku sebagai manusia.

GAYA BICARA:
- Gunakan Bahasa Indonesia.
- Ramah, hangat, sederhana, dan menyenangkan.
- Target utama adalah anak-anak SD.
- Gunakan bahasa yang mudah dipahami anak.
- Gunakan emoji secukupnya.
- Jawaban jangan terlalu panjang.
- Berbicaralah seperti teman belajar yang menyenangkan.

MATEMATIKA:
- Untuk soal matematika, jelaskan langkah demi langkah.
- Jangan hanya memberikan jawaban akhir.
- Jika anak salah, bantu dengan sabar.
- Jangan mempermalukan anak.
- Sesuaikan penjelasan dengan tingkat anak SD.

MEMBACA GAMBAR:
- Kamu dapat melihat gambar yang dikirim oleh anak.
- Jika anak mengirim foto soal matematika, baca dan pahami isi soal tersebut.
- Identifikasi angka, simbol, teks, diagram, tabel, atau informasi lain yang terlihat.
- Setelah memahami soal, bantu anak mengerjakannya langkah demi langkah.
- Jika gambar berisi soal matematika, jangan hanya mengatakan bahwa ada gambar.
- Jangan mengatakan "Mimi tidak bisa melihat gambar" jika gambar memang sudah diberikan.
- Jangan mengarang isi gambar yang tidak terlihat.
- Jika gambar terlalu buram, terpotong, terlalu kecil, atau tidak terbaca, katakan bagian mana yang belum jelas dan minta anak mengirim foto yang lebih jelas.
- Jika anak bertanya "Mimi, ini jawabannya apa?" setelah mengirim gambar, gunakan isi gambar tersebut sebagai konteks utama pertanyaan.
- Jika gambar berisi soal seperti:
  AA
  + A
  ----
  B08
  Find A and B
  maka baca struktur soalnya dengan teliti dan bantu mencari nilai A dan B.

KEAMANAN ANAK:
- Jangan memberikan konten seksual atau pornografi.
- Jangan membantu mencari atau membuat konten dewasa.
- Jangan memberikan instruksi berbahaya.
- Jangan meminta alamat rumah, nomor telepon, password, atau informasi pribadi lainnya.
- Jangan meminta foto pribadi anak.
- Jika mendapat pertanyaan yang tidak sesuai untuk anak, arahkan kembali ke topik yang aman dan edukatif.

FORMAT JAWABAN:
- Jangan gunakan format LaTeX.
- Jangan gunakan tanda $ untuk menulis matematika.
- Tulis operasi matematika dengan teks biasa.
- Contoh: 10 + 9 = 19.
- Jangan gunakan format seperti $10 + 9$ atau $$10 + 9$$.
- Gunakan baris baru agar langkah matematika mudah dibaca anak.

PEMBUKAAN:
- Jika percakapan benar-benar baru, kamu boleh mengatakan:
  "Halo, aku Mimi! 👋 Ketik pertanyaanmu."
- Jangan mengulang pembukaan tersebut di setiap pesan.
`;

type ChatImage = {
    mimeType: string;
    data: string;
};

type ChatMessage = {
    role: "user" | "assistant";
    content: string;
    image?: ChatImage;
};

const ALLOWED_IMAGE_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
]);

export async function POST({ request }: { request: Request }) {
    try {
        const rawBody = await request.text();

        if (!rawBody) {
            return new Response(
                JSON.stringify({
                    error: "Body request kosong.",
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        let body: {
            messages?: ChatMessage[];
        };

        try {
            body = JSON.parse(rawBody);
        } catch {
            return new Response(
                JSON.stringify({
                    error: "Format pesan tidak valid.",
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        const messages = Array.isArray(body.messages)
            ? body.messages
            : [];

        if (messages.length === 0) {
            return new Response(
                JSON.stringify({
                    error: "Pertanyaan belum ada.",
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        /*
         * Ubah percakapan Mimi menjadi format Gemini.
         *
         * Kalau ada gambar:
         *
         * {
         *   inlineData: {
         *      mimeType: "image/jpeg",
         *      data: "BASE64..."
         *   }
         * }
         *
         * Jadi gambar benar-benar ikut dikirim
         * ke model multimodal Gemini.
         */

        const contents = messages.map((message) => {
            const parts: Array<
                | { text: string }
                | {
                      inlineData: {
                          mimeType: string;
                          data: string;
                      };
                  }
            > = [];

            /*
             * MASUKKAN GAMBAR
             */
            if (message.image) {
                const { mimeType, data } = message.image;

                if (!ALLOWED_IMAGE_TYPES.has(mimeType)) {
                    throw new Error(
                        `Format gambar ${mimeType} belum didukung. Gunakan JPG, PNG, WEBP, atau GIF.`
                    );
                }

                if (!data || typeof data !== "string") {
                    throw new Error("Data gambar tidak valid.");
                }

                /*
                 * Batas pengaman.
                 * Frontend kita sendiri juga membatasi ukuran file.
                 */
                if (data.length > 7_000_000) {
                    throw new Error(
                        "Ukuran gambar terlalu besar. Maksimal 5 MB."
                    );
                }

                parts.push({
                    inlineData: {
                        mimeType,
                        data,
                    },
                });
            }

            /*
             * MASUKKAN TEKS
             */
            if (message.content?.trim()) {
                parts.push({
                    text: message.content,
                });
            }

            /*
             * Jangan kirim parts kosong.
             */
            if (parts.length === 0) {
                parts.push({
                    text: "Tolong bantu pertanyaan ini.",
                });
            }

            return {
                role:
                    message.role === "assistant"
                        ? "model"
                        : "user",
                parts,
            };
        });

        console.log(
            "Mimi → Gemini:",
            messages.length,
            "pesan"
        );

        const hasImage = messages.some(
            (message) => !!message.image
        );

        console.log(
            "Gambar dikirim ke Gemini:",
            hasImage ? "YA" : "TIDAK"
        );

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",

            contents,

            config: {
                systemInstruction: MIMI_INSTRUCTIONS,
                maxOutputTokens: 700,
            },
        });

        const reply =
            response.text ||
            "Maaf ya, Mimi belum bisa menjawab sekarang. 😊";

        console.log("Gemini → Mimi OK");

        return new Response(
            JSON.stringify({
                reply,
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error) {
        console.error(
            "MIMI GEMINI API ERROR:",
            error
        );

        const errorMessage =
            error instanceof Error
                ? error.message
                : "Mimi sedang mengalami masalah.";

        return new Response(
            JSON.stringify({
                error: errorMessage,
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
}