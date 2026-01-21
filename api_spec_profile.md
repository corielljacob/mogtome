# Profile API Specification

This document outlines the API endpoints and data structures required for the FC member profile system.

---

## Overview

The profile system allows FC members to:
- Display their character info and FC membership
- Customize which "cards" appear on their profile
- Share availability, goals, and how they can help other members
- Upload screenshots

---

## Data Models

### Member Profile

The core profile data for a member.

```typescript
interface MemberProfile {
  // Identity (from Lodestone or stored)
  characterId: string;
  name: string;
  race: string;
  clan: string;
  
  // FC-specific
  freeCompanyRank: string;
  joinDate: Date;
  
  // User-editable fields
  bio: string;
  pronouns: string | null;
  timezone: string | null;
  languages: string[];
  voiceChat: string | null; // e.g., "Has mic, prefers text"
  discordUsername: string | null;
  
  // Lodestone stats (cached)
  itemLevel: number;
  achievementPoints: number;
  mountCount: number;
  minionCount: number;
  
  // Images
  avatarUrl: string;
  bannerUrl: string | null;
}
```

### Profile Cards

Controls which cards are visible and their display order.

```typescript
type CardId = 
  | 'main-jobs'
  | 'looking-for'
  | 'can-help'
  | 'crafting'
  | 'goals'
  | 'content-prefs'
  | 'availability'
  | 'discord'
  | 'fc-membership'
  | 'quick-info'
  | 'housing'
  | 'alts'
  | 'fc-roles'
  | 'wishlist'
  | 'screenshots';

interface ProfileCard {
  id: CardId;
  enabled: boolean;
  order: number;
}
```

### Card Data Models

Each card type has its own data structure:

```typescript
// Main Jobs
interface MainJob {
  name: string;      // "Samurai"
  abbrev: string;    // "SAM"
  level: number;     // 100
  role: 'tank' | 'healer' | 'dps' | 'crafter' | 'gatherer';
}

// Goals with progress tracking
interface Goal {
  id: string;
  text: string;
  progress: number; // 0-100
}

// Content preferences
interface ContentPreferences {
  loves: string[];
  likes: string[];
  notInterested: string[];
}

// Weekly availability
interface Availability {
  timezone: string;
  schedule: {
    Mon: DaySchedule;
    Tue: DaySchedule;
    Wed: DaySchedule;
    Thu: DaySchedule;
    Fri: DaySchedule;
    Sat: DaySchedule;
    Sun: DaySchedule;
  };
}

interface DaySchedule {
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
}

// Housing
interface Housing {
  hasHouse: boolean;
  type: 'Apartment' | 'Small' | 'Medium' | 'Large' | null;
  location: string | null; // "Mist, Ward 12"
  amenities: string[];
}

// Alt characters
interface AltCharacter {
  id: string;
  name: string;
  note: string | null;
}

// Screenshots
interface Screenshot {
  id: string;
  url: string;
  thumbnailUrl: string;
  uploadedAt: Date;
}
```

---

## API Endpoints

### Profile

#### Get Member Profile

```
GET /api/members/{characterId}/profile
```

**Response:**
```json
{
  "characterId": "12345678",
  "name": "Mochi Pawbeans",
  "race": "Miqo'te",
  "clan": "Keeper of the Moon",
  "freeCompanyRank": "Moogle Knight",
  "joinDate": "2022-03-15T00:00:00Z",
  "bio": "Sleepy cat who loves crafting...",
  "pronouns": "She/Her",
  "timezone": "EST",
  "languages": ["English", "Spanish"],
  "voiceChat": "Has mic, prefers text",
  "discordUsername": "mochi_pawbeans",
  "itemLevel": 710,
  "achievementPoints": 18450,
  "mountCount": 245,
  "minionCount": 312,
  "avatarUrl": "https://...",
  "bannerUrl": null
}
```

#### Update Member Profile

```
PATCH /api/members/{characterId}/profile
```

