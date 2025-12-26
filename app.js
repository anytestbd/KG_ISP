import { auth, db } from "./firebase.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* 🔐 Multi Admin Protection */
onAuthStateChanged(auth, u => {
  if (!u) location.href = "index.html";
});

/* 🚪 Logout */
window.logout = () => signOut(auth).then(() => location.href = "index.html");

/* 💾 Add / Edit Bill */
window.saveBill = async () => {
  const data = {
    userid: userId.value,
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
  userId.value = name.value = phone.value = pkg.value = amount.value = "";
  status.value = "Paid";
}

/* 📥 Load + Search + Monthly Summary */
let customers = [];

window.loadBills = async () => {
  list.innerHTML = "";
  let total = 0, paid = 0, due = 0;

  const uid = searchId.value.trim();
  const m = searchMonth.value;

  const snap = await getDocs(collection(db, "bills"));
  customers = [];
  snap.forEach(d => {
    const x = d.data();
    x.id = d.id;

    if (uid && x.userid !== uid) return;
    if (m && x.month !== m) return;

    customers.push(x);

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
<button onclick='edit(${JSON.stringify(x)})'>Edit</button>
<button onclick='del("${x.id}")'>Delete</button>
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
  userId.value = x.userid;
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

/* 📊 Monthly Summary Alert */
window.monthlyReport = () => {
  let total = 0, paid = 0, due = 0;
  customers.forEach(c => {
    total += c.amount;
    if (c.status === "Paid") paid += c.amount;
    if (c.status === "Due") due += c.amount;
  });
  alert(`Total: ${total} | Paid: ${paid} | Due: ${due}`);
};

/* 📥 Excel Export */
window.exportToExcel = () => {
  if (customers.length === 0) { alert("No data to export"); return; }

  const excelData = customers.map((c,i)=>({
    "SL": i+1,
    "User ID": c.userid,
    "Customer Name": c.name,
    "Package": c.pkg,
    "Monthly Bill": c.amount,
    "Month": c.month,
    "Status": c.status
  }));

  const ws = XLSX.utils.json_to_sheet(excelData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "ISP_Report");
  XLSX.writeFile(wb, "ISP_Billing_Report.xlsx");
};