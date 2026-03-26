import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Download, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import {
  AnnouncementCategory,
  ContributionCategory,
  Currency,
} from "../backend.d";
import { SAMPLE_CONTRIBUTIONS } from "../data/sampleData";
import {
  useAddAnnouncement,
  useAnnouncements,
  useContributionTotal,
  useContributionsByCategory,
  useCreateMeeting,
  useDeleteAnnouncement,
  useDeleteContribution,
  useMeetings,
} from "../hooks/useQueries";
import { formatAmount, formatDate } from "../utils/formatters";

export function AdminDashboard() {
  const { data: irayidiTotal = 0 } = useContributionTotal(
    ContributionCategory.Irayidi,
  );
  const { data: zakatTotal = 0 } = useContributionTotal(
    ContributionCategory.ZakatulFitr,
  );
  const { data: musabakaTotal = 0 } = useContributionTotal(
    ContributionCategory.Musabaka,
  );
  const { data: irayidiList = [] } = useContributionsByCategory(
    ContributionCategory.Irayidi,
  );
  const { data: zakatList = [] } = useContributionsByCategory(
    ContributionCategory.ZakatulFitr,
  );
  const { data: musabakaList = [] } = useContributionsByCategory(
    ContributionCategory.Musabaka,
  );
  const { data: announcements = [] } = useAnnouncements();
  const { data: meetings = [] } = useMeetings();
  const deleteContribution = useDeleteContribution();
  const deleteAnnouncement = useDeleteAnnouncement();
  const addAnnouncement = useAddAnnouncement();
  const createMeeting = useCreateMeeting();

  const allContributions = [...irayidiList, ...zakatList, ...musabakaList];

  const [meetingForm, setMeetingForm] = useState({
    title: "",
    date: "",
    location: "",
    agenda: "",
  });
  const setMF = (k: string, v: string) =>
    setMeetingForm((p) => ({ ...p, [k]: v }));

  const [annForm, setAnnForm] = useState({
    title: "",
    body: "",
    category: AnnouncementCategory.general,
    pinned: false,
  });
  const setAF = (k: string, v: string | boolean) =>
    setAnnForm((p) => ({ ...p, [k]: v }));

  const handleExport = () => {
    const data =
      allContributions.length > 0 ? allContributions : SAMPLE_CONTRIBUTIONS;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bmc-contributions-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported!");
  };

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingForm.title || !meetingForm.date || !meetingForm.location) {
      toast.error("Fill all required fields");
      return;
    }
    try {
      await createMeeting.mutateAsync({
        title: meetingForm.title,
        date: BigInt(new Date(meetingForm.date).getTime()) * 1_000_000n,
        location: meetingForm.location,
        agenda: meetingForm.agenda,
        minutes: undefined,
      });
      toast.success("Meeting created!");
      setMeetingForm({ title: "", date: "", location: "", agenda: "" });
    } catch {
      toast.error("Failed to create meeting");
    }
  };

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annForm.title || !annForm.body) {
      toast.error("Fill all required fields");
      return;
    }
    try {
      await addAnnouncement.mutateAsync({
        title: annForm.title,
        body: annForm.body,
        category: annForm.category,
        pinned: annForm.pinned,
        date: BigInt(Date.now()) * 1_000_000n,
      });
      toast.success("Announcement posted!");
      setAnnForm({
        title: "",
        body: "",
        category: AnnouncementCategory.general,
        pinned: false,
      });
    } catch {
      toast.error("Failed to post announcement");
    }
  };

  const chartData = [
    { name: "Irayidi", amount: irayidiTotal, fill: "#0F5B3A" },
    { name: "Zakatul Fitr", amount: zakatTotal, fill: "#B8944E" },
    { name: "Musabaka", amount: musabakaTotal, fill: "#1a7a50" },
  ];

  const summaryItems = [
    { label: "Irayidi Total", value: irayidiTotal, color: "#0F5B3A" },
    { label: "Zakatul Fitr", value: zakatTotal, color: "#B8944E" },
    { label: "Musabaka Total", value: musabakaTotal, color: "#1a7a50" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-sm">
              Bugesera Muslim Community — Full Management
            </p>
          </div>
          <Button
            type="button"
            onClick={handleExport}
            variant="outline"
            className="rounded-xl"
            data-ocid="admin.primary_button"
          >
            <Download className="w-4 h-4 mr-2" /> Export Data
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {summaryItems.map((item) => (
            <Card key={item.label} className="rounded-2xl shadow-card">
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {item.label}
                </p>
                <p
                  className="text-2xl font-bold mt-1"
                  style={{ color: item.color }}
                >
                  {formatAmount(item.value, Currency.RWF)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="rounded-xl mb-6" data-ocid="admin.tab">
            <TabsTrigger value="overview">Financial Overview</TabsTrigger>
            <TabsTrigger value="contributions">Contributions</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="rounded-2xl shadow-card">
              <CardHeader>
                <CardTitle style={{ color: "#0F5B3A" }}>
                  Contributions by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                    <Tooltip
                      formatter={(v: number) => [
                        formatAmount(v, Currency.RWF),
                        "Amount",
                      ]}
                    />
                    <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contributions">
            <Card className="rounded-2xl shadow-card">
              <CardHeader>
                <CardTitle style={{ color: "#0F5B3A" }}>
                  All Contributions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table data-ocid="admin.table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allContributions.map((c, i) => (
                      <TableRow
                        key={`${c.donorName}-${c.category}-${i}`}
                        data-ocid={`admin.row.${i + 1}`}
                      >
                        <TableCell className="font-medium">
                          {c.donorName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{c.category}</Badge>
                        </TableCell>
                        <TableCell
                          className="font-semibold"
                          style={{ color: "#0F5B3A" }}
                        >
                          {formatAmount(c.amount, Currency.RWF)}
                        </TableCell>
                        <TableCell>{c.paymentMethod}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(c.timestamp)}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={async () => {
                              try {
                                const id = (c as { id?: bigint }).id;
                                if (id !== undefined)
                                  await deleteContribution.mutateAsync(id);
                                else toast.error("Cannot delete sample data");
                              } catch {
                                toast.error("Delete failed");
                              }
                            }}
                            className="text-destructive hover:text-destructive"
                            data-ocid={`admin.delete_button.${i + 1}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meetings">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="rounded-2xl shadow-card">
                <CardHeader>
                  <CardTitle style={{ color: "#0F5B3A" }}>
                    Create Meeting
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateMeeting} className="space-y-4">
                    <div>
                      <Label>Title *</Label>
                      <Input
                        placeholder="Meeting title"
                        value={meetingForm.title}
                        onChange={(e) => setMF("title", e.target.value)}
                        className="rounded-xl mt-1"
                        data-ocid="admin.input"
                      />
                    </div>
                    <div>
                      <Label>Date *</Label>
                      <Input
                        type="datetime-local"
                        value={meetingForm.date}
                        onChange={(e) => setMF("date", e.target.value)}
                        className="rounded-xl mt-1"
                        data-ocid="admin.input"
                      />
                    </div>
                    <div>
                      <Label>Location *</Label>
                      <Input
                        placeholder="Location"
                        value={meetingForm.location}
                        onChange={(e) => setMF("location", e.target.value)}
                        className="rounded-xl mt-1"
                        data-ocid="admin.input"
                      />
                    </div>
                    <div>
                      <Label>Agenda</Label>
                      <Textarea
                        placeholder="Meeting agenda..."
                        value={meetingForm.agenda}
                        onChange={(e) => setMF("agenda", e.target.value)}
                        className="rounded-xl mt-1"
                        rows={3}
                        data-ocid="admin.textarea"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={createMeeting.isPending}
                      className="rounded-xl bg-primary text-white w-full"
                      data-ocid="admin.submit_button"
                    >
                      {createMeeting.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="mr-2 h-4 w-4" />
                      )}
                      Create Meeting
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-card">
                <CardHeader>
                  <CardTitle style={{ color: "#0F5B3A" }}>
                    Existing Meetings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {meetings.map((m, i) => (
                    <div
                      key={m.title}
                      className="p-3 rounded-xl bg-muted"
                      data-ocid={`admin.item.${i + 1}`}
                    >
                      <p className="font-medium text-sm">{m.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(m.date)} · {m.location}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="announcements">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="rounded-2xl shadow-card">
                <CardHeader>
                  <CardTitle style={{ color: "#0F5B3A" }}>
                    Post Announcement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePostAnnouncement} className="space-y-4">
                    <div>
                      <Label>Title *</Label>
                      <Input
                        placeholder="Announcement title"
                        value={annForm.title}
                        onChange={(e) => setAF("title", e.target.value)}
                        className="rounded-xl mt-1"
                        data-ocid="admin.input"
                      />
                    </div>
                    <div>
                      <Label>Body *</Label>
                      <Textarea
                        placeholder="Message..."
                        value={annForm.body}
                        onChange={(e) => setAF("body", e.target.value)}
                        className="rounded-xl mt-1"
                        rows={4}
                        data-ocid="admin.textarea"
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select
                        value={annForm.category}
                        onValueChange={(v) => setAF("category", v)}
                      >
                        <SelectTrigger
                          className="rounded-xl mt-1"
                          data-ocid="admin.select"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={AnnouncementCategory.urgent}>
                            🚨 Urgent
                          </SelectItem>
                          <SelectItem value={AnnouncementCategory.event}>
                            🎉 Event
                          </SelectItem>
                          <SelectItem value={AnnouncementCategory.general}>
                            📢 General
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={annForm.pinned}
                        onCheckedChange={(v) => setAF("pinned", v)}
                        id="pinned"
                        data-ocid="admin.switch"
                      />
                      <Label htmlFor="pinned">Pin this announcement</Label>
                    </div>
                    <Button
                      type="submit"
                      disabled={addAnnouncement.isPending}
                      className="rounded-xl bg-primary text-white w-full"
                      data-ocid="admin.submit_button"
                    >
                      {addAnnouncement.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Post Announcement
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-card">
                <CardHeader>
                  <CardTitle style={{ color: "#0F5B3A" }}>
                    Existing Announcements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {announcements.map((ann, i) => (
                    <div
                      key={ann.title}
                      className="p-3 rounded-xl bg-muted flex justify-between items-start"
                      data-ocid={`admin.item.${i + 1}`}
                    >
                      <div>
                        <p className="font-medium text-sm">{ann.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {ann.category} · {formatDate(ann.date)}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={async () => {
                          try {
                            const id = (ann as { id?: bigint }).id;
                            if (id !== undefined)
                              await deleteAnnouncement.mutateAsync(id);
                            else toast.error("Cannot delete sample data");
                          } catch {
                            toast.error("Delete failed");
                          }
                        }}
                        className="text-destructive hover:text-destructive"
                        data-ocid={`admin.delete_button.${i + 1}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
