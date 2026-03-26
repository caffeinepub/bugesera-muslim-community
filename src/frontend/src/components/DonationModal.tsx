import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ContributionCategory, Currency, PaymentMethod } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAddContribution } from "../hooks/useQueries";

interface DonationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCategory?: ContributionCategory;
}

export function DonationModal({
  open,
  onOpenChange,
  defaultCategory,
}: DonationModalProps) {
  const { identity } = useInternetIdentity();
  const addContribution = useAddContribution();
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    donorName: "",
    amount: "",
    currency: Currency.RWF,
    category: defaultCategory || ContributionCategory.Irayidi,
    paymentMethod: PaymentMethod.MTN,
    phone: "",
    note: "",
  });

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.donorName || !form.amount) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await addContribution.mutateAsync({
        donorName: form.donorName,
        amount: Number.parseFloat(form.amount),
        currency: form.currency,
        category: form.category,
        paymentMethod: form.paymentMethod,
        note: form.note || undefined,
        member: identity ? identity.getPrincipal() : undefined,
        timestamp: BigInt(Date.now()) * 1_000_000n,
      });
      setSuccess(true);
      toast.success("Contribution submitted! Murakoze!");
    } catch {
      toast.error("Failed to submit. Please try again.");
    }
  };

  const handleClose = (v: boolean) => {
    if (!v) {
      setSuccess(false);
      setForm({
        donorName: "",
        amount: "",
        currency: Currency.RWF,
        category: defaultCategory || ContributionCategory.Irayidi,
        paymentMethod: PaymentMethod.MTN,
        phone: "",
        note: "",
      });
    }
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-md rounded-2xl"
        data-ocid="donation.dialog"
      >
        <DialogHeader>
          <DialogTitle
            className="text-xl font-bold"
            style={{ color: "#0F5B3A" }}
          >
            {success ? "Contribution Received!" : "Make a Contribution"}
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div
            className="flex flex-col items-center gap-4 py-8"
            data-ocid="donation.success_state"
          >
            <CheckCircle2 className="w-16 h-16" style={{ color: "#0F5B3A" }} />
            <p className="text-center text-muted-foreground">
              Your contribution has been recorded. Murakoze cyane! 🙏
            </p>
            <Button
              onClick={() => handleClose(false)}
              className="rounded-xl bg-primary text-white"
              data-ocid="donation.close_button"
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => set("category", v)}
              >
                <SelectTrigger
                  className="rounded-xl"
                  data-ocid="donation.select"
                  id="category"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ContributionCategory.Irayidi}>
                    Irayidi / Igitambo
                  </SelectItem>
                  <SelectItem value={ContributionCategory.ZakatulFitr}>
                    Zakatul Fitr
                  </SelectItem>
                  <SelectItem value={ContributionCategory.Musabaka}>
                    Musabaka
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="donorName">Your Name *</Label>
              <Input
                id="donorName"
                placeholder="e.g. Uwimana Abubakar"
                value={form.donorName}
                onChange={(e) => set("donorName", e.target.value)}
                className="rounded-xl"
                data-ocid="donation.input"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={form.amount}
                  onChange={(e) => set("amount", e.target.value)}
                  className="rounded-xl"
                  data-ocid="donation.input"
                  required
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={form.currency}
                  onValueChange={(v) => set("currency", v)}
                >
                  <SelectTrigger
                    className="rounded-xl"
                    id="currency"
                    data-ocid="donation.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Currency.RWF}>RWF</SelectItem>
                    <SelectItem value={Currency.USD}>USD</SelectItem>
                    <SelectItem value={Currency.KES}>KES</SelectItem>
                    <SelectItem value={Currency.UGX}>UGX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={form.paymentMethod}
                onValueChange={(v) => set("paymentMethod", v)}
              >
                <SelectTrigger
                  className="rounded-xl"
                  id="paymentMethod"
                  data-ocid="donation.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PaymentMethod.MTN}>
                    MTN Mobile Money
                  </SelectItem>
                  <SelectItem value={PaymentMethod.Airtel}>
                    Airtel Money
                  </SelectItem>
                  <SelectItem value={PaymentMethod.Bank}>
                    Bank Transfer
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(form.paymentMethod === PaymentMethod.MTN ||
              form.paymentMethod === PaymentMethod.Airtel) && (
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+250 7XX XXX XXX"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  className="rounded-xl"
                  data-ocid="donation.input"
                />
              </div>
            )}

            <div>
              <Label htmlFor="note">Note (optional)</Label>
              <Textarea
                id="note"
                placeholder="Any message..."
                value={form.note}
                onChange={(e) => set("note", e.target.value)}
                className="rounded-xl resize-none"
                rows={2}
                data-ocid="donation.textarea"
              />
            </div>

            <Button
              type="submit"
              disabled={addContribution.isPending}
              className="rounded-xl text-white font-semibold"
              style={{ backgroundColor: "#B8944E" }}
              data-ocid="donation.submit_button"
            >
              {addContribution.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {addContribution.isPending
                ? "Submitting..."
                : "Submit Contribution"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
