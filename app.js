import { auth, db } from "./firebase.js";
import { signOut, onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* 🔐 Multi Admin (যে কেউ login করলে admin) */
onAuthStateChanged(auth, u => {
  if (!u) location.href = "index.html";
});

/* 🚪 Logout */
window.logout = () =>
  signOut(auth).then(() => location.href = "index.html");

/* 💾 Add / Edit Bill */
window.saveBill = async () => {
  const data = {
    userid: userid.value,
    name: name.value,
    phone: phone.value,
    pkg: pkg.value,
    month: month.value,
    amount: Number(amount.value),
    status: status.value
  };

  if (docid.value) {
    await updateDoc(doc(db, "bills", docid.value), data);
  } else {
    await addDoc(collection(db, "bills"), data);
  }

  clearForm();
  loadBills();
};

function clearForm() {
  docid.value = "";
  userid.value = name.value = phone.value = pkg.value = amount.value = "";
}

/* 📊 Load + Search + Monthly Summary */
window.loadBills = async () => {
  list.innerHTML = "";
  let total = 0, paid = 0, due = 0;

  const uid = searchId.value.trim();
  const m = searchMonth.value;

  const snap = await getDocs(collection(db, "bills"));
  snap.forEach(d => {
    const x = d.data();

    if (uid && x.userid !== uid) return;
    if (m && x.month !== m) return;

    total += x.amount;
    if (x.status === "Paid") paid += x.amount;
    if (x.status === "Due") due += x.amount;

    list.innerHTML += `
<tr>
<td>${x.userid}</td>
<td>${x.name}</td>
<td>${x.month}</td>
<td>${x.amount}</td>
<td>${x.status}</td>
<td>
<button onclick='edit(${JSON.stringify({...x,id:d.id})})'>Edit</button>
<button onclick='del("${d.id}")'>Delete</button>
<button onclick='pdf(${JSON.stringify(x)})'>PDF</button>
</td>
</tr>`;
  });

  total.innerText = total;
  paid.innerText = paid;
  due.innerText = due;
};

loadBills();

/* ✏️ Edit */
window.edit = x => {
  docid.value = x.id;
  userid.value = x.userid;
  name.value = x.name;
  phone.value = x.phone;
  pkg.value = x.pkg;
  month.value = x.month;
  amount.value = x.amount;
  status.value = x.status;
};

/* ❌ Delete */
window.del = async id => {
  if (confirm("Delete bill?")) {
    await deleteDoc(doc(db, "bills", id));
    loadBills();
  }
};

/* 🧾 PDF */
window.pdf = d => {
  const p = new jspdf.jsPDF();
  p.text("ISP BILL", 20, 20);
  p.text(`User ID: ${d.userid}`, 20, 30);
  p.text(`Name: ${d.name}`, 20, 40);
  p.text(`Month: ${d.month}`, 20, 50);
  p.text(`Amount: ${d.amount}`, 20, 60);
  p.text(`Status: ${d.status}`, 20, 70);
  p.save(`${d.userid}-${d.month}.pdf`);
};