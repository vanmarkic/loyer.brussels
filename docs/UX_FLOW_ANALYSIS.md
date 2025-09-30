# UX Flow Analysis: Calculateur Journey & Conversion Strategy

_Loyer.brussels - Wuune Collectif User Experience Analysis_

---

## Executive Summary

The current calculateur flow is designed as a conversion funnel leading users from rent evaluation to Wuune membership. The journey progresses through multiple decision points with increasingly personalized messaging based on rent evaluation outcomes, ultimately driving users toward collective action and membership.

---

## Complete User Journey Map

### 1. Entry Point: Region Selection (`/calculateur`)

**Objective:** Geographic filtering and initial engagement

**Flow:**

- User selects from 3 regions: Brussels (active), Wallonia (coming soon), Flanders (in development)
- Each region shows different availability status
- Brussels leads to immediate continuation; others show roadmap messaging

**UX Elements:**

- Visual cards with clear status indicators
- Progressive disclosure of regional information
- Commitment gradient: low to medium

### 2. Housing Type Filtering (`/calculateur/bruxelles`)

**Objective:** Legal applicability screening and expectation setting

**Flow:**

- User chooses: Private market (applicable), AIS (not applicable), Social housing (not applicable)
- Non-applicable choices trigger immediate educational messaging
- Private market selection advances to next step

**UX Elements:**

- Clear visual indicators of applicability
- Immediate feedback for incorrect paths
- Educational messaging for excluded segments

### 3. User Type & Consent (`/calculateur/bruxelles`)

**Objective:** Path separation and data consent collection

**Flow:**

- Data protection messaging with consent checkbox
- User type selection: Tenant, Landlord, Other
- Landlords redirect to separate specialized flow
- Tenants proceed to main calculator

**UX Elements:**

- Trust-building privacy messaging
- Mandatory consent gate
- Role-based path routing

### 4. Main Rent Calculator

**Objective:** Core evaluation functionality and data collection

**Flow:**

- Multi-step form collecting property details
- Real-time calculation display
- Progressive form reveal with validation

**Components:**

- Address autocomplete
- Property characteristics selection
- Energy performance inputs
- Features and amenities checklist

### 5. Results & Conversion Hub (`WuuneResultStep`)

**Objective:** Personalized conversion messaging based on evaluation outcome

**Flow:**

- User inputs current rent amount
- System calculates difference vs. legal reference
- Personalized message displayed based on situation type
- Multiple conversion paths offered

**Conversion Logic:**

```
Rent Analysis:
├── Below Grid (≤-5%) → Celebration + Join for stronger protection
├── Fair (±5%) → Affirmation + Join to maintain protections
├── High but Legal (+5-20%) → Negotiation advice + Wuune support offer
└── Abusive (>20%) → Urgent alert + Immediate help offer
```

### 6. Extended Questionnaire (`/questionnaire`)

**Objective:** Deep data collection and engagement extension

**Flow:**

- 5-section detailed questionnaire
- Personal situation assessment
- Problem identification
- Positive aspects evaluation
- Final conversion attempt

---

## Conversion Strategy Analysis

### Primary Conversion Objectives

1. **Wuune Membership Acquisition**

   - Systematic membership proposition in all result scenarios
   - Direct signup options with email/phone collection
   - Newsletter and local assembly participation opt-ins

2. **Contact Information Capture**

   - Email collection for ongoing engagement
   - Phone number for direct outreach
   - Consent-based data collection for research

3. **Engagement Escalation**
   - Results-based call-to-action intensity
   - Situation-specific messaging tone
   - Multiple engagement levels (newsletter → assembly → membership)

### Conversion Messaging Strategy

**Below Grid Rent:**

- **Tone:** Celebratory, community-building
- **Message:** "Join us to protect everyone"
- **CTA:** Moderate urgency, collective benefit focus

**Fair Rent:**

- **Tone:** Affirmative, protective
- **Message:** "Help maintain this protection"
- **CTA:** Community solidarity appeal

**High but Legal Rent:**

- **Tone:** Advisory, supportive
- **Message:** "We can help you negotiate"
- **CTA:** Service-oriented, support offering

**Abusive Rent:**

- **Tone:** Urgent, action-oriented
- **Message:** "Get help immediately"
- **CTA:** High urgency, immediate assistance

---

## UX Strengths

### Effective Elements

1. **Progressive Disclosure**

   - Information revealed gradually
   - Reduced cognitive load at each step
   - Clear progression indicators

