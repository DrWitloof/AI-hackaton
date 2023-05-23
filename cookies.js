// Functie om een cookie uit te lezen op naam
function getCookie(name) {
  const cookieArr = document.cookie.split(";");

  for (let i = 0; i < cookieArr.length; i++) {
    const cookiePair = cookieArr[i].split("=");

    if (name === cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }

  return null;
}

// Functie om een cookie toe te voegen of bij te werken
function putCookie(name, value, expirationDate = null, path = '/') {
  if (expirationDate === null) {
    expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1); // Standaard 1 jaar geldigheid
  }

  const cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expirationDate.toUTCString()}; path=${path}`;
  document.cookie = cookie;
}

// Functie om een cookie te verwijderen
function deleteCookie(name, path = '/') {
  const expirationDate = new Date('Thu, 01 Jan 1970 00:00:00 UTC');
  const cookie = `${encodeURIComponent(name)}=; expires=${expirationDate.toUTCString()}; path=${path}`;
  document.cookie = cookie;
}
