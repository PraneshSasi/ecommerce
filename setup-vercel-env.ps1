$scope = "pranesh-ss-projects-81693c9f"

$envVars = @{
    "DATABASE_URL"                  = "postgresql://postgres:Pranesh%401506@db.fxocgxuhbixwpdjwhglb.supabase.co:5432/postgres"
    "DIRECT_URL"                    = "postgresql://postgres:Pranesh%401506@db.fxocgxuhbixwpdjwhglb.supabase.co:5432/postgres"
    "NEXTAUTH_SECRET"               = "shopwave-super-secret-key-2024-change-in-production"
    "AUTH_SECRET"                   = "shopwave-super-secret-key-2024-change-in-production"
    "NEXTAUTH_URL"                  = "https://ecommerce-pranesh-ss-projects-81693c9f.vercel.app"
    "AUTH_URL"                      = "https://ecommerce-pranesh-ss-projects-81693c9f.vercel.app/api/auth"
    "NEXT_PUBLIC_SUPABASE_URL"      = "https://fxocgxuhbixwpdjwhglb.supabase.co"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY" = "YOUR_SUPABASE_ANON_KEY_HERE"
    "SUPABASE_SERVICE_ROLE_KEY"     = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4b2NneHVoYml4d3BkandoZ2xiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTU4Mzc2OSwiZXhwIjoyMDk3MTU5NzY5fQ.tshNfhdgQIazl_hZy8aCpBHrS6vL2zw9M9gcoS0Rc6k"
}

foreach ($key in $envVars.Keys) {
    $value = $envVars[$key]
    Write-Host "Adding env var: $key"
    $value | vercel env add $key production --scope $scope --force 2>&1
}

Write-Host "`nAll environment variables added!"
