import { setDoc, doc, collection } from 'firebase/firestore';
import { db } from '@/src/firebase';

export const populateMockData = async () => {
  const trilhas = [
    {
      id: '1',
      title: 'Fundamentos do Branding para Produtos Naturais',
      description: 'Aprenda a criar uma marca forte e autêntica que ressoe com o público consciente.',
      category: 'Branding',
      thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      isPremium: false
    },
    {
      id: '2',
      title: 'E-commerce de Sucesso: Do Zero à Primeira Venda',
      description: 'O guia completo para configurar sua loja online e começar a vender seus produtos artesanais.',
      category: 'E-commerce',
      thumbnail: 'https://images.unsplash.com/photo-1556742049-02e49f30b910?auto=format&fit=crop&w=800&q=80',
      isPremium: true
    }
  ];

  const modulos = [
    { id: 'm1', trilhaId: '1', title: 'Introdução ao Branding', order: 1 },
    { id: 'm2', trilhaId: '1', title: 'Identidade Visual', order: 2 }
  ];

  const aulas = [
    { 
      id: '1', 
      moduloId: 'm1', 
      title: 'O que é Branding?', 
      order: 1, 
      content: 'Branding não é apenas um logo. É a alma do seu negócio natural.',
      checklist: ['Definir valores', 'Criar manifesto']
    },
    { 
      id: '2', 
      moduloId: 'm1', 
      title: 'Sua História como Diferencial', 
      order: 2, 
      content: 'Conte como você começou a produzir produtos veganos.',
      checklist: ['Escrever "Sobre Nós"']
    }
  ];

  try {
    for (const t of trilhas) {
      await setDoc(doc(db, 'trilhas', t.id), t);
    }
    for (const m of modulos) {
      await setDoc(doc(db, `trilhas/${m.trilhaId}/modulos`, m.id), m);
    }
    for (const a of aulas) {
      // Find which modulo this aula belongs to
      const mod = modulos.find(m => m.id === a.moduloId);
      if (mod) {
        await setDoc(doc(db, `trilhas/${mod.trilhaId}/modulos/${a.moduloId}/aulas`, a.id), a);
      }
    }
    console.log('Mock data populated successfully!');
  } catch (error) {
    console.error('Error populating mock data:', error);
  }
};
