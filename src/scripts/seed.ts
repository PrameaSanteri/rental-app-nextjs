import { firestore } from '../firebase/admin'; // Corrected path

async function seedProperties() {
  const kuopioProperties = [
    { name: 'aapeli', address: 'Tulliportinkatu 50 A 51', city: 'Kuopio' },
    { name: 'pietari', address: 'Tulliportinkatu 50 A 26', city: 'Kuopio' },
    { name: 'uus aapeli', address: 'Tulliportinkatu 50 A 47', city: 'Kuopio' },
    { name: 'snellu', address: 'Snellmaninkatu 13 A 3', city: 'Kuopio' },
    { name: 'torni', address: 'Puutarhakatu 11 C 22', city: 'Kuopio' },
    { name: 'matka', address: 'Puutarhakatu 11 C 24', city: 'Kuopio' },
    { name: 'satama', address: 'Tulliportinkatu 9 A 3', city: 'Kuopio' },
    { name: 'haapa', address: 'Haapaniemenkatu 27 A 2', city: 'Kuopio' },
    { name: 'holvi', address: 'Puijonkatu 29 C 96', city: 'Kuopio' },
    { name: 'pankki', address: 'Puijonkatu 29 A 71', city: 'Kuopio' },
    { name: 'mylly', address: 'Myllykatu 3 C 31', city: 'Kuopio' },
    { name: 'kulta', address: 'Lintulahdenkatu 12 A 6', city: 'Kuopio' },
    { name: 'asematalo', address: 'Asemakatu 1 b A 35', city: 'Kuopio' },
    { name: 'asemankulma', address: 'Asemakatu 1 b A 42', city: 'Kuopio' },
  ];

  const propertiesCollection = firestore.collection('properties');

  console.log('Seeding Kuopio properties...');
  for (const prop of kuopioProperties) {
    await propertiesCollection.add(prop);
    console.log(`Added: ${prop.name}`);
  }
  console.log('Seeding complete!');
}

seedProperties().catch(console.error);
