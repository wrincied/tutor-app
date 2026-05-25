/** Production API — Firebase App Hosting (europe-west4). */
const API_HOST = 'https://tutor-app-backend--tutorassis.europe-west4.hosted.app';
/** SPA на App Hosting (для ссылок в письмах Firebase Auth). */
const APP_HOST = 'https://tutor-app--tutorassis.europe-west4.hosted.app';

export const environment = {
  production: true,
  apiUrl: API_HOST,
  appUrl: APP_HOST,
  firebase: {
    apiKey: 'AIzaSyDI_O1K8uBbEIe2uJvY-8tzpJjfhgg0rlw',
    authDomain: 'tutorassis.firebaseapp.com',
    projectId: 'tutorassis',
    storageBucket: 'tutorassis.firebasestorage.app',
    messagingSenderId: '965411338053',
    appId: '1:965411338053:web:d98317afdb5602a53c702c',
    measurementId: 'G-TXM74NGN6R',
  },
};
