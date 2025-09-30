const API_URL = 'http://localhost:5000/api'; // Change this when you deploy

// Store token in memory
let token = localStorage.getItem('token') || null;

window.onload = () => {
  if (token) {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('vault-section').style.display = 'block';
    fetchPasswords();
  }
};

// ===== SIGNUP =====
async function signup() {
  const username = document.getElementById('signup-username').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  try {
    const res = await fetch(`${API_URL}/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      token = data.token;
      localStorage.setItem('token', token);
      alert('Signup successful!');
      location.reload();
    } else {
      alert(data.message || 'Signup failed');
    }
  } catch (err) {
    console.error(err);
    alert('Error signing up');
  }
}

// ===== LOGIN =====
async function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      token = data.token;
      localStorage.setItem('token', token);
      alert('Login successful!');
      location.reload();
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (err) {
    console.error(err);
    alert('Error logging in');
  }
}

// ===== LOGOUT =====
function logout() {
  token = null;
  localStorage.removeItem('token');
  location.reload();
}

// ===== ADD PASSWORD ENTRY =====
async function addPassword() {
  const name = document.getElementById('vault-name').value;
  const email = document.getElementById('vault-email').value;
  const password = document.getElementById('vault-password').value;
  const category = document.getElementById('vault-category').value;

  if (!name || !password) return alert('Name and password are required');

  try {
    const res = await fetch(`${API_URL}/passwords`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, password, category }),
    });

    if (res.ok) {
      alert('Password saved!');
      fetchPasswords();
      document.getElementById('vault-name').value = '';
      document.getElementById('vault-email').value = '';
      document.getElementById('vault-password').value = '';
      document.getElementById('vault-category').value = '';
    } else {
      const data = await res.json();
      alert(data.message || 'Failed to save');
    }
  } catch (err) {
    console.error(err);
    alert('Error saving password');
  }
}

// ===== FETCH PASSWORDS =====
async function fetchPasswords() {
  try {
    const res = await fetch(`${API_URL}/passwords`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    const list = document.getElementById('password-list');
    list.innerHTML = '';

    if (data.length === 0) {
      list.innerHTML = '<p>No passwords saved yet.</p>';
      return;
    }

    data.forEach((item) => {
      const div = document.createElement('div');
      div.className = 'password-entry';
      div.innerHTML = `
        <strong>${item.name}</strong>
        ${item.email ? `<small>Email: ${item.email}</small><br/>` : ''}
        <small>Password: ${item.password}</small><br/>
        ${item.category ? `<small>Category: ${item.category}</small>` : ''}
      `;
      list.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    alert('Error loading passwords');
  }
}

