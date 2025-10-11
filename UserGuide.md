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

## **Section 4 – [Composer Suggestions Feature: Diana Cano]**

### Overview
This feature adds a **“Composer Suggestions”** functionality to NodeBB. Extending the existing composer interface, it helps users by providing real-time topic suggestions as they type a new post's title. By showing similarly titled topics, this feature hopes to reduce duplicate topics.

This feature was implemented in:
1. **`static/lib/main.js`** – Frontend logic that listens to composer activity and displays live topic suggestions.  
2. **`library.js`** – Backend API route that searches the database for topic titles matching the user’s input.

Test files:
1. **`tests/main.test.js`** — Contains automated frontend tests verifying the rendering and behavior of the suggestions interface.
2. **`tests/library.test.js`** — Tests the results of searching the database for matching title.

---

### Feature Details
#### 1. Suggestions Container in Composer

- Activated when a user opens the **composer** (post creation window). 
- Appears **beneath the title input field** in the composer.  
- Displays a list of clickable **related topic titles**.  
- Updates automatically as the user types.  
- Falls back to “No similar topics found.” if no matches are returned.


##### **Example UI Behavior:**
Title: Example Question #
Suggested Topics:
- Example Question #1
- Example Question #2
- Example Question #3

**Purpose:**  
Enhances the user experience by preventing duplicate topics and allowing users to find what they are looking for.

---

### User Testing Instructions
You can test this feature manually on your local NodeBB instance.

#### Steps to Test Functionality

1. Ensure Plugin is installed correctly
   - cd into **nodebb-plugin-composer-suggestions** plugin folder (‘cd nodebb-plugin-composer-suggestions’) and run the command ‘npm link’.
   - Then at the root of NodeBB run the command ‘npm link nodebb-plugin-composer-suggestions’.
2. Update Nodebb
   - Run the command ‘./nodebb build’ to ensure the plugin is installed
3. Start NodeBB locally and activate plugin.
   - In the Admin view of NodeBB, go to **Extend** tab and click on **Plugins**.
   - Locate the **nodebb-plugin-composer-suggestions** plugin and install/activate it.
   - Restart NodeBB
4. Navigate to “New Topic.”
   - Open the composer by creating a new post.
5. Type into the Title Field.
   - Begin typing part of an existing topic title
6. Verify:
   - A “Suggested Topics” section appears below the title field.
   - Up to 5 suggestions are shown, each linking to an existing topic.
   - If no similar topics exist, you’ll see “No similar topics found.”

#### Expected Behavior:
- Suggestions load dynamically as you type with some buffer (debounce).

- Suggestions disappear if the input is cleared/there are no existing matching topics.

- All suggestion links redirect to valid topic pages.

---
### Automated Tests

**File Locations:**  
| Test | Purpose |
|------|----------|
| ``test/main.test.js`| Tests the composer UI behavior and live suggestion rendering|
| ``test/library.test.js`` | Tests the suggestion API logic and database interaction |



**Test Description:**
**test/library.test.js**
| Test | Purpose |
|------|----------|
| `should return empty list when given a unique title` | Confirms the endpoint returns an empty result for unmatched queries. |
| `should return filtered suggestions that match the query` | Ensures returned topics contain the searched term.|
| `should safely return an empty array when no title is provided` | Validates safe handling of empty or missing titles.|


**test/main.test.js**
| Test | Purpose |
|------|----------|
| `should render suggestions when the composer is loaded` | Ensures the plugin listens to ‘action:composer.loaded’, queries the API, and renders suggestion links. |

---
### Test Coverage and Rationale
These tests confirm:

- This feature’s introduced UI’s elements (Front end’s appearance & Back end)
- Proper creation of the suggestion container. 
- Correct DOM manipulation and API integration behavior.
- API routing and middleware integration.
- Error-free handling of edge cases (empty or invalid input).

These tests ensure the API route behaves predictably regardless of input or backend conditions.

- They prevent regressions like unhandled rejections, missing suggestions, or malformed data.

- They confirm that the output schema is consistent for the frontend consumer.
---

## **Section 5 – [Show Password Toggle button: Luciana Requena]**

You can test this feature by opening the log-in page, this feature should appear when user starts typing. 

## Purpose: 
Enhance user experience by making the login form more intuitive. Serve as a visual cue for password visibility features in future updates.

## Steps:
1) Open the login page
2) Locate the Show Password button
3) Verify appearance

## Tests location:
public/src/client/login.js

| Test | Purpose |
|------|----------|
| `placeholder test for Show Password button` | Confirms that a .toggle-button element exists in the login form.|


## Rationale:

- This test acts as a smoke check to ensure the UI element is present.
- It prevents accidental removal or misplacement of the toggle button during other login form updates.
- Can be extended in the future to test real interactivity (e.g., toggling the password field type from password to text).

## Expected Behavior

- Element: .toggle-button exists in the login form.
- Visibility: Button is visible to the user near the password field.
- Accessibility: aria-pressed attribute is set correctly for potential screen reader support.
- Interactivity: Currently static; does not change password visibility.


## Limitations and Next Steps

- The button does not yet implement the actual “show/hide password” functionality

Future enhancements may include:
- Changing the password input type dynamically
- Updating aria-pressed and button icon to reflect state
- Optional user preference for remembering password visibility choice


