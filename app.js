/*************************************************
 * ISP ADMIN PANEL - FULL app.js
 * Features:
 * - Add Customer (User ID সহ)
 * - Load Customer
 * - Search
 * - Delete
 * - Monthly Report
 * - Excel Export (XLSX)
 *************************************************/

/* ==============================
   🔴 Firebase Config বসাবেন এখানে
   ============================== */

// 🔽 🔽 🔽 এখানে আপনার Firebase config বসান 🔽 🔽 🔽
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};
// 🔼 🔼 🔼 এখান পর্যন্ত 🔼 🔼 🔼

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/* ==============================
   Global Data
   ============================== */
let customers = [];

/* ==============================
   Add Customer
   ============================== */
function addCustomer() {
  const userId = document.getElementById("userId").value;
  const name = document.getElementById("name").value;
  const pkg = document.getElementById("package").value;
  const bill = document.getElementById("bill").value;
  const month = document.getElementById("month").value;
  const status = document.getElementById("status").value;

  if (!userId || !name) {
    alert("User ID এবং নাম বাধ্যতামূলক");
    return;
  }

  const customerData = {
    userId,
    name,
    package: pkg,
    bill,
    month,
    status
  };

  db.ref("customers/" + userId).set(customerData);
  alert("Customer Added Successfully");
  clearForm();
}

/* ==============================
   Clear Form
   ============================== */
function clearForm() {
  document.getElementById("userId").value = "";
  document.getElementById("name").value = "";
  document.getElementById("package").value = "";
  document.getElementById("bill").value = "";
  document.getElementById("month").value = "";
  document.getElementById("status").value = "Paid";
}

/* ==============================
   Load Customers
   ============================== */
function loadCustomers() {
  db.ref("customers").on("value", snapshot => {
    customers = [];
    const table = document.getElementById("customerTable");
    table.innerHTML = "";

    snapshot.forEach(child => {
      const data = child.val();
      customers.push(data);