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
    if (!form.crewName.trim()) return "Crew name is required.";
    if (!form.crewId.trim()) return "Crew ID is required.";
    if (!form.flightNumber.trim()) return "Flight number is required.";
    if (!form.flightDate) return "Flight date is required.";
    if (!form.aircraftType) return "Aircraft type is required.";
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
          `Vouchers for flight ${form.flightNumber.toUpperCase()} on this date have already been generated.`,
        );
        return;
      }

      const result = await generateVoucher({
        name: form.crewName,
        id: form.crewId,
        flightNumber: form.flightNumber.toUpperCase(),
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
    <div className="min-h-screen bg-slate-100 text-slate-800 flex items-center justify-center p-4 sm:p-6 font-sans antialiased selection:bg-sky-500 selection:text-white">
      {/* Main Container */}
      <div className="w-full max-w-xl my-auto space-y-6">
        {/* Main Card Form */}
        <Card className="shadow-xl border-slate-200/80 bg-white text-slate-800 rounded-3xl overflow-hidden">
          {/* Card Header */}
          <CardHeader className="bg-slate-50/80 border-b border-slate-100 p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-tr from-sky-500 to-blue-600 rounded-2xl text-white shadow-md shadow-sky-500/20 shrink-0">
                <Plane className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Seat Voucher Assignment
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-slate-500 mt-1">
                  Generate promotional seat allocations for flight crew
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          {/* Form Content */}
          <CardContent className="p-6 sm:p-8 space-y-6">
            <form onSubmit={handleGenerate} className="space-y-5">
              {/* Field Grid: Crew Name & ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="crewName"
                    className="text-xs font-semibold text-slate-600 flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5 text-sky-600" /> Crew Name
                  </Label>
                  <Input
                    id="crewName"
                    placeholder="e.g. Sarah Jenkins"
                    value={form.crewName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange("crewName", e.target.value)
                    }
                    className="h-11 bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-sky-500/20 focus-visible:border-sky-500 text-sm rounded-xl transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="crewId"
                    className="text-xs font-semibold text-slate-600 flex items-center gap-1.5"
                  >
                    <IdCard className="w-3.5 h-3.5 text-sky-600" /> Crew ID
                  </Label>
                  <Input
                    id="crewId"
                    placeholder="e.g. 98123"
                    value={form.crewId}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange("crewId", e.target.value)
                    }
                    className="h-11 bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-sky-500/20 focus-visible:border-sky-500 text-sm rounded-xl transition-all"
                  />
                </div>
              </div>

              {/* Field Grid: Flight Number & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="flightNumber"
                    className="text-xs font-semibold text-slate-600 flex items-center gap-1.5"
                  >
                    <Plane className="w-3.5 h-3.5 text-sky-600" /> Flight No.
                  </Label>
                  <Input
                    id="flightNumber"
                    placeholder="e.g. GA102"
                    value={form.flightNumber}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange("flightNumber", e.target.value)
                    }
                    className="h-11 bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-sky-500/20 focus-visible:border-sky-500 uppercase font-mono tracking-wider text-sm rounded-xl transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="flightDate"
                    className="text-xs font-semibold text-slate-600 flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-sky-600" /> Date
                  </Label>
                  <Input
                    id="flightDate"
                    type="date"
                    value={form.flightDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange("flightDate", e.target.value)
                    }
                    className="h-11 bg-slate-50 border-slate-200 text-slate-800 focus-visible:ring-sky-500/20 focus-visible:border-sky-500 text-sm rounded-xl transition-all"
                  />
                </div>
              </div>

              {/* Field: Aircraft Type */}
              <div className="space-y-2">
                <Label
                  htmlFor="aircraftType"
                  className="text-xs font-semibold text-slate-600"
                >
                  Aircraft Type
                </Label>
                <Select
                  value={form.aircraftType}
                  onValueChange={(value: string | null) =>
                    handleChange("aircraftType", value ?? "")
                  }
                >
                  <SelectTrigger
                    id="aircraftType"
                    className="h-11 w-full bg-slate-50 border-slate-200 text-slate-800 focus:ring-sky-500/20 focus:border-sky-500 text-sm rounded-xl transition-all"
                  >
                    <SelectValue placeholder="-- Select Aircraft Type --" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 text-slate-800">
                    {AIRCRAFT_OPTIONS.map((type) => (
                      <SelectItem
                        key={type}
                        value={type}
                        className="focus:bg-sky-50 focus:text-sky-900"
                      >
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 mt-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-md shadow-sky-500/20 transition-all duration-200 active:scale-[0.99] disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Generate Vouchers
                  </span>
                )}
              </Button>
            </form>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Visual Result Card - Light Theme */}
            {seats && (
              <div className="pt-2 animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-gradient-to-br from-sky-50/60 via-white to-slate-50 border border-sky-200 rounded-2xl overflow-hidden shadow-sm">
                  {/* Top Result Banner */}
                  <div className="bg-sky-500/10 border-b border-sky-100 px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sky-700 font-semibold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>VOUCHER GENERATED SUCCESSFULLY</span>
                    </div>
                  </div>

                  {/* Body Result */}
                  <div className="p-5 sm:p-6 space-y-5">
                    {/* Main Info Grid (2x2) */}
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="space-y-0.5">
                        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                          Crew Name
                        </p>
                        <p className="font-semibold text-slate-800 text-sm truncate">
                          {form.crewName}
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                          Crew ID
                        </p>
                        <p className="font-semibold text-slate-700 text-sm font-mono">
                          {form.crewId}
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                          Flight No.
                        </p>
                        <p className="font-bold text-sky-600 text-sm font-mono tracking-wide">
                          {form.flightNumber.toUpperCase()}
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                          Aircraft Type
                        </p>
                        <p className="font-medium text-slate-700 text-sm truncate">
                          {form.aircraftType}
                        </p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-slate-200/70" />

                    {/* Allocated Seats Section */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                          Assigned Seats
                        </p>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {seats.length} Seats Allocated
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {seats.map((seat) => (
                          <div
                            key={seat}
                            className="flex items-center gap-1.5 bg-sky-50 border border-sky-200/80 px-3.5 py-1.5 rounded-xl text-sky-700 font-mono font-bold text-sm shadow-sm"
                          >
                            <Ticket className="w-3.5 h-3.5 text-sky-500 opacity-80" />
                            <span>{seat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
