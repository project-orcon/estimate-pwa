# estimate-pwa
A test app to show the offline capabilities of Progressive web apps. The user can create, manage and track current time of estimates both offline and online. Data is stored
via IndexedDB in the browser and in firebase cloudstore.
See app at https://estimate-pwa.firebaseapp.com

## Project setup
```
npm install
```

Create a firebase.js file in the src directory with the following details.
These settings can be found in the firebase console.

```
import { initializeApp } from 'firebase';
const app = initializeApp({
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  });

export const db = app.firestore();
export const estimatesCollection = db.collection('estimates');
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
