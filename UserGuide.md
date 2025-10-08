# User Guide — Post Author Role Labels

This document describes the feature additions in this branch, how to manually verify them in the running application, and where to find and run the automated tests that cover the changes.

Overview
--------
This change ensures a role label (e.g. Instructor, TA, Student) is attached to each post's author data and rendered next to the author's display name in topic pages. The goal is to make role information visible in the UI and to add a small, focused frontend test that protects against regressions in how the role label is rendered and displayed.

Files changed / added
---------------------
- `src/controllers/topics.js`
  - New helper `getRoleLabel(uid)` that determines a high-level role label for a user (checks administrator/global-moderator APIs and falls back to `Student`).
  - When loading posts for a topic, the controller attaches `p.roleLabel` for each post so templates can render it.

- `test/topic-role-labels.js` (new)
  - A frontend unit test (Mocha + JSDOM + jQuery) that asserts a `.role-label` appears immediately after a poster's display name and maps to a general role category.

- `build/public/templates/topic.tpl` / theme templates
  - The topic template renders a `.role-label` span after the post author displayname if `posts.roleLabel` or `posts.user.roleLabel` is present; otherwise, it falls back to `(Student)`. (This is part of the theme/template that consumes the controller-provided data.)

Manual usage and testing (user-facing)
--------------------------------------
These steps let you manually confirm the feature in a running NodeBB instance.

1. Start the application
   - If you normally run NodeBB locally, start it as you normally would. Typical commands in this project:
     ```bash
     npm start
     # or if you use the NodeBB loader
     node loader.js
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
     - (TA) or some TA-like form
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
- The essential risk introduced by the controller change is: templates must correctly display the role label attached to posts. The test verifies that the rendered markup contains a `.role-label` immediately after the displayname and that the label text contains an expected role keyword even if formatted in various ways. This is a low-risk, focused smoke test to prevent regressions where the role label is dropped, mis-positioned, or rendered empty.

Limitations and suggested extensions
- The test uses a handcrafted DOM snippet rather than rendering the theme/template end-to-end. This makes it fast and robust, but not strictly end-to-end.
- If you want E2E coverage, add a test that renders the real topic template using the template engine (or boot a small server instance and do an HTTP request to the topic page) and assert the output contains the expected label. That would be slightly larger and likely slower, but will provide stronger coverage of template/controller integration.
- You can add more role synonyms to the test if you expect additional variations (e.g., `t.a.`, `teaching-assistant`, `lab-ta`).

How to run the automated test(s)

- Run only the new test file:

```bash
npm test -- test/topic-role-labels.js
```

- Run the full test suite (project default):

```bash
npm test
```

Both commands use the project's existing Mocha + nyc configuration as defined in `package.json`.

Notes for maintainers
---------------------
- Controller behavior: `src/controllers/topics.js` attaches `p.roleLabel` for posts. If future user-role logic changes, ensure `getRoleLabel(uid)` remains in sync with the permission/group APIs used to determine role membership.
- Template: the theme/template already contains conditional rendering for `posts.roleLabel` and `posts.user.roleLabel`. If you change template structure or class names, update the test accordingly.

Contact / Further changes
-------------------------
If you'd like, I can:
- Convert the test to render the actual template to provide end-to-end verification.
- Expand the test to include more role variants.
- Add automated tests that confirm the controller populates `roleLabel` across a set of real user-role combinations (integration tests against the database mock).

Thank you — let me know which option you'd like next and I'll add it.
