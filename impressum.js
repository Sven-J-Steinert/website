
const hexContent = '3c64697620636c6173733d22696d7072657373756d2d74657874223e3c703e4e616d653a205376656e204a756c69757320537465696e6572743c62723e416464726573733a2054616e6e656e77656720352c2038353339392048616c6c626572676d6f6f732c204765726d616e793c62723e50686f6e653a202b34392031353737203934203231203833333c62723e456d61696c3a207376656e2e737465696e657274393640676d61696c2e636f6d3c2f703e3c2f6469763e';

function hexToString(hex) {
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

const impressumContent = hexToString(hexContent);

document.querySelector('.impressum-toggle').addEventListener('click', function(e) {
  e.preventDefault(); // Prevent the default link behavior
  const details = document.querySelector('.impressum-details');

  if (details.style.display === 'none' || details.style.display === '') {
    if (!details.innerHTML) { // Load content only if not already loaded
      details.innerHTML = impressumContent;
    }
    details.style.display = 'block';
    details.scrollIntoView({ behavior: 'smooth' }); // Scroll down to make it visible
  } else {
    details.style.display = 'none';
  }
});