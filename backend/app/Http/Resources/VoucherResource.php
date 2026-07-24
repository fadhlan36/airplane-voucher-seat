<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VoucherResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'success' => true,
            'seats' => [
                $this->seat1,
                $this->seat2,
                $this->seat3,
            ],
        ];
    }
}
