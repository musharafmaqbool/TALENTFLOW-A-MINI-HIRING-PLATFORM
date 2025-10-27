# 🧪 TalentFlow Testing Guide

Complete guide to test all features of the TalentFlow hiring platform.

## 🚀 Getting Started

1. **Start the development server:**
```bash
npm run dev
```

2. **Open your browser:**
Navigate to `http://localhost:3000`

The application will automatically seed the database with 1,200 candidates and sample jobs on first load.

---

## 📋 Feature Testing Checklist

### 1. **Jobs Board** (`/jobs`)

#### ✅ View & Navigation
- [ ] View list of jobs with pagination
- [ ] See job cards with title, description, tags, and status badges
- [ ] Click on job title to view job details (deep linking)
- [ ] Observe glassmorphism effects and modern UI animations

#### ✅ Search & Filters
- [ ] Search jobs by title in the search bar
- [ ] Filter jobs by status (All, Active, Draft, Archived)
- [ ] Filter jobs by tags (click on tag buttons)
- [ ] Combine multiple filters simultaneously
- [ ] Clear filters and reset view

#### ✅ Create New Job
- [ ] Click "Create Job" button
- [ ] Fill in job details:
  - Title (required)
  - Slug (auto-generated, can edit)
  - Description
  - Status (Draft/Active/Archived)
  - Tags (add multiple)
- [ ] Test validation:
  - Try submitting without title (should fail)
  - Try using duplicate slug (should fail)
- [ ] Successfully create a job
- [ ] Verify new job appears in the list

#### ✅ Edit Job
- [ ] Click "Edit" button on any job card
- [ ] Modify job details
- [ ] Save changes
- [ ] Verify changes appear immediately (optimistic update)

#### ✅ Archive/Unarchive
- [ ] Click "Archive" on an active job
- [ ] Observe optimistic update
- [ ] Click "Unarchive" on archived job
- [ ] Verify status changes

#### ✅ Drag & Drop Reordering
- [ ] Grab the grip handle (⋮⋮) on any job card
- [ ] Drag job to new position
- [ ] Drop job
- [ ] Observe smooth animation and reordering
- [ ] Test rollback: Disconnect internet and try reordering (should revert on error)

#### ✅ Pagination
- [ ] Navigate through pages using Previous/Next buttons
- [ ] Verify page numbers update correctly

---

### 2. **Candidates** (`/candidates`)

#### ✅ Virtualized List (1000+ candidates)
- [ ] Scroll through candidate list smoothly
- [ ] Notice only visible candidates render (performance)
- [ ] View shows "X of 1,200 candidates"

#### ✅ Search & Filter
- [ ] Search candidates by name or email
- [ ] Filter by stage (Applied, Screening, Interview, Offer, Hired, Rejected)
- [ ] Combine search and filters
- [ ] Verify count updates dynamically

#### ✅ Candidate Profile
- [ ] Click on any candidate
- [ ] View detailed profile with:
  - Name, email, phone
  - Current stage badge
  - Applied job link
  - Timeline of stage changes
  - Notes section
- [ ] Click job link to navigate to that job
- [ ] Navigate back to candidates list

---

### 3. **Kanban Board** (`/kanban`)

#### ✅ View Kanban Columns
- [ ] See 6 columns: Applied, Screening, Interview, Offer, Hired, Rejected
- [ ] Each column shows candidate count
- [ ] Candidates display with name and email

#### ✅ Drag & Drop Between Stages
- [ ] Grab a candidate card
- [ ] Drag to another column
- [ ] Drop candidate
- [ ] Observe:
  - Smooth animation
  - Optimistic update (immediate move)
  - Column counts update
  - Drag overlay effect

#### ✅ Stage Transitions
- [ ] Move candidates forward: Applied → Screening → Interview → Offer → Hired
- [ ] Move candidates to Rejected from any stage
- [ ] Verify stage history updates (check candidate profile)

