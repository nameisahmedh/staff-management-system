@echo off
echo Building project...
npm run build

echo Deploying to Vercel...
vercel --prod

echo Deployment complete!
pause