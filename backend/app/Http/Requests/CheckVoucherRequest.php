<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckVoucherRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // gak pakai auth, jadi semua boleh akses
    }

    public function rules(): array
    {
        return [
            'flightNumber' => ['required', 'string'],
            'date' => ['required', 'date_format:Y-m-d'],
        ];
    }

    public function messages(): array
    {
        return [
            'flightNumber.required' => 'Nomor penerbangan wajib diisi.',
            'date.required' => 'Tanggal wajib diisi.',
            'date.date_format' => 'Format tanggal harus YYYY-MM-DD.',
        ];
    }
}
