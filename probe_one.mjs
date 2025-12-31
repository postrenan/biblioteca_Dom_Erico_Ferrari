
const dbIdRaw = '2d9c32c9bf9480acb6bedda4a98dda35';
function uuid(id) {
  return id.slice(0, 8) + '-' + id.slice(8, 12) + '-' + id.slice(12, 16) + '-' + id.slice(16, 20) + '-' + id.slice(20);
}
const dbId = uuid(dbIdRaw);
console.log('Testing ID:', dbId);

async function check() {
  try {
    const response = await fetch(`http://localhost:3008/api/notion?db=${dbId}`);
    const text = await response.text();
    try {
      const json = JSON.parse(text);
      if (json.message) {
         console.log('Error Message:', json.message);
      } else {
         console.log('JSON:', JSON.stringify(json, null, 2));
      }
    } catch {
      console.log('Body:', text.substring(0, 500));
    }
  } catch (e) {
    console.log('Network Error:', e);
  }
}

check();
