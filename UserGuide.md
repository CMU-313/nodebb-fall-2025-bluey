# User Guide

This document provides instructions and testing details for the new features implemented by each team member in Project 2.
Each section describes a specific feature, its purpose, how to use or test it, and the automated tests written to ensure functionality.

---

## **Section 1 – [Feature Placeholder: Member 1]**
Include: (look on website for details on what to write)
- Purpose and functionality overview  
- Steps for using/testing  
- Automated test details

---

## **Section 2 – [Feature Placeholder: Member 2]**

---

## **Section 3 – “Unanswered” Quick Link and Filter Feature (Lisa Huang)**

### Overview
This feature adds an **“Unanswered”** quick-access link and filter to NodeBB.  
It helps forum users and moderators easily view topics with **no replies**, improving engagement and visibility of overlooked discussions.

This feature was added in two templates:

1. **`header.tpl`** — Adds a *Quick Access Button* for unanswered topics at the top of the home page.  
2. **`recent.tpl`** — Adds *Filter Pills* (“All” and “Unanswered”) on the “Recent Topics” page for quick filtering.

---

### Feature Details

#### 1. “Unanswered” Quick Link in Header

- Appears on home page, aligned to the **top-right corner** of the main content area.  
- Button label: **“Unanswered”**  

**Purpose:**  
Provides users and moderators an immediate way to access unanswered discussions from home page of the forum.

---

#### 2. “Unanswered” Filter Pills in Recent Topics

- Added a new **filter bar** above the topic list.  
- Includes two pills:  
  - **All:** `/recent`  
  - **Unanswered:** `/recent?filter=unreplied`  
- Appears with the label **“Filter:”** followed by clickable buttons.

**Purpose:**  
Allows users to toggle between viewing all topics and only unanswered ones without needing to navigate away.

---

### User Testing Instructions

You can test this feature manually in your local NodeBB instance:

1. **Start NodeBB**  
   Run the project locally and open your forum.

2. **Navigate to Recent Topics** (`/recent`)

3. **Verify:**
   - The **filter bar** appears with “All” and “Unanswered” buttons.  
   - Clicking **Unanswered** updates the page URL to `/recent?filter=unreplied` and displays only topics without replies.
   - From the home page (the inital page when you open the port link), look at the **top-right corner** of the header:  
     - You should see a yellow “Unanswered” button.  
     - Clicking it should take you to the same filtered view (`/recent?filter=unreplied`).

**Expected Behavior:**  
Both the header button and the recent page filter pills link to the same destination and correctly display unanswered topics.

---

### Automated Tests

**File Location:**  
`test/recent-unanswered.test.js`

**Test Description:**

| Test | Purpose |
|------|----------|
| `should render the Unanswered filter pills in recent.tpl` | Ensures that the Recent Topics template correctly renders the filter for unanswered |
| `should render the Unanswered quick link in header.tpl` | Verifies that the Header template correctly renders the “Unanswered” button and correct link path |

---

### Test Coverage and Rationale

These tests confirm:

- The presence of new UI elements introduced by this feature.  
- The correct links (`/recent?filter=unreplied`) exist and are consistent between templates.  
- The templates compile successfully with dummy data.

Because these are static template changes without dynamic logic or API calls, these tests are sufficient for full coverage.  
They ensure:
- The new elements render properly.  
- No syntax or template rendering errors occur.

---

## **Section 4 – [Feature Placeholder: Member 4]**

---

## **Section 5 – [Feature Placeholder: Member 5]**
