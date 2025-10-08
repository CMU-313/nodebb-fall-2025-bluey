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

## **Section 2 – Post Author Role Labels (Michael Yan)**

Overview
--------
This change ensures a role label (e.g. Instructor, TA, Student) is attached to each post's author data and rendered next to the author's display name in topic pages. The goal is to make role information visible in the UI and to add a small, focused frontend test that protects against regressions in how the role label is rendered and displayed.

Manual usage and testing (user-facing)
--------------------------------------
These steps let you manually confirm the feature in a running NodeBB instance.

1. Start the application
   - Start NodeBB locally as you normally would.
     ```bash
     npm start
     ```
   - Ensure your dev environment (database, redis) is running.

2. Create or identify users with different roles
   - Instructor / administrator: register a user and give them Administrator privileges via the admin panel, or use an existing admin account.
   - TA / moderator: create or use a user assigned to a moderator or TA-like group (global moderator or group with moderator privileges).
   - Student: use any normal (non-admin, non-moderator) account.

3. Create a topic and posts
   - Log in as different users and post replies to a topic so multiple posts have different authors and roles.

4. Open the topic page
   - Navigate to the topic in the browser.
   - For each post, look at the post header (next to the display name). You should see a small label in parentheses after the author's displayname, such as:
     - (Instructor)
     - (TA)
     - (Student)

5. Verify tolerant rendering for TA labels
   - The backend attaches an explicit `roleLabel` value (e.g. `TA`) but the frontend test is tolerant to multiple common forms (parentheses, punctuation, case). In the UI you should see a human-readable label; the exact label text will match templates/theme formatting.

Quick smoke tests (manual checks)
- Admin/Instructor post should show an Instructor label next to their display name.
- Moderator/TA user posts should show a TA or TA-like label.
- Regular user posts should show Student (or the fallback).
- Remove role or change user role and reload the topic to see the label update.

Automated tests
---------------
I added one focused frontend unit test that validates the role label rendering behavior.

Test location
- `test/topic-role-labels.js` — New Mocha test.

What the test checks
- Uses JSDOM + jQuery (consistent with other tests in `test/`) to create a small DOM snippet that simulates the topic post header.
- Ensures a span with class `.role-label` exists immediately after the author display name.
- Normalizes the role text (removes parentheses and non-alphanumeric characters and lowercases) and asserts that it maps to a general category:
  - TA-like: `ta`, `teachingassistant`, `assistant` (multiple forms accepted)
  - Student: `student`
  - Instructor: `instructor`, `prof`, `teacher`
  - Unknown labels (e.g. `(unknown)`) must not match any known roles

Why this test is sufficient for the change
- The essential risk introduced by the controller change is: templates must correctly display the role label attached to posts. The test verifies that the rendered markup contains a `.role-label` immediately after the displayname and that the label text contains an expected role keyword even if formatted in various ways. This is a focused smoke test to prevent regressions where the role label is dropped, mis-positioned, or rendered empty.

Limitations and suggested extensions
- The test uses a handcrafted DOM snippet rather than rendering the theme/template end-to-end. This makes it fast and robust, but not strictly end-to-end.
- Add more role synonyms to the test for expect additional variations (e.g., `t.a.`, `teaching-assistant`, `lab-ta`).

How to run the automated test(s)

- Run only the new test file:

```bash
npm test -- test/topic-role-labels.js
```

- Run the full test suite:

```bash
npm test
```

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
