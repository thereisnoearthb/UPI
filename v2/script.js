
const pay = () => {
  let txnId = Math.floor(Math.random() * 1e5) + 1;
  let orderId = Math.floor(Math.random() * 1e5) + 1;
  let c ="upi://pay?pa=" +
              document.getElementById('vpa').value +
              "&pn=" +
              document.getElementById('name').value +
              "&am=" +
              document.getElementById('amt').value +
              "&tr=" +
              txnId +
              "&mc=5411&cu=INR&tn=ORDER ID " +
              orderId;

              let p = encodeURI(c);

  document.getElementById("qrcode").innerHTML = '';

  new QRCode(document.getElementById("qrcode"), {
    text: p
  });

  setTimeout(() => {
    window.location = p;
  }, 5e3);
}

document.getElementById('form').addEventListener('submit', (e) => {
  e.preventDefault();
  pay();
})
