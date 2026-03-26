import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, MessageCircle, Send, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AnnouncementCategory,
  ContributionCategory,
  Currency,
} from "../backend.d";
import { DonationModal } from "../components/DonationModal";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddMeetingComment,
  useAnnouncements,
  useContributionsByCategory,
  useMeetingComments,
  useMeetings,
  useSaveProfile,
  useUserProfile,
} from "../hooks/useQueries";
import { formatAmount, formatDate } from "../utils/formatters";

function AnnouncementBadge({ cat }: { cat: AnnouncementCategory }) {
  if (cat === AnnouncementCategory.urgent)
    return <Badge className="bg-red-100 text-red-700 border-0">Urgent</Badge>;
  if (cat === AnnouncementCategory.event)
    return (
      <Badge className="bg-amber-100 text-amber-700 border-0">Event</Badge>
    );
  return <Badge className="bg-gray-100 text-gray-600 border-0">General</Badge>;
}

function MeetingCard({
  meeting,
  idx,
}: {
  meeting: {
    id?: bigint;
    title: string;
    date: bigint;
    location: string;
    agenda: string;
  };
  idx: number;
}) {
  const [comment, setComment] = useState("");
  const [open, setOpen] = useState(false);
  const meetingId = meeting.id ?? BigInt(idx);
  const { data: comments = [] } = useMeetingComments(meetingId);
  const addComment = useAddMeetingComment();
  const { identity } = useInternetIdentity();

  const handleComment = async () => {
    if (!comment.trim()) return;
    try {
      await addComment.mutateAsync({
        meetingId,
        memberName: identity?.getPrincipal().toString().slice(0, 8) || "Member",
        comment,
      });
      setComment("");
      toast.success("Comment added!");
    } catch {
      toast.error("Failed to add comment");
    }
  };

  return (
    <Card
      className="rounded-2xl shadow-card"
      data-ocid={`meetings.item.${idx}`}
    >
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-foreground">{meeting.title}</h3>
          <span className="text-xs text-muted-foreground">
            {formatDate(meeting.date)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          📍 {meeting.location}
        </p>
        <details className="mb-3">
          <summary className="text-sm cursor-pointer text-primary font-medium">
            View Agenda
          </summary>
          <pre className="text-xs text-muted-foreground mt-2 whitespace-pre-wrap">
            {meeting.agenda}
          </pre>
        </details>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-xl"
          onClick={() => setOpen(!open)}
          data-ocid={`meetings.open_modal_button.${idx}`}
        >
          <MessageCircle className="w-4 h-4 mr-1" /> Comments ({comments.length}
          )
        </Button>
        {open && (
          <div className="mt-3 space-y-2">
            {comments.map((c) => (
              <div
                key={`${c.memberName}-${c.comment}`}
                className="bg-muted rounded-xl p-3 text-sm"
              >
                <span className="font-medium">{c.memberName}:</span> {c.comment}
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="rounded-xl flex-1"
                data-ocid={`meetings.input.${idx}`}
              />
              <Button
                type="button"
                size="sm"
                onClick={handleComment}
                disabled={addComment.isPending}
                className="rounded-xl bg-primary text-white"
                data-ocid={`meetings.submit_button.${idx}`}
              >
                {addComment.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function MemberDashboard() {
  const { data: announcements = [] } = useAnnouncements();
  const { data: meetings = [] } = useMeetings();
  const { data: myIrayidi = [] } = useContributionsByCategory(
    ContributionCategory.Irayidi,
  );
  const { data: myZakat = [] } = useContributionsByCategory(
    ContributionCategory.ZakatulFitr,
  );
  const { data: myMusabaka = [] } = useContributionsByCategory(
    ContributionCategory.Musabaka,
  );
  const { data: profile } = useUserProfile();
  const saveProfile = useSaveProfile();
  const { identity } = useInternetIdentity();
  const [name, setName] = useState(profile?.name || "");
  const [donateOpen, setDonateOpen] = useState(false);

  const zakatPaid = myZakat.length > 0;
  const allContributions = [...myIrayidi, ...myZakat, ...myMusabaka];

  const handleSave = async () => {
    try {
      await saveProfile.mutateAsync(name);
      toast.success("Profile saved!");
    } catch {
      toast.error("Failed to save profile");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {identity?.getPrincipal().toString().slice(0, 16)}...
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setDonateOpen(true)}
            className="rounded-xl text-white font-semibold"
            style={{ backgroundColor: "#B8944E" }}
            data-ocid="member.primary_button"
          >
            + Contribute
          </Button>
        </div>

        <Tabs defaultValue="contributions">
          <TabsList className="rounded-xl mb-6" data-ocid="member.tab">
            <TabsTrigger value="contributions">My Contributions</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="contributions">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-muted-foreground">
                Zakatul Fitr status:
              </span>
              {zakatPaid ? (
                <Badge className="bg-green-100 text-green-700 border-0">
                  ✓ Paid
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-700 border-0">
                  ✗ Unpaid
                </Badge>
              )}
            </div>
            {allContributions.length === 0 ? (
              <Card className="rounded-2xl">
                <CardContent
                  className="py-12 text-center text-muted-foreground"
                  data-ocid="contributions.empty_state"
                >
                  No contributions yet. Start giving today!
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {allContributions.map((c, i) => (
                  <Card
                    key={`${c.donorName}-${c.category}-${i}`}
                    className="rounded-2xl"
                    data-ocid={`contributions.item.${i + 1}`}
                  >
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-foreground">
                          {c.category}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {c.paymentMethod} · {formatDate(c.timestamp)}
                        </p>
                      </div>
                      <span className="font-bold" style={{ color: "#0F5B3A" }}>
                        {formatAmount(c.amount, Currency.RWF)}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="meetings">
            <div className="space-y-4">
              {meetings.map((m, i) => (
                <MeetingCard key={m.title} meeting={m} idx={i + 1} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="announcements">
            <div className="space-y-4">
              {announcements.map((ann, i) => (
                <Card
                  key={ann.title}
                  className="rounded-2xl"
                  data-ocid={`announcements.item.${i + 1}`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <AnnouncementBadge cat={ann.category} />
                          {ann.pinned && <span>📌</span>}
                        </div>
                        <h3 className="font-semibold text-foreground">
                          {ann.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {ann.body}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(ann.date)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="rounded-2xl max-w-md">
              <CardHeader>
                <CardTitle
                  className="flex items-center gap-2"
                  style={{ color: "#0F5B3A" }}
                >
                  <User className="w-5 h-5" /> Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="profileName">Display Name</Label>
                  <Input
                    id="profileName"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl mt-1"
                    data-ocid="profile.input"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={saveProfile.isPending}
                  className="rounded-xl bg-primary text-white w-full"
                  data-ocid="profile.save_button"
                >
                  {saveProfile.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <DonationModal open={donateOpen} onOpenChange={setDonateOpen} />
    </div>
  );
}
