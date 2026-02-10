# 🔧 Authentication Troubleshooting Guide

## Can't login on mobile or other devices?

### Quick Checks

1. **Enable Cookies**
   - Go to your browser settings
   - Enable cookies for your site
   - Ensure third-party cookies are allowed (for Supabase)

2. **Check Browser Console**
   - On desktop: Press F12
   - On mobile: Connect to desktop or use browser's developer tools
   - Look for red errors in the "Console" tab

3. **Disable Private/Incognito Mode**
   - Private mode may block localStorage/cookies
   - Try logging in in a regular tab

4. **Disable Ad Blockers**
   - Ad blockers can interfere with Supabase authentication
   - Try disabling temporarily

### Common Issues & Solutions

#### Issue: "Failed to fetch" or Network Errors
**Cause**: Network connectivity or CORS issues
**Solution**:
- Check your internet connection
- Ensure Supabase URL in `.env.local` is correct
- Verify backend is running if using custom backend

#### Issue: "Invalid login credentials"
**Cause**: Wrong email or password
**Solution**:
- Double-check email and password
- Reset password via Supabase dashboard
- Make sure account is confirmed (check email)

#### Issue: "Email not confirmed"
**Cause**: Account not verified
**Solution**:
- Check your email for confirmation link
- Resend confirmation from Supabase dashboard

#### Issue: Session doesn't persist after refresh
**Cause**: localStorage blocked or cookies disabled
**Solution**:
- Enable cookies and localStorage in browser
- Check browser privacy settings
- Try a different browser

### Mobile-Specific Issues

#### iOS Safari
- Enable cookies: Settings > Safari > Block Cookies > "Allow from Websites I Visit"
- Clear cache if issues persist

#### Chrome Mobile
- Enable cookies: Settings > Site Settings > Cookies > "Allow"
- Try incognito mode to test

#### Android Browser
- Enable cookies and local storage
- Check for aggressive data-saving settings

### Debug Steps

1. Open browser console (F12 or connect device to desktop)
2. Click "SHOW DEBUG INFO" on login page
3. Check console for errors marked with ❌
4. Check network tab for failed requests (red status codes)

### Still Having Issues?

1. Check Supabase Dashboard:
   - Go to Authentication > Users
   - Verify your user exists
   - Check if email is confirmed
   - Look at Authentication > URL Configuration

2. Check Environment Variables:
   ```bash
   # In frontend/.env.local
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Restart Development Server:
   ```bash
   # Stop and restart
   cd frontend
   npm run dev
   ```

### For Development Team

If users still can't login, check:
1. Supabase auth logs in dashboard
2. Backend logs for authentication errors
3. Network requests to Supabase auth endpoints
4. CORS configuration in Supabase project settings
