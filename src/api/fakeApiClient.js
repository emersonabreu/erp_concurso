// src/api/fakeApiClient.js
const API_URL = 'http://localhost:3001';

// Helper genérico para listar
async function list(endpoint, orderBy = '-created_date', limit = 100) {
  try {
    const res = await fetch(`${API_URL}/${endpoint}`);
    let data = await res.json();
    if (orderBy) {
      const [field, dir] = orderBy.startsWith('-') ? [orderBy.slice(1), 'desc'] : [orderBy, 'asc'];
      data.sort((a, b) => {
        const aVal = a[field] ?? '';
        const bVal = b[field] ?? '';
        return dir === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
      });
    }
    return data.slice(0, limit);
  } catch (err) {
    return [];
  }
}

async function create(endpoint, data) {
  const newItem = { ...data, id: Date.now().toString(), created_date: new Date().toISOString() };
  const res = await fetch(`${API_URL}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newItem)
  });
  return res.json();
}

async function update(endpoint, id, updates) {
  const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  return res.json();
}

async function del(endpoint, id) {
  await fetch(`${API_URL}/${endpoint}/${id}`, { method: 'DELETE' });
}

// Autenticação mock
let currentUser = null;

const auth = {
  loginViaEmailPassword: async (email, password) => {
    const res = await fetch(`${API_URL}/users?email=${email}&password=${password}`);
    const users = await res.json();
    const user = users[0];
    if (!user) throw new Error('Credenciais inválidas');
    currentUser = user;
    localStorage.setItem('fakeUser', JSON.stringify(user));
    return { access_token: 'fake-token' };
  },
  getCurrentUser: () => currentUser || JSON.parse(localStorage.getItem('fakeUser') || 'null'),
};

export const fakeApi = {
  entities: {
    Orgao: {
      list: () => list('orgaos'),
      create: (d) => create('orgaos', d),
      update: (id, d) => update('orgaos', id, d),
      delete: (id) => del('orgaos', id)
    },
    Banca: {
      list: () => list('bancas'),
      create: (d) => create('bancas', d),
      update: (id, d) => update('bancas', id, d),
      delete: (id) => del('bancas', id)
    },
    Disciplina: {
      list: () => list('disciplinas'),
      create: (d) => create('disciplinas', d),
      update: (id, d) => update('disciplinas', id, d),
      delete: (id) => del('disciplinas', id)
    }
    // Adicione outras entidades conforme necessário (serão expandidas depois)
  },
  auth
};