2. **Personalized Messaging**

   - Results-driven content adaptation
   - Situation-specific calls to action
   - Relevant engagement opportunities

3. **Trust Building**

   - Transparent data usage messaging
   - Privacy assurance throughout flow
   - Optional vs. required field distinction

4. **Multiple Conversion Points**
   - Result screen primary conversion
   - Extended questionnaire secondary conversion
   - Additional service offerings (PDF, rights info)

---

## Identified Pain Points

### Navigation & Flow Issues

1. **Progress Opacity**

   - Unclear journey length expectation
   - No overall progress indication until questionnaire
   - Difficult to estimate time investment

2. **Back Navigation Complexity**

   - Complex state management across steps
   - Potential data loss when navigating backwards
   - No save-and-resume functionality

3. **Mobile Experience Gaps**
   - Form complexity on smaller screens
   - Extensive checkbox lists difficult on mobile
   - Long scrolling sections

### Form Design Challenges

1. **Cognitive Load**

   - Extended questionnaire with 50+ questions
   - Multiple similar checkbox groups
   - Complex conditional logic not always clear

2. **Input Validation**

   - Missing real-time validation feedback
   - Error states not clearly communicated
   - Required vs. optional fields ambiguity

3. **Data Entry Friction**
   - Manual address entry (autocomplete available but not prominent)
   - Repetitive information patterns
   - No smart defaults or pre-population

### Data Redundancy Issues

**⚠️ CRITICAL: Repetitive Information Requests**

Users are asked for the same information multiple times throughout the flow, creating significant friction and frustration:

1. **Rent Amount - Asked 3 Times:**

   - **Main Calculator:** Property details collection (size, bedrooms)
   - **Results Step:** "Quel est votre loyer actuel ?" - Manual input required
   - **Extended Questionnaire:** "Montant actuel de votre loyer (€/mois, hors charges)"

2. **Living Space/Size - Asked 3 Times:**

   - **Main Calculator:** "Surface" field in property details step
   - **Extended Questionnaire:** "Surface habitable totale (m²)" - Exact same information

3. **Contact Information - Asked 2 Times:**

   - **Results Step:** Email/phone collection for Wuune membership
   - **Extended Questionnaire:** Likely repeated in final conversion attempt

4. **Property Characteristics - Potentially Duplicated:**
   - **Main Calculator:** Detailed property features, energy performance, amenities
   - **Extended Questionnaire:** "Points positifs du logement" - Similar amenities/features

**Impact on User Experience:**

- **High abandonment risk** - Users frustrated by repetitive data entry
- **Trust erosion** - Appears unprofessional and poorly designed
- **Time waste** - Significantly increases completion time
- **Data inconsistency** - Users may provide different answers to same questions
- **Form fatigue** - Reduces willingness to complete extended questionnaire

### UI Consistency Issues

**⚠️ CRITICAL: Layout & Visual Inconsistency Across Flow**

The user experience is severely disrupted by inconsistent UI layouts and styling throughout the flow:

1. **Region Selection (`/calculateur`)**

   - Layout: Standard gray background (`bg-gray-50`)
   - Header: Simple white header with basic navigation
   - Style: Clean, minimal card-based design

2. **Housing Type & Consent (`/calculateur/bruxelles`)**

   - Layout: Same gray background and white header initially
   - Style: Consistent card-based selection interface

3. **Main Calculator**

   - Layout: **COMPLETE REDESIGN** - Dramatic visual shift
   - Header: Dual-header system (white top bar + red navigation bar)
   - Background: **Full red gradient** (`bg-gradient-to-b from-red-600 via-red-500 to-orange-500`)
   - Style: Bold, campaign-like branding with uppercase text
   - Typography: Completely different styling (uppercase, bold, white text)

4. **Questionnaire (`/questionnaire`)**
   - Layout: **Reverts to original style** - Gray background returns
   - Header: Back to simple white header design
   - Style: Returns to clean, minimal card design

**Impact on User Experience:**

- **Jarring transitions** that break user flow continuity
- **Brand confusion** - users may think they've left the site
- **Loss of trust** due to inconsistent professional appearance
- **Cognitive overhead** from adapting to different visual paradigms
- **Potential abandonment** at the dramatic visual transition

### Conversion Optimization Gaps

1. **Urgency Calibration**

   - Conversion pressure may be too aggressive for some users
   - Limited soft-entry options for hesitant users
   - All-or-nothing membership approach

