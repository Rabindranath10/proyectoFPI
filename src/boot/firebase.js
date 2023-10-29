import { boot } from "quasar/wrappers";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { VueFire } from "vuefire";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATXjiymqZis55gp8Ot2-0UE5RRY3wlK34",
  authDomain: "proyectofpi-541a7.firebaseapp.com",
  projectId: "proyectofpi-541a7",
  storageBucket: "proyectofpi-541a7.appspot.com",
  messagingSenderId: "42915636328",
  appId: "1:42915636328:web:93dc4dcc407f7211fc87dd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ app }) => {
  // something to do
  app.use(VueFire, {
    // imported above but could also just be created here
    app,
    modules: [
      // we will see other modules later on
    ],
  });
});
export { db };
