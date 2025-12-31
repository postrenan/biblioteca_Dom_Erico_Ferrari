
const dbs = [
  '2d9c32c9bf9480acb6bedda4a98dda35',
  '2d9c32c9bf948045aac4ded6ae261395',
  '8534efa571d64e4987eab248952f71d8',
  '29f7b59215a640e28de45dc4511bd22f'
];

async function check() {
  for (const db of dbs) {
    try {
      console.log(`Checking DB: ${db}`);
      const response = await fetch(`http://localhost:3008/api/notion?db=${db}`);
      const res = await response.json();
      
      if (res.success && res.data.length > 0) {
        console.log('Keys:', Object.keys(res.data[0]));
        console.log('Sample:', JSON.stringify(res.data[0], null, 2));
      } else {
        console.log('Empty or failed:', res);
      }
    } catch (e) {
      console.log('Error:', e);
    }
    console.log('---');
  }
}

check();
