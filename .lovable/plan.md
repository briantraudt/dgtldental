
# Plan: Add Recovery Options for Declined Returning Visitors

## Overview
When a returning visitor clicks "Not right now", they currently see a dead-end farewell message. This plan adds two recovery paths: a demo test drive option and an email contact link, giving users another chance to engage.

## Current Behavior
When "Not right now" is clicked:
1. User message "Not right now" appears
2. Bot says: "No problem at all — thanks for stopping by! If you ever change your mind, just reach out at hello@dgtldental.com"
3. **No further interaction available** (dead end)

## Proposed Behavior
When "Not right now" is clicked:
1. User message "Not right now" appears
2. Bot says: "No problem at all! If you change your mind, you're always welcome to take our platform for a test drive below, or reach out at hello@dgtldental.com"
3. **Below the message, show:**
   - The `DemoChat` component so they can still try the demo
   - If they interact with the demo and hit Continue, route them into the standard sales workflow

## Changes Required

### File: `src/components/landing/GuidedChat.tsx`

1. **Update the farewell message** in the `returning_visitor_declined` case (lines 177-201):
   - Change the text to invite them to try the demo or email
   - Keep the mailto link formatting

2. **Add interaction handler for declined state** in `renderInteraction()`:
   - Add a new case for `returning_visitor_declined`
   - Show the `DemoChat` component
   - Create a handler (`handleDeclinedDemoComplete`) that routes to `show_value` if they complete the demo

3. **Add state tracking** for the declined demo:
   - Add a new state variable `declinedDemoCompleted` (similar to `returningDemoCompleted`)

## Visual Flow

```text
User clicks "Not right now"
           │
           ▼
┌──────────────────────────────────────────────────┐
│ Bot: "No problem at all! If you change your      │
│ mind, you're always welcome to take our          │
│ platform for a test drive below, or reach out    │
│ at hello@dgtldental.com"                         │
└──────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│ [DemoChat component - "Ask a dental question..."]│
└──────────────────────────────────────────────────┘
           │
           ├── User asks question → Demo responds
           │                │
           │                ▼
           │   [Continue button appears]
           │                │
           │                ▼
           └──────► "show_value" state (sales pitch)
```

## Technical Details

### New State Variable
```tsx
const [declinedDemoCompleted, setDeclinedDemoCompleted] = useState(false);
```

### New Handler Function
```tsx
const handleDeclinedDemoComplete = () => {
  setDeclinedDemoCompleted(true);
  processedStates.current.clear();
  setState('show_value');
};
```

### Updated Message Text (line 182)
```tsx
text="No problem at all! If you change your mind, you're always welcome to take our platform for a test drive below, or reach out at hello@dgtldental.com"
```

### New Interaction Case
```tsx
case 'returning_visitor_declined':
  return (
    <div className="space-y-4 animate-fade-in">
      <DemoChat 
        onComplete={handleDeclinedDemoComplete} 
        isCompleted={declinedDemoCompleted} 
      />
    </div>
  );
```

## User Experience Benefits
- **No dead ends**: Users who initially decline still have a path forward
- **Low pressure**: They can explore the demo at their own pace without feeling pushed
- **Email fallback**: Those who want human contact can still reach out directly
- **Full conversion path**: If the demo impresses them, they can complete the full sales flow

