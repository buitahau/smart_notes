# Smart Notes - Chrome Extension Mockup

## Popup Interface (500px width x 600px height)

### Header
```
┌─────────────────────────────────────────────────────┐
│  🔍 [Search notes...]       ⚙️  📅  🔄  ▢  ✕  │
└─────────────────────────────────────────────────────┘
```
- Search bar with quick filter capabilities
- Icons for Settings, Calendar, Sync, and Window controls

### Main Content Area

#### 1. Chat/Note List View (Default)
```
┌─────────────────────────────────────────────────────┐
│  🟢 All Notes (42)                                  │
│  ────────────────────────────────────────────────  │
│  📝 Meeting Notes                                  │
│  ⏰ 2:00 PM - Project Kickoff                      │
│  #work #meeting                                   │
│  ────────────────────────────────────────────────  │
│  ✅ Shopping List                                  │
│  ⏰ Tomorrow 6:00 PM                              │
│  #personal                                       │
│  ────────────────────────────────────────────────  │
│  💡 Idea: Browser Extension                       │
│  Just had an idea for a new feature...            │
│  #ideas #feature                                  │
│  ────────────────────────────────────────────────  │
│  🤖 AI: Here's your summary for "Project X"...    │
│  #ai #summary                                     │
└─────────────────────────────────────────────────────┘
```

#### 2. Chat/Note Input Area
```
┌─────────────────────────────────────────────────────┐
│  💬 What's on your mind?                            │
│  ┌───────────────────────────────────────────────┐  │
│  │ Type your note or question...                 │  │
│  │                                               │  │
│  │                                               │  │
│  │                                               │  │
│  └───────────────────────────────────────────────┘  │
│  [📅] [🏷️ Add tags] [📎] [✨ AI Enhance] [Send]     │
└─────────────────────────────────────────────────────┘
```

### Sidebar (Collapsible)
```
┌─────┐
│  🏠 │
│  📋 │
│  📅 │
│  ⭐ │
│  🏷️ │
│  ⚙️ │
└─────┘
```
- Home (All Notes)
- Tasks
- Calendar
- Starred
- Tags
- Settings

## Detailed Components

### 1. Note/Chat Item
```
┌─────────────────────────────────────────────────────┐
│  📝 [Note Title]                                   │
│  ⏰ [Due Date/Time]                                │
│  [Preview Text...]                                │
│  🏷️ #tag1 #tag2 #tag3                             │
└─────────────────────────────────────────────────────┘
```

### 2. AI Response Bubble
```
┌─────────────────────────────────────────────────────┐
│  🤖 AI Assistant                                   │
│  ────────────────────────────────────────────────  │
│  Here's the information you requested:             │
│  • Task 1: Due tomorrow                           │
│  • Note from yesterday's meeting                  │
│  • Related documents: ProjectX.md                 │
│                                                    │
│  Would you like me to help you with anything else? │
└─────────────────────────────────────────────────────┘
```

### 3. Quick Action Buttons
```
┌─────────────────────────────────────────────────────┐
│  Quick Actions:                                     │
│  [📝 New Note]  [✅ New Task]  [🔔 Reminder]        │
│  [📋 Templates] [🔍 Search]    [📊 Summary]         │
└─────────────────────────────────────────────────────┘
```

## States

### 1. Empty State
```
┌─────────────────────────────────────────────────────┐
│  📭 No Notes Yet                                   │
│  ────────────────────────────────────────────────  │
│                                                    │
│  Start by creating your first note or              │
│  ask me anything!                                  │
│                                                    │
│  [✨ Create Note]  [💬 Ask AI]                      │
│                                                    │
└─────────────────────────────────────────────────────┘
```

### 2. Search Results
```
┌─────────────────────────────────────────────────────┐
│  🔍 Search: "meeting notes" (3 results)             │
│  ────────────────────────────────────────────────  │
│  📝 Project Kickoff Meeting                        │
│  ⏰ Today 2:00 PM                                  │
│  #work #meeting                                   │
│  ────────────────────────────────────────────────  │
│  📝 Weekly Team Sync                               │
│  ⏰ Jul 10, 2025                                  │
│  #work #weekly                                   │
└─────────────────────────────────────────────────────┘
```

### 3. Note Creation/Editing
```
┌─────────────────────────────────────────────────────┐
│  [📝 Note Title]                                   │
│  ────────────────────────────────────────────────  │
│  📅 Due: [Tomorrow 6:00 PM]  🏷️ [work, project]   │
│  ────────────────────────────────────────────────  │
│  Type your note here...                            │
│                                                    │
│  • You can use markdown formatting                │
│  • Add checklists with - [ ]                     │
│  • @mention other notes                           │
│                                                    │
│  ────────────────────────────────────────────────  │
│  [📎 Attachments] [🔗 Copy Link] [🗑️ Delete]       │
│  [💾 Save] [✨ AI Enhance] [📤 Share]              │
└─────────────────────────────────────────────────────┘
```

## Color Scheme
- Primary: `#4F46E5` (Indigo)
- Background: `#FFFFFF` (White)
- Secondary Background: `#F9FAFB` (Gray-50)
- Text: `#111827` (Gray-900)
- Secondary Text: `#6B7280` (Gray-500)
- Accent: `#8B5CF6` (Purple-500)
- Success: `#10B981` (Emerald-500)
- Warning: `#F59E0B` (Amber-500)
- Error: `#EF4444` (Red-500)

## Typography
- Primary Font: Inter, system-ui, sans-serif
- Monospace: JetBrains Mono, monospace
- Base Font Size: 14px
- Heading Sizes: 
  - H1: 20px (bold)
  - H2: 16px (semibold)
  - Body: 14px (regular)
  - Small: 12px (regular)

## Interaction States
- Hover: Slight background color change (`#F3F4F6`)
- Active: Subtle shadow and slight scale effect
- Focus: Blue outline with 2px border
- Disabled: 50% opacity and not-allowed cursor
