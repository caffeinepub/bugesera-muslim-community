# Bugesera Muslim Community

## Current State
AdminDashboard has 4 tabs: Financial Overview, Contributions, Meetings, Announcements. Backend supports role assignment via `assignCallerUserRole`. No user management UI exists yet.

## Requested Changes (Diff)

### Add
- New "Users" tab in AdminDashboard
- User list managed in localStorage (array of {id, name, principal, role, blocked})
- Add User form: name, principal (optional), role selector (admin/user/guest)
- Edit User: inline edit for name and role via a dialog/modal
- Block/Unblock toggle per user (sets blocked flag in localStorage)
- Visual indicator for blocked users (red badge)

### Modify
- AdminDashboard: add Users tab to the TabsList and TabsContent

### Remove
- Nothing removed

## Implementation Plan
1. Add Users tab UI to AdminDashboard.tsx with localStorage state for user list
2. Add/Edit user form using Dialog
3. Block/unblock toggle button per user row
