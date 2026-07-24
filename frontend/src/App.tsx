import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import {
  Plane,
  User,
  IdCard,
  Calendar,
  Ticket,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { checkVoucher, generateVoucher } from "@/api/voucherApi";

const AIRCRAFT_OPTIONS = ["ATR", "Airbus 320", "Boeing 737 Max"];

interface FormState {
  crewName: string;
  crewId: string;
  flightNumber: string;
  flightDate: string;
  aircraftType: string;
}

const initialForm: FormState = {
  crewName: "",
  crewId: "",
  flightNumber: "",
  flightDate: "",
  aircraftType: "",
};

export default function App() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [seats, setSeats] = useState<string[] | null>(null);

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validateForm(): string | null {
    if (!form.crewName.trim()) return "Nama kru wajib diisi.";
    if (!form.crewId.trim()) return "ID kru wajib diisi.";
    if (!form.flightNumber.trim()) return "Nomor penerbangan wajib diisi.";
    if (!form.flightDate) return "Tanggal penerbangan wajib diisi.";
    if (!form.aircraftType) return "Tipe pesawat wajib dipilih.";
    return null;
  }

  async function handleGenerate(e: FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setSeats(null);

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setLoading(true);
    try {
      const checkResult = await checkVoucher({
        flightNumber: form.flightNumber,
        date: form.flightDate,
      });

      if (checkResult.exists) {
        setErrorMessage(
          `Voucher untuk penerbangan ${form.flightNumber} pada tanggal ini sudah pernah dibuat.`,
        );
        return;
      }

      const result = await generateVoucher({
        name: form.crewName,
        id: form.crewId,
        flightNumber: form.flightNumber,
        date: form.flightDate,
        aircraft: form.aircraftType,
      });

      setSeats(result.seats);
    } catch (err) {
      setErrorMessage((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4 md:p-6">
      <Card className="w-full max-w-lg shadow-xl border-slate-200/80 bg-white backdrop-blur-sm">
        {/* Header Bagian Atas */}
        <CardHeader className="space-y-2 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
              <Plane className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold tracking-tight text-slate-900">
                Voucher Seat Assignment
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Alokasi kursi voucher secara acak untuk kru penerbangan
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Informasi Kru (Grid 2 Kolom) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="crewName"
                  className="text-xs font-semibold text-slate-700 flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" /> Nama Kru
                </Label>
                <Input
                  id="crewName"
                  placeholder="Contoh: Sarah"
                  value={form.crewName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange("crewName", e.target.value)
                  }
                  className="h-10 focus-visible:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="crewId"
                  className="text-xs font-semibold text-slate-700 flex items-center gap-1.5"
                >
                  <IdCard className="w-3.5 h-3.5 text-slate-400" /> ID Kru
                </Label>
                <Input
                  id="crewId"
                  placeholder="Contoh: 98123"
                  value={form.crewId}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange("crewId", e.target.value)
                  }
                  className="h-10 focus-visible:ring-primary/20"
                />
              </div>
            </div>

            {/* Penerbangan & Tanggal (Grid 2 Kolom) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="flightNumber"
                  className="text-xs font-semibold text-slate-700 flex items-center gap-1.5"
                >
                  <Plane className="w-3.5 h-3.5 text-slate-400" /> No.
                  Penerbangan
                </Label>
                <Input
                  id="flightNumber"
                  placeholder="GA102"
                  value={form.flightNumber}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange("flightNumber", e.target.value)
                  }
                  className="h-10 uppercase focus-visible:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="flightDate"
                  className="text-xs font-semibold text-slate-700 flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Tanggal
                </Label>
                <Input
                  id="flightDate"
                  type="date"
                  value={form.flightDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange("flightDate", e.target.value)
                  }
                  className="h-10 focus-visible:ring-primary/20"
                />
              </div>
            </div>

            {/* Select Tipe Pesawat */}
            <div className="space-y-2">
              <Label
                htmlFor="aircraftType"
                className="text-xs font-semibold text-slate-700"
              >
                Tipe Pesawat
              </Label>
              <Select
                value={form.aircraftType}
                onValueChange={(value: string | null) =>
                  handleChange("aircraftType", value ?? "")
                }
              >
                <SelectTrigger
                  id="aircraftType"
                  className="h-10 w-full focus:ring-primary/20"
                >
                  <SelectValue placeholder="-- Pilih Tipe Pesawat --" />
                </SelectTrigger>
                <SelectContent>
                  {AIRCRAFT_OPTIONS.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tombol Submit */}
            <Button
              type="submit"
              className="w-full h-11 font-medium transition-all shadow-md shadow-primary/10 hover:shadow-primary/20"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Vouchers
                </>
              )}
            </Button>
          </form>

          {/* Alert Error Message */}
          {errorMessage && (
            <div className="mt-5 p-3.5 bg-red-50 border border-red-200/60 rounded-lg text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Badge Tempat Seat Hasil Generate */}
          {seats && (
            <div className="mt-5 p-4 bg-emerald-50/70 border border-emerald-200/70 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Kursi Berhasil Di-generate!</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {seats.map((seat) => (
                  <div
                    key={seat}
                    className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-mono font-bold text-sm shadow-sm"
                  >
                    <Ticket className="w-3.5 h-3.5 opacity-80" />
                    <span>{seat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