**Request Body** (partial update - only include fields to change):
```json
{
  "bio": "Updated bio text",
  "pronouns": "They/Them",
  "timezone": "PST"
}
```

**Response:** Updated profile object

---

### Profile Cards (Layout)

#### Get Profile Cards

```
GET /api/members/{characterId}/profile-cards
```

**Response:**
```json
{
  "cards": [
    { "id": "main-jobs", "enabled": true, "order": 0 },
    { "id": "looking-for", "enabled": true, "order": 1 },
    { "id": "can-help", "enabled": true, "order": 2 },
    { "id": "crafting", "enabled": false, "order": 3 },
    { "id": "goals", "enabled": true, "order": 4 },
    { "id": "content-prefs", "enabled": false, "order": 5 },
    { "id": "availability", "enabled": true, "order": 6 },
    { "id": "discord", "enabled": true, "order": 7 },
    { "id": "fc-membership", "enabled": true, "order": 8 },
    { "id": "quick-info", "enabled": true, "order": 9 },
    { "id": "housing", "enabled": true, "order": 10 },
    { "id": "alts", "enabled": false, "order": 11 },
    { "id": "fc-roles", "enabled": true, "order": 12 },
    { "id": "wishlist", "enabled": true, "order": 13 },
    { "id": "screenshots", "enabled": true, "order": 14 }
  ]
}
```

#### Update Profile Cards

```
PUT /api/members/{characterId}/profile-cards
```

**Request Body:**
```json
{
  "cards": [
    { "id": "main-jobs", "enabled": true, "order": 0 },
    { "id": "discord", "enabled": true, "order": 1 }
  ]
}
```

---

### Main Jobs

#### Get Main Jobs

```
GET /api/members/{characterId}/main-jobs
```

**Response:**
```json
{
  "jobs": [
    { "name": "Samurai", "abbrev": "SAM", "level": 100, "role": "dps" },
    { "name": "White Mage", "abbrev": "WHM", "level": 100, "role": "healer" },
    { "name": "Weaver", "abbrev": "WVR", "level": 100, "role": "crafter" }
  ]
}
```

#### Update Main Jobs

```
PUT /api/members/{characterId}/main-jobs
```

**Request Body:**
```json
{
  "jobs": [
    { "name": "Samurai", "abbrev": "SAM", "level": 100, "role": "dps" }
  ]
}
```

---

### Looking For

#### Get Looking For

```
GET /api/members/{characterId}/looking-for
```

**Response:**
```json
{
  "items": ["Savage Prog", "Map Parties", "Eureka", "Roulettes"]
}
```

#### Update Looking For

```
PUT /api/members/{characterId}/looking-for
```

**Request Body:**
```json
{
  "items": ["Savage Prog", "Map Parties"]
}
```

---

### Can Help With

#### Get Can Help

```
GET /api/members/{characterId}/can-help
```

**Response:**
```json
{
  "items": ["Crafting Gear", "Extremes", "Glamour Tips", "Mentoring"]
}
```

#### Update Can Help

```
PUT /api/members/{characterId}/can-help
```

**Request Body:**
```json
{
  "items": ["Crafting Gear", "Mentoring"]
}
```

---

### Crafting Services

#### Get Crafting Services

```
GET /api/members/{characterId}/crafting-services
```

**Response:**
```json
{
  "services": ["Raid Food", "HQ Gear", "Glamour Sets", "Housing Items"]
}
```

#### Update Crafting Services

```
PUT /api/members/{characterId}/crafting-services
```

**Request Body:**
```json
{
  "services": ["Raid Food", "HQ Gear"]
}
```

---

### Goals

#### Get Goals

```
GET /api/members/{characterId}/goals
```

**Response:**
```json
{
  "goals": [
    { "id": "goal-1", "text": "Complete Dawntrail Relic", "progress": 65 },
    { "id": "goal-2", "text": "Get all DT Mounts", "progress": 40 }
  ]
}
```

#### Update Goals

