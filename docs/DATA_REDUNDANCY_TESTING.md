# Data Redundancy Fix - Testing Guide

**Purpose:** Verify that data is shared across forms and users are never asked for the same information twice.

---

## 🧪 Manual Testing Checklist

### Test 1: Calculator → Result Step Data Flow

1. [ ] Navigate to http://localhost:3000/fr/calculateur/bruxelles
2. [ ] Select "Marché privé" (private market)
3. [ ] Select "Locataire" (tenant) and accept consent
4. [ ] **Step 1:** Select property type (e.g., Appartement)
5. [ ] **Step 2:** Enter surface (e.g., 80m²) and bedrooms (e.g., 2)
6. [ ] **Step 3:** Select features
7. [ ] **Step 4:** Select energy class (e.g., C)
8. [ ] **Step 5:** Enter address and calculate
9. [ ] **Step 6 (Result):**
   - Enter actual rent (e.g., 900€)
   - Enter email (e.g., test@example.com)
   - Enter phone (e.g., +32 123456789)
10. [ ] **Verify:** Green badge "✓ Données sauvegardées" appears
11. [ ] **Verify:** Data saved in browser console → sessionStorage → "loyer-brussels-form-data"

**Expected Result:** ✅ All data captured in global context

---

### Test 2: Browser Refresh Persistence

1. [ ] From Step 6, refresh the page (F5 or Cmd+R)
2. [ ] **Verify:** Calculator state restored
3. [ ] **Verify:** Result step shows same rent amount
4. [ ] **Verify:** Email and phone still filled
5. [ ] **Verify:** Green badge still visible

**Expected Result:** ✅ No data loss after refresh

---

### Test 3: Questionnaire Pre-filling

1. [ ] From result step, click "Répondre au questionnaire détaillé"
2. [ ] **Section 0 - Verify displayed data:**
   - [ ] Current rent shows: 900€/mois
   - [ ] Living space shows: 80m²
   - [ ] Email shows: test@example.com
   - [ ] Phone shows: +32 123456789
3. [ ] **Verify:** Green info box states "Informations déjà collectées"
4. [ ] **Verify:** NO duplicate input fields for rent, email, phone

**Expected Result:** ✅ All calculator data displayed, no re-asking

---

### Test 4: Back Navigation

1. [ ] From questionnaire, click browser back button
2. [ ] **Verify:** Return to calculator result step
3. [ ] **Verify:** All fields still contain data
4. [ ] **Verify:** Session ID unchanged in console
5. [ ] Navigate forward again to questionnaire
6. [ ] **Verify:** Data still displayed correctly

**Expected Result:** ✅ Data persists through back/forward navigation

---

### Test 5: Multiple Tab Consistency

1. [ ] Open calculator in Tab 1, fill data through step 6
2. [ ] Open new tab (Tab 2) with same URL
3. [ ] **Verify Tab 2:** Same session data loaded
4. [ ] In Tab 2, change rent amount to 950€
5. [ ] Switch to Tab 1, refresh
6. [ ] **Verify Tab 1:** Shows updated rent 950€

**Expected Result:** ✅ Session shared across tabs

---

### Test 6: Session Expiration

1. [ ] Open browser DevTools → Application → Session Storage
2. [ ] Find "loyer-brussels-form-data"
3. [ ] Modify `lastUpdated` timestamp to 25 hours ago:
   ```javascript
   // In console:
   const data = JSON.parse(sessionStorage.getItem("loyer-brussels-form-data"));
   data.lastUpdated = Date.now() - 25 * 60 * 60 * 1000;
   sessionStorage.setItem("loyer-brussels-form-data", JSON.stringify(data));
   ```
4. [ ] Refresh page
5. [ ] **Verify:** Session cleared (expired)
6. [ ] **Verify:** Clean form state

**Expected Result:** ✅ Old sessions auto-cleared

---

### Test 7: Data Consistency Check

