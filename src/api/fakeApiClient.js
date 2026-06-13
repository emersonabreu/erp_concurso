// src/api/fakeApiClient.js
const API_URL = 'http://localhost:3001';

// ----------------------------
// Helpers
// ----------------------------
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
    console.error(`Erro em list(${endpoint}):`, err);
    return [];
  }
}

async function filter(endpoint, filters) {
  try {
    const res = await fetch(`${API_URL}/${endpoint}`);
    let data = await res.json();
    for (const [key, value] of Object.entries(filters)) {
      data = data.filter(item => item[key] === value);
    }
    return data;
  } catch (err) {
    console.error(`Erro em filter(${endpoint}):`, err);
    return [];
  }
}

async function get(endpoint, id) {
  const res = await fetch(`${API_URL}/${endpoint}/${id}`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
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

async function bulkCreate(endpoint, items) {
  const created = [];
  for (const item of items) {
    const newItem = await create(endpoint, item);
    created.push(newItem);
  }
  return created;
}

// ----------------------------
// Autenticação
// ----------------------------
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
  loginWithProvider: (provider, redirect) => {
    currentUser = { id: 'user1', email: 'usuario@teste.com', full_name: 'Usuário Teste' };
    localStorage.setItem('fakeUser', JSON.stringify(currentUser));
    window.location.href = redirect;
  },
  register: async ({ email, password }) => {
    const newUser = { id: Date.now().toString(), email, password, full_name: email.split('@')[0] };
    await create('users', newUser);
    currentUser = newUser;
    localStorage.setItem('fakeUser', JSON.stringify(newUser));
    return { access_token: 'fake-token' };
  },
  getCurrentUser: () => currentUser || JSON.parse(localStorage.getItem('fakeUser') || 'null'),
  setToken: () => {},
  resetPasswordRequest: async () => ({ success: true }),
  resetPassword: async () => ({ success: true }),
  verifyOtp: async () => ({ access_token: 'fake-token' }),
  resendOtp: async () => ({ success: true }),
};

// ----------------------------
// Integrações (IA, upload)
// ----------------------------
const integrations = {
  Core: {
    UploadFile: async ({ file }) => ({ file_url: `https://mock.storage/${file.name}` }),
    ExtractDataFromUploadedFile: async () => ({
      status: "success",
      output: [{ enunciado: "Questão mock", alternativa_a: "A", resposta_correta: "A" }]
    }),
    InvokeLLM: async () => ({
      disciplinas: [{ nome: "Português", prioridade: "alta", temas: [] }]
    })
  }
};

// ----------------------------
// Entidades
// ----------------------------
export const fakeApi = {
  entities: {
    Orgao: {
      list: (o, l) => list('orgaos', o, l),
      filter: (f) => filter('orgaos', f),
      get: (id) => get('orgaos', id),
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
    },
    Tema: {
      list: () => list('temas'),
      create: (d) => create('temas', d),
      update: (id, d) => update('temas', id, d),
      delete: (id) => del('temas', id)
    },
    Topico: {
      list: () => list('topicos'),
      create: (d) => create('topicos', d),
      update: (id, d) => update('topicos', id, d),
      delete: (id) => del('topicos', id)
    },
    Edital: {
      list: (o, l) => list('editais', o, l),
      create: (d) => create('editais', d),
      update: (id, d) => update('editais', id, d),
      delete: (id) => del('editais', id)
    },
    Cargo: {
      list: () => list('cargos'),
      create: (d) => create('cargos', d),
      update: (id, d) => update('cargos', id, d),
      delete: (id) => del('cargos', id)
    },
    Questao: {
      list: (o, l) => list('questoes', o, l),
      create: (d) => create('questoes', d),
      update: (id, d) => update('questoes', id, d),
      delete: (id) => del('questoes', id),
      bulkCreate: (items) => bulkCreate('questoes', items)
    },
    Simulado: {
      list: (o, l) => list('simulados', o, l),
      create: (d) => create('simulados', d),
      update: (id, d) => update('simulados', id, d),
      delete: (id) => del('simulados', id)
    },
    Resposta: {
      list: (o, l) => list('respostas', o, l),
      create: (d) => create('respostas', d),
      bulkCreate: (items) => bulkCreate('respostas', items)
    },
    RevisaoEspacada: {
      list: (o, l) => list('revisoes', o, l),
      filter: (f) => filter('revisoes', f),
      create: (d) => create('revisoes', d),
      update: (id, d) => update('revisoes', id, d)
    },
    Pontuacao: {
      list: () => list('pontuacoes'),
      create: (d) => create('pontuacoes', d),
      update: (id, d) => update('pontuacoes', id, d)
    },
    MetaSemanal: {
      list: (o, l) => list('metas', o, l),
      create: (d) => create('metas', d),
      update: (id, d) => update('metas', id, d),
      delete: (id) => del('metas', id)
    },
    CronogramaEstudo: {
      list: () => list('cronogramas'),
      filter: (f) => filter('cronogramas', f),
      create: (d) => create('cronogramas', d),
      update: (id, d) => update('cronogramas', id, d),
      delete: (id) => del('cronogramas', id)
    },
    ItemCronograma: {
      list: () => list('itens_cronograma'),
      filter: (f) => filter('itens_cronograma', f),
      create: (d) => create('itens_cronograma', d),
      update: (id, d) => update('itens_cronograma', id, d),
      bulkCreate: (items) => bulkCreate('itens_cronograma', items),
      delete: (id) => del('itens_cronograma', id)
    }
  },
  auth,
  integrations
};