#### ✅ Error Handling
- [ ] Try moving many candidates quickly
- [ ] ~5-10% of moves will fail (simulated)
- [ ] Failed moves should:
  - Show error message (red banner)
  - Rollback to previous state automatically
  - Error disappears after 3 seconds

---

### 4. **Assessments** (`/assessments`)

#### ✅ View Assessments
- [ ] See list of existing assessments (3 pre-seeded)
- [ ] Each card shows:
  - Assessment title
  - Job it's for
  - Number of sections and questions
  - Last updated time
- [ ] Empty state: "No assessments yet" message if database is cleared

#### ✅ Create New Assessment
- [ ] Click "Create New Assessment" button or card
- [ ] Fill in assessment details:
  - Title (required)
  - Description (optional)

#### ✅ Assessment Builder

**Add Sections:**
- [ ] Click "Add Section" button
- [ ] Enter section title and description
- [ ] Expand/collapse sections with chevron icon
- [ ] Delete sections with trash icon

**Add Questions:**
For each question type, test:

**1. Single Choice:**
- [ ] Add single choice question
- [ ] Enter question text
- [ ] Add/remove options
- [ ] Edit option text
- [ ] Mark as required

**2. Multiple Choice:**
- [ ] Add multi-choice question
- [ ] Configure options
- [ ] Test in preview (select multiple)

**3. Short Text:**
- [ ] Add short text question
- [ ] Set max length constraint
- [ ] Test validation in preview

**4. Long Text:**
- [ ] Add long text question
- [ ] Set max length
- [ ] Test textarea in preview

**5. Numeric:**
- [ ] Add numeric question
- [ ] Set min/max range
- [ ] Test number input validation

**6. File Upload:**
- [ ] Add file upload question
- [ ] Specify accepted formats (e.g., .pdf, .doc)
- [ ] Note: Actual upload is stubbed (display only)

#### ✅ Live Preview
- [ ] Click "Show Preview" button
- [ ] Preview pane appears on right side
- [ ] Test all question types:
  - Radio buttons for single choice
  - Checkboxes for multi-choice
  - Text inputs
  - Number inputs with constraints
  - File upload UI
- [ ] Required fields show asterisk (*)
- [ ] Form validates required fields
- [ ] Click "Hide Preview" to toggle off

#### ✅ Save Assessment
- [ ] Click "Save Assessment"
- [ ] Verify save success (redirects back)
- [ ] Go back to assessments list
- [ ] Verify new assessment appears

#### ✅ Edit Assessment
- [ ] Click on existing assessment card
- [ ] Make changes to sections/questions
- [ ] Save changes
- [ ] Verify updates persist

---

## 🎨 UI/UX Features to Test

### Visual Design
- [ ] Gradient background (slate → blue → indigo)
- [ ] Glassmorphism effects on cards
- [ ] Smooth animations on page transitions
- [ ] Hover effects on buttons and cards
- [ ] Active navigation highlighting
- [ ] Gradient text on headings

### Interactions
- [ ] Buttons scale on hover/click
- [ ] Cards lift on hover (shadow effect)
- [ ] Smooth scrolling
- [ ] Loading spinners during data fetch
- [ ] Success/error messages
- [ ] Modal overlays

### Responsive Design
- [ ] Test on different screen sizes
- [ ] Mobile navigation (icons only on small screens)
- [ ] Card layouts adjust to viewport
- [ ] Forms remain usable on mobile

---

## ⚡ Performance Testing

### Large Data Sets
- [ ] Scroll through 1,200 candidates (should be smooth)
- [ ] Search/filter with large data sets
- [ ] Drag & drop with many cards
- [ ] Page load time is reasonable

### Optimistic Updates
- [ ] All mutations (create, update, delete) show immediate feedback
- [ ] Network errors trigger rollback
- [ ] Success states persist correctly

---

## 🐛 Error Scenarios to Test

