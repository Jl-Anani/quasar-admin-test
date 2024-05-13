# Quasar Admin Test (quasar-admin-test)

A Quasar Project

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).




# Admin Route Security Implementation with MirageJS

## Overview
This document outlines the implementation details and security considerations for handling admin access verification in a Vue application using Quasar and MirageJS. The initial problem was that unauthorized users could access admin-specific pages and potentially make changes, posing a significant security risk. By integrating MirageJS, I've simulated backend API behavior to securely manage access to these admin routes.

## Problem Statement
Previously, the application did not effectively verify whether a user had admin privileges when attempting to access admin-specific routes. This oversight allowed any user to view or interact with admin-level features, regardless of their authorization status.

## Solution
 I implemented route verification using MirageJS, a tool that allows us to mock backend APIs in a development environment. By setting up a specific route to verify admin status (`/api/admin/verify`), I can conditionally render admin pages based on the user's privileges.

## Implementation

### Step 1: Setting Up MirageJS
MirageJS is used to intercept API calls and simulate server responses based on predefined routes. Here's how I configured it:

```javascript
// src/boot/mirage-server.js
import { createServer } from 'miragejs';

export function makeServer({ environment = 'development' } = {}) {
  let server = createServer({
    environment,
    routes() {
      this.namespace = 'api'; // Set a common namespace for all API routes
      this.get('/admin/verify', () => {
        return { admin: true };  // Simulate an admin verification response
      });
    }
  });

  return server;
}

makeServer();
```

### Step 2: Frontend Route Guard
Using Vue Router, I implemented a navigation guard that checks the admin status before routing to any admin-specific pages:

```javascript
// src/router/index.js
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    fetch('/api/admin/verify')
      .then(response => response.json())
      .then(data => {
        if (data.admin) {
          next();
        } else {
          alert('You are not authorized to view this page.');
          next('/');
        }
      })
      .catch(() => {
        alert('Failed to verify admin status.');
        next('/');
      });
  } else {
    next();
  }
});
```

### Step 3: Handling Unauthorized Access
If the admin verification fails, the user is redirected to the home page, and an alert is displayed, preventing unauthorized access to admin functionalities.

