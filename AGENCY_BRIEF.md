# Loyer.Brussels - Agency Brief
## Complete Rebuild Specification for Development, Design & Communication Agency

**Document Version:** 1.0
**Date:** November 4, 2025
**Project Type:** Full Application Rebuild from Scratch
**Estimated Timeline:** 6-12 weeks

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Business Context & Problem](#2-business-context--problem)
3. [Target Audiences & User Personas](#3-target-audiences--user-personas)
4. [The Rent Calculation Formula](#4-the-rent-calculation-formula)
5. [Feature Requirements](#5-feature-requirements)
6. [User Journeys](#6-user-journeys)
7. [Content & Messaging Strategy](#7-content--messaging-strategy)
8. [Design Requirements](#8-design-requirements)
9. [Data & Information Requirements](#9-data--information-requirements)
10. [Multi-Language Support](#10-multi-language-support)
11. [Success Metrics](#11-success-metrics)
12. [Legal & Compliance](#12-legal--compliance)
13. [Appendices](#13-appendices)

---

## 1. Executive Summary

### What This Application Does

**Loyer.Brussels** is a web application that helps Brussels tenants and landlords calculate fair rent prices based on official regulations. It's operated by WUUNE, a tenant rights collective that uses the tool to:

- Educate people about their housing rights
- Collect data on the Brussels rental market
- Recruit members to their advocacy organization
- Build political power for tenant protections

### Who It's For

**Primary Users:** Tenants who want to know if their rent is legal
**Secondary Users:** Landlords ensuring regulatory compliance
**Organization:** WUUNE collective seeking to grow membership and collect housing data

### Key Goals

1. **60% conversion** from calculator to detailed questionnaire
2. **50% conversion** from questionnaire to WUUNE membership
3. **5,000 calculations** in first year
4. **1,000 new members** recruited in first year
5. **500 detailed questionnaires** for research purposes

### What Success Looks Like

A Brussels tenant suspects their rent is too high. They find the calculator through social media, spend 5 minutes answering questions about their apartment, and discover their rent is €350/month over the legal limit. Shocked and validated, they complete a detailed questionnaire about their housing situation, then join WUUNE to get support negotiating with their landlord. Within a week, they attend their first tenant assembly meeting.

---

## 2. Business Context & Problem

### The Housing Crisis in Brussels

**The Problem:**
- Brussels has **rent capping laws** to prevent exploitation
- **90% of tenants** don't know if their rent is legal
- Landlords struggle to understand complex regulations
- No simple, transparent tool exists
- Housing authorities lack comprehensive market data

**Why This Matters:**
Housing is the #1 expense for most Brussels residents. Illegal rents can cost tenants hundreds of euros monthly, while landlords risk legal disputes. WUUNE sees this as both a crisis and an opportunity to organize politically.

### WUUNE's Mission

**Who They Are:**
WUUNE (collectif des locataires bruxellois) is a Brussels tenant rights collective founded in the 2020s. They organize assemblies, support rent negotiations, advocate for policy changes, and build tenant power through collective action.

**What They Need:**
- **Membership growth**: More members = more political power
- **Data collection**: Evidence for policy advocacy
- **Legitimacy**: Professional tools establish credibility
- **Community building**: Connect isolated tenants

**Critical Insight:**
This is not just a rent calculator. It's a **political organizing tool** that uses rent evaluation as an entry point for membership recruitment. Every design decision must support both the utility function (accurate calculations) and the political function (converting users to members).

### Brussels Rent Regulations

**What Applies:**
Rent capping only applies to **private market rentals** (individuals and companies renting to tenants). It does NOT apply to:
- **AIS housing** (Agences Immobilières Sociales - social rental agencies)
- **Social housing** (CPAS, SLSP, public housing authorities)

**How It Works:**
The government publishes an official formula that calculates "reference rent" based on objective property characteristics:
- Type (studio, apartment, house)
- Size (square meters)
- Number of bedrooms/bathrooms
- Features (heating, energy rating, amenities)
- Location (postal code affects calculation)

The formula produces three numbers:
- **Minimum fair rent** (90% of median)
- **Median fair rent** (calculated amount)
- **Maximum fair rent** (110% of median)

Landlords can legally charge within this range. Anything significantly above is potentially illegal.

---

## 3. Target Audiences & User Personas

### Persona 1: Concerned Tenant - Marie, 32

**Background:**
Marie is a 32-year-old communications professional living alone in a 1-bedroom apartment in Brussels. She pays €1,600/month rent and suspects it might be too high after talking to friends. She's never been politically active but is frustrated with housing costs.

**Situation:**
- Renting for 3 years at same price
- Landlord increased rent 10% last year
- Afraid to confront landlord (fears eviction)
- Active on social media
- French-speaking, some English

**Goals:**
- Know if rent is legal
- Get documentation if needed
- Find support if she needs to act
- Not get evicted

**Fears:**
- Landlord retaliation
- Legal complexity
- Acting alone
- Making things worse

**How We Reach Her:**
Social media posts, friend recommendations, Google search

**What She Needs From Us:**
- Simple, clear answers
- Evidence she can save or share
- Support if rent is illegal
- Low-commitment first step

**Journey:**
Finds calculator → Discovers rent is 25% too high → Feels validated + angry → Completes questionnaire → Joins WUUNE for support → Attends assembly → Negotiates rent reduction

**Conversion Triggers:**
"Your rent is €350/month over the legal limit" + "You're not alone - 500+ tenants are organized" + "Get free support"

---

### Persona 2: Conscientious Landlord - Pierre, 58

**Background:**
Pierre inherited a property from his parents and rents it out for supplemental income. He's not a professional landlord and wants to do things correctly. He's concerned about new regulations and potential fines.

**Situation:**
- Owns 2 rental properties
- Sets rent based on "market rate"
- Worried about compliance
- No interest in politics
- French-Dutch bilingual

**Goals:**
- Set legal rent prices
- Avoid fines and disputes
- Understand regulations clearly
- Maintain good tenant relations
- Protect his investment

**Fears:**
- Legal penalties
- Tenant complaints
- Bad reputation
- Financial losses

**How We Reach Him:**
Google search for "Brussels legal rent," regulatory notices, professional networks

**What He Needs From Us:**
- Clear compliance guidance
- Professional, non-judgmental tone
- Quick answers
- Educational resources
- Reassurance he's doing it right

**Journey:**
Searches for information → Finds landlord section → Uses calculator → Realizes proposed rent was too high → Adjusts to legal amount → Subscribes to regulatory updates → Becomes informed landlord

**Conversion Triggers:**
"Avoid disputes" + "Set fair, legal rent" + "Professional compliance tool"

---

### Persona 3: Housing Activist - Amina, 26

**Background:**
Amina is a graduate student and community organizer already involved in social justice movements. She's highly motivated but has limited time and income. Looking for concrete ways to make political impact.

**Situation:**
- Shared apartment, modest rent
- Politically engaged, attends protests
- Strong social media presence
- Trilingual (French, Dutch, English)
- Wants to help friends/community

**Goals:**
- Fight housing injustice
- Build tenant power
- Learn organizing skills
- Support her community
- Make systemic change

**Motivations:**
- Social justice values
- Community solidarity
- Political activism
- Concrete action

**How We Reach Her:**
Activist networks, social media, community groups

**What She Needs From Us:**
- Tools to help others
- Community to join
- Organizing opportunities
- Political framing
- Ways to take action

**Journey:**
Finds tool through activist network → Uses for self and friends → Shares widely on social media → Immediately joins WUUNE → Attends assemblies → Becomes active organizer → Recruits others

**Conversion Triggers:**
"Build tenant power" + "Join 500+ organized tenants" + "Take collective action"

---

### User Segmentation by Rent Result

**Critical Strategy:**
The application automatically adapts messaging based on calculation results. Every rent situation has a path to WUUNE membership:

| Rent Situation | % of Users | Emotional State | Message Strategy | Call-to-Action |
|----------------|------------|-----------------|------------------|----------------|
| **Abusive Rent** (>20% over max) | ~15% | Anger, urgency, validation | "Your rent may be illegal. Get immediate help." | "Get urgent support now" |
| **High Rent** (+5-20% over) | ~35% | Frustration, concern | "Your rent is at the upper limit. Negotiation may help." | "Learn negotiation strategies" |
| **Fair Rent** (±5% of median) | ~40% | Relief, vulnerability | "Your rent is fair. Help protect this for everyone." | "Join the community" |
| **Below Grid** (<-5% under median) | ~10% | Privilege, guilt | "You have a good situation. Help others achieve the same." | "Support tenant rights" |

**Why This Matters:**
Every user, regardless of their rent situation, receives messaging designed to convert them to organizational membership. The tool triggers specific emotions that motivate different types of political engagement.

---

## 4. The Rent Calculation Formula

### What Users Need to Know

The application calculates "reference rent" using the **official Brussels Housing Code formula**. This is based on government regulations, not WUUNE's opinion.

### What Goes Into the Calculation

**Property Basics:**
- Type: Studio, Apartment, or House
- Size: Square meters of living space
- Bedrooms: How many bedrooms (0-5+)
- Bathrooms: How many full bathrooms

**Property Features:**
- Energy rating (PEB certificate: A-G scale)
- Central heating: Yes/No
- Thermal regulation (thermostat): Yes/No
- Double glazing: Yes/No
- Second bathroom: Yes/No
- Recreational spaces (terrace, balcony, garden): Yes/No
- Storage spaces (cellar, attic): Yes/No
- Garages: How many
- Building age: Before/after 2000

**Location:**
- Postal code (required): Brussels codes 1000-1210
- Street name (optional): For documentation
- Building number (optional): For documentation

The postal code determines a "difficulty index" - a location factor that affects the calculation (reflects construction difficulty and neighborhood characteristics).

### The Output

**Three Numbers:**
1. **Minimum fair rent**: 90% of calculated median
2. **Median fair rent**: The core calculated amount
3. **Maximum fair rent**: 110% of calculated median

**Legal Interpretation:**
- **Within range**: Rent is compliant
- **Slightly over**: May be acceptable, negotiation possible
- **Significantly over (>20%)**: Potentially illegal, tenant has grounds for complaint

**Important Disclaimer:**
This is an **informational calculation** only. It does not constitute legal advice or an official determination. Only housing authorities or courts can make binding legal rulings about rent.

### Formula Accuracy Requirements

**Must Be:**
- Based on exact official Brussels Housing Code methodology
- Updated annually when government updates indexation factors
- Source data (difficulty index) from official Brussels databases
- Display date of last update
- Include legal disclaimers

**What This Means:**
The agency must implement the exact formula constants and adjustments. WUUNE will provide the complete technical formula specification separately. The calculation must be accurate enough to serve as evidence in rent disputes.

---

## 5. Feature Requirements

### 5.1 Multi-Step Rent Calculator

**Purpose:**
Guide users through rent calculation with a clear, step-by-step process that feels simple despite collecting detailed information.

**User Experience:**
- **6 steps total**
- Progress indicator shows current step (e.g., "Step 3 of 6")
- Can go back to edit previous steps
- Data saves automatically (no lost progress)
- Mobile-friendly throughout
- 3-5 minutes to complete

---

#### Step 1: Housing Type Selector

**Question:**
"What type of housing do you have?"

**Three Options** (large, visual cards):

1. **Private Market Rental**
   - Icon: House/apartment
   - Description: "Property rented from private individual or company"
   - Subtitle: "Rent capping applies ✓"
   - Action: Continue to calculator

2. **AIS Housing**
   - Icon: Building with organization symbol
   - Description: "Agence Immobilière Sociale (social rental agency)"
   - Subtitle: "Rent capping does NOT apply"
   - Action: Show info modal explaining AIS, offer resources

3. **Social Housing**
   - Icon: Public building
   - Description: "CPAS, SLSP, or public housing authority"
   - Subtitle: "Rent capping does NOT apply"
   - Action: Show info modal, offer resources

**Why This Matters:**
Rent capping only applies to private rentals. This step qualifies users and sets proper expectations. Users selecting AIS or social housing see explanatory content but can't use the calculator (it wouldn't be accurate for them).

**Design Requirements:**
- Large, obvious buttons/cards
- Clear visual distinction between options
- Help icons with additional explanations
- Prominent Brussels region indicator
- Professional, official appearance

---

#### Step 2: Property Type

**Question:**
"What type of property?"

**Options** (visual cards with icons):
- Studio (0 bedrooms, one main space)
- Apartment - 1 bedroom
- Apartment - 2 bedrooms
- Apartment - 3 bedrooms
- Apartment - 4+ bedrooms
- House (any bedroom count)

**Why This Matters:**
Property type determines base formula constants. Must be selected before proceeding.

**Help Content:**
- Studio: "One main room serving as bedroom + living room, plus separate kitchen/bathroom"
- Apartment: "Multiple rooms in a building, with separate bedroom(s)"
- House: "Entire building with private entrance"

**Design Requirements:**
- Large cards with icons
- Hover for more info
- Clear visual selection state
- Cannot proceed without selecting

---

#### Step 3: Property Details

**Three Inputs:**

**1. Living Space (required)**
- Label: "Total living space"
- Unit: Square meters (m²)
- Input: Number with +/- buttons
- Range: 15-500 m²
- Help: "Total habitable space, excluding cellars/attics unless converted"

**Special Feature:**
Hold down +/- buttons to increment faster (acceleration feature for better mobile UX)

**2. Bedrooms** (pre-filled from Step 2, adjustable)
- Counter with +/- buttons
- Range: 0-10
- Auto-set based on property type choice
- Can be adjusted by user

**3. Bathrooms** (required)
- Counter with +/- buttons
- Range: 1-5
- Help: "Count full bathrooms only (toilet + shower/bath)"

**Validation:**
- Living space minimum 15m² (show warning if lower)
- Flag unusually large spaces (>300m²) with "Please verify this measurement"
- Warn if bedroom count conflicts with property type (e.g., studio with 2 bedrooms)

**Design Requirements:**
- Large, touch-friendly buttons (min 48px height)
- Clear labels above inputs
- Real-time validation feedback
- Mobile-optimized number input

---

#### Step 4: Features & Amenities

**Question:**
"What features does your property have?"

**7 Yes/No Questions** (toggle switches or clear checkboxes):

1. Central heating present?
2. Thermal regulation (thermostat)?
3. Double glazing on windows?
4. Second full bathroom?
5. Recreational spaces (terrace, balcony, garden)?
6. Storage spaces (cellar, attic)?
7. Building constructed before 2000?

**Plus One Counter:**
- "Number of garages/parking spaces" (0-10)

**Help Text:**
Each feature has a help icon explaining:
- What counts (e.g., "Central heating: radiators or floor heating throughout property")
- Why it matters (e.g., "Affects rent calculation by ±€X/month")

**Design Requirements:**
- Clear yes/no controls
- Visual feedback on selection
- Logical grouping (heating features together, space features together)
- Optional to skip (defaults to "no" if not answered)

---

#### Step 5: Energy Rating

**Question:**
"What is the energy performance certificate (PEB) rating?"

**Dropdown or Visual Selector:**
- Class A (best - green)
- Class B (green)
- Class C (light green)
- Class D (yellow)
- Class E (orange)
- Class F (red)
- Class G (dark red - worst)
- Unknown/Don't have certificate

**Help Content:**
- "What is PEB?" link → Explanation of energy performance certificate
- "Where do I find this?" → On rental contract or certificate document
- "I don't know" → Can select "Unknown" option

**Visual Design:**
- Color-coded scale (A=green to G=red)
- Energy symbols/icons
- Clear which is better/worse
- "Unknown" option not penalized in calculation

**Behind the Scenes:**
When user selects energy class, system should look up the "difficulty index" for their postal code from the address database. Show loading indicator while fetching.

---

#### Step 6: Address

**Question:**
"Where is the property located?"

**Three Inputs:**

**1. Postal Code** (required)
- Number input, 4 digits
- Brussels range: 1000-1210
- Validation: Must be valid Brussels postal code
- Immediate feedback if invalid

**2. Street Name** (optional but helpful)
- Text input with autocomplete
- As user types, suggest matching Brussels streets
- Can skip or enter manually

**3. Building Number** (optional)
- Text input (handles "123" or "123A")
- For complete documentation

**Why Postal Code Matters:**
The postal code determines a location factor ("difficulty index") that significantly affects the calculation. Different Brussels neighborhoods have different base costs.

**Address Validation:**
- Check postal code is in Brussels region
- If street name provided, verify it exists in Brussels
- Allow manual entry if address not found in database
- Clear error messages: "This postal code is not in Brussels. Calculation only valid for Brussels addresses."

**Design Requirements:**
- Clear required/optional indicators
- Autocomplete dropdown for streets
- Helpful errors
- "Why do you need this?" help text

---

#### Step 7: Results Display

**Purpose:**
Show the calculated reference rent, compare to user's actual rent, and drive conversion to questionnaire or membership.

**Main Display:**

**Reference Rent Range** (prominent visual):
```
Minimum Fair Rent: €XXX
Median Fair Rent:  €XXX  ← Most prominent
Maximum Fair Rent: €XXX
```

Visual: Gauge, bar chart, or number display with clear labels

**User's Rent Input:**
- "Your current/proposed rent" input field
- Currency format: €X,XXX
- Editable, auto-saves
- Help: "Monthly rent excluding charges (utilities, etc.)"

**Comparison Result:**

If user enters their rent, show clear visual comparison:

**Scenario 1: Rent Significantly Over (>20% above maximum)**
- **Visual**: Red indicator, alert icon
- **Headline**: "Your rent appears to exceed legal limits"
- **Message**: "You are paying €XXX more than the maximum legal rent (€XXX/month or XX% over)"
- **Emotion**: Validation + urgency
- **Primary CTA**: "Get help from WUUNE" (large, red, urgent button)
- **Secondary CTA**: "Download PDF report"
- **Tertiary**: "Take detailed questionnaire"

**Scenario 2: Rent Moderately Over (+5-20%)**
- **Visual**: Orange indicator
- **Headline**: "Your rent is at the upper end of the legal range"
- **Message**: "Your rent is €XXX above the median (XX% over). While legal, negotiation may be possible."
- **Emotion**: Concern + hope
- **Primary CTA**: "Learn negotiation strategies"
- **Secondary CTA**: "Join WUUNE for support"

**Scenario 3: Rent Fair (±5%)**
- **Visual**: Green indicator
- **Headline**: "Your rent is within the legal reference range"
- **Message**: "Your rent is compliant with Brussels regulations."
- **Emotion**: Relief + vulnerability
- **Primary CTA**: "Help protect tenant rights"
- **Secondary CTA**: "Join WUUNE community"

**Scenario 4: Rent Below Grid (<-5%)**
- **Visual**: Blue indicator
- **Headline**: "Your rent is below the reference grid"
- **Message**: "You have a favorable rental situation."
- **Emotion**: Privilege + responsibility
- **Primary CTA**: "Support other tenants"
- **Secondary CTA**: "Learn about WUUNE"

**Action Buttons** (always present):
- "Download PDF" - Generate professional report
- "Take detailed questionnaire" - 5-minute survey for personalized support
- "Start new calculation" - Reset and start over
- "Edit calculation" - Go back to Step 1

**Optional Data Collection:**
- Email address (to send results and updates)
- Phone number (for personalized contact)
- Checkboxes: Newsletter signup, Assembly invitations
- Privacy notice: "Data used for research and tenant advocacy"

**Critical Conversion Point:**
This is where most users decide whether to engage further. The messaging must:
- Trigger appropriate emotion based on rent situation
- Create urgency or motivation
- Offer clear value ("personalized support", "community", "help")
- Make next step feel low-commitment
- Pre-fill data to reduce friction

---

### 5.2 PDF Export Feature

**Purpose:**
Provide professional documentation of rent calculation for:
- Personal records
- Landlord negotiation
- Legal proceedings
- Sharing with advisors

**When Available:**
"Download PDF" button appears on results page

**PDF Contents** (maximum 3 pages):

**Page 1: Summary & Results**
- WUUNE logo and branding
- Document title: "Brussels Reference Rent Calculation"
- Generation date
- Property summary (address, type, size, features)
- Calculation results box:
  - Reference rent range (min/median/max)
  - User's declared rent (if provided)
  - Comparison result (over/under by €X or X%)
  - Status indicator (Fair/High/Potentially Abusive/Below Grid)

**Page 2: Calculation Details**
- Property characteristics table (all entered data)
- Formula components used
- Adjustments applied (energy, features, location)
- Breakdown showing how result was reached

**Page 3: Legal Information**
- Regulatory context (Brussels rent capping summary)
- Legal basis (Housing Code references)
- Important disclaimers
- User rights information (contextual based on rent situation)
- Resources:
  - WUUNE contact information
  - Housing inspection contact
  - Legal aid resources

**Design Requirements:**
- Professional, official appearance
- WUUNE branding (subtle, not overwhelming)
- Print-friendly (works in black & white)
- Clear typography
- Tables for readability
- Unique document ID for reference

**User Experience:**
- Click button → PDF generates immediately
- Downloads automatically (filename: `loyer-brussels-[date].pdf`)
- No waiting, no account required
- Option to email PDF to self

---

### 5.3 Detailed Questionnaire

**Purpose:**
Collect comprehensive housing situation data for:
- Personalized support recommendations
- Housing market research
- Policy advocacy evidence
- Deeper organizational connection

**Entry Points:**
1. From calculator results: "Take detailed questionnaire" button
2. From email follow-up: Link in confirmation email

**User Promise:**
"5-minute questionnaire for personalized support and to help improve housing policy in Brussels"

**Length:** 5 sections, ~20 questions total

**Critical Feature:**
All data from calculator is pre-filled. User confirms or edits, then adds additional information.

---

#### Section 1: Collected Information Summary

**Purpose:**
Show transparency - display all data from calculator

**Content:**
- "Here's what you've already shared:"
- Display: Rent, living space, address, email, phone
- Each item has "Edit" button
- User confirms accuracy

**Message:**
"We've saved your calculation. Now let's gather a bit more information to help you and improve housing policy."

---

#### Section 2: Personal Situation

**Questions:**

1. **Lease Type**
   - Options: 9-year lease, 3-year lease, 1-year lease, Short-term rental, Other
   - Help: "Standard lease terms in Belgium"

2. **Lease Start Date**
   - Date picker
   - Used to calculate rent indexation eligibility

3. **Monthly Household Income** (optional)
   - Number input: €X,XXX
   - Help: "Total monthly income before taxes"
   - Privacy: "Used for research only, kept confidential"

4. **Household Composition**
   - Options: Single person, Couple, Family with children, Shared housing, Other

5. **Rent Indexation** (has landlord increased rent for inflation?)
   - Options:
     - Yes, recently (last 12 months)
     - Yes, but more than a year ago
     - No, never
     - Don't know

6. **Boiler Maintenance Included in Rent?**
   - Checkbox: Yes/No

7. **Fire Insurance Included in Rent?**
   - Checkbox: Yes/No

**Design:**
- Clear, simple forms
- One question at a time (vertical scroll) or grouped logically
- Progress indicator: "Section 2 of 5"

---

#### Section 3: Housing Problems

**Question:**
"Are you experiencing any of these housing issues?"

**Multiple Selection Allowed:**

**Health Issues:**
- Mold or humidity
- Excessive cold in winter
- Drafts or poor insulation
- Poor air quality
- Noise pollution
- Pest infestation (rodents, insects)
- None of these
- Other (free text)

**Major Defects:**
- Structural damage (cracks, instability)
- Plumbing issues (leaks, no hot water)
- Electrical problems
- Broken heating system
- Non-functional windows/doors
- Roof leaks
- None of these
- Other (free text)

**Why This Matters:**
These are often legal violations separate from rent issues. Helps WUUNE prioritize urgent cases and build policy advocacy around common problems.

**Design:**
- Checkboxes (can select multiple)
- "None" option clears others
- Optional free-text for specifics
- Empathetic tone, not judgmental

---

#### Section 4: Positive Aspects

**Question:**
"What do you like about your housing?"

**Purpose:**
Balance negativity, understand full picture, identify what tenants value

**Multiple Selection:**
- Good location/neighborhood
- Proximity to public transport
- Quiet environment
- Outdoor space (balcony/garden)
- Good natural light
- Well-maintained building
- Responsive landlord
- Other (free text)

**Additional Comments:**
- Free text area (500 words max)
- Prompt: "Anything else you'd like to share about your housing situation?"
- Optional

---

#### Section 5: Your Personalized Results & Next Steps

**Display:**

**Summary of Their Situation:**
"Based on your responses:"
- Your rent is [status]
- You are experiencing [X issues]
- You qualify for [types of support]

**Recommendations:**
Personalized based on their situation:
- High rent + problems: "Priority case - immediate support available"
- Fair rent + problems: "Landlord has repair obligations - we can help"
- High rent + no problems: "Negotiation strategies available"
- Fair rent + no problems: "Help protect these rights for everyone"

**WUUNE Information Card:**
"What WUUNE Offers:"
- Free rent negotiation support
- Legal advice and mediation
- Community of 500+ Brussels tenants
- Monthly assemblies (online & in-person)
- Housing rights workshops
- Collective bargaining power

**Success Stories:**
"80% of members who requested support achieved rent reductions or repairs"
"Average rent reduction: €200/month"

**Call-to-Action:**
- **Primary**: "Join WUUNE Collective" → Pre-filled contact form
- **Secondary**: "Download complete report (PDF)"
- **Tertiary**: "Start new evaluation"

**What Happens Next:**
"Within 48 hours:"
- You'll receive a confirmation email
- A WUUNE volunteer will contact you personally
- You'll be invited to the next assembly
- You'll receive our welcome newsletter

**Submission:**
One prominent button: "Submit questionnaire"

**After Submission:**
- Success message: "Thank you! Your responses help us fight for better housing."
- Confirmation email sent immediately
- Redirect to contact form (pre-filled) OR success page

---

### 5.4 Contact Form & Membership Signup

**Purpose:**
Final conversion point - get user's contact details and formalize membership interest.

**Page Layout:**

**Hero Section:**
- Headline: "Join the Movement for Housing Rights"
- Subheadline: "500+ Brussels tenants already organized"
- Visual: Community photo, diverse group
- Background: WUUNE brand colors

**Three Information Cards** (side by side):

1. **Contact**
   - Email: contact@wuune.be
   - Response time: Within 48 hours
   - Icon: Envelope

2. **Assemblies**
   - Frequency: Monthly meetings
   - Format: Online & in-person options
   - Next date: [Dynamic date if available]
   - Icon: People gathering

3. **Newsletter**
   - Frequency: Monthly
   - Content: Housing rights news, success stories, events
   - Subscribers: 1,200+ subscribers
   - Icon: Newsletter

**Contact Form:**

**Fields:**

1. **Full Name** (required)
   - Text input
   - Placeholder: "Jean Dupont"

2. **Email** (required)
   - Email input
   - Pre-filled if coming from calculator/questionnaire
   - Placeholder: "jean.dupont@example.com"

3. **Subject** (required)
   - Dropdown options:
     - "Membership / Join WUUNE"
     - "Help with rent negotiation"
     - "Report housing issues"
     - "General question"
     - "Press inquiry"
     - "Other"
   - Pre-filled based on context

4. **Message** (required)
   - Large text area
   - Pre-filled based on user's journey:
     - From calculator with abusive rent: Template about rent exploitation
     - From questionnaire: Reference to submission
     - From direct visit: Blank
   - Placeholder with example message

5. **Newsletter Signup** (checkbox)
   - "Receive monthly newsletter with housing rights news and updates"
   - Pre-checked if coming from calculator/questionnaire
   - Can be unchecked

6. **Assembly Invitations** (checkbox)
   - "Receive invitations to WUUNE assemblies and meetings"
   - Pre-checked if coming from questionnaire
   - Can be unchecked

**Submit Button:**
Text varies by context:
- "Join WUUNE" (if membership-focused)
- "Send message" (if general contact)

**Privacy Notice:**
"Your data is used only for WUUNE organizing and housing research, never shared with third parties. [Full privacy policy]"

**Context-Aware Behavior:**

**If user arrives from calculator with abusive rent:**
- Subject pre-set: "Help with rent negotiation"
- Message template: "I used the rent calculator and discovered my rent (€X) exceeds the legal maximum (€X). I would like support addressing this with my landlord."
- Headline: "Get Urgent Support"
- Both checkboxes: Pre-checked

**If user arrives from questionnaire:**
- Subject pre-set: "Membership / Join WUUNE"
- Message template: "I completed the questionnaire (ID: XXX) and would like to join WUUNE to support tenant rights in Brussels."
- Headline: "Welcome to WUUNE"
- Both checkboxes: Pre-checked

**If user arrives directly (no context):**
- Nothing pre-filled
- Standard headline
- Checkboxes not checked

**After Submission:**
- Success message: "Message sent successfully! We'll respond within 48 hours."
- If membership: "Welcome to WUUNE! Check your email for next steps."
- Confirmation email sent automatically
- Thank you page or return home button

---

### 5.5 Landlord Information Section

**Purpose:**
Provide resources for landlords in a non-confrontational way. Same calculation tool, different framing.

**URL:** `/landlords` or `/bailleurs`

**Visual Identity:**
- Different color scheme (green instead of WUUNE red)
- Professional, neutral tone
- Same tool, different messaging

**Hero Section:**
- Headline: "Landlords: Understanding Brussels Rent Regulations"
- Subheadline: "Set fair, legal rent prices with confidence"
- Visual: Professional property image
- Background: Green/neutral colors

**Content Sections:**

**1. Understanding Rent Capping**
- What is the rent reference grid?
- Why does it exist? (fair housing market, prevent exploitation)
- What properties does it apply to?
- How is it calculated?

**2. Using the Calculator**
- Step-by-step guide
- What information you'll need
- How to interpret results
- Link to calculator tool (same tool, neutral mode)

**3. Compliance Benefits**
- Avoid disputes with tenants
- Prevent legal penalties
- Maintain good tenant relations
- Protect your investment
- Build positive reputation

**4. Quick Tools**
- "Can I increase rent?" decision guide
- Annual indexation calculator
- Impact of renovations on legal rent
- Documentation best practices

**5. Resources**
- Link to Brussels Housing Code
- Housing inspection contact
- Professional landlord associations
- Mediation services

**6. FAQ**
- Common questions about rent capping
- How to correct mistakes if rent too high
- Renovation exceptions
- Dispute resolution process

**Call-to-Action:**
- Primary: "Calculate Reference Rent" → Calculator (neutral mode)
- Secondary: "Subscribe to Regulatory Updates" → Newsletter
- No political messaging, no WUUNE membership push

**Tone:**
- Educational, not judgmental
- "Good landlord" identity reinforcement
- Compliance-focused, not punitive
- Professional and helpful

**Conversion Goal:**
Newsletter subscribers who stay informed about regulations. Potential allies, not members.

---

## 6. User Journeys

### Journey 1: Tenant Discovers Rent is Too High

**Scenario:** Marie pays €1,600/month rent for a 65m² 1-bedroom apartment in Brussels. She suspects it might be too high after talking to friends.

**Complete Journey:**

**1. Awareness** (Social Media)
- Friend shares WUUNE post on Facebook
- Post: "Is your rent too high? Find out in 3 minutes"
- Marie clicks link
- **Emotion:** Curious, skeptical

**2. Landing Page** (Home)
- Sees: "Calculate your fair rent based on official Brussels regulations"
- Credibility signals: "500+ tenants helped", "Official Brussels formula"
- Clean, professional design
- **Emotion:** Interested, slightly more trusting
- **Action:** Clicks "Calculate My Rent"

**3. Housing Type Selector**
- Sees three clear options
- Selects "Private Market Rental"
- Quick transition to next step
- **Emotion:** Good, I qualify
- **Time:** 10 seconds

**4. Calculator Steps 1-6** (3-5 minutes)
- Step 1: Property Type → Apartment, 1 bedroom
- Step 2: Details → 65m², 1 bedroom, 1 bathroom
- Step 3: Features → Central heating yes, double glazing yes, no other special features
- Step 4: Energy → Class D
- Step 5: Address → 1050 postal code, Rue Example
- Progress bar shows "Step 4 of 6" throughout
- Data saves automatically
- Mobile-friendly, easy inputs
- **Emotion:** Engaged, invested in process
- **Time:** 4 minutes

**5. Results - The Critical Moment**
- Calculation loads...
- **RESULT DISPLAYED:**
  - Minimum Fair Rent: €1,170
  - Median Fair Rent: €1,300
  - Maximum Fair Rent: €1,430
  - Her rent: €1,600 (enters in field)
  - Comparison: **28% OVER MAXIMUM**

- **Visual:** Big red indicator, alert icon
- **Headline:** "Your rent appears to exceed legal limits"
- **Message:** "You are paying €170/month more than the maximum legal rent (€2,040/year or 28% over the legal limit)"

- **Emotion:** SHOCK → ANGER → VALIDATION
  - "I KNEW IT!"
  - "That's €2,000/year I'm losing!"
  - "This is proof!"

- **Action Buttons:**
  - Primary (large, red, urgent): "Get Help from WUUNE Collective"
  - Secondary: "Download PDF Report"
  - Tertiary: "Take Detailed Questionnaire"

- **First Action:** Downloads PDF (wants evidence)
- **Time:** 2 minutes reading results, downloading

**6. Commitment Escalation**
- After PDF download, pop-up/prompt:
  "Want personalized support for your situation? Take our 5-minute questionnaire."
- Marie thinks: "I've come this far, and I'm angry. Let's do it."
- **Action:** Clicks "Start Questionnaire"
- **Emotion:** Determined, seeking support

**7. Questionnaire** (5-8 minutes)
- Section 1: Her data pre-filled (frictionless)
- Section 2: Personal situation - describes 3-year lease, modest income
- Section 3: Housing problems - checks "excessive cold", "drafts"
- Section 4: Positive aspects - "good location"
- Section 5: Sees WUUNE info and personalized support message
- **Emotion:** Cathartic (sharing full story), hopeful (support available)
- **Time:** 7 minutes

**8. The Conversion Moment**
- Questionnaire results page shows:
  - "Priority case: Rent significantly over legal limit + housing defects"
  - "WUUNE can help you: Free negotiation support, legal advice, community of 500+ tenants"
  - Success stat: "80% of members achieve rent reductions or repairs"
  - "Average rent reduction: €200/month"

- **Emotion:** Hope + Urgency + Desire for community
- **Visual:** Prominent "Join WUUNE Collective" button
- **Action:** Clicks button
- **Time:** 3 minutes reading, deciding

**9. Contact Form** (Pre-filled)
- Name: [Blank - she fills "Marie Durand"]
- Email: [Pre-filled from questionnaire]
- Subject: [Pre-set to "Help with rent negotiation"]
- Message: [Template pre-filled with her situation]
- Newsletter: [Checked]
- Assemblies: [Checked]

- **Emotion:** Relief (easy, they already know my situation)
- **Action:** Adds her name and phone number, clicks "Join WUUNE"
- **Time:** 2 minutes

**10. Confirmation**
- Success page: "Welcome to WUUNE! Check your email for next steps."
- Immediate email:
  - Confirms membership
  - Explains what happens next (48h personal contact)
  - Provides next assembly date
  - Links to resources
  - Attached: Her PDF calculation report

- **Emotion:** Validated + Supported + Part of something bigger
- **Action:** Reads email, saves PDF, marks assembly date on calendar

**11. Follow-Up** (48 hours later)
- Personal email from WUUNE volunteer
- "Hi Marie, I'm Sophie from WUUNE. I saw your situation and I'd like to help..."
- Schedules call to discuss negotiation strategy
- Invites to next assembly (next week)

**12. Engagement** (1 week later)
- Marie attends her first online assembly
- Hears other tenant success stories
- Learns negotiation techniques
- Meets community
- Feels empowered

**13. Outcome** (2 months later)
- With WUUNE support, Marie negotiates with landlord
- Landlord agrees to reduce rent to €1,400 (maximum legal amount)
- Savings: €200/month = €2,400/year
- Marie becomes active WUUNE member
- Shares calculator with friends
- Attends monthly assemblies

**Total Journey Time:** 15-20 minutes (awareness to membership)
**Result:** CONVERSION SUCCESSFUL

---

### Journey 2: Landlord Compliance Check

**Scenario:** Pierre inherited a property and wants to rent it legally. He plans to charge €1,150/month and wants to verify compliance.

**Complete Journey:**

**1. Awareness** (Google Search)
- Searches: "Brussels legal rent calculation"
- Finds Loyer.Brussels in results
- **Emotion:** Concerned, seeking guidance

**2. Landing Page**
- Immediately notices "Landlords" section in navigation
- **Emotion:** "Oh good, this is for me too"
- **Action:** Clicks "Information for Landlords"

**3. Landlord Section** (Green theme)
- Sees: Professional, non-judgmental tone
- Headline: "Set fair, legal rent prices"
- Content: Understanding regulations, compliance benefits
- **Emotion:** Reassured (not being attacked)
- **Action:** Clicks "Calculate Reference Rent"
- **Time:** 3 minutes reading

**4. Calculator** (Same tool, neutral messaging)
- Goes through same 6 steps
- Enters property details for his apartment
- No political messaging, professional throughout
- **Time:** 5 minutes

**5. Results**
- Reference rent: Min €950, Median €1,050, Max €1,150
- He planned: €1,150
- Comparison: **Exactly at maximum**

- **Message:** "Your proposed rent (€1,150) is at the maximum legal amount. Consider setting rent at or below maximum to ensure compliance and avoid disputes."

- **Emotion:** Grateful (caught it before problem)
- **Thought:** "I was going to charge exactly the maximum... maybe I should lower it a bit to be safe"
- **Action:** Downloads PDF, decides to charge €1,100

**6. Conversion**
- Secondary CTA: "Subscribe to regulatory updates"
- **Emotion:** Wants to stay informed
- **Action:** Subscribes to newsletter
- **Time:** 1 minute

**7. Outcome**
- Pierre charges €1,100 (legal, comfortable margin)
- Receives monthly newsletter with regulatory updates
- Positive view of WUUNE as helpful resource
- Recommends tool to other landlord friends

**Total Journey Time:** 10-15 minutes
**Result:** Appropriate conversion (newsletter, not membership), potential ally created

---

### Journey 3: Housing Activist Mobilization

**Scenario:** Amina is a student and activist. She finds the tool through activist networks and wants to help her community.

**Complete Journey:**

**1. Awareness** (Activist Network)
- Sees tool shared in housing rights WhatsApp group
- Message: "Great tool to help tenants - check your rent + organize!"
- **Emotion:** Interested, politically motivated

**2. Calculator** (Quick Path)
- Uses calculator for her own apartment (she's fine, slightly below grid)
- **Result:** Below grid
- **Emotion:** Privileged + responsible
- **Message:** "You have a favorable situation. Help others achieve the same."
- **Time:** 5 minutes

**3. Immediate Action**
- Doesn't need personal support, but politically motivated
- **Action:** Clicks "Support Tenant Rights" button
- Taken directly to WUUNE membership/contact
- **Time:** 1 minute

**4. Membership** (Fast track)
- Fills contact form quickly
- Checks both newsletter + assemblies
- Message: "I want to get involved in tenant organizing"
- **Emotion:** Ready to act
- **Time:** 3 minutes

**5. Amplification**
- Immediately shares tool on social media:
  - Instagram story: "Check if your rent is legal! Link in bio"
  - WhatsApp groups: Sends to 5 friend groups
  - Facebook: Shares with commentary about housing rights
- **Time:** 5 minutes

**6. Community Organizing**
- Attends first assembly (next week)
- Volunteers to help organize
- Uses calculator to help 10 friends check their rents
- 3 friends discover they're overpaying
- Brings them all to WUUNE

**Total Journey Time:** 15 minutes
**Result:** Not just conversion - MULTIPLIER (recruits others)

---

### Drop-off Points & Recovery

**Critical Drop-offs:**

**Point 1: Calculator Step 3** (Property Details)
- **Drop-off Rate:** ~15%
- **Why:** Too many questions, mobile difficulty
- **Recovery:** Simplify inputs, progress encouragement, save progress, send reminder email

**Point 2: Results → Questionnaire**
- **Drop-off Rate:** ~65% (BIGGEST PROBLEM)
- **Why:** Already got answer, unclear value of continuing
- **Recovery:**
  - Emphasize personalized support benefit
  - Show time estimate: "Just 5 more minutes"
  - Social proof: "500+ completed"
  - Situation-specific urgency
  - **Target:** Reduce to 40% drop-off

**Point 3: Questionnaire → Contact**
- **Drop-off Rate:** ~50%
- **Why:** Another form feels redundant
- **Recovery:**
  - Integrate contact into questionnaire
  - Pre-fill everything possible
  - Make it feel like "one more click"
  - Strong value proposition

---

## 7. Content & Messaging Strategy

### Brand Voice

**WUUNE Personality:**
- **Empowering** (not victimizing): "Know your power" not "You're powerless"
- **Professional** (not amateur): Credible, trustworthy, legitimate
- **Collective** (not individual): "We" not "I", "Together" not "Alone"
- **Urgent** (not passive): "Act now" not "Think about it"
- **Welcoming** (not intimidating): "Join us" not "This is only for activists"

**Tone by Context:**

| Context | Tone | Example |
|---------|------|---------|
| Calculator instructions | Clear, neutral, helpful | "Enter your living space in square meters" |
| Abusive rent results | Urgent, supportive, action-oriented | "Your rent may exceed legal limits. Get immediate support." |
| Fair rent results | Reassuring, community-focused | "Your rent is fair. Help protect this for all tenants." |
| Questionnaire | Empathetic, research-oriented | "Your experience helps us fight for better housing." |
| Landlord section | Professional, educational, non-confrontational | "Ensure your rental complies with Brussels regulations." |
| Membership CTA | Inspiring, collective, empowering | "Join 500+ tenants building power together." |

### Key Messages by Audience

**For Concerned Tenants:**
- Primary: "Know your rights, know your rent"
- Secondary: "You're not alone - 500+ Brussels tenants are organized"
- Value Prop: "Free rent calculation + community support"
- Urgency: "83% of tenants don't know if their rent is legal"

**For Housing Activists:**
- Primary: "Build tenant power in Brussels"
- Secondary: "Join the collective fighting for housing justice"
- Value Prop: "Organize with us - tools, training, community"
- Urgency: "The housing crisis demands collective action"

**For Landlords:**
- Primary: "Set fair, legal rents with confidence"
- Secondary: "Understand Brussels rent regulations"
- Value Prop: "Free tool to ensure compliance and avoid disputes"
- Urgency: "Regulations are updated annually - stay informed"

### Situational Messaging

**Result-Based Messaging:**

**Abusive Rent (>20% over max):**
- **Emotional Trigger:** Anger, urgency, validation
- **Headline:** "Your rent exceeds legal limits"
- **Core Message:** "You may be overpaying €[X]/month (€[Y]/year). This is not acceptable. Get support now."
- **Call-to-Action:** "Get immediate help"
- **Follow-up:** "WUUNE has helped 80% of members reduce rent"

**High Rent (+5-20% over):**
- **Emotional Trigger:** Concern, frustration
- **Headline:** "Your rent is at the upper limit"
- **Core Message:** "While technically legal, your rent is high. Negotiation may be possible."
- **Call-to-Action:** "Learn negotiation strategies"
- **Follow-up:** "Join WUUNE for support"

**Fair Rent (±5%):**
- **Emotional Trigger:** Relief, but vulnerability
- **Headline:** "Your rent is within the legal range"
- **Core Message:** "Your situation is compliant. Help us protect these rights for all tenants."
- **Call-to-Action:** "Join the community"
- **Follow-up:** "These protections require collective action to maintain"

**Below Grid (<-5% under):**
- **Emotional Trigger:** Privilege, responsibility
- **Headline:** "You have a favorable situation"
- **Core Message:** "You're in a good position. Help other tenants achieve the same."
- **Call-to-Action:** "Support tenant rights"
- **Follow-up:** "Solidarity means supporting those less fortunate"

### Content Principles

**DO:**
- Use "we" language (builds collective identity)
- Use active voice ("Take action" not "Action can be taken")
- Use specific numbers (€350/month not "significant amount")
- Create emotional connection ("You're not alone")
- State clear benefits ("Free support" not vague promises)
- Use social proof (500+ members, 80% success rate)

**DON'T:**
- Use victim language ("exploited" → "rent exceeds legal limits")
- Use aggressive tone ("fight your landlord" → "negotiate fair rent")
- Use jargon without explanation
- Use passive voice
- Make vague promises
- Overwhelm with too much text

---

## 8. Design Requirements

### Visual Identity

**WUUNE Brand Colors:**

**Primary Palette:**
- **WUUNE Red:** Main brand color for tenant-facing content
  - Use: Primary buttons, urgent messaging, brand elements, headings
  - Emotion: Energy, urgency, political action, passion

- **Deep Red:** Darker shade for contrast
  - Use: Hover states, backgrounds, emphasis
  - Emotion: Seriousness, determination

**Secondary Palette:**
- **Landlord Green:** For landlord section only
  - Use: Landlord pages, buttons, headers (separate identity)
  - Emotion: Professional, compliant, neutral, safe

- **Neutral Gray:** Body text and secondary elements
- **Light Gray:** Backgrounds, cards, subtle separators

**Accent Colors:**
- **Success Green:** Rent is fair/compliant
- **Warning Orange:** Rent is high but legal
- **Danger Red:** Rent is potentially abusive
- **Info Blue:** Below grid or informational content

**When to Use Which Color:**
- Calculator: Neutral (no political messaging yet)
- Results for tenants: Red accent (WUUNE engagement)
- Results for landlords: Green accent (landlord mode)
- Rent comparison: Traffic light system (green=good, orange=warning, red=problem)

---

### Typography

**Requirements:**
- **Modern, readable sans-serif** font
- **Bold weights** for headings and CTAs
- **Regular weight** for body text
- Works in French, Dutch, English (including special characters: é, è, à, ë, ï)

**Hierarchy:**
- **H1** (Page titles): Large, bold, attention-grabbing
- **H2** (Section headers): Clear hierarchy below H1
- **H3** (Subsections): Distinct but smaller
- **Body text**: Comfortable reading size (not too small)
- **Small text**: Legal disclaimers, help text, footnotes

**Size Guidelines:**
- Body text: Minimum 16px (mobile), comfortable for reading
- Headings: Proportionally larger
- Help text: Slightly smaller but still legible (14px minimum)

**Line Height:**
- Body text: 1.5 (comfortable reading)
- Headings: 1.2 (tighter, more impact)

---

### Button Styles

**Primary Button:**
- Most important action on page
- Background: WUUNE Red (or green in landlord section)
- Text: White, bold
- Size: Large, touch-friendly (minimum 48px height on mobile)
- Padding: Generous (comfortable to tap)
- Corners: Rounded (modern, friendly)
- Hover: Slightly darker shade
- Example uses: "Calculate My Rent", "Join WUUNE", "Get Help Now"

**Secondary Button:**
- Important but not primary action
- Background: Transparent or light
- Border: Solid line in brand color
- Text: Brand color, bold
- Same sizing as primary
- Hover: Light background fill
- Example uses: "Download PDF", "Take Questionnaire"

**Text Button:**
- Tertiary actions, less emphasis
- No background, no border
- Text: Underline on hover
- Smaller acceptable
- Example uses: "Back", "Edit", "Learn More"

**Destructive Button:**
- For dangerous actions (rare)
- Red regardless of context
- Example: "Delete", "Cancel" (if irreversible)

---

### Form Elements

**Text Inputs:**
- Height: 48px on mobile (prevents zoom), 44px on desktop acceptable
- Border: 1px solid, neutral color
- Corners: Rounded to match buttons
- Padding: 12-16px
- Font size: 16px minimum (prevents mobile zoom)
- Focus state: Border changes to brand color
- Error state: Red border, error message below
- Success state: Green indicator (optional)

**Dropdowns/Select:**
- Same height and styling as text inputs
- Clear chevron/arrow indicator
- Custom styling (not default browser dropdown)

**Checkboxes:**
- Size: 20px × 20px minimum (touch-friendly)
- Border: 2px for visibility
- Checked state: Filled with brand color, white checkmark
- Label: Clickable (not just checkbox)
- Clear checked/unchecked states

**Radio Buttons:**
- Similar to checkboxes but circular
- Only one selectable per group
- Clear visual feedback

**Toggle Switches:**
- For yes/no questions
- Clear on/off states
- Animated transition
- Size: Large enough to tap easily

**Textarea:**
- Same styling as text input
- Minimum height: 5 lines visible
- Resizable vertically

---

### Cards & Containers

**Standard Card:**
- Background: White (or very light gray)
- Border: 1px solid, subtle color OR no border with shadow
- Shadow: Subtle, creates depth
- Corners: Rounded (consistent with buttons)
- Padding: Generous (24px)
- Use: Content grouping, steps, information display

**Interactive Card:**
- Same as standard card but clickable
- Hover state: Lift effect (increase shadow) OR border color change
- Cursor: Pointer to indicate clickability
- Use: Property type selection, housing type selection

**Result Card:**
- More prominent than standard
- Can have colored border or background based on result
- Larger padding
- Clear visual hierarchy
- Use: Displaying rent calculation results

---

### Progress Indicators

**Step Progress:**
- Visual: Numbered steps with connecting line
- Active step: Highlighted in brand color
- Completed steps: Checkmark icon, brand color
- Future steps: Gray, outlined numbers
- Always include text: "Step 3 of 6"
- Mobile: Simplified if needed (just "3/6")

**Loading Spinner:**
- Circular, rotating
- Brand color
- Sizes: Small (inline) and large (full page)
- Use: During calculation, PDF generation, form submission

**Progress Bar:**
- Horizontal bar that fills
- Brand color fill
- Background: Light gray
- Animated fill
- Use: Questionnaire progress, upload progress

---

### Icons & Imagery

**Icons:**
- Consistent style throughout (all line-based OR all filled)
- Appropriate size for touch (24px minimum if clickable)
- Use sparingly (support text, don't replace it)
- Common needs:
  - Help/info icon (? or i in circle)
  - Home/property icons
  - Checkmark (success)
  - Alert/warning
  - Error (X or exclamation)
  - Email, phone, location
  - Download, share, edit
  - Arrow (back, next, dropdown)

**Photography:**
- Authentic Brussels housing (not stock)
- Diverse people (if showing community)
- Professional but warm
- Avoid: Overly polished corporate stock photos

**Illustrations:**
- Simple, friendly style
- Brand colors incorporated
- Use: Empty states, explainer content, decorative accents

---

### Mobile-First Design

**Requirements:**

**Touch Targets:**
- **Minimum size: 44px × 44px** (Apple standard)
- Prefer: 48px × 48px for generosity
- Spacing: 8px minimum between tappable elements
- Larger targets for primary actions

**Layout:**
- Single column on mobile (no side-by-side complex layouts)
- Generous spacing between sections
- Thumbs can reach key actions
- Bottom-aligned action buttons (easier to reach)

**Forms:**
- One question at a time OR clearly grouped
- Large input fields
- Clear labels above inputs (not beside)
- Error messages immediately below related field
- Avoid excessive scrolling

**Navigation:**
- Simplified mobile menu (hamburger if needed)
- Clear back buttons
- Breadcrumbs or progress indicators always visible
- No hidden functionality

**Performance:**
- Fast page loads (<3 seconds on 3G)
- Optimized images
- Minimal large files
- Progressive enhancement

**Testing:**
- Must test on real devices (iOS and Android)
- Various screen sizes (small phones to tablets)
- Both orientations
- With different text sizes (accessibility)

---

### Accessibility

**WCAG 2.1 Level AA Compliance:**

**Color Contrast:**
- Text on background: Minimum 4.5:1 ratio
- Large text (24px or 18px bold): Minimum 3:1
- UI components and icons: Minimum 3:1
- Never rely on color alone (use icons + text)

**Keyboard Navigation:**
- All interactive elements reachable by Tab key
- Logical tab order (left-to-right, top-to-bottom)
- Visible focus indicators (outline or highlight)
- Skip to main content link
- Escape key closes modals/popups

**Screen Reader Support:**
- Semantic HTML (proper heading levels, nav, main, etc.)
- Alt text for all images
- Labels for all form fields
- Error messages announced
- Loading states announced
- ARIA labels where needed

**Forms:**
- Labels visible and properly associated
- Required fields clearly marked
- Errors clearly indicated
- Success confirmations
- Help text available

**Other Requirements:**
- No content that flashes more than 3 times per second (seizure risk)
- Users can pause/stop moving content
- Text can be resized up to 200% without breaking layout
- Support for keyboard-only users
- Support for screen magnification

---

## 9. Data & Information Requirements

### What Data We Collect

**Calculator Data:**
From the 6-step calculator, we collect:

**Property Information:**
- Housing type (private/AIS/social)
- Property type (studio/apartment/house)
- Number of bedrooms (0-10)
- Number of bathrooms (1-5)
- Living space (square meters)
- Energy performance rating (A-G or unknown)
- Features: Central heating, thermal regulation, double glazing, second bathroom, recreational spaces, storage spaces, number of garages
- Building construction date (before/after 2000)
- Postal code (required for calculation)
- Street name (optional)
- Building number (optional)

**User Information (Optional):**
- Email address
- Phone number
- Current/proposed rent amount

**Calculated Results:**
- Reference rent (minimum, median, maximum)
- Difficulty index (from postal code)
- Rent comparison (over/under percentage)
- Situation classification (abusive/high/fair/below)

**Questionnaire Data:**
If user completes detailed questionnaire, we additionally collect:

**Personal Situation:**
- Lease type and duration
- Lease start date
- Monthly household income (optional)
- Household composition
- Rent indexation history
- Boiler maintenance and fire insurance inclusion

**Housing Issues:**
- Health issues present (mold, cold, drafts, noise, pests, etc.)
- Major defects (structural, plumbing, electrical, etc.)
- Positive aspects (location, light, maintenance, etc.)
- Additional free-text comments

**Contact Information:**
- Confirmation of email/phone
- Newsletter opt-in
- Assembly invitation opt-in

**Contact Form Data:**
- Full name
- Email address
- Subject
- Message
- Newsletter opt-in
- Assembly opt-in

**Metadata (Automatically Captured):**
- Submission timestamp
- Session ID (links calculator → questionnaire → contact)
- Referral source (where they came from)
- Device type (mobile/tablet/desktop)

---

### Data Storage Requirements

**What Needs to Be Saved:**

**Permanent Storage:**
- Complete questionnaire submissions (all data above)
- Contact form submissions
- Newsletter/assembly sign-ups
- Rent calculation results (for research)

**Temporary Storage:**
- Calculator progress (saved for 24 hours, in case user returns)
- Session data (calculator → questionnaire → contact flow)

**Not Stored:**
- Calculator results if user doesn't provide email
- Anonymous calculations (unless user opts in)
- Credit card or payment info (no payments in this system)

**Data Linking:**
- Each user journey gets a unique Session ID
- Links calculator data → questionnaire → contact submission
- Allows seeing complete user journey
- Email serves as identifier across sessions

---

### Data Organization

**Key Data Relationships:**

**Contact Submissions:**
- Stores: Name, email, subject, message, newsletter opt-in, assembly opt-in
- Searchable by: Email, date, subject
- Used for: Direct WUUNE follow-up, newsletter lists, assembly invitations

**Questionnaire Responses:**
- Stores: All calculator data + personal situation + housing issues
- Searchable by: Email, postal code, rent situation, date
- Used for: Personalized support, research, policy advocacy, targeted outreach
- Links to: Contact submission via email or session ID

**Address Database (Reference Data):**
- Brussels postal codes and street names
- Each postal code has a "difficulty index"
- Used for: Address validation, rent calculation
- Source: Official Brussels government data

**Newsletter Subscribers:**
- Separate list of all newsletter opt-ins
- Sourced from: Calculator, questionnaire, contact form
- Used for: Monthly email campaigns
- Must support: Unsubscribe, preference management

**Assembly Invitees:**
- Separate list of assembly invitation opt-ins
- Used for: Event invitations
- Must support: Unsubscribe

---

### Data Privacy & Security

**User Rights (GDPR):**

**Users Must Be Able To:**
1. **Access their data**: Request a copy of everything stored
2. **Correct their data**: Fix errors or outdated information
3. **Delete their data**: "Right to be forgotten"
4. **Export their data**: Get machine-readable copy
5. **Opt out of research use**: Separate consent for research
6. **Unsubscribe**: Easy opt-out from emails

**Consent Requirements:**

**Calculator:**
- Basic use: No consent needed (no data stored)
- Email collection: Checkbox "I consent to WUUNE storing this data for sending results and updates"
- Clear purpose: "We'll send you your calculation and occasional housing rights updates"

**Questionnaire:**
- Explicit consent checkbox at start: "I consent to sharing detailed information for research and advocacy purposes"
- Must be checked to proceed
- Can opt out of research while still getting support

**Contact Form:**
- Form submission implies consent for contact
- Notice: "By submitting, you agree to WUUNE contacting you about your message"

**Newsletter:**
- Separate opt-in checkbox
- Not pre-checked
- Unsubscribe link in every email

**Privacy Notices:**
- Clear, prominent on all forms
- Plain language (not legal jargon)
- Link to full privacy policy
- Specific about data use:
  - Rent calculation
  - Personalized support
  - Research (anonymized)
  - Housing advocacy
  - Never sold to third parties

**Data Retention:**
- Questionnaire responses: Keep indefinitely (research value) UNLESS user requests deletion
- Contact form: Keep 3 years, then review
- Newsletter subscribers: Keep until unsubscribe
- Calculator sessions: Delete after 24 hours

---

### Address Database

**What It Is:**
Official Brussels address data with rent calculation factors

**Required Data:**
- All Brussels postal codes (1000-1210)
- Street names for each postal code
- "Difficulty index" for each postal code
- Commune names

**How It's Used:**
1. **Postal code validation**: Verify user entered valid Brussels code
2. **Street autocomplete**: Suggest matching streets as user types
3. **Difficulty index lookup**: Fetch location factor for calculation
4. **Address documentation**: Complete address for PDF reports

**Data Source:**
- Official Brussels government housing database
- Must be updated if government changes data
- Provide data source attribution

---

### Reporting & Analytics

**What to Track:**

**User Journey:**
- Calculator started
- Each step completed
- Calculator completed (reached results)
- PDF downloaded
- Questionnaire started
- Questionnaire completed
- Contact form submitted

**Drop-offs:**
- Where users abandon process
- Time spent at each step
- Patterns (mobile vs desktop, language, etc.)

**Rent Data (Aggregated):**
- Distribution of rent situations (% abusive, high, fair, below)
- Average overpayment amount
- Overpayment by postal code
- Overpayment by property type
- Energy class distribution
- Common housing problems

**Conversion Metrics:**
- Calculator → Questionnaire conversion rate
- Questionnaire → Contact conversion rate
- Overall conversion funnel
- By rent situation
- By device type

**Important:**
- Aggregate data only (no individual tracking for reporting)
- Anonymize before analysis
- Privacy-respecting analytics (no cross-site tracking)
- Respect Do Not Track preferences

---

## 10. Multi-Language Support

### Languages Required

**1. French (Français) - PRIMARY**
- Default language
- ~70% of Brussels users
- All content must be in French
- Belgian French variants (not France French)
- Example: "septante" (70), "nonante" (90)

**2. Dutch (Nederlands/Vlaams) - REQUIRED**
- Brussels second official language
- ~20% of users
- Full translation required
- Flemish variant preferred (Belgian Dutch)

**3. English - RECOMMENDED**
- International residents
- ~10% of users
- At minimum: Calculator, key pages
- Full site preferred
- International English (not US-specific)

### What Must Be Translated

**Everything user-facing:**
- All page content
- All buttons, labels, placeholders
- All help text and tooltips
- All form fields and options
- All error messages
- All success confirmations
- All email templates (both user and admin)
- PDF report contents
- Privacy policy
- Legal disclaimers
- FAQ and help documentation

**Translation Quality:**
- Professional translation (not just machine translation)
- Reviewed by native Brussels speakers
- Culturally adapted (not literal translation)
- Consistent terminology across all pages
- Legal accuracy for regulatory content

### How Language Selection Works

**URL Structure:**
- French: `/fr/calculateur`
- Dutch: `/nl/calculator`
- English: `/en/calculator`
- Root `/` → Redirect to user's browser language OR French

**Language Switcher:**
- Visible on all pages (usually top right)
- Options: FR | NL | EN
- Stays on same page when switching
- Preserves calculation data when switching
- Simple, clear labels (flag icons optional)

**Browser Detection:**
- Detect user's browser language on first visit
- Suggest appropriate language: "Ce site est disponible en français"
- Remember user's choice (cookie or local storage)
- Don't force language (user can always switch)

**If Translation Missing:**
- Show French version
- Note: "This content is not yet available in [language]"
- Never show translation keys or error codes

### Cultural Considerations

**Dates:**
- French: DD/MM/YYYY (e.g., 04/11/2025)
- Dutch: DD-MM-YYYY (e.g., 04-11-2025)
- English: DD/MM/YYYY (European format)

**Numbers:**
- Decimal separator: Comma (1.234,56)
- Thousands separator: Period or space (1.234 or 1 234)
- Currency: € symbol after number with space: "1.234,56 €"

**Currency:**
- Always euros (€)
- Display: "1.500 €" (space before symbol, French/Dutch)
- Input: Accept both comma and period as decimal

**Tone:**
- French: Formal "vous" (not informal "tu")
- Dutch: Formal "u"
- English: Professional but friendly

**Brussels Context:**
- Acknowledge bilingual nature of Brussels
- Respect both language communities
- Avoid language politics
- Inclusive, welcoming tone for all

---

## 11. Success Metrics

### Primary Goals

**1. User Engagement**

| Metric | Current Baseline | 6-Month Target |
|--------|-----------------|----------------|
| Calculator Completions | ~3,000/year | 5,000/year |
| Calculator Completion Rate | ~60% | >80% |
| Calculator → Questionnaire | ~35% | >60% |
| Questionnaire Completion Rate | ~50% | >75% |
| Contact Form Submissions | ~20% of questionnaire | >50% |
| Overall Conversion (Entry → Member) | ~5% | >15% |

**What We're Measuring:**
- How many people start the calculator
- How many complete all 6 steps
- How many continue to questionnaire after results
- How many complete the full questionnaire
- How many join WUUNE (contact form with membership)

**2. Membership Growth**

- **Target:** 1,000 new WUUNE members in first year
- **Current:** ~50 members/month
- **Goal:** 100+ members/month
- **Metric:** Contact form submissions indicating membership interest

**What Success Looks Like:**
By end of Year 1, WUUNE has 1,000+ new members recruited through this tool, giving them significantly more political power and organizing capacity.

**3. Data Collection for Research**

- **Target:** 500 complete questionnaires in first year
- **Metric:** Questionnaire submissions with full data
- **Quality:** >90% complete (no major gaps in responses)
- **Geographic:** Coverage of all Brussels postal codes

**What Success Looks Like:**
WUUNE has comprehensive dataset showing rent exploitation patterns across Brussels, used for policy advocacy and media campaigns.

---

### User Experience Metrics

**Page Performance:**
- Calculator page load: <2 seconds on mobile
- Step transitions: <500 milliseconds
- Form submission: <1 second response
- PDF generation: <3 seconds

**Mobile Experience:**
- Mobile users: Expect 60% of traffic
- Mobile completion rate: >50% (target)
- Mobile abandonment: <50%
- Touch target compliance: 100% (all elements ≥44px)

**Accessibility:**
- WCAG 2.1 AA compliance: 100%
- Keyboard navigation: All features accessible
- Screen reader compatible: Full support
- Color contrast: All text passes ratio requirements

**User Satisfaction:**
- Post-completion survey rating: >4.0/5.0
- Would recommend: >70%
- "Found it easy to use": >80%
- "Got helpful information": >85%

---

### Business Impact Metrics

**Advocacy Impact:**

**Rent Reductions:**
- Target: 100 successful cases in first year
- Metric: Follow-up survey of members
- Average reduction: Track €/month saved
- Success rate: >70% of cases

**What We're Measuring:**
Of members who requested support for high rent, how many successfully reduced their rent with WUUNE's help?

**Policy Influence:**
- Media mentions: Track press coverage
- Policy citations: References in government reports
- Partnership requests: Housing authorities, researchers wanting to collaborate
- Data requests: Organizations seeking access to aggregate data

**Community Building:**

**Engagement:**
- Assembly attendance: Average 50+ per meeting
- Newsletter open rate: >40%
- Newsletter click rate: >10%
- Social media shares: Track viral reach

**Retention:**
- Member retention: >80% still active after 6 months
- Active participation: >30% attend events
- Volunteer recruitment: 10% of members volunteer

---

### Operational Metrics

**System Reliability:**
- Uptime: >99.9%
- Error rate: <0.1% of requests
- Data integrity: 100% (no data loss)
- Backup success: Daily, 100% success rate

**Response Times:**
- Contact form response: <48 hours
- Email delivery: >99% success
- Questionnaire follow-up: <48 hours personal contact

**Cost Efficiency:**
- Cost per calculation: <€0.10
- Cost per member acquired: <€5
- Monthly operating costs: <€500 (hosting, email, services)

---

### How Metrics Will Be Tracked

**Analytics Dashboard:**

**Real-time:**
- Current active users
- Today's calculations completed
- Today's questionnaire submissions

**Daily:**
- Total calculations
- Conversion rates at each step
- New members

**Weekly:**
- Drop-off analysis
- Device/browser distribution
- Geographic distribution
- Language preferences

**Monthly:**
- Full funnel analysis
- Month-over-month growth
- Completion rate trends
- Member acquisition

**Quarterly:**
- Strategic goal progress
- User satisfaction surveys
- Impact assessments
- Research findings

**Reports:**
- Weekly: Auto-generated email to WUUNE team
- Monthly: Detailed analysis with recommendations
- Quarterly: Board presentation with insights
- Annual: Public-facing impact report

---

## 12. Legal & Compliance

### Privacy & Data Protection (GDPR)

**Required Compliance:**

**Privacy Policy Page:**
Must include:
- Who collects data (WUUNE organization)
- What data is collected (detailed list)
- Why data is collected (calculation, research, organizing)
- Legal basis (consent, legitimate interest)
- How long data is kept (retention policy)
- User rights (access, correction, deletion)
- How to exercise rights (email contact)
- Right to complain to data protection authority
- No data sold or shared with third parties

**Cookie Consent:**
- Banner appears on first visit
- Explains what cookies are used
- Separate consent for:
  - Essential cookies (required for functionality)
  - Analytics cookies (tracking usage)
- Can accept or reject non-essential
- Link to full cookie policy
- Remember user's choice

**Consent Mechanisms:**

Throughout the app, users must actively consent:

**Calculator Email Collection:**
- Clear checkbox: "I consent to WUUNE storing my email to send results and updates"
- Not pre-checked
- Purpose clearly stated

**Questionnaire:**
- Checkbox at start: "I consent to sharing detailed information for research and advocacy"
- Must check to proceed
- Explanation of how data will be used

**Newsletter:**
- Separate opt-in checkbox
- Never pre-checked
- Unsubscribe in every email

**Contact Form:**
- Notice: "By submitting, you consent to WUUNE contacting you about your message"
- Privacy policy link

**User Rights Implementation:**
- **Access:** Email form to request all data
- **Correction:** Email to correct data
- **Deletion:** Email to request deletion (honored within 30 days)
- **Export:** Provide data in readable format (JSON or PDF)
- **Unsubscribe:** One-click unsubscribe in all emails

---

### Brussels Housing Law Compliance

**Legal Disclaimers:**

**On Calculator Results:**
```
IMPORTANT LEGAL NOTICE:
This rent calculation is for informational purposes only.
Based on Brussels Housing Code regulations but does not
constitute legal advice or official determination.

For official rent evaluations, contact:
- Brussels Housing Inspection: [contact]
- Regional Housing Observatory: [contact]

Only a court or authorized authority can make binding
legal determinations about rent.

Formula last updated: [Date]
Indexation factor: [Current year factor]
```

**On PDF Reports:**
```
This document is automatically generated based on user-provided
information. WUUNE is not responsible for inaccurate inputs.
This does not constitute legal advice. Consult housing
authorities or legal professionals for official evaluations.
```

**Formula Accuracy:**
- Must match official Brussels Housing Code exactly
- Update annually when government updates indexation
- Maintain version history of formula changes
- Changes reflected within 30 days of official updates
- Display date of last update

**Source Attribution:**
- Reference Brussels Housing Code articles
- Link to official government resources
- Credit Brussels Capital Region
- Cite data sources (address database, difficulty index)

---

### Email Compliance

**CAN-SPAM / GDPR Requirements:**

**All Marketing Emails Must Have:**
- Clear "From" line (WUUNE or official name)
- Accurate subject lines (no deception)
- Physical mailing address in footer
- One-click unsubscribe link
- Honor unsubscribe within 48 hours
- Separate lists for newsletter vs assembly invitations

**Transactional Emails:**
(Confirmation emails, password resets, etc.)
- Don't need unsubscribe
- Still need identifying information

**Unsubscribe Process:**
- One-click unsubscribe (no login required)
- Process within 48 hours
- Confirmation: "You've been unsubscribed"
- Option to resubscribe if accidental

---

### Accessibility Compliance

**WCAG 2.1 Level AA:**

**Required Compliance:**
- Perceivable: Text alternatives, adaptable, distinguishable
- Operable: Keyboard accessible, enough time, navigable
- Understandable: Readable, predictable, input assistance
- Robust: Compatible with assistive technologies

**Testing Requirements:**
- Automated testing (free tools available)
- Manual keyboard navigation testing
- Screen reader testing
- Color contrast verification
- Mobile responsiveness
- Test with users with disabilities (recommended)

**Accessibility Statement:**
- Page describing accessibility features
- Known issues and workarounds
- Contact for accessibility concerns
- Commitment to improvement

---

### Terms of Service

**Should Include:**

**Acceptable Use:**
- Calculator is for personal, non-commercial use
- Don't scrape or automate requests
- Don't misuse or attempt to hack

**Disclaimers:**
- Tool provides information, not legal advice
- WUUNE not liable for rent disputes
- Not responsible for inaccurate user inputs
- Data security reasonable but not guaranteed

**User Responsibilities:**
- Provide accurate information
- Don't submit false data
- Respect other users and organization

**Limitation of Liability:**
- WUUNE not liable for damages from tool use
- No warranty of accuracy or availability
- Standard legal limitations

**Governing Law:**
- Belgian law
- Brussels jurisdiction for disputes

**Changes to Terms:**
- Right to update terms
- Notify users of material changes
- Continued use = acceptance

---

### Insurance & Legal Protection

**Recommended for WUUNE:**
- General liability insurance
- Professional indemnity coverage
- Cyber security insurance (data breach coverage)
- Legal defense fund for potential disputes

---

## 13. Appendices

### Appendix A: Glossary

**Brussels Housing Terms:**

- **Rent Capping**: Legal maximum rent based on property characteristics
- **Reference Grid**: Official formula and constants for calculating fair rent
- **PEB**: Performance Énergétique du Bâtiment = Energy performance certificate (A-G rating)
- **AIS**: Agences Immobilières Sociales = Social real estate agencies (exempt from capping)
- **CPAS**: Public social welfare centers providing social housing
- **SLSP**: Public low-cost housing companies
- **Indexation**: Annual rent increase based on inflation (legal, separate from capping)
- **Difficulty Index**: Location-based factor in rent formula
- **Brussels Capital Region**: The 19 communes (1000-1210 postal codes)

**Application Terms:**

- **Calculator**: 6-step rent calculation tool
- **Questionnaire**: Detailed housing situation survey
- **Reference Rent**: Calculated fair rent (min/median/max)
- **Actual Rent**: User's current or proposed rent
- **Rent Situation**: Classification (abusive/high/fair/below grid)
- **Drop-off**: User abandoning process before completion
- **Conversion**: User completing desired action (questionnaire, membership)
- **Funnel**: The flow from calculator entry to WUUNE membership

**WUUNE Terms:**

- **WUUNE**: Collectif des locataires bruxellois = Brussels tenants' collective
- **Assembly**: Monthly meeting of members (online/in-person)
- **Collective**: The community of organized tenants
- **Membership**: Joining WUUNE organization

---

### Appendix B: Calculation Formula Details

**Note to Agency:**
This section describes what the calculation does in business terms. The exact mathematical formula with all constants will be provided separately in a technical specification document.

**What the Formula Does:**

**Step 1: Base Calculation**
Uses property type (studio/apartment/house) and bedroom count to determine starting formula constants. Larger properties and houses have different base rates.

**Step 2: Size Adjustment**
Considers living space in square meters. There's a diminishing return (first 50m² worth more per meter than next 50m²). Smaller properties have higher per-meter rates.

**Step 3: Location Factor**
Applies "difficulty index" based on postal code. Different Brussels neighborhoods have different construction costs and demand. This adjusts rent up or down by neighborhood.

**Step 4: Property Condition**
If property state is "excellent" vs "good" vs "poor", this adjusts the base rent accordingly.

**Step 5: Feature Adjustments**
Each feature adds or subtracts a fixed amount:
- Energy class A adds most (€160+)
- No central heating subtracts
- Second bathroom adds
- No recreational spaces subtracts
- Garages add per unit
- Etc.

**Step 6: Indexation**
Multiply by current year's indexation factor (accounts for inflation over time). Updated annually by government.

**Step 7: Range Calculation**
- Minimum = Result × 0.9
- Median = Result
- Maximum = Result × 1.1

This 10% range allows flexibility while preventing exploitation.

**Result:**
Three numbers (min/median/max) representing legally compliant rent range.

---

### Appendix C: Competitor Analysis

**Current Landscape:**

**1. Official Government Calculator** (if exists)
- Strengths: Official, authoritative
- Weaknesses: Often complex, poor UX, no support offered
- Our Advantage: Simpler UX + community support + political organizing

**2. Commercial Rental Platforms**
- Examples: Immoweb, Zimmo
- Strengths: Large user base, property listings
- Weaknesses: Landlord-focused, not advocacy-oriented, not transparent
- Our Advantage: Tenant-focused, transparent formula, free, political backing

**3. Legal Advice Websites**
- Strengths: Professional legal information
- Weaknesses: Not interactive, no calculation, expensive
- Our Advantage: Free, interactive tool + collective support

**4. Housing Nonprofits**
- Strengths: Credible, mission-aligned
- Weaknesses: Often lack modern tools, limited reach
- Our Advantage: Professional digital tool + grassroots organizing power

**Our Unique Position:**
ONLY tool that combines:
1. Accurate rent calculation
2. Transparent methodology (not black box)
3. Free service
4. Community support
5. Political organizing
6. Research and advocacy

---

### Appendix D: Future Enhancements

**Phase 2** (6-12 months after launch):

- **User Accounts**: Save calculations, track rent over time
- **Negotiation Tools**: Letter templates, mediation guides
- **Community Features**: Member directory, building-specific organizing
- **Advanced Analytics**: Public data visualizations, trend analysis

**Phase 3** (12-24 months):

- **Mobile Apps**: Native iOS/Android apps
- **Legal Case Management**: Document repository, case tracking
- **Landlord Platform**: Tools for property managers
- **API Access**: Public API for researchers

**Long-term Vision:**
- Expand to other Belgian regions
- Expand to other European cities with rent control
- Become reference platform globally
- Build largest tenant rights database in Europe

---

### Appendix E: Success Stories (Examples to Feature)

**For Inspiration and Social Proof:**

**Story 1: Marie's Rent Reduction**
"I was paying €1,600 for a 1-bedroom. The calculator showed my maximum legal rent was €1,430. With WUUNE's support, I negotiated with my landlord and got it reduced to €1,400. I'm saving €200/month - €2,400/year!"

**Story 2: Ahmed's Building Organization**
"Three tenants in my building used the calculator and discovered we were all overpaying. We joined WUUNE together and organized collectively. Our landlord agreed to adjust all our rents rather than face complaints."

**Story 3: Landlord Compliance**
"As a small landlord, I wanted to do the right thing. The calculator helped me understand the regulations and set a fair price. My tenant is happy, and I have no legal worries."

---

### Appendix F: Contact Information

**WUUNE Organization:**
- Email: contact@wuune.be
- Website: [If exists]
- Address: [Physical address for legal compliance]
- Phone: [If available]

**For Project Questions:**
[Project owner contact information]

**Response Time:**
All questions should receive response within 24-48 business hours.

---

### Appendix G: Brand Assets Needed

**To Be Provided by WUUNE:**

**Logo Files:**
- Primary WUUNE logo (vector format)
- Alternative versions (white, single-color)
- Minimum size specifications
- Clear space requirements

**Color Values:**
- Exact RGB/HEX values for:
  - WUUNE Red
  - Deep Red
  - Landlord Green (if specific shade preferred)
  - Accent colors

**Imagery:**
- Community photos (if available)
- Brussels housing imagery
- Assembly photos
- Any existing brand photography

**Voice Examples:**
- Sample copy they've used before
- Tone guide if documented
- Examples of messaging they like

---

## Document Control

**Version:** 1.0
**Date:** November 4, 2025
**Status:** FINAL - Ready for Agency Review

**Purpose:**
Complete business requirements for rebuilding Loyer.Brussels application from scratch. All technical implementation decisions left to agency expertise.

**Next Steps:**
1. Agency reviews brief
2. Questions submitted in writing
3. Kickoff meeting scheduled
4. Project timeline established
5. Development begins

**Questions:**
All questions should be submitted to [contact email] and will be answered within 48 hours.

---

**END OF AGENCY BRIEF**