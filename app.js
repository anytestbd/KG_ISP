import { auth, db } from "./firebase.js";
import { signOut, onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, addDoc, getDocs } from
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

/* 📥 Load Bills + Total হিসাব */
async function loadBills() {
  list.innerHTML = "";
  let total = 0;

  const snap = await getDocs(collection(db, "bills"));
  snap.forEach(d => {
    const x = d.data();
    total += x.amount;

    list.innerHTML += `
<tr>
<td>${x.userid}</td>
<td>${x.name}</td>
<td>${x.month}</td>
<td>${x.amount}</td>
<td>${x.status}</td>
<td><button onclick='pdf(${JSON.stringify(x)})'>PDF</button></td>
</tr>`;
  });

  document.getElementById("total").innerText = total;
}

loadBills();

/* 🧾 PDF Bill */
window.pdf = d => {
  const doc = new jspdf.jsPDF();
  doc.text("ISP BILL", 20, 20);
  doc.text(`User ID: ${d.userid}`, 20, 30);
  doc.text(`Name: ${d.name}`, 20, 40);
  doc.text(`Month: ${d.month}`, 20, 50);
  doc.text(`Amount: ${d.amount}`, 20, 60);
  doc.text(`Status: ${d.status}`, 20, 70);
  doc.save(`${d.userid}-${d.month}.pdf`);
};