### Network Simulation (5-10% failure rate)
1. **Create/Edit operations:**
   - Try creating multiple jobs quickly
   - Some will fail (500 error simulation)
   - Error messages should display

2. **Drag & Drop:**
   - Move multiple candidates rapidly
   - Failed moves auto-rollback
   - Error banner appears briefly

### Validation Errors
- [ ] Submit forms with missing required fields
- [ ] Try duplicate job slugs
- [ ] Exceed max length in text fields
- [ ] Enter numbers outside min/max range

### Edge Cases
- [ ] Empty search results
- [ ] Filter with no matches
- [ ] Delete all items in a list
- [ ] Navigate directly to non-existent IDs

---

## 📊 Data Persistence

### IndexedDB
- [ ] Create jobs, refresh page → data persists
- [ ] Move candidates, refresh page → positions saved
- [ ] Create assessments, refresh page → assessments remain

### Clear Data
To reset application:
```javascript
// Open browser console and run:
indexedDB.deleteDatabase('TalentFlowDB')
// Then refresh page
```

---

## 🎯 Key Features Checklist

### Jobs Module
- [x] Server-like pagination (10 items/page)
- [x] Client-side search (by title)
- [x] Server-like filtering (status, tags)
- [x] CRUD operations (Create, Read, Update, Archive)
- [x] Drag & drop reordering
- [x] Optimistic updates with rollback
- [x] Unique slug validation
- [x] Deep linking (/jobs/:id)

### Candidates Module
- [x] Virtualized list (1000+ candidates)
- [x] Client-side search (name/email)
- [x] Server-like filtering (current stage)
- [x] Profile page with timeline
- [x] Stage history tracking
- [x] Kanban board view
- [x] Drag & drop stage transitions
- [x] Optimistic updates

### Assessments Module
- [x] CRUD operations
- [x] Multiple section support
- [x] 6 question types
- [x] Live preview pane
- [x] Form validation
- [x] Conditional sections (data model ready)
- [x] Local persistence

### API Simulation
- [x] MSW (Mock Service Worker)
- [x] Random latency (200-1200ms)
- [x] 5-10% error rate on writes
- [x] Pagination support
- [x] Filtering/search support

---

## 📱 Browser Testing

Test in multiple browsers:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)

---

## 🎉 Success Criteria

The application is working correctly if:

1. ✅ All CRUD operations complete successfully
2. ✅ Drag & drop works smoothly
3. ✅ Virtualization handles 1000+ items without lag
4. ✅ Optimistic updates show immediate feedback
5. ✅ Errors trigger rollbacks automatically
6. ✅ Data persists across page refreshes
7. ✅ UI is modern, animated, and appealing
8. ✅ All forms validate properly
9. ✅ Navigation works correctly
10. ✅ No console errors (except intentional MSW simulation errors)

---

## 🚀 Pro Tips

1. **Network Tab**: Open DevTools → Network to see MSW intercepting requests
2. **Console**: Watch for MSW logs showing request handling
3. **IndexedDB**: DevTools → Application → IndexedDB to inspect stored data
4. **Performance**: DevTools → Performance to verify virtual scrolling efficiency
5. **Responsive**: DevTools → Device Toolbar to test mobile views

---

## 📸 Screenshots to Capture

For documentation/demo purposes:
1. Jobs board with filters active
2. Drag & drop in action (job reordering)
3. Kanban board with candidates
4. Candidate profile with timeline
5. Assessment builder with preview
6. Modal forms (create job, create assessment)
7. Loading states
8. Error states with rollback

---

## ⚠️ Known Limitations

As per requirements:
1. **No backend** - All data in IndexedDB
2. **No authentication** - No login system
3. **File uploads stubbed** - Display only, no actual upload
4. **@mentions stubbed** - Data model ready, no autocomplete UI
5. **Conditional questions** - Data structure exists, evaluation not fully implemented

---

Happy Testing! 🎉

If you encounter any issues, they're likely intentional (error simulation) or by design (known limitations).

