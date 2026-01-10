# @abpjs/theme.basic - Usage Guide

## Installation

```bash
npm install @abpjs/theme.basic
```

## Quick Setup

Wrap your app with `ThemeBasicProvider`:

```tsx
import { ThemeBasicProvider } from '@abpjs/theme.basic';

function App() {
  return (
    <ThemeBasicProvider>
      {/* Your app content */}
    </ThemeBasicProvider>
  );
}
```

---

## Available Layouts

### 1. LayoutApplication (Main Dashboard)

Full-featured layout with navbar, navigation menu, user menu, and language selector.

```tsx
import { LayoutApplication } from '@abpjs/theme.basic';
import { Route, Routes } from 'react-router-dom';

// In your router setup:
<Route element={<LayoutApplication />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/users" element={<Users />} />
</Route>
```

**Features:**
- Responsive navbar with mobile hamburger menu
- Automatic navigation from your routes
- Current user dropdown (profile, change password, logout)
- Language selector
- Custom navigation elements support

---

### 2. LayoutAccount (Auth Pages)

Simplified layout for login, register, forgot password pages.

```tsx
import { LayoutAccount } from '@abpjs/theme.basic';

<Route element={<LayoutAccount />}>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
</Route>
```

**Features:**
- Clean, centered layout
- Brand/logo display
- No user menu (for unauthenticated users)

---

### 3. LayoutEmpty (Minimal)

Bare minimum layout - just renders your content.

```tsx
import { LayoutEmpty } from '@abpjs/theme.basic';

<Route element={<LayoutEmpty />}>
  <Route path="/print" element={<PrintView />} />
  <Route path="/embed" element={<EmbedView />} />
</Route>
```

**Features:**
- No navbar
- Just router outlet
- Good for print views, embeds, or custom layouts

---

## Complete Router Example

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeBasicProvider, LayoutApplication, LayoutAccount, LayoutEmpty } from '@abpjs/theme.basic';

function App() {
  return (
    <BrowserRouter>
      <ThemeBasicProvider>
        <Routes>
          {/* Main app pages */}
          <Route element={<LayoutApplication />}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Auth pages */}
          <Route element={<LayoutAccount />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Minimal pages */}
          <Route element={<LayoutEmpty />}>
            <Route path="/print/:id" element={<PrintView />} />
          </Route>
        </Routes>
      </ThemeBasicProvider>
    </BrowserRouter>
  );
}
```

---

## Adding Custom Navigation Elements

```tsx
import { useLayoutService } from '@abpjs/theme.basic';

function MyComponent() {
  const { addNavigationElement, removeNavigationElement } = useLayoutService();

  useEffect(() => {
    // Add a custom element to the navbar
    addNavigationElement({
      name: 'notifications',
      element: <NotificationBell />,
      order: 1
    });

    return () => removeNavigationElement('notifications');
  }, []);

  return <div>...</div>;
}
```

---

## Profile & Change Password Modals

```tsx
import { Profile, ChangePassword } from '@abpjs/theme.basic';
import { useState } from 'react';

function UserSettings() {
  const [showProfile, setShowProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <>
      <button onClick={() => setShowProfile(true)}>Edit Profile</button>
      <button onClick={() => setShowChangePassword(true)}>Change Password</button>

      <Profile visible={showProfile} onVisibleChange={setShowProfile} />
      <ChangePassword visible={showChangePassword} onVisibleChange={setShowChangePassword} />
    </>
  );
}
```

---

## Dynamic Layout Selection

Use the `LAYOUTS` constant with `eLayoutType` for dynamic routing:

```tsx
import { LAYOUTS } from '@abpjs/theme.basic';
import { eLayoutType } from '@abpjs/core';

// Find layout by type
const appLayout = LAYOUTS.find(L => L.type === eLayoutType.application);
const accountLayout = LAYOUTS.find(L => L.type === eLayoutType.account);
const emptyLayout = LAYOUTS.find(L => L.type === eLayoutType.empty);
```

---

## Customizing Brand

```tsx
import { LayoutApplication } from '@abpjs/theme.basic';

// LayoutApplication reads brand from environment or you can customize LayoutBase directly
<LayoutBase brandName="My Dashboard" brandLink="/home">
  {/* nav content */}
</LayoutBase>
```

---

That's it! Pick the layout that fits your page type and wrap your routes.
