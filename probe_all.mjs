
const dbs = [
  '2d9c32c9bf9480acb6bedda4a98dda35',
  '2d9c32c9bf948045aac4ded6ae261395',
  '8534efa571d64e4987eab248952f71d8',
  '29f7b59215a640e28de45dc4511bd22f'
];

function uuid(id) {
  if (id.includes('-')) return id;
  return id.slice(0, 8) + '-' + id.slice(8, 12) + '-' + id.slice(12, 16) + '-' + id.slice(16, 20) + '-' + id.slice(20);
}

async function check() {
  for (let rawId of dbs) {
     const dbId = uuid(rawId);
     console.log('--- Checking:', dbId);
     try {
      const response = await fetch(`http://localhost:3001/api/notion?db=${dbId}`);
      const text = await response.text();
      try {
        const json = JSON.parse(text);
        if (json.success) {
           console.log('SUCCESS! items:', json.data.length);
           if (json.data[0]) console.log('Props:', Object.keys(json.data[0]));
        } else {
           console.log('Error:', json.message || json);
        }
      } catch {
        console.log('Body:', text.substring(0, 500));
      }
    } catch (e) {
      console.log('Network Error:', e);
    }
  }
}

check();
