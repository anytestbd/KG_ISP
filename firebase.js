<script type="module">
  import { initializeApp } from
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
  import { getAuth } from
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
  import { getFirestore } from
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "আপনার apiKey",
    authDomain: "আপনার authDomain",
    projectId: "আপনার projectId",
    storageBucket: "আপনার storageBucket",
    messagingSenderId: "আপনার messagingSenderId",
    appId: "আপনার appId"
  };

  const app = initializeApp(firebaseConfig);
  window.auth = getAuth(app);
  window.db = getFirestore(app);
</script>
