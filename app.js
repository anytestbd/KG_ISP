import { auth, db } from "./firebase.js";
import { signOut, onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* 🔐 Login Protection */
onAuthStateChanged(auth, user => {
  if (!user) location.href = "index.html";
});

/* 🚪 Logout */
window.logout = () =>
  signOut(auth).then(() => location.href = "index.html");

/* ➕ Add Bill */
window.addBill = async () => {
  await addDoc(collection(db, "bills"), {
    userid: userid.value,
    name: name.value,
    phone: phone.value,
    pkg: pkg.value,
    month: month.value,
    amount: Number(amount.value),
    status: status.value
  });
  loadBills();
};

/* 📥 Load + Search + Monthly Report */
window.loadBills = async () => {
  list.innerHTML = "";
  let total = 0;

  const uid = searchId.value.trim();
  const m = searchMonth.value;

  const snap = await getDocs(collection(db, "bills"));
  snap.forEach(d => {
    const x = d.data();

    if (uid && x.userid !== uid) return;
    if (m && x.month !== m) return;

    total += x.amount;

    list.innerHTML += `
<tr>
<td>${x.userid}</td>
<td>${x.name}</td>
<td>${x.month}</td>
<td>${x.amount}</td>
<td>${x.status}</td>
<td>
<button onclick="pdf(${JSON.stringify(x)})">PDF</button>
<button onclick="del('${d.id}')">Delete</button>
</td>
</tr>`;
  });

  document.getElementById("total").innerText = total;
};

loadBills();

/* ❌ Delete Bill */
window.del = async id => {
  if (confirm("Delete this bill?")) {
    await deleteDoc(doc(db, "bills", id));
    loadBills();
  }
};

/* 🧾 PDF */
window.pdf = d => {
  const docu = new jspdf.jsPDF();
  docu.text("ISP BILL", 20, 20);
  docu.text(`User ID: ${d.userid}`, 20, 30);
  docu.text(`Name: ${d.name}`, 20, 40);
  docu.text(`Month: ${d.month}`, 20, 50);
  docu.text(`Amount: ${d.amount}`, 20, 60);
  docu.text(`Status: ${d.status}`, 20, 70);
  docu.save(`${d.userid}-${d.month}.pdf`);
};