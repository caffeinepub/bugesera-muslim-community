import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Pencil, TrendingUp, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ContributionCategory, Currency } from "../backend.d";
import { CAMPAIGN_GOALS } from "../data/sampleData";
import { useContributionTotal, useIsAdmin } from "../hooks/useQueries";
import { formatAmount } from "../utils/formatters";
import { DonationModal } from "./DonationModal";

const STORAGE_KEY = "campaign_goals";

function loadGoals(): Record<ContributionCategory, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...CAMPAIGN_GOALS, ...JSON.parse(raw) };
  } catch {}
  return { ...CAMPAIGN_GOALS };
}

function saveGoals(goals: Record<ContributionCategory, number>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

function TotalRaisedBanner({ currency }: { currency: Currency }) {
  const { data: t1 = 0 } = useContributionTotal(ContributionCategory.Irayidi);
  const { data: t2 = 0 } = useContributionTotal(
    ContributionCategory.ZakatulFitr,
  );
  const { data: t3 = 0 } = useContributionTotal(ContributionCategory.Musabaka);
  const total = t1 + t2 + t3;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <div
        className="rounded-2xl p-5 flex items-center gap-4 shadow-md"
        style={{
          background: "linear-gradient(135deg, #0F5B3A 0%, #1a7d52 100%)",
        }}
        data-ocid="fundraising.card"
      >
        <div
          className="flex items-center justify-center rounded-full p-3"
          style={{ backgroundColor: "rgba(184,148,78,0.25)" }}
        >
          <TrendingUp className="w-6 h-6" style={{ color: "#E8C87A" }} />
        </div>
        <div className="flex-1">
          <p
            className="text-xs font-medium uppercase tracking-widest"
            style={{ color: "#A8D8BC" }}
          >
            Total Raised Across All Campaigns
          </p>
          <p className="text-2xl font-extrabold text-white mt-0.5">
            {formatAmount(total, currency)}
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs" style={{ color: "#A8D8BC" }}>
            Campaigns
          </p>
          <p className="text-xl font-bold text-white">3</p>
        </div>
      </div>
    </motion.div>
  );
}

function CampaignCard({
  category,
  currency,
  goal,
  isAdmin,
  onDonate,
  onGoalChange,
}: {
  category: ContributionCategory;
  currency: Currency;
  goal: number;
  isAdmin: boolean;
  onDonate: (cat: ContributionCategory) => void;
  onGoalChange: (cat: ContributionCategory, newGoal: number) => void;
}) {
  const { data: total = 0 } = useContributionTotal(category);
  const progress = Math.min((total / goal) * 100, 100);
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(String(goal));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) setInputVal(String(goal));
  }, [goal, editing]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const handleSave = () => {
    const parsed = Number.parseInt(inputVal.replace(/[^0-9]/g, ""), 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      onGoalChange(category, parsed);
    }
    setEditing(false);
  };

  const labels: Record<
    ContributionCategory,
    { name: string; desc: string; emoji: string }
  > = {
    [ContributionCategory.Irayidi]: {
      name: "Irayidi / Igitambo",
      desc: "Monthly community contributions",
      emoji: "🤲",
    },
    [ContributionCategory.ZakatulFitr]: {
      name: "Zakatul Fitr",
      desc: "Obligatory charity for Ramadan",
      emoji: "🌙",
    },
    [ContributionCategory.Musabaka]: {
      name: "Musabaka",
      desc: "Quran competition sponsorship",
      emoji: "📖",
    },
  };
  const info = labels[category];

  return (
    <Card className="rounded-2xl shadow-card border-border overflow-hidden">
      <div className="h-2" style={{ backgroundColor: "#0F5B3A" }} />
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-2xl">{info.emoji}</span>
            <h3 className="font-bold text-foreground mt-1">{info.name}</h3>
            <p className="text-xs text-muted-foreground">{info.desc}</p>
          </div>
          <span
            className="text-xs font-semibold px-2 py-1 rounded-full"
            style={{ backgroundColor: "#E8F5EE", color: "#0F5B3A" }}
          >
            {Math.round(progress)}%
          </span>
        </div>

        <div className="mb-1 flex justify-between items-center text-xs text-muted-foreground">
          <span>
            Raised: <strong>{formatAmount(total, currency)}</strong>
          </span>
          <div className="flex items-center gap-1">
            {editing ? (
              <>
                <span className="text-muted-foreground">Goal:</span>
                <input
                  ref={inputRef}
                  className="w-24 border rounded px-1 py-0.5 text-xs text-foreground"
                  style={{ borderColor: "#0F5B3A" }}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                    if (e.key === "Escape") setEditing(false);
                  }}
                  data-ocid="fundraising.input"
                />
                <button
                  type="button"
                  className="text-green-700 hover:text-green-900"
                  onClick={handleSave}
                  title="Save"
                  data-ocid="fundraising.save_button"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => setEditing(false)}
                  title="Cancel"
                  data-ocid="fundraising.cancel_button"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                <span>Goal: {formatAmount(goal, currency)}</span>
                {isAdmin && (
                  <button
                    type="button"
                    className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setEditing(true)}
                    title="Edit goal"
                    data-ocid="fundraising.edit_button"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <Progress
          value={progress}
          className="h-2 rounded-full mb-4"
          style={{ "--progress-background": "#0F5B3A" } as React.CSSProperties}
        />
        <Button
          className="w-full rounded-xl font-semibold text-white"
          style={{ backgroundColor: "#B8944E" }}
          onClick={() => onDonate(category)}
          data-ocid="fundraising.primary_button"
        >
          Donate Now
        </Button>
      </CardContent>
    </Card>
  );
}

export function FundraisingSection() {
  const [currency, setCurrency] = useState<Currency>(Currency.RWF);
  const [donateCategory, setDonateCategory] =
    useState<ContributionCategory | null>(null);
  const [goals, setGoals] =
    useState<Record<ContributionCategory, number>>(loadGoals);
  const { data: isAdmin = false } = useIsAdmin();

  const handleGoalChange = (cat: ContributionCategory, newGoal: number) => {
    const updated = { ...goals, [cat]: newGoal };
    setGoals(updated);
    saveGoals(updated);
  };

  return (
    <section id="features" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Fundraising Dashboard
            </h2>
            <p className="text-muted-foreground mt-1">
              Track campaigns & contribute to community growth
            </p>
          </div>
          <Select
            value={currency}
            onValueChange={(v) => setCurrency(v as Currency)}
          >
            <SelectTrigger
              className="w-32 rounded-xl"
              data-ocid="fundraising.select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Currency.RWF}>🇷🇼 RWF</SelectItem>
              <SelectItem value={Currency.USD}>🇺🇸 USD</SelectItem>
              <SelectItem value={Currency.KES}>🇰🇪 KES</SelectItem>
              <SelectItem value={Currency.UGX}>🇺🇬 UGX</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TotalRaisedBanner currency={currency} />

        <div className="grid sm:grid-cols-3 gap-6">
          {(
            [
              ContributionCategory.Irayidi,
              ContributionCategory.ZakatulFitr,
              ContributionCategory.Musabaka,
            ] as ContributionCategory[]
          ).map((cat, i) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <CampaignCard
                category={cat}
                currency={currency}
                goal={goals[cat]}
                isAdmin={isAdmin}
                onDonate={setDonateCategory}
                onGoalChange={handleGoalChange}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <DonationModal
        open={!!donateCategory}
        onOpenChange={(open) => {
          if (!open) setDonateCategory(null);
        }}
        defaultCategory={donateCategory || ContributionCategory.Irayidi}
      />
    </section>
  );
}
