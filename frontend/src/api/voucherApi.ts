const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export interface CheckVoucherPayload {
    flightNumber: string;
    date: string;
}

export interface GenerateVoucherPayload {
    name: string;
    id: string;
    flightNumber: string;
    date: string;
    aircraft: string;
}

export interface GenerateVoucherResponse {
    success: boolean;
    seats: string[];
}

/**
 * Cek apakah voucher untuk flight+date tertentu sudah ada.
 */
export async function checkVoucher(
    payload: CheckVoucherPayload
): Promise<{ exists: boolean }> {
    const response = await fetch(`${BASE_URL}/check`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Gagal memeriksa data voucher. Coba lagi.");
    }

    return response.json();
}

/**
 * Generate voucher baru (3 kursi random) dan simpan ke database.
 */
export async function generateVoucher(
    payload: GenerateVoucherPayload
): Promise<GenerateVoucherResponse> {
    const response = await fetch(`${BASE_URL}/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.status === 409) {
        throw new Error(
            data.message || "Voucher sudah pernah dibuat untuk flight dan tanggal ini."
        );
    }

    if (response.status === 422) {
        const firstError = Object.values(data.errors || {})[0] as string[] | undefined;
        throw new Error(firstError?.[0] || "Data yang dimasukkan tidak valid.");
    }

    if (!response.ok) {
        throw new Error("Terjadi kesalahan saat generate voucher. Coba lagi.");
    }

    return data;
}