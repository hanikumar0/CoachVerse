# Mobile Connection Troubleshooting Guide

## 🚨 CURRENT ISSUE: Network Error

Your mobile app cannot connect to the backend server. Here's how to fix it:

---

## ✅ STEP-BY-STEP FIX

### Step 1: Add Windows Firewall Rule (CRITICAL) 🔥

**This is the #1 most common issue!**

1. Right-click on `add-firewall-rule.bat` in your CoachVerse folder
2. Select **"Run as administrator"**
3. Click "Yes" when Windows asks for permission
4. You should see: "Firewall rule added successfully!"

**OR manually add the rule:**
1. Press `Win + R`
2. Type: `wf.msc` and press Enter
3. Click "Inbound Rules" → "New Rule..."
4. Select "Port" → Next
5. Choose "TCP" and type `5000` → Next
6. Select "Allow the connection" → Next
7. Check all boxes (Domain, Private, Public) → Next
8. Name it "CoachVerse Backend" → Finish

---

### Step 2: Verify Backend Server

Check your backend terminal output. It should show:

```
🚀 Server running in development mode
📍 Local: http://localhost:5000
📱 Network: http://172.18.32.1:5000

💡 For mobile app, use: http://172.18.32.1:5000/api
```

**If you see a different IP**, update `mobile/src/services/api.ts` line 7 with the new IP.

---

### Step 3: Test Connection from Mobile Device

Open your **phone's browser** and go to:
```
http://172.18.32.1:5000/api/test
```

**Expected result:** You should see JSON like this:
```json
{
  "status": "SUCCESS",
  "message": "Mobile connection working!",
  "timestamp": "2026-01-07T16:17:56.123Z"
}
```

**If you see an error or can't connect:**
- ❌ Firewall is still blocking → Repeat Step 1
- ❌ Wrong network → Make sure phone and PC are on same WiFi
- ❌ Wrong IP → Check backend console for correct IP

---

### Step 4: Test in Mobile App

Once the browser test works, reload your mobile app:
1. Shake your device
2. Select "Reload"
3. Try logging in again

---

## 🔍 Additional Troubleshooting

### Check Both Devices Are on Same WiFi

**On PC:**
```powershell
ipconfig
```
Look for "Wireless LAN adapter" → "IPv4 Address"

**On Phone:**
Settings → Wi-Fi → Tap connected network → Check IP address
(Should be similar like 172.18.32.X)

---

### If IP Address Changes

If your WiFi IP changes (after restart/reconnect):

1. Look at backend console for new IP
2. Update `mobile/src/services/api.ts`:
```typescript
const BASE_URL = 'http://YOUR_NEW_IP:5000/api';
```
3. Reload mobile app

---

### Alternative: Use USB Debugging (Advanced)

If WiFi doesn't work, you can use ADB reverse:

1. Connect phone via USB
2. Enable USB Debugging on phone
3. Run in PowerShell:
```powershell
adb reverse tcp:5000 tcp:5000
```
4. Change mobile API to:
```typescript
const BASE_URL = 'http://localhost:5000/api';
```

---

## 📋 Quick Checklist

Before asking for help, verify:

- [ ] Windows Firewall rule added (Step 1)
- [ ] Backend is running (check terminal)
- [ ] Both devices on same WiFi network
- [ ] IP address in mobile app matches backend console
- [ ] Browser test works (http://IP:5000/api/test)
- [ ] Mobile app reloaded after changes

---

## ✅ Success Indicators

When everything works, you should see:

**Mobile App Console:**
```
LOG  Attempting login with: your_email@gmail.com
LOG  Login successful: {user data}
```

**Backend Console:**
```
POST /api/auth/login 200 - 245ms
```

---

## 🆘 Still Not Working?

1. **Temporarily disable Windows Firewall** (for testing only):
   - Windows Security → Firewall & network protection
   - Turn off Private network firewall
   - Try connecting
   - If it works, the firewall rule wasn't added correctly
   - **Remember to turn it back on!**

2. **Check antivirus software** - some antivirus programs block network access

3. **Try different network** - use mobile hotspot from another phone

---

## 📱 Current Configuration

- Backend IP: `172.18.32.1`
- Backend Port: `5000`
- Mobile API: `http://172.18.32.1:5000/api`
- Health Check: `http://172.18.32.1:5000/health`
- Test Endpoint: `http://172.18.32.1:5000/api/test`

---

**Good luck! The firewall rule should fix it. 🚀**
