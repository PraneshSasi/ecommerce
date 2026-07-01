$scope = "pranesh-ss-projects-81693c9f"

# Fix 1: DATABASE_URL - Use pooler URL since Vercel cannot connect directly over IPv6
$databaseUrl = "postgresql://postgres.fxocgxuhbixwpdjwhglb:Pranesh%401506@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
Write-Host "Updating DATABASE_URL to use pooler..."
$databaseUrl | vercel env add DATABASE_URL production --scope $scope --force 2>&1
Write-Host ""

# Fix 2: DIRECT_URL - Use session pooler URL (needed for migrations, schema pushes over IPv4)
$directUrl = "postgresql://postgres.fxocgxuhbixwpdjwhglb:Pranesh%401506@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres"
Write-Host "Updating DIRECT_URL (pooler session mode for migrations)..."
$directUrl | vercel env add DIRECT_URL production --scope $scope --force 2>&1
Write-Host ""

# Fix 3: NEXTAUTH_URL must match actual production domain exactly
$nextAuthUrl = "https://ecommerce-alpha-nine-77.vercel.app"
Write-Host "Updating NEXTAUTH_URL to match production domain..."
$nextAuthUrl | vercel env add NEXTAUTH_URL production --scope $scope --force 2>&1
Write-Host ""

# Fix 4: AUTH_URL must also match
$authUrl = "https://ecommerce-alpha-nine-77.vercel.app/api/auth"
Write-Host "Updating AUTH_URL..."
$authUrl | vercel env add AUTH_URL production --scope $scope --force 2>&1
Write-Host ""

Write-Host "All fixes applied! Now redeploying..."