1. [ ] Complete calculator with rent 850€, email user@test.com
2. [ ] Go to questionnaire
3. [ ] In questionnaire section 1, fill additional data
4. [ ] Open browser console and run:
   ```javascript
   const session = JSON.parse(sessionStorage.getItem("loyer-brussels-form-data"));
   console.log("Rent:", session.rentalInfo.actualRent);
   console.log("Email:", session.userProfile.email);
   console.log("Living Space:", session.propertyInfo.size);
   ```
5. [ ] **Verify:** All values match what you entered

**Expected Result:** ✅ Single source of truth maintained

---

### Test 8: Contact Form Integration (Future)

1. [ ] Complete questionnaire
2. [ ] Navigate to contact page with `?join=true` parameter
3. [ ] **Expected (when implemented):** Email/phone pre-filled from session
4. [ ] **Current:** Contact form uses own state (OK for now)

**Expected Result:** 🔄 Future enhancement - contact form pre-fill

---

## 🐛 Known Issues & Edge Cases

### Issue 1: Different Property Types

- **Scenario:** User changes property type mid-flow
- **Current Behavior:** Some fields reset
- **Status:** Acceptable - property type change = new calculation

### Issue 2: Session Storage Full

- **Scenario:** Browser session storage limit reached
- **Mitigation:** Auto-save catches errors, fails gracefully
- **User Impact:** May lose some data (rare)

---

## 📊 Success Metrics

### Before Fix:

- Rent field: Asked 2× ❌
- Email: Asked 2× ❌
- Phone: Asked 2× ❌
- User complaints: "Too repetitive" ❌

### After Fix:

- Rent field: Asked 1× ✅
- Email: Asked 1× ✅
- Phone: Asked 1× ✅
- Visual confirmation: Green badges ✅
- Session persistence: 24 hours ✅

---

## 🔧 Debugging Tips

### Check Session Data:

```javascript
// In browser console:
const session = JSON.parse(sessionStorage.getItem("loyer-brussels-form-data"));
console.table({
  "Session ID": session.sessionId,
  "Last Updated": new Date(session.lastUpdated).toLocaleString(),
  "Current Step": session.currentStep,
  "Actual Rent": session.rentalInfo.actualRent,
  Email: session.userProfile.email,
  Phone: session.userProfile.phone,
  "Living Space": session.propertyInfo.size + "m²",
});
```

### Check Auto-Save:

```javascript
// Watch for auto-saves in console:
// Should see "Session saved: [sessionId]" every 1 second after changes
```

### Clear Session Manually:

```javascript
sessionStorage.removeItem("loyer-brussels-form-data");
location.reload();
```

---

## ✅ Test Results

### Environment:

- **Date Tested:** ****\_\_****
- **Browser:** ****\_\_****
- **OS:** ****\_\_****
- **Tester:** ****\_\_****

### Results:

| Test                           | Status | Notes |
| ------------------------------ | ------ | ----- |
| Test 1: Calculator → Result    | ⬜     |       |
| Test 2: Refresh Persistence    | ⬜     |       |
| Test 3: Questionnaire Pre-fill | ⬜     |       |
| Test 4: Back Navigation        | ⬜     |       |
| Test 5: Multiple Tabs          | ⬜     |       |
| Test 6: Session Expiration     | ⬜     |       |
| Test 7: Data Consistency       | ⬜     |       |
| Test 8: Contact Integration    | ⬜     |       |

### Overall Result: ⬜ PASS / ⬜ FAIL

---

## 🚀 Quick Start Testing

**Fastest way to verify the fix:**

1. Open http://localhost:3000/fr/calculateur/bruxelles
2. Fill calculator (5 mins)
3. Enter rent 850€ at result step
4. Refresh page → Verify rent still there ✅
5. Go to questionnaire → Verify rent shown ✅
6. **If both ✅ = SUCCESS!**

---

**Status:** Ready for QA Testing  
**Estimated Testing Time:** 30-45 minutes for complete suite  
**Critical Tests:** 1, 2, 3 (Must pass)  
**Optional Tests:** 4, 5, 6, 7, 8 (Nice to verify)
