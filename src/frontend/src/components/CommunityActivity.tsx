import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Megaphone } from "lucide-react";
import { AnnouncementCategory } from "../backend.d";
import { useAnnouncements, useMeetings } from "../hooks/useQueries";
import { formatDate, formatDateShort } from "../utils/formatters";

function categoryStyle(cat: AnnouncementCategory) {
  if (cat === AnnouncementCategory.urgent)
    return { label: "Urgent", className: "bg-red-100 text-red-700" };
  if (cat === AnnouncementCategory.event)
    return { label: "Event", className: "bg-amber-100 text-amber-700" };
  return { label: "General", className: "bg-gray-100 text-gray-600" };
}

export function CommunityActivity() {
  const { data: announcements = [] } = useAnnouncements();
  const { data: meetings = [] } = useMeetings();

  return (
    <section id="community" className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Community Activity
          </h2>
          <p className="text-muted-foreground mt-1">
            Announcements & upcoming meetings
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Announcements */}
          <Card className="rounded-2xl shadow-card">
            <CardHeader className="pb-3">
              <CardTitle
                className="flex items-center gap-2 text-lg"
                style={{ color: "#0F5B3A" }}
              >
                <Megaphone className="w-5 h-5" />
                Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {announcements.slice(0, 3).map((ann, i) => {
                const style = categoryStyle(ann.category);
                return (
                  <div
                    key={ann.title}
                    className="flex gap-3"
                    data-ocid={`announcements.item.${i + 1}`}
                  >
                    <div className="text-center min-w-[48px]">
                      <div
                        className="rounded-lg px-1 py-2 text-xs font-bold"
                        style={{ backgroundColor: "#E8F5EE", color: "#0F5B3A" }}
                      >
                        {formatDateShort(ann.date)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          className={`text-xs ${style.className} border-0`}
                        >
                          {style.label}
                        </Badge>
                        {ann.pinned && <span className="text-xs">📌</span>}
                      </div>
                      <p className="font-semibold text-sm text-foreground line-clamp-2">
                        {ann.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {ann.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Meetings */}
          <Card className="rounded-2xl shadow-card">
            <CardHeader className="pb-3">
              <CardTitle
                className="flex items-center gap-2 text-lg"
                style={{ color: "#0F5B3A" }}
              >
                <Calendar className="w-5 h-5" />
                Upcoming Meetings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {meetings.slice(0, 3).map((meeting, i) => (
                <div
                  key={meeting.title}
                  className="flex gap-3"
                  data-ocid={`meetings.item.${i + 1}`}
                >
                  <div className="text-center min-w-[48px]">
                    <div
                      className="rounded-lg px-1 py-2 text-xs font-bold"
                      style={{ backgroundColor: "#FEF3E2", color: "#B8944E" }}
                    >
                      {formatDateShort(meeting.date)}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {meeting.title}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {meeting.location}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
