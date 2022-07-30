const DEBUG = window.location.host.includes('127.0.0.1') || window.location.host.includes('localhost');

const iOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) &&
  !window.MSStream;

const getQueryParams = () => {
  const params = new URLSearchParams(location.search);
  const upi = params.get('upi') || '';
  const name = params.get('name') || '';
  const paytm = params.get('paytm') || '';
  return [upi, name, paytm];
};

const createDeeplink = (upi, name, paytm) => {
  let link;
  if (upi) {
    const org = Math.floor(Math.random() * 1e5) + 1;

    link = `gpay://upi/pay?pa=${upi}&pn=${name}&mc=0000&mode=02&purpose=00&orgid=${org}`;

    // if (iOS()) {
    //   link = `gpay://upi/pay?pa=${upi}&pn=${name}&mc=0000&mode=02&purpose=00&orgid=${org}`;
    // } else {
    //   link = `upi://pay?pa=${upi}&pn=${name}&mc=0000&mode=02&purpose=00&orgid=${org}`;
    // }
  }
  else if (paytm) {
    link = `paytmmp://cash_wallet?featuretype=sendmoneymobile$recipient=${paytm}`;
  };
  return encodeURI(link);
};

const generateQRCode = (link) => new QRCode(document.getElementById('qr'), {
  text: link,
  width: 200,
  height: 200,
  useSVG: true,
  correctLevel: QRCode.CorrectLevel.H
});

const updateDOM = (upi, name, paytm) => {

  if (upi) {
    document.querySelector('#id').innerHTML = upi;
    document.title = `Pay ${name} | UPI Magic Link`;
  } else if (paytm) {
    document.querySelector('#id').innerHTML = paytm;
    document.title = `Pay ${paytm} | UPI Magic Link`;
  }
};

const navigateToLink = (link) => window.location = link;

const init = () => {
  const [upi, name, paytm] = getQueryParams();

  if (!((upi && name) || paytm)) {
    navigateToLink('/generator.html');
    return;
  }

  if (upi && name) {
    const nameInLowercase = name.toLowerCase();
    if (nameInLowercase.match(/(there)[^a-zA-Z0-9]*(is)[^a-zA-Z0-9]*(no)[^a-zA-Z0-9]*(earth)[^a-zA-Z0-9]*(b)/g)
      || nameInLowercase.match(/(there)[^a-zA-Z0-9]*(is)[^a-zA-Z0-9]*(no)[^a-zA-Z0-9]*(planet)[^a-zA-Z0-9]*(b)/g)
      || nameInLowercase.match(/(t)[^a-zA-Z0-9]*(i)[^a-zA-Z0-9]*(n)[^a-zA-Z0-9]*(e)[^a-zA-Z0-9]*(b)/g)
      || nameInLowercase.includes('there') && nameInLowercase.includes('is') && nameInLowercase.includes('no') && nameInLowercase.includes('earth') && nameInLowercase.includes('b')) {
      if (upi !== 'givetomlp.thereisnoearthb1@icici') {
        navigateToLink('/?upi=givetomlp.thereisnoearthb1@icici&name=There%20Is%20No%20Earth%20B');
        return;
      }
    }

    updateDOM(upi, name);

    const link = createDeeplink(upi, name);

    generateQRCode(link);
    document.getElementById('gpay-link').href = `gpay://upi/pay?pa=${upi}&pn=${name}&mc=0000&mode=02&purpose=00&orgid=${Math.floor(Math.random() * 1e5) + 1}`;
    document.getElementById('gpay-link').style.display = 'inline-block';
    navigateToLink(link);

    // if (!DEBUG)
    //   setTimeout(() => {
    //     window.location = 'https://instagram.com/thereisnoearthb';
    //   }, 15e3);
  }
  else if (paytm) {
    if (!paytm.match(/[0-9]{10}/)) {
      alert("Not a Valid Number!");
      navigateToLink('/generator.html');
      return;
    }

    updateDOM(null, null, paytm);

    const link = createDeeplink(null, null, paytm);
    document.getElementById('paytm-link').href = link;
    document.getElementById('paytm-link').style.display = 'inline-block';
    navigateToLink(link);
  }
};

(() => init())();
