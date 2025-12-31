import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // 0. System Settings
  await prisma.systemSetting.upsert({
    where: { key: 'labelType' },
    update: {},
    create: { key: 'labelType', value: 'AUTO' }
  });
  console.log('Seeded System Settings');

  // 1. Create Series
  const seriesNames = ['1º Ano A', '1º Ano B', '2º Ano A', '3º Ano A', '9º Ano B', 'Professores', 'Staff'];
  const seriesMap = new Map();
  
  for (const name of seriesNames) {
    const s = await prisma.series.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    seriesMap.set(name, s.id);
  }
  console.log('Seeded Series');

  const password = await bcrypt.hash('123456', 10);

  // 2. Create Users with Matricula
  // Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@library.com' },
    update: { matricula: 'admin001', role: 'ADMIN', serieId: seriesMap.get('Staff') },
    create: {
      email: 'admin@library.com',
      name: 'Diretor Silva',
      password,
      role: 'ADMIN',
      matricula: 'admin001',
      serieId: seriesMap.get('Staff')
    },
  });

  // Librarian
  const librarian = await prisma.user.upsert({
    where: { email: 'lib@library.com' },
    update: { matricula: 'lib001', role: 'LIBRARIAN', serieId: seriesMap.get('Staff') },
    create: {
      email: 'lib@library.com',
      name: 'Sra. Bibliotecária',
      password,
      role: 'LIBRARIAN',
      matricula: 'lib001',
      serieId: seriesMap.get('Staff')
    },
  });

  // Teacher
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@school.com' },
    update: { matricula: 'teach001', role: 'TEACHER', serieId: seriesMap.get('Professores') },
    create: {
      email: 'teacher@school.com',
      name: 'Prof. Girafales',
      password,
      role: 'TEACHER',
      matricula: 'teach001',
      serieId: seriesMap.get('Professores')
    },
  });

  // Student
  const student = await prisma.user.upsert({
    where: { email: 'student@school.com' },
    update: { matricula: '20240001', role: 'STUDENT', serieId: seriesMap.get('3º Ano A') },
    create: {
      email: 'student@school.com',
      name: 'Chaves do 8',
      password,
      role: 'STUDENT',
      matricula: '20240001',
      serieId: seriesMap.get('3º Ano A')
    },
  });
  console.log('Seeded Users');

  // 3. Create Categories
  const categoriesData = ['Romance', 'Fantasia', 'Ficção Científica', 'Clássico', 'Suspense', 'Aventura', 'Terror', 'História'];
  const categoriesMap = new Map();

  for (const name of categoriesData) {
    const c = await prisma.category.upsert({
        where: { name },
        update: {},
        create: { name }
    });
    categoriesMap.set(name, c.id);
  }
  console.log('Seeded Categories');

  // 4. Create Books (with multiple copies)
  // We clean up books first to avoid duplication logic complexity for this simple seeder, or check existence by ISBN/Title
  // For safety, let's just create if not exists
  const booksData = [
    {
      title: 'Dom Casmurro',
      author: 'Machado de Assis',
      description: 'A história de Bento Santiago e Capitu.',
      coverUrl: 'https://m.media-amazon.com/images/I/710FjLd-kAL._AC_UF1000,1000_QL80_.jpg',
      isbn: '9788525044444',
      publicationDate: new Date('1899-01-01').toISOString(),
      genre: 'Romance',
      category: 'Romance',
      totalCopies: 5
    },
    {
      title: 'O Pequeno Príncipe',
      author: 'Antoine de Saint-Exupéry',
      description: 'Um piloto cai no deserto e encontra um príncipe.',
      coverUrl: 'https://m.media-amazon.com/images/I/71d-15C0GOL._AC_UF1000,1000_QL80_.jpg',
      isbn: '9780156012195',
      publicationDate: new Date('1943-04-06').toISOString(),
      genre: 'Fantasia',
      category: 'Fantasia',
      totalCopies: 3
    },
    {
       title: 'O Senhor dos Anéis: A Sociedade do Anel',
       author: 'J.R.R. Tolkien',
       description: 'A jornada de Frodo para destruir o Um Anel.',
       coverUrl: 'https://m.media-amazon.com/images/I/71j+g0PXTLL._AC_UF1000,1000_QL80_.jpg',
       isbn: '9788595084751',
       publicationDate: new Date('1954-07-29').toISOString(),
       genre: 'Fantasia',
       category: 'Fantasia',
       totalCopies: 2
    },
    {
        title: 'Dom Quixote',
        author: 'Miguel de Cervantes',
        description: 'O cavaleiro da triste figura.',
        coverUrl: 'https://m.media-amazon.com/images/I/71OQkm57VpL._AC_UF1000,1000_QL80_.jpg',
         isbn: '9780142437230',
        publicationDate: new Date('1605-01-16').toISOString(),
        genre: 'Clássico',
        category: 'Clássico',
        totalCopies: 1
    },
    {
        title: '1984',
        author: 'George Orwell',
        description: 'O Grande Irmão está de olho em você.',
        coverUrl: 'https://m.media-amazon.com/images/I/91SZSW8qSsL._AC_UF1000,1000_QL80_.jpg',
         isbn: '9780451524935',
        publicationDate: new Date('1949-06-08').toISOString(),
        genre: 'Ficção Científica',
        category: 'Ficção Científica',
        totalCopies: 4
    },
    {
        title: 'A Revolução dos Bichos',
        author: 'George Orwell',
        description: 'Todos os animais são iguais, mas alguns são mais iguais que outros.',
        coverUrl: 'https://m.media-amazon.com/images/I/91S1XN2GgVL._AC_UF1000,1000_QL80_.jpg',
        isbn: '9780451526342',
        publicationDate: new Date('1945-08-17').toISOString(),
        genre: 'Ficção',
        category: 'Ficção Científica',
        totalCopies: 5
    },
    {
        title: 'O Código Da Vinci',
        author: 'Dan Brown',
        description: 'Um assassinato no Louvre revela um segredo religioso.',
        coverUrl: 'https://m.media-amazon.com/images/I/712Xk7h548L._AC_UF1000,1000_QL80_.jpg',
        isbn: '9780307474278',
        publicationDate: new Date('2003-03-18').toISOString(),
        genre: 'Suspense',
        category: 'Suspense',
        totalCopies: 2
    },
    {
        title: 'Percy Jackson: O Ladrão de Raios',
        author: 'Rick Riordan',
        description: 'Um adolescente descobre que é um semideus.',
        coverUrl: 'https://m.media-amazon.com/images/I/91f6B6tqO4L._AC_UF1000,1000_QL80_.jpg',
        isbn: '9788598078396',
        publicationDate: new Date('2005-06-28').toISOString(),
        genre: 'Fantasia',
        category: 'Fantasia',
        totalCopies: 6
    }
  ];

  for (const b of booksData) {
      // Check if book exists by ISBN or Title to avoid duplicates or re-seed idempotently
      const existing = await prisma.book.findFirst({
        where: { 
            OR: [
                { isbn: b.isbn },
                { title: b.title }
            ]
        }
      });

      if (existing) {
          console.log(`Skipping existing book: ${b.title}`);
          continue;
      }

      const catId = categoriesMap.get(b.category);

      const book = await prisma.book.create({
          data: {
              title: b.title,
              author: b.author,
              description: b.description,
              coverUrl: b.coverUrl,
              isbn: b.isbn,
              publicationDate: b.publicationDate,
              genre: b.genre,
              totalCopies: b.totalCopies,
              availableCopies: b.totalCopies, // Initialize correctly!
              categories: catId ? {
                  connect: { id: catId }
              } : undefined
          }
      });
      
      // Create copies
      const copiesData: { bookId: string; copyCode: string, status: string, customLabel: string }[] = [];
      for(let i = 1; i <= b.totalCopies; i++) {
          const bookCode = b.title.substring(0, 3).toUpperCase();
          // Assuming AUTO logic approximation for seed
          const label = `${b.category.charAt(0).toUpperCase()}${bookCode}-${i}`;
          copiesData.push({
              bookId: book.id,
              copyCode: label,
              customLabel: label,
              status: 'AVAILABLE'
          });
      }
      
      if(copiesData.length > 0) {
        // cast to any to avoid type gymnastics with enums if unused in seed import
        await prisma.bookCopy.createMany({ data: copiesData as any });
      }

      console.log(`Created book: ${book.title} with ${b.totalCopies} copies linked to ${b.category}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
