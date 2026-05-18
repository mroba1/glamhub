"use client";
import { useState } from "react";
import Image from "next/image";
import { Calendar, Clock, CheckCircle, ChevronRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadZone } from "@/components/shared/upload-zone";
import { StatusBadge } from "@/components/shared/status-badge";
import { MOCK_SERVICES, MOCK_BOOKINGS } from "@/constants/mock-data";
import { TIME_SLOTS } from "@/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

type Step = "service" | "datetime" | "payment" | "confirm";

export default function BookingPage() {
  const [step, setStep] = useState<Step>("service");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<"book" | "history">("book");

  const service = MOCK_SERVICES.find((s) => s.id === selectedService);

  const STEPS: { id: Step; label: string }[] = [
    { id: "service", label: "Service" },
    { id: "datetime", label: "Date & Time" },
    { id: "payment", label: "Payment" },
    { id: "confirm", label: "Confirm" },
  ];

  const handleBook = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    toast.success("Booking submitted!", { description: "We'll notify you once it's approved." });
    setStep("confirm");
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[hsl(0,0%,95%)]">Book Appointment</h1>
          <p className="text-[hsl(0,0%,55%)] mt-1">Schedule your next beauty session</p>
        </div>
        <div className="flex rounded-xl overflow-hidden border border-[hsl(0,0%,15%)]">
          {(["book", "history"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 text-sm font-medium transition-all ${
                view === v ? "bg-[hsl(38,65%,60%)] text-[hsl(0,0%,4%)]" : "text-[hsl(0,0%,60%)] hover:text-[hsl(0,0%,90%)]"
              }`}
            >
              {v === "book" ? "Book New" : "My Bookings"}
            </button>
          ))}
        </div>
      </div>

      {view === "history" ? (
        <div className="space-y-4">
          {MOCK_BOOKINGS.map((booking) => (
            <div key={booking.id} className="rounded-xl border border-[hsl(0,0%,13%)] bg-[hsl(0,0%,7%)] p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-[hsl(0,0%,90%)]">{booking.serviceName}</p>
                  <p className="text-xs text-[hsl(0,0%,50%)] mt-0.5">{booking.bookingNumber}</p>
                </div>
                <StatusBadge status={booking.status} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-[hsl(0,0%,45%)] text-xs">Date</p>
                  <p className="text-[hsl(0,0%,80%)]">{formatDate(booking.date)}</p>
                </div>
                <div>
                  <p className="text-[hsl(0,0%,45%)] text-xs">Time</p>
                  <p className="text-[hsl(0,0%,80%)]">{booking.timeSlot}</p>
                </div>
                <div>
                  <p className="text-[hsl(0,0%,45%)] text-xs">Amount</p>
                  <p className="text-[hsl(38,65%,60%)] font-semibold">{formatCurrency(booking.servicePrice)}</p>
                </div>
              </div>
              {booking.status === "pending" && !booking.paymentProofUrl && (
                <div className="mt-3 pt-3 border-t border-[hsl(0,0%,12%)]">
                  <Button variant="gold" size="sm" className="text-xs">
                    <Upload className="h-3 w-3" />
                    Upload Payment Proof
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>
          {/* Progress Steps */}
          <div className="flex items-center mb-8">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className={`flex items-center gap-2 ${i < STEPS.length - 1 ? "flex-1" : ""}`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-all ${
                    step === s.id ? "bg-[hsl(38,65%,60%)] text-[hsl(0,0%,4%)]"
                    : STEPS.indexOf(STEPS.find((x) => x.id === step)!) > i ? "bg-green-500 text-white"
                    : "bg-[hsl(0,0%,12%)] text-[hsl(0,0%,50%)]"
                  }`}>
                    {STEPS.indexOf(STEPS.find((x) => x.id === step)!) > i ? <CheckCircle className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={`hidden sm:block text-xs font-medium ${step === s.id ? "text-[hsl(38,65%,60%)]" : "text-[hsl(0,0%,50%)]"}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 mx-2 h-px transition-all ${
                    STEPS.indexOf(STEPS.find((x) => x.id === step)!) > i ? "bg-green-500" : "bg-[hsl(0,0%,15%)]"
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step: Service Selection */}
          {step === "service" && (
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-semibold text-[hsl(0,0%,90%)]">Choose a Service</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_SERVICES.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`text-left rounded-xl border p-4 transition-all ${
                      selectedService === service.id
                        ? "border-[hsl(38,65%,60%)] bg-[hsl(38,65%,60%)/8%]"
                        : "border-[hsl(0,0%,13%)] bg-[hsl(0,0%,7%)] hover:border-[hsl(0,0%,22%)]"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0">
                        <Image src={service.imageUrl ?? ""} alt={service.name} fill className="object-cover" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[hsl(38,65%,60%)]">{service.categoryName}</p>
                        <p className="font-semibold text-[hsl(0,0%,90%)] text-sm">{service.name}</p>
                        <p className="text-xs text-[hsl(0,0%,55%)] line-clamp-1">{service.description}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm font-bold text-[hsl(38,65%,60%)]">{formatCurrency(service.price)}</span>
                          <span className="text-xs text-[hsl(0,0%,50%)]"><Clock className="h-3 w-3 inline mr-0.5" />{service.duration}min</span>
                        </div>
                      </div>
                      {selectedService === service.id && (
                        <CheckCircle className="h-5 w-5 text-[hsl(38,65%,60%)] shrink-0 mt-0.5" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end pt-4">
                <Button variant="gold" onClick={() => setStep("datetime")} disabled={!selectedService}>
                  Continue <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step: Date & Time */}
          {step === "datetime" && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-semibold text-[hsl(0,0%,90%)]">Select Date & Time</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[hsl(0,0%,80%)]">Date</label>
                  <input
                    type="date"
                    min={today}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full h-11 rounded-xl border border-[hsl(0,0%,15%)] bg-[hsl(0,0%,7%)] px-4 text-sm text-[hsl(0,0%,90%)] focus:outline-none focus:ring-2 focus:ring-[hsl(38,65%,60%)/50%] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[hsl(0,0%,80%)]">Time Slot</label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map((slot, i) => {
                      const unavailable = i === 2 || i === 5 || i === 8;
                      return (
                        <button
                          key={slot}
                          disabled={unavailable}
                          onClick={() => setSelectedSlot(slot)}
                          className={`rounded-lg py-2 text-xs font-medium transition-all ${
                            unavailable ? "opacity-30 cursor-not-allowed border border-[hsl(0,0%,12%)] text-[hsl(0,0%,40%)]"
                            : selectedSlot === slot ? "bg-[hsl(38,65%,60%)] text-[hsl(0,0%,4%)]"
                            : "border border-[hsl(0,0%,15%)] text-[hsl(0,0%,65%)] hover:border-[hsl(38,65%,60%)/50%]"
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[hsl(0,0%,80%)]">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requests or notes for the stylist…"
                  rows={3}
                  className="w-full rounded-xl border border-[hsl(0,0%,15%)] bg-[hsl(0,0%,7%)] p-4 text-sm text-[hsl(0,0%,90%)] placeholder:text-[hsl(0,0%,40%)] focus:outline-none focus:ring-2 focus:ring-[hsl(38,65%,60%)/50%] resize-none"
                />
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep("service")}>Back</Button>
                <Button variant="gold" onClick={() => setStep("payment")} disabled={!selectedDate || !selectedSlot}>
                  Continue <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step: Payment */}
          {step === "payment" && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-semibold text-[hsl(0,0%,90%)]">Upload Payment Proof</h2>
              <div className="rounded-xl border border-[hsl(38,65%,60%)/30%] bg-[hsl(38,65%,60%)/5%] p-4">
                <p className="text-sm font-semibold text-[hsl(38,65%,60%)] mb-2">Payment Details</p>
                <div className="text-sm text-[hsl(0,0%,65%)] space-y-1">
                  <p>Bank: First Bank Nigeria</p>
                  <p>Account: 1234567890</p>
                  <p>Name: Glam Hub Ltd</p>
                  <p className="font-semibold text-[hsl(0,0%,90%)] mt-2">
                    Amount: {service ? formatCurrency(service.price) : ""}
                  </p>
                </div>
              </div>
              <UploadZone
                label="Upload Payment Screenshot"
                hint="Upload your bank transfer receipt or screenshot"
                onFilesSelected={(files) => setPaymentFile(files[0])}
              />
              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep("datetime")}>Back</Button>
                <Button variant="gold" onClick={() => setStep("confirm")} disabled={!paymentFile}>
                  Review Booking <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step: Confirm */}
          {step === "confirm" && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-semibold text-[hsl(0,0%,90%)]">Review & Confirm</h2>
              <div className="rounded-xl border border-[hsl(0,0%,13%)] bg-[hsl(0,0%,7%)] divide-y divide-[hsl(0,0%,12%)]">
                {[
                  { label: "Service", value: service?.name },
                  { label: "Studio", value: service?.companyName },
                  { label: "Date", value: selectedDate ? formatDate(selectedDate) : "" },
                  { label: "Time", value: selectedSlot },
                  { label: "Duration", value: `${service?.duration} minutes` },
                  { label: "Amount", value: service ? formatCurrency(service.price) : "", highlight: true },
                ].map(({ label, value, highlight }) => (
                  <div key={label} className="flex items-center justify-between px-5 py-3">
                    <span className="text-sm text-[hsl(0,0%,55%)]">{label}</span>
                    <span className={`text-sm font-medium ${highlight ? "text-[hsl(38,65%,60%)] text-base font-bold font-serif" : "text-[hsl(0,0%,85%)]"}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              {notes && (
                <div className="rounded-xl border border-[hsl(0,0%,13%)] bg-[hsl(0,0%,7%)] p-4">
                  <p className="text-xs text-[hsl(0,0%,50%)] mb-1">Notes</p>
                  <p className="text-sm text-[hsl(0,0%,80%)]">{notes}</p>
                </div>
              )}
              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep("payment")}>Back</Button>
                <Button variant="gold" onClick={handleBook} isLoading={isLoading}>
                  <Calendar className="h-4 w-4" />
                  Confirm Booking
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