```
PUT /api/members/{characterId}/goals
```

**Request Body:**
```json
{
  "goals": [
    { "id": "goal-1", "text": "Complete Dawntrail Relic", "progress": 75 }
  ]
}
```

---

### Content Preferences

#### Get Content Preferences

```
GET /api/members/{characterId}/content-prefs
```

**Response:**
```json
{
  "loves": ["Extreme Trials", "Savage Raids", "Deep Dungeons", "Gold Saucer"],
  "likes": ["Alliance Raids", "Maps", "Hunts"],
  "notInterested": ["PvP", "Eureka"]
}
```

#### Update Content Preferences

```
PUT /api/members/{characterId}/content-prefs
```

**Request Body:**
```json
{
  "loves": ["Savage Raids"],
  "likes": ["Maps"],
  "notInterested": ["PvP"]
}
```

---

### Availability

#### Get Availability

```
GET /api/members/{characterId}/availability
```

**Response:**
```json
{
  "timezone": "EST",
  "schedule": {
    "Mon": { "morning": false, "afternoon": false, "evening": true },
    "Tue": { "morning": false, "afternoon": false, "evening": true },
    "Wed": { "morning": false, "afternoon": false, "evening": false },
    "Thu": { "morning": false, "afternoon": false, "evening": true },
    "Fri": { "morning": false, "afternoon": true, "evening": true },
    "Sat": { "morning": true, "afternoon": true, "evening": true },
    "Sun": { "morning": false, "afternoon": true, "evening": true }
  }
}
```

#### Update Availability

```
PUT /api/members/{characterId}/availability
```

**Request Body:** Same structure as response

---

### Housing

#### Get Housing

```
GET /api/members/{characterId}/housing
```

**Response:**
```json
{
  "hasHouse": true,
  "type": "Apartment",
  "location": "Mist, Ward 12",
  "amenities": ["Garden", "Orchestrion", "Striking Dummy"]
}
```

#### Update Housing

```
PUT /api/members/{characterId}/housing
```

**Request Body:** Same structure as response

---

### Alt Characters

#### Get Alts

```
GET /api/members/{characterId}/alts
```

**Response:**
```json
{
  "alts": [
    { "id": "alt-1", "name": "Momo Pawpad", "note": "Crafting alt" }
  ]
}
```

#### Update Alts

```
PUT /api/members/{characterId}/alts
```

**Request Body:**
```json
{
  "alts": [
    { "name": "Momo Pawpad", "note": "Crafting alt" }
  ]
}
```

---

### FC Roles/Contributions

#### Get FC Roles

```
GET /api/members/{characterId}/fc-roles
```

**Response:**
```json
{
  "roles": ["Crafter", "Event Helper", "Sprout Guide"]
}
```

#### Update FC Roles

```
PUT /api/members/{characterId}/fc-roles
```

**Request Body:**
```json
{
  "roles": ["Crafter"]
}
```

> **Note:** This endpoint may require admin approval or be admin-only depending on requirements.

---

### Wishlist

#### Get Wishlist

```
GET /api/members/{characterId}/wishlist
```

**Response:**
```json
{
  "items": [
    "Dawntrail Extreme Mounts",
    "Archeo Kingdom Gear",
    "Level Pictomancer"
  ]
}
```

#### Update Wishlist

```
PUT /api/members/{characterId}/wishlist
```

**Request Body:**
```json
{
  "items": ["Dawntrail Extreme Mounts"]
}
```

---

### Screenshots

#### Get Screenshots

```
GET /api/members/{characterId}/screenshots
```

