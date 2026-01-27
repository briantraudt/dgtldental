

# Plan: Reorder "Yes, Contacted" Flow - Ask Questions First, Then Confirm Email

## Overview
Currently, when a returning visitor says "Yes" (someone has reached out), the flow immediately asks to confirm their email. The user wants to flip this order: first ask if they have any questions, and only if they say "Yes, I have a question" should we then confirm their email before collecting the question.

## Current Flow (Incorrect)
```text
User: "Yes" (someone reached out)
        │
        ▼
Bot: "Ok, good deal. We have [email] on file. Is that still the best way?"
        │
        ├── "Yes, that's still correct"
        │           │
        │           ▼
        │   Bot: "Do you have any other questions right now?"
        │
        └── "I have a better contact"
                    │
                    ▼
            [Update contact, then ask about questions]
```

## New Flow (Requested)
```text
User: "Yes" (someone reached out)
        │
        ▼
Bot: "Ok, good deal. Do you have any other questions right now?"
        │
        ├── "No, I'm all set" ──────────► Bot: "Great! Thanks again..."
        │
        └── "Yes, I have a question"
                    │
                    ▼
        Bot: "We have [email] on file. Is that the best way to reach you?"
                    │
                    ├── "Yes, that's still correct"
                    │           │
                    │           ▼
                    │   [Show question input box]
                    │
                    └── "I have a better contact"
                                │
                                ▼
                        [Collect new contact, then show question input]
```

## Changes Required

### 1. Update `returning_submitted_yes_contacted` State
Change from asking about contact to asking about questions:
- Message: "Ok, good deal. Do you have any other questions right now?"
- Interaction: Yes/No buttons for questions (not contact confirmation)

### 2. Add New State: `returning_yes_confirm_before_question`
This state confirms their email/phone AFTER they say they have a question:
- Message: "Sure! We have [email] on file — is that still the best way to reach you?"
- Interaction: "Yes, that's still correct" / "I have a better contact" buttons

### 3. Update Handler Functions
- `handleSubmittedYesContacted` - now shows question prompt
- Create new handler for when user says "Yes, I have a question" in the contacted flow - this triggers contact confirmation
- After contact is confirmed/updated, show the question input

### 4. Update Existing State Flow
- `returning_yes_confirm_contact` - after confirming contact, go to question form
- `returning_yes_new_contact` - after updating contact, go to question form

## Technical Details

### New State to Add
```tsx
| 'returning_yes_confirm_before_question'
```

### Updated State Handler: `returning_submitted_yes_contacted`
```tsx
case 'returning_submitted_yes_contacted':
  setIsTypingComplete(false);
  await addMessage({ 
    type: 'question', 
    content: (
      <TypewriterText 
        text="Ok, good deal. Do you have any other questions right now?"
        onComplete={() => setIsTypingComplete(true)}
      />
    )
  });
  break;
```

### New State Handler: `returning_yes_confirm_before_question`
```tsx
case 'returning_yes_confirm_before_question':
  setIsTypingComplete(false);
  const confirmBeforeQuestionMsg = storedContactValue 
    ? `Sure! We have ${storedContactValue} on file — is that still the best way to reach you?`
    : `Sure! What's the best email or phone to reach you?`;
  await addMessage({ 
    type: 'question', 
    content: (
      <TypewriterText 
        text={confirmBeforeQuestionMsg}
        onComplete={() => setIsTypingComplete(true)}
      />
    )
  });
  break;
```

### New Handler Function
```tsx
const handleYesContactedHasQuestion = () => {
  triggerHaptic('light');
  addUserMessage("Yes, I have a question");
  setState('returning_yes_confirm_before_question');
};
```

### Updated Interactions

**For `returning_submitted_yes_contacted`:**
```tsx
case 'returning_submitted_yes_contacted':
  if (!isTypingComplete) return null;
  return (
    <QuickReplyButtons
      options={[
        { label: "Yes, I have a question", onClick: handleYesContactedHasQuestion },
        { label: "No, I'm all set", onClick: handleNoMoreQuestions },
      ]}
    />
  );
```

**For `returning_yes_confirm_before_question`:**
```tsx
case 'returning_yes_confirm_before_question':
  if (!isTypingComplete) return null;
  if (storedContactValue) {
    return (
      <QuickReplyButtons
        options={[
          { label: "Yes, that's still correct", onClick: handleYesContactedConfirm, primary: true },
          { label: "I have a better contact", onClick: handleYesContactedUpdate },
        ]}
      />
    );
  }
  return (
    <ChatInput 
      placeholder="Email or phone number..." 
      onSubmit={(value) => {
        addUserMessage(value);
        if (typeof window !== 'undefined') {
          const isEmail = value.includes('@');
          localStorage.setItem(VISITOR_CONTACT_VALUE_KEY, value);
          localStorage.setItem(VISITOR_CONTACT_PREF_KEY, isEmail ? 'email' : 'phone');
        }
        setState('returning_show_question_form');
      }} 
    />
  );
```

### Update Existing Handlers
- `handleYesContactedConfirm` → should go to `returning_show_question_form` (not `returning_yes_confirm_contact`)
- `handleYesContactedUpdate` → should go to `returning_yes_new_contact`, which then goes to `returning_show_question_form`

## Files to Modify
- `src/components/landing/GuidedChat.tsx`

