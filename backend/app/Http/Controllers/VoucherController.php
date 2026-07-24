<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckVoucherRequest;
use App\Http\Requests\GenerateVoucherRequest;
use App\Http\Resources\VoucherResource;
use App\Models\Voucher;
use App\Services\SeatGeneratorService;
use Illuminate\Http\JsonResponse;

class VoucherController extends Controller
{
    public function __construct(
        protected SeatGeneratorService $seatGeneratorService
    ) {}

    /**
     * POST /api/check
     * Cek apakah voucher untuk flight+date tertentu sudah ada.
     */
    public function check(CheckVoucherRequest $request): JsonResponse
    {
        $exists = Voucher::where('flight_number', $request->flightNumber)
            ->where('flight_date', $request->date)
            ->exists();

        return response()->json([
            'exists' => $exists,
        ]);
    }

    /**
     * POST /api/generate
     * Generate 3 kursi random & simpan ke database.
     */
    public function generate(GenerateVoucherRequest $request): JsonResponse
    {
        // Double-check di sini juga (biar aman, gak cuma andalin frontend yang manggil /check duluan)
        $alreadyExists = Voucher::where('flight_number', $request->flightNumber)
            ->where('flight_date', $request->date)
            ->exists();

        if ($alreadyExists) {
            return response()->json([
                'success' => false,
                'message' => 'Voucher sudah pernah dibuat untuk flight dan tanggal ini.',
            ], 409); // 409 Conflict
        }

        $seats = $this->seatGeneratorService->generate($request->aircraft);

        $voucher = Voucher::create([
            'crew_name' => $request->name,
            'crew_id' => $request->id,
            'flight_number' => $request->flightNumber,
            'flight_date' => $request->date,
            'aircraft_type' => $request->aircraft,
            'seat1' => $seats[0],
            'seat2' => $seats[1],
            'seat3' => $seats[2],
        ]);

        return (new VoucherResource($voucher))
            ->response()
            ->setStatusCode(201); // 201 Created
    }
}
