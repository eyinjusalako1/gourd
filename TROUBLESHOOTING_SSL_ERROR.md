# 🔧 Troubleshooting: SSL Cipher Error with npm install

**Error:** `ERR_SSL_CIPHER_OPERATION_FAILED`

This error is preventing npm from installing dependencies. Here are solutions to try:

---

## ✅ Solution 1: Disable SSL Strict Mode (Quick Fix)

**In PowerShell, run:**
```powershell
cd c:\Users\user\gourd
npm config set strict-ssl false
npm install
```

⚠️ **Note:** This disables SSL verification. Re-enable it after:
```powershell
npm config set strict-ssl true
```

---

## ✅ Solution 2: Clear npm Cache and Retry

```powershell
cd c:\Users\user\gourd
npm cache clean --force
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install
```

---

## ✅ Solution 3: Check Antivirus/Windows Defender

1. **Temporarily disable Windows Defender** (or your antivirus)
2. Try `npm install` again
3. Re-enable antivirus

**Or add exclusions:**
- Add `C:\Users\user\gourd` to Windows Defender exclusions

---

## ✅ Solution 4: Use Yarn Instead

```powershell
npm install -g yarn
cd c:\Users\user\gourd
yarn install
yarn dev
```

---

## 🎯 Most Likely Fix

**Try Solution 1 first** (disable strict-ssl temporarily), install packages, then re-enable it.

After successful install:
```powershell
npm run dev
```

Then visit: http://localhost:3000/dashboard



