#!/bin/bash
# Shell script to create .env.local template
# Run with: ./scripts/create-env.sh

ENV_FILE=".env.local"

if [ -f "$ENV_FILE" ]; then
    echo "⚠️  .env.local already exists!"
    echo ""
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Aborted. Existing file not modified."
        exit 0
    fi
fi

cat > "$ENV_FILE" << 'EOF'
# Supabase Configuration
# Get these from your Supabase project dashboard
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Email Configuration (Resend)
# Uncomment and add your API key to enable email sending
# Get your API key from: https://resend.com/api-keys
# RESEND_API_KEY=re_your_key_here

# Email FROM address
# For testing without domain: use onboarding@resend.dev
# For production with verified domain: contact@loyer.brussels
# EMAIL_FROM=onboarding@resend.dev

# Admin email (receives contact form notifications)
# EMAIL_TO=contact@wuune.be
EOF

echo ""
echo "✅ Created .env.local template file!"
echo ""
echo "📝 Next steps:"
echo "  1. Edit .env.local and add your credentials"
echo "  2. For Supabase: Get keys from your Supabase dashboard"
echo "  3. For Email: Sign up at https://resend.com and get API key"
echo ""
echo "💡 Tip: Use 'nano .env.local' or 'code .env.local' to edit"
echo ""
