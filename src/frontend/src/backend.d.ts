import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Meeting {
    title: string;
    date: Time;
    minutes?: string;
    agenda: string;
    location: string;
}
export interface Contribution {
    member?: Principal;
    paymentMethod: PaymentMethod;
    note?: string;
    donorName: string;
    currency: Currency;
    timestamp: Time;
    category: ContributionCategory;
    amount: number;
}
export interface Announcement {
    title: string;
    body: string;
    date: Time;
    pinned: boolean;
    category: AnnouncementCategory;
}
export interface MeetingComment {
    comment: string;
    memberName: string;
    timestamp: Time;
    meetingId: bigint;
}
export interface UserProfile {
    name: string;
}
export enum AnnouncementCategory {
    event = "event",
    urgent = "urgent",
    general = "general"
}
export enum ContributionCategory {
    Musabaka = "Musabaka",
    Irayidi = "Irayidi",
    ZakatulFitr = "ZakatulFitr"
}
export enum Currency {
    KES = "KES",
    RWF = "RWF",
    UGX = "UGX",
    USD = "USD"
}
export enum PaymentMethod {
    MTN = "MTN",
    Bank = "Bank",
    Airtel = "Airtel"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAnnouncement(announcement: Announcement): Promise<bigint>;
    addContribution(contribution: Contribution): Promise<bigint>;
    addMeetingComment(meetingId: bigint, memberName: string, comment: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createMeeting(meeting: Meeting): Promise<bigint>;
    deleteAnnouncement(announcementId: bigint): Promise<boolean>;
    deleteContribution(contributionId: bigint): Promise<boolean>;
    getAllAnnouncements(): Promise<Array<Announcement>>;
    getAllMeetings(): Promise<Array<Meeting>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContributionTotalsByCategory(category: ContributionCategory): Promise<number>;
    getContributionsByCategory(category: ContributionCategory): Promise<Array<Contribution>>;
    getMeetingComments(meetingId: bigint): Promise<Array<MeetingComment>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    pinAnnouncement(announcementId: bigint): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
