-- Loyer Brussels Database Schema
-- Run this in your Supabase SQL editor to create the necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- RENT CALCULATIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS rent_calculations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Property Type & Details
    housing_type TEXT CHECK (housing_type IN ('private', 'ais', 'social')),
    property_type TEXT CHECK (property_type IN ('studio', 'apartment-1', 'apartment-2', 'apartment-3', 'apartment-4+', 'house')),
    living_space INTEGER NOT NULL CHECK (living_space >= 15 AND living_space <= 500),
    bedrooms INTEGER NOT NULL CHECK (bedrooms >= 0 AND bedrooms <= 10),
    bathrooms INTEGER NOT NULL CHECK (bathrooms >= 1 AND bathrooms <= 5),

    -- Features
    central_heating BOOLEAN DEFAULT false,
    thermal_regulation BOOLEAN DEFAULT false,
    double_glazing BOOLEAN DEFAULT false,
    second_bathroom BOOLEAN DEFAULT false,
    recreational_spaces BOOLEAN DEFAULT false,
    storage_spaces BOOLEAN DEFAULT false,
    building_before_2000 BOOLEAN DEFAULT false,
    garages INTEGER DEFAULT 0 CHECK (garages >= 0 AND garages <= 10),

    -- Energy & Location
    energy_rating TEXT CHECK (energy_rating IN ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'unknown')),
    postal_code TEXT NOT NULL CHECK (postal_code ~ '^\d{4}$'),
    street_name TEXT,
    building_number TEXT,

    -- Calculation Results
    minimum_rent INTEGER,
    median_rent INTEGER,
    maximum_rent INTEGER,
    difficulty_index NUMERIC(4, 2),

    -- User Rent
    user_rent INTEGER,
    comparison_status TEXT CHECK (comparison_status IN ('abusive', 'high', 'fair', 'below')),
    rent_difference INTEGER,

    -- Contact Info (optional)
    email TEXT,
    phone TEXT,

    -- Metadata
    locale TEXT DEFAULT 'fr' CHECK (locale IN ('fr', 'nl', 'en')),
    completed BOOLEAN DEFAULT true
);

-- Index for faster queries
CREATE INDEX idx_calculations_created ON rent_calculations(created_at DESC);
CREATE INDEX idx_calculations_postal ON rent_calculations(postal_code);
CREATE INDEX idx_calculations_status ON rent_calculations(comparison_status);

-- ==========================================
-- QUESTIONNAIRES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS questionnaires (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    calculation_id UUID REFERENCES rent_calculations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Personal Situation (Section 2)
    lease_type TEXT CHECK (lease_type IN ('9-year', '3-year', '1-year', 'short-term', 'other')),
    lease_start_date DATE,
    monthly_income INTEGER,
    household_type TEXT CHECK (household_type IN ('single', 'couple', 'family', 'shared', 'other')),
    rent_indexation TEXT CHECK (rent_indexation IN ('recent', 'old', 'never', 'unknown')),
    boiler_maintenance BOOLEAN DEFAULT false,
    fire_insurance BOOLEAN DEFAULT false,

    -- Housing Problems (Section 3)
    health_issues JSONB DEFAULT '[]'::jsonb,
    major_defects JSONB DEFAULT '[]'::jsonb,
    other_issues TEXT,

    -- Positive Aspects (Section 4)
    positive_aspects JSONB DEFAULT '[]'::jsonb,
    additional_comments TEXT,

    -- Contact preferences
    wants_support BOOLEAN DEFAULT false,
    wants_membership BOOLEAN DEFAULT false,
    wants_newsletter BOOLEAN DEFAULT false,
    wants_assembly_invites BOOLEAN DEFAULT false,

    -- Metadata
    completed BOOLEAN DEFAULT false
);

-- Index
CREATE INDEX idx_questionnaires_created ON questionnaires(created_at DESC);
CREATE INDEX idx_questionnaires_calculation ON questionnaires(calculation_id);

-- ==========================================
-- CONTACTS / MEMBERSHIP TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Personal Info
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT,

    -- Membership Preferences
    wants_membership BOOLEAN DEFAULT false,
    wants_newsletter BOOLEAN DEFAULT false,
    wants_assembly_invites BOOLEAN DEFAULT false,

    -- Associated Data
    calculation_id UUID REFERENCES rent_calculations(id) ON DELETE SET NULL,
    questionnaire_id UUID REFERENCES questionnaires(id) ON DELETE SET NULL,

    -- Status
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'member', 'archived')),
    contacted_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,

    -- Metadata
    locale TEXT DEFAULT 'fr' CHECK (locale IN ('fr', 'nl', 'en')),
    source TEXT DEFAULT 'contact-form' CHECK (source IN ('calculator', 'questionnaire', 'contact-form'))
);

-- Indexes
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created ON contacts(created_at DESC);

-- ==========================================
-- PDF DOWNLOADS TABLE (for tracking)
-- ==========================================
CREATE TABLE IF NOT EXISTS pdf_downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    calculation_id UUID REFERENCES rent_calculations(id) ON DELETE CASCADE,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Metadata
    user_agent TEXT,
    ip_address INET
);

-- Index
CREATE INDEX idx_pdf_downloads_calculation ON pdf_downloads(calculation_id);
CREATE INDEX idx_pdf_downloads_date ON pdf_downloads(downloaded_at DESC);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE rent_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_downloads ENABLE ROW LEVEL SECURITY;

-- Public can insert (for form submissions)
CREATE POLICY "Enable insert for everyone" ON rent_calculations FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for everyone" ON questionnaires FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for everyone" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for everyone" ON pdf_downloads FOR INSERT WITH CHECK (true);

-- Only authenticated admin users can read/update/delete
-- You'll need to set up authentication and adjust these policies

-- ==========================================
-- FUNCTIONS
-- ==========================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_rent_calculations_updated_at BEFORE UPDATE ON rent_calculations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questionnaires_updated_at BEFORE UPDATE ON questionnaires
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- VIEWS FOR ANALYTICS
-- ==========================================

-- Summary statistics view
CREATE OR REPLACE VIEW calculation_statistics AS
SELECT
    COUNT(*) as total_calculations,
    COUNT(CASE WHEN comparison_status = 'abusive' THEN 1 END) as abusive_count,
    COUNT(CASE WHEN comparison_status = 'high' THEN 1 END) as high_count,
    COUNT(CASE WHEN comparison_status = 'fair' THEN 1 END) as fair_count,
    COUNT(CASE WHEN comparison_status = 'below' THEN 1 END) as below_count,
    AVG(median_rent) as avg_median_rent,
    AVG(user_rent) as avg_user_rent,
    AVG(rent_difference) as avg_rent_difference
FROM rent_calculations
WHERE completed = true;

-- Postal code summary
CREATE OR REPLACE VIEW postal_code_summary AS
SELECT
    postal_code,
    COUNT(*) as calculation_count,
    AVG(median_rent) as avg_median_rent,
    AVG(user_rent) as avg_user_rent,
    COUNT(CASE WHEN comparison_status = 'abusive' THEN 1 END) as abusive_count
FROM rent_calculations
WHERE completed = true
GROUP BY postal_code
ORDER BY calculation_count DESC;

-- ==========================================
-- INITIAL DATA / SEED
-- ==========================================

-- You can add seed data here if needed
-- For example, difficulty index reference data

-- ==========================================
-- COMMENTS
-- ==========================================

COMMENT ON TABLE rent_calculations IS 'Stores rent calculation results from the multi-step calculator';
COMMENT ON TABLE questionnaires IS 'Stores detailed questionnaire responses from tenants';
COMMENT ON TABLE contacts IS 'Stores contact form submissions and membership requests';
COMMENT ON TABLE pdf_downloads IS 'Tracks PDF report downloads for analytics';
