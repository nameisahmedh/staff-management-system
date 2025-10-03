# Restart Instructions

After making changes to environment variables and API configuration, you need to restart the development server:

## Steps:

1. **Stop the current server** (if running):
   - Press `Ctrl + C` in the terminal where `npm start` is running

2. **Restart the development server**:
   ```bash
   npm start
   ```

3. **Test the API**:
   - Open the application in your browser
   - Look for the "Gemini API Test" box in the bottom-right corner
   - Click "Test API" to verify the connection
   - If successful, try the Contact Modal email generation

## If API Test Fails:

1. **Check your .env file** contains:
   ```
   REACT_APP_GEMINI_API_KEY=your_api_key_here
   ```

2. **Verify the API key is valid** by testing it directly in Google AI Studio

3. **Check browser console** for detailed error messages

## Remove Test Component:

Once everything is working, remove the test component by commenting out these lines in `LandingPage.js`:
```javascript
// import ApiTest from './ApiTest';
// <ApiTest />
```