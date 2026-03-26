import Time "mo:core/Time";
import List "mo:core/List";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Authorization "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = Authorization.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type Currency = { #RWF; #USD; #KES; #UGX };
  type PaymentMethod = { #MTN; #Airtel; #Bank };
  type ContributionCategory = {
    #Irayidi;
    #ZakatulFitr;
    #Musabaka;
  };

  type Contribution = {
    donorName : Text;
    amount : Float;
    currency : Currency;
    paymentMethod : PaymentMethod;
    timestamp : Time.Time;
    category : ContributionCategory;
    note : ?Text;
    member : ?Principal;
  };

  type Meeting = {
    title : Text;
    date : Time.Time;
    agenda : Text;
    location : Text;
    minutes : ?Text;
  };

  type MeetingComment = {
    memberName : Text;
    comment : Text;
    timestamp : Time.Time;
    meetingId : Nat;
  };

  type AnnouncementCategory = { #urgent; #event; #general };
  type Announcement = {
    title : Text;
    body : Text;
    category : AnnouncementCategory;
    date : Time.Time;
    pinned : Bool;
  };

  public type UserProfile = {
    name : Text;
  };

  module Contribution {
    public func compare(a : Contribution, b : Contribution) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  module Meeting {
    public func compare(a : Meeting, b : Meeting) : Order.Order {
      Int.compare(a.date, b.date);
    };
  };

  module MeetingComment {
    public func compare(a : MeetingComment, b : MeetingComment) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  module Announcement {
    public func compare(a : Announcement, b : Announcement) : Order.Order {
      Int.compare(a.date, b.date);
    };
  };

  module Nat {
    public func compare(a : Nat, b : Nat) : Order.Order {
      Int.compare(a, b);
    };
  };

  let contributions = Map.empty<Nat, Contribution>();
  let meetings = Map.empty<Nat, Meeting>();
  let meetingComments = Map.empty<Nat, MeetingComment>();
  let announcements = Map.empty<Nat, Announcement>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextContributionId = 0;
  var nextMeetingId = 0;
  var nextCommentId = 0;
  var nextAnnouncementId = 0;

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not Authorization.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Contributions Module
  public shared ({ caller }) func addContribution(contribution : Contribution) : async Nat {
    // Only authenticated users can make contributions
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can make contributions");
    };
    let contributionId = nextContributionId;
    nextContributionId += 1;
    contributions.add(contributionId, {
      contribution with
      timestamp = Time.now();
      member = ?caller;
    });
    contributionId;
  };

  public query ({ caller }) func getContributionsByCategory(category : ContributionCategory) : async [Contribution] {
    // Public can view contributions
    contributions.values().toArray().filter(func(c) { c.category == category }).sort();
  };

  public query ({ caller }) func getContributionTotalsByCategory(category : ContributionCategory) : async Float {
    // Public can view totals
    var total = 0.0;
    contributions.values().toArray().forEach(
      func(c) {
        if (c.category == category) { total += c.amount };
      }
    );
    total;
  };

  public shared ({ caller }) func deleteContribution(contributionId : Nat) : async Bool {
    if (not (Authorization.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete contributions");
    };
    if (not contributions.containsKey(contributionId)) { return false };
    contributions.remove(contributionId);
    true;
  };

  // Meetings Module
  public shared ({ caller }) func createMeeting(meeting : Meeting) : async Nat {
    if (not (Authorization.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create meetings");
    };
    let meetingId = nextMeetingId;
    nextMeetingId += 1;
    meetings.add(meetingId, {
      meeting with
      date = Time.now();
      minutes = null;
    });
    meetingId;
  };

  public shared ({ caller }) func addMeetingComment(meetingId : Nat, memberName : Text, comment : Text) : async Nat {
    // Members and admins can add comments
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add comments");
    };
    if (not meetings.containsKey(meetingId)) {
      Runtime.trap("Meeting does not exist");
    };
    let commentId = nextCommentId;
    nextCommentId += 1;
    meetingComments.add(commentId, {
      memberName;
      comment;
      timestamp = Time.now();
      meetingId;
    });
    commentId;
  };

  public query ({ caller }) func getAllMeetings() : async [Meeting] {
    // Public can view meetings
    meetings.values().toArray().sort();
  };

  public query ({ caller }) func getMeetingComments(meetingId : Nat) : async [MeetingComment] {
    // Public can view comments
    meetingComments.values().toArray().filter(func(c) { c.meetingId == meetingId }).sort();
  };

  // Announcements Module
  public shared ({ caller }) func addAnnouncement(announcement : Announcement) : async Nat {
    if (not (Authorization.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create announcements");
    };
    let announcementId = nextAnnouncementId;
    nextAnnouncementId += 1;
    announcements.add(announcementId, {
      announcement with
      date = Time.now();
      pinned = false;
    });
    announcementId;
  };

  public shared ({ caller }) func pinAnnouncement(announcementId : Nat) : async Bool {
    if (not (Authorization.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can pin announcements");
    };
    switch (announcements.get(announcementId)) {
      case (null) { false };
      case (?announcement) {
        announcements.add(announcementId, { announcement with pinned = true });
        true;
      };
    };
  };

  public query ({ caller }) func getAllAnnouncements() : async [Announcement] {
    // Public can view announcements
    announcements.values().toArray().sort();
  };

  public shared ({ caller }) func deleteAnnouncement(announcementId : Nat) : async Bool {
    if (not (Authorization.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete announcements");
    };
    if (not announcements.containsKey(announcementId)) { return false };
    announcements.remove(announcementId);
    true;
  };
};
