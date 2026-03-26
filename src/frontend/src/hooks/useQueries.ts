import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Announcement,
  Contribution,
  ContributionCategory,
  Meeting,
} from "../backend.d";
import {
  SAMPLE_ANNOUNCEMENTS,
  SAMPLE_CONTRIBUTIONS,
  SAMPLE_MEETINGS,
} from "../data/sampleData";
import { useActor } from "./useActor";

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    initialData: false,
  });
}

export function useUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userRole"],
    queryFn: async () => {
      if (!actor) return "guest";
      try {
        return await actor.getCallerUserRole();
      } catch {
        return "guest";
      }
    },
    enabled: !!actor && !isFetching,
    initialData: "guest" as string,
  });
}

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCallerUserProfile();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAnnouncements() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      if (!actor) return SAMPLE_ANNOUNCEMENTS;
      try {
        const result = await actor.getAllAnnouncements();
        return result.length > 0 ? result : SAMPLE_ANNOUNCEMENTS;
      } catch {
        return SAMPLE_ANNOUNCEMENTS;
      }
    },
    enabled: !!actor && !isFetching,
    initialData: SAMPLE_ANNOUNCEMENTS,
  });
}

export function useMeetings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["meetings"],
    queryFn: async () => {
      if (!actor) return SAMPLE_MEETINGS;
      try {
        const result = await actor.getAllMeetings();
        return result.length > 0 ? result : SAMPLE_MEETINGS;
      } catch {
        return SAMPLE_MEETINGS;
      }
    },
    enabled: !!actor && !isFetching,
    initialData: SAMPLE_MEETINGS,
  });
}

export function useContributionsByCategory(category: ContributionCategory) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["contributions", category],
    queryFn: async () => {
      if (!actor)
        return SAMPLE_CONTRIBUTIONS.filter((c) => c.category === category);
      try {
        const result = await actor.getContributionsByCategory(category);
        return result.length > 0
          ? result
          : SAMPLE_CONTRIBUTIONS.filter((c) => c.category === category);
      } catch {
        return SAMPLE_CONTRIBUTIONS.filter((c) => c.category === category);
      }
    },
    enabled: !!actor && !isFetching,
    initialData: SAMPLE_CONTRIBUTIONS.filter((c) => c.category === category),
  });
}

export function useContributionTotal(category: ContributionCategory) {
  const { actor, isFetching } = useActor();
  const sampleTotal = SAMPLE_CONTRIBUTIONS.filter(
    (c) => c.category === category,
  ).reduce((s, c) => s + c.amount, 0);
  return useQuery({
    queryKey: ["contributionTotal", category],
    queryFn: async () => {
      if (!actor) return sampleTotal;
      try {
        const result = await actor.getContributionTotalsByCategory(category);
        return result > 0 ? result : sampleTotal;
      } catch {
        return sampleTotal;
      }
    },
    enabled: !!actor && !isFetching,
    initialData: sampleTotal,
  });
}

export function useMeetingComments(meetingId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["meetingComments", meetingId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getMeetingComments(meetingId);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    initialData: [],
  });
}

export function useAddContribution() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (contribution: Contribution) => {
      if (!actor) throw new Error("Not connected");
      return actor.addContribution(contribution);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contributions"] });
      qc.invalidateQueries({ queryKey: ["contributionTotal"] });
    },
  });
}

export function useAddAnnouncement() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ann: Announcement) => {
      if (!actor) throw new Error("Not connected");
      return actor.addAnnouncement(ann);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
}

export function useDeleteAnnouncement() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteAnnouncement(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
}

export function useCreateMeeting() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (meeting: Meeting) => {
      if (!actor) throw new Error("Not connected");
      return actor.createMeeting(meeting);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["meetings"] }),
  });
}

export function useAddMeetingComment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      meetingId,
      memberName,
      comment,
    }: { meetingId: bigint; memberName: string; comment: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addMeetingComment(meetingId, memberName, comment);
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({
        queryKey: ["meetingComments", vars.meetingId.toString()],
      }),
  });
}

export function useDeleteContribution() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteContribution(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contributions"] });
      qc.invalidateQueries({ queryKey: ["contributionTotal"] });
    },
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile({ name });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userProfile"] }),
  });
}
