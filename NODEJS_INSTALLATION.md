# 🚀 Node.js Installation Guide for Gathered

## **Method 1: Direct Download (Recommended)**

### **Step 1: Download Node.js**
1. Go to **https://nodejs.org/**
2. Click the **LTS version** (Long Term Support) - this is the recommended version
3. Download the **Windows Installer (.msi)** for your system:
   - **64-bit**: Download "Windows Installer (.msi)" for x64
   - **32-bit**: Download "Windows Installer (.msi)" for x86

### **Step 2: Install Node.js**
1. **Run the downloaded .msi file**
2. **Follow the installation wizard:**
   - Click "Next" on the welcome screen
   - Accept the license agreement
   - Choose installation location (default is fine)
   - Select components (keep all checked)
   - Click "Install"
   - Click "Finish" when done

### **Step 3: Verify Installation**
1. **Close and reopen your terminal/command prompt**
2. **Run these commands to verify:**
   ```bash
   node --version
   npm --version
   ```
3. **You should see version numbers like:**
   ```
   v20.10.0
   10.2.3
   ```

---

## **Method 2: Using Chocolatey (Advanced)**

If you have Chocolatey package manager installed:

```bash
# Install Node.js
choco install nodejs

# Verify installation
node --version
npm --version
```

---

## **Method 3: Using Winget (Windows 10/11)**

```bash
# Install Node.js
winget install OpenJS.NodeJS

# Verify installation
node --version
npm --version
```

---

## **Troubleshooting**

### **If installation fails:**
1. **Run as Administrator** - Right-click the installer and select "Run as administrator"
2. **Disable antivirus temporarily** - Some antivirus software blocks installations
3. **Check Windows version** - Ensure you're using Windows 10 or later

### **If commands don't work after installation:**
1. **Restart your terminal** - Close and reopen PowerShell/Command Prompt
2. **Restart your computer** - This ensures PATH variables are updated
3. **Check PATH** - Node.js should be added to your system PATH automatically

### **If you get permission errors:**
1. **Run PowerShell as Administrator**
2. **Set execution policy:**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

---

## **What Gets Installed**

- **Node.js** - JavaScript runtime
- **npm** - Package manager (comes with Node.js)
- **npx** - Package runner (comes with Node.js)

---

## **Next Steps After Installation**

Once Node.js is installed, we'll:

1. ✅ **Verify installation**
2. ✅ **Run the deployment script**
3. ✅ **Set up Supabase**
4. ✅ **Deploy to Vercel**

---

**Ready to install Node.js? Follow Method 1 above, then let me know when it's done!** 🚀












