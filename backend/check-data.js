// Check data in user collection
const { db } = require('./index.js');
const { collection, getDocs, doc, getDoc } = require('firebase/firestore');

async function checkData() {
  try {
    console.log('Checking user collection...\n');
    
    // Method 1: Get all documents from user collection
    const userRef = collection(db, 'user');
    const snapshot = await getDocs(userRef);
    
    if (snapshot.empty) {
      console.log('❌ No data found in user collection.');
    } else {
      console.log(`✅ Found ${snapshot.size} document(s) in user collection:\n`);
      
      snapshot.forEach((docSnapshot, index) => {
        console.log(`--- Document ${index + 1} (ID: ${docSnapshot.id}) ---`);
        const data = docSnapshot.data();
        console.log('Email:', data.email || '(not set)');
        console.log('First Name:', data['first name'] || '(not set)');
        console.log('Last Name:', data['last name'] || '(not set)');
        console.log('Affiliation:', data.affiliation || '(not set)');
        console.log('Department:', data.department || '(not set)');
        console.log('Program:', data.program || '(not set)');
        console.log('Grad Year:', data['grad year'] || '(not set)');
        console.log('\nFull Data:');
        console.log(JSON.stringify(data, null, 2));
        console.log('');
      });
    }
    
    // Method 2: Try to get the specific document by ID
    console.log('\n--- Trying to get specific document: WMIIV8jnVuLytlmfG8MO ---');
    try {
      const specificDoc = doc(db, 'user', 'WMIIV8jnVuLytlmfG8MO');
      const docSnap = await getDoc(specificDoc);
      
      if (docSnap.exists()) {
        console.log('✅ Found specific document:');
        console.log(JSON.stringify(docSnap.data(), null, 2));
      } else {
        console.log('❌ Document not found with that ID');
      }
    } catch (err) {
      console.log('Could not fetch specific document:', err.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkData();
