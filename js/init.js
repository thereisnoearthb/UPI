const DEBUG = window.location.host.includes('127.0.0.1') || window.location.host.includes('localhost');

const iOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) &&
  !window.MSStream;

const getQueryParams = () => {
  const params = new URLSearchParams(location.search);
  const upi = params.get('upi');
  const name = params.get('name');
  return [upi, name];
};

const createDeeplink = (upi, name) => {
  let link;
  const org = Math.floor(Math.random() * 1e5) + 1;

  if (iOS()) {
    link = `gpay://upi/pay?pa=${upi}&pn=${name}&mc=0000&mode=02&purpose=00&orgid=${org}`;
  } else {
    link = `upi://pay?pa=${upi}&pn=${name}&mc=0000&mode=02&purpose=00&orgid=${org}`;
  }

  return encodeURI(link);
};

const generateQRCode = (link) => new QRCode(document.getElementById('qr'), {
  text: link,
  width: 200,
  height: 200,
  useSVG: true,
  correctLevel: QRCode.CorrectLevel.H
});

const updateDOM = (upi, name) => {
  document.querySelector('#id').innerHTML = upi;
  document.title = `Pay ${name} | UPI Magic Link`;
};

const navigateToLink = (link) => window.location = link;

const init = () => {
  const [upi, name] = getQueryParams();

  if (!(upi && name)) {
    window.location.pathname = '/generator.html';
    return;
  }

  updateDOM(upi, name);

  const link = createDeeplink(upi, name);

  generateQRCode(link);
  navigateToLink(link);

  if (!DEBUG)
    setTimeout(() => {
      window.location = 'https://instagram.com/thereisnoearthb';
    }, 15e3);
};

(() => init())();
