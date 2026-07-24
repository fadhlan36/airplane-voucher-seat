<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GenerateVoucherRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string'],
            'id' => ['required', 'string'],
            'flightNumber' => ['required', 'string'],
            'date' => ['required', 'date_format:Y-m-d'],
            'aircraft' => ['required', 'in:ATR,Airbus 320,Boeing 737 Max'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama kru wajib diisi.',
            'id.required' => 'ID kru wajib diisi.',
            'flightNumber.required' => 'Nomor penerbangan wajib diisi.',
            'date.required' => 'Tanggal wajib diisi.',
            'date.date_format' => 'Format tanggal harus YYYY-MM-DD.',
            'aircraft.required' => 'Tipe pesawat wajib dipilih.',
            'aircraft.in' => 'Tipe pesawat harus salah satu dari: ATR, Airbus 320, Boeing 737 Max.',
        ];
    }
}
