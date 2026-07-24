<?php

namespace App\Services;

class SeatGeneratorService
{
    /**
     * Konfigurasi layout kursi per tipe pesawat.
     * rows = jumlah baris, columns = kolom yang tersedia (huruf kursi)
     */
    protected array $seatMaps = [
        'ATR' => [
            'rows' => 18,
            'columns' => ['A', 'C', 'D', 'F'],
        ],
        'Airbus 320' => [
            'rows' => 32,
            'columns' => ['A', 'B', 'C', 'D', 'E', 'F'],
        ],
        'Boeing 737 Max' => [
            'rows' => 32,
            'columns' => ['A', 'B', 'C', 'D', 'E', 'F'],
        ],
    ];

    /**
     * Generate 3 kursi unik secara random berdasarkan tipe pesawat.
     *
     * @param string $aircraftType
     * @return array
     * @throws \InvalidArgumentException
     */
    public function generate(string $aircraftType): array
    {
        if (!isset($this->seatMaps[$aircraftType])) {
            throw new \InvalidArgumentException("Tipe pesawat tidak valid: {$aircraftType}");
        }

        $map = $this->seatMaps[$aircraftType];
        $rows = $map['rows'];
        $columns = $map['columns'];

        // Bikin semua kombinasi kursi yang mungkin, misal: 1A, 1C, 1D, 1F, 2A, ...
        $allSeats = [];
        for ($row = 1; $row <= $rows; $row++) {
            foreach ($columns as $col) {
                $allSeats[] = $row . $col;
            }
        }

        // Acak urutan semua kursi, lalu ambil 3 kursi pertama (otomatis unik, gak mungkin dobel)
        shuffle($allSeats);

        return array_slice($allSeats, 0, 3);
    }
}