2. **Social Proof Missing**

   - No testimonials or success stories
   - No membership statistics or community size indicators
   - Limited credibility signals

3. **Alternative Engagement Paths**
   - Heavy focus on immediate membership
   - Limited intermediate engagement options
   - No gradual commitment escalation

---

## Priority Improvement Recommendations

### Immediate Quick Wins (Week 1-2)

1. **⭐ UI Consistency Standardization - TOP PRIORITY**

   - Establish unified header/navigation system across all flow steps
   - Standardize background colors and layout patterns
   - Create cohesive visual transition strategy between steps
   - Maintain brand identity without jarring visual shifts

2. **⭐ Data Redundancy Elimination - HIGH PRIORITY**

   - Implement cross-form data persistence and pre-population
   - Remove duplicate rent amount requests (ask once, reuse everywhere)
   - Eliminate duplicate living space/size questions
   - Pre-fill questionnaire with previously collected data
   - Add data editing capability without re-entering everything

3. **Enhanced Progress Indication**

   - Add overall journey progress bar
   - Estimated completion time display
   - Clear step indicators across all sections

4. **Improved Mobile Experience**

   - Responsive form layout optimization
   - Touch-friendly checkbox/radio interfaces
   - Simplified navigation on small screens

5. **Social Proof Integration**
   - Add member count displays
   - Include brief success stories
   - Show collective impact metrics

### Short-term Enhancements (Month 1)

1. **Smart Form Features**

   - Auto-save functionality with session persistence
   - Intelligent field pre-population
   - Real-time validation with helpful error messages

2. **Conversion Path Diversification**

   - Add "learn more" options before full commitment
   - Create soft engagement options (follow updates, get info)
   - Implement progressive engagement ladder

3. **Results Enhancement**
   - Visual comparison charts
   - Downloadable personalized reports
   - Shareable results summary

### Medium-term Strategic Changes (Months 2-3)

1. **Onboarding Optimization**

   - Create preparation checklist
   - Add guided tour option
   - Implement smart field grouping

2. **Advanced Personalization**

   - Dynamic content based on previous answers
   - Personalized action recommendations
   - Situation-specific resource offerings

3. **Analytics Integration**
   - Conversion funnel tracking
   - Drop-off point identification
   - A/B test framework implementation

---

## Success Metrics & KPIs

### Primary Conversion Metrics

- **Membership Conversion Rate:** % of completed evaluations → Wuune membership
- **Contact Capture Rate:** % of users providing email/phone
- **Journey Completion Rate:** % starting calculator → completing evaluation

### Secondary Engagement Metrics

- **Newsletter Signup Rate:** % opting into communications
- **Extended Questionnaire Rate:** % proceeding to detailed questionnaire
- **Result Sharing Rate:** % using share/download features

### User Experience Metrics

- **Time to Completion:** Average time for complete journey
- **Drop-off Analysis:** % abandonment at each step
- **Mobile vs. Desktop Performance:** Completion rates by device type

### Business Impact Metrics

- **Community Growth Rate:** Monthly new member acquisition
- **Engagement Quality:** Participation in assemblies/activities
- **Tool Virality:** Organic sharing and referrals

---

## Technical Implementation Priority

### Phase 1: Foundation (Immediate)

1. Analytics implementation for baseline measurement
2. Mobile responsiveness improvements
3. Basic progress indication

### Phase 2: Enhancement (Month 1)

1. Auto-save and session management
2. Advanced form validation
3. Social proof integration

### Phase 3: Optimization (Months 2-3)

1. A/B testing framework
2. Advanced personalization engine
3. Integration with membership management system

---

## Conclusion

The current calculateur flow demonstrates strong strategic thinking around conversion optimization with personalized messaging based on user situations. The journey effectively progresses from functional tool usage to community engagement, with multiple touchpoints for conversion.

The primary areas for improvement focus on reducing friction (mobile optimization, progress indication, auto-save) and enhancing conversion through social proof and progressive engagement options. The personalised messaging strategy is well-conceived but could benefit from more gradual commitment escalation and alternative engagement paths.

**Recommended immediate focus:** **UI consistency standardization and data redundancy elimination are the highest priorities** - the current visual inconsistencies and repetitive data requests likely cause significant user confusion and abandonment. After addressing these critical issues, focus on mobile experience optimization and progress transparency to reduce abandonment, followed by social proof integration to improve conversion rates across all user segments.