**Response:**
```json
{
  "screenshots": [
    {
      "id": "ss-1",
      "url": "https://storage.example.com/screenshots/full/abc123.jpg",
      "thumbnailUrl": "https://storage.example.com/screenshots/thumb/abc123.jpg",
      "uploadedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Upload Screenshot

```
POST /api/members/{characterId}/screenshots
Content-Type: multipart/form-data
```

**Request Body:**
- `file`: Image file (JPEG, PNG, WebP)

**Response:**
```json
{
  "id": "ss-2",
  "url": "https://storage.example.com/screenshots/full/def456.jpg",
  "thumbnailUrl": "https://storage.example.com/screenshots/thumb/def456.jpg",
  "uploadedAt": "2024-01-20T14:00:00Z"
}
```

#### Delete Screenshot

```
DELETE /api/members/{characterId}/screenshots/{screenshotId}
```

**Response:** `204 No Content`

---

## Supporting Endpoints

### Preset Options

Returns predefined options for tag/dropdown selections. This keeps the UI consistent and allows easy updates.

```
GET /api/options
```

**Response:**
```json
{
  "lookingFor": [
    "Savage Prog",
    "Extreme Trials",
    "Criterion",
    "Ultimate Prog",
    "Map Parties",
    "Hunts",
    "Eureka",
    "Bozja",
    "Deep Dungeons",
    "Roulettes",
    "Treasure Maps",
    "Gold Saucer",
    "RP",
    "Casual Content"
  ],
  "canHelp": [
    "Mentoring",
    "Crafting Gear",
    "Crafting Food/Pots",
    "Tanking",
    "Healing",
    "Extreme Clears",
    "Savage Clears",
    "Glamour Tips",
    "Housing Decoration",
    "MSQ Help",
    "Dungeon Queues"
  ],
  "craftingServices": [
    "Raid Food",
    "Raid Pots",
    "HQ Gear",
    "Glamour Sets",
    "Housing Items",
    "Minions/Mounts",
    "Orchestrion Rolls",
    "Repairs"
  ],
  "contentTypes": [
    "MSQ",
    "Dungeons",
    "Trials",
    "Normal Raids",
    "Alliance Raids",
    "Extreme Trials",
    "Savage Raids",
    "Ultimate Raids",
    "Criterion",
    "Deep Dungeons",
    "Eureka",
    "Bozja",
    "PvP",
    "Gold Saucer",
    "Housing",
    "Glamour",
    "Crafting",
    "Gathering",
    "RP",
    "Screenshots"
  ],
  "fcRoles": [
    "Crafter",
    "Gatherer",
    "Event Organizer",
    "Event Helper",
    "Decorator",
    "Sprout Guide",
    "Raid Lead",
    "Social Butterfly"
  ],
  "housingAmenities": [
    "Garden",
    "Chocobo Stable",
    "Striking Dummy",
    "Orchestrion",
    "Aquarium",
    "Mini Cactpot Board",
    "Triple Triad Board",
    "Aesthetician"
  ],
  "housingTypes": [
    "Apartment",
    "Small",
    "Medium",
    "Large"
  ],
  "voiceChatOptions": [
    "Has mic, uses VC",
    "Has mic, prefers text",
    "No mic, can listen",
    "Text only"
  ]
}
```

### Jobs List

Returns all FFXIV jobs for the job selector.

```
GET /api/options/jobs
```

**Response:**
```json
{
  "jobs": [
    { "name": "Paladin", "abbrev": "PLD", "role": "tank" },
    { "name": "Warrior", "abbrev": "WAR", "role": "tank" },
    { "name": "Dark Knight", "abbrev": "DRK", "role": "tank" },
    { "name": "Gunbreaker", "abbrev": "GNB", "role": "tank" },
    { "name": "White Mage", "abbrev": "WHM", "role": "healer" },
    { "name": "Scholar", "abbrev": "SCH", "role": "healer" },
    { "name": "Astrologian", "abbrev": "AST", "role": "healer" },
    { "name": "Sage", "abbrev": "SGE", "role": "healer" },
    { "name": "Monk", "abbrev": "MNK", "role": "dps" },
    { "name": "Dragoon", "abbrev": "DRG", "role": "dps" },
    { "name": "Ninja", "abbrev": "NIN", "role": "dps" },
    { "name": "Samurai", "abbrev": "SAM", "role": "dps" },
    { "name": "Reaper", "abbrev": "RPR", "role": "dps" },
    { "name": "Viper", "abbrev": "VPR", "role": "dps" },
    { "name": "Bard", "abbrev": "BRD", "role": "dps" },
    { "name": "Machinist", "abbrev": "MCH", "role": "dps" },
    { "name": "Dancer", "abbrev": "DNC", "role": "dps" },
    { "name": "Black Mage", "abbrev": "BLM", "role": "dps" },
    { "name": "Summoner", "abbrev": "SMN", "role": "dps" },
    { "name": "Red Mage", "abbrev": "RDM", "role": "dps" },
    { "name": "Pictomancer", "abbrev": "PCT", "role": "dps" },
    { "name": "Blue Mage", "abbrev": "BLU", "role": "dps" },
    { "name": "Carpenter", "abbrev": "CRP", "role": "crafter" },
    { "name": "Blacksmith", "abbrev": "BSM", "role": "crafter" },
    { "name": "Armorer", "abbrev": "ARM", "role": "crafter" },
    { "name": "Goldsmith", "abbrev": "GSM", "role": "crafter" },
    { "name": "Leatherworker", "abbrev": "LTW", "role": "crafter" },
    { "name": "Weaver", "abbrev": "WVR", "role": "crafter" },
    { "name": "Alchemist", "abbrev": "ALC", "role": "crafter" },
    { "name": "Culinarian", "abbrev": "CUL", "role": "crafter" },
    { "name": "Miner", "abbrev": "MIN", "role": "gatherer" },
    { "name": "Botanist", "abbrev": "BTN", "role": "gatherer" },
    { "name": "Fisher", "abbrev": "FSH", "role": "gatherer" }
  ]
}
```

---

## Database Schema Suggestion

### Collections (MongoDB)

| Collection | Description |
|------------|-------------|
| `members` | Core member data synced from FC roster |
| `member_profiles` | User-editable profile fields |
| `member_profile_cards` | Card visibility and order |
| `member_main_jobs` | Selected main jobs |
| `member_looking_for` | Looking for tags |
| `member_can_help` | Can help with tags |
| `member_crafting` | Crafting services |
| `member_goals` | Goals with progress |
| `member_content_prefs` | Content preferences |
| `member_availability` | Weekly schedule |
| `member_housing` | Housing info |
| `member_alts` | Alt characters |
| `member_fc_roles` | FC contribution roles |
| `member_wishlist` | Wishlist items |
| `member_screenshots` | Screenshot metadata |
| `lodestone_cache` | Cached Lodestone data |

### Indexes

```javascript
// members
{ characterId: 1 } // unique

// All member_* collections
{ characterId: 1 } // for lookups

// member_screenshots
{ characterId: 1, uploadedAt: -1 } // for sorted listing

// lodestone_cache
{ characterId: 1 } // unique
{ lastUpdated: 1 } // for cache invalidation
```

---

## Consolidated Endpoint Alternative

If you prefer fewer endpoints, you can consolidate into a single profile endpoint:

### Get Full Profile

```
GET /api/members/{characterId}
```

Returns all profile data in one payload.

### Update Profile

```
PATCH /api/members/{characterId}
```

Accepts partial updates for any section:

```json
{
  "profile": {
    "bio": "New bio"
  },
  "mainJobs": [...],
  "lookingFor": [...],
  "availability": {...}
}
```

The tradeoff is larger payloads but simpler API surface.

---

## Authentication & Authorization

All endpoints should:

1. Require authentication (user must be logged in)
2. For `GET` requests: Allow any authenticated FC member to view
3. For `PUT/PATCH/DELETE` requests: Only allow the profile owner OR admins

---

## Error Responses

Standard error format:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Member not found"
  }
}
```

Common error codes:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (not allowed to edit this profile)
- `404` - Not Found
- `413` - Payload Too Large (screenshot too big)
- `500` - Internal Server Error
