// Authentication system
const AUTH_KEY = 'stockmarket_users';
const CURRENT_USER_KEY = 'stockmarket_current_user';

// Initialize demo user
function initializeDemoUser() {
    const users = getUsers();
    if (!users['demo']) {
        users['demo'] = {
            username: 'demo',
            password: 'demo123',
            name: 'Demo User',
            createdAt: new Date().toISOString()
        };
        saveUsers(users);
    }
}

// Get all users
function getUsers() {
    const users = localStorage.getItem(AUTH_KEY);
    return users ? JSON.parse(users) : {};
}

// Save users
function saveUsers(users) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(users));
}

// Get current user
export function getCurrentUser() {
    const username = localStorage.getItem(CURRENT_USER_KEY);
    if (!username) return null;
    
    const users = getUsers();
    return users[username] || null;
}

// Set current user
function setCurrentUser(username) {
    localStorage.setItem(CURRENT_USER_KEY, username);
}

// Logout
export function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = 'login.html';
}

// Check if logged in
export function checkAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Login page logic
if (window.location.pathname.includes('login.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        initializeDemoUser();
        
        // Check if already logged in
        if (getCurrentUser()) {
            window.location.href = 'index.html';
            return;
        }
        
        // Tab switching
        document.querySelectorAll('.login-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                
                document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
                document.getElementById(tabName + 'Form').classList.add('active');
            });
        });
        
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            const users = getUsers();
            const user = users[username];
            
            if (!user) {
                alert('Username topilmadi!');
                return;
            }
            
            if (user.password !== password) {
                alert('Parol noto\'g\'ri!');
                return;
            }
            
            setCurrentUser(username);
            window.location.href = 'index.html';
        });
        
        // Register form
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value.trim();
            const username = document.getElementById('registerUsername').value.trim();
            const password = document.getElementById('registerPassword').value;
            const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
            
            if (username.length < 3) {
                alert('Username kamida 3 ta belgidan iborat bo\'lishi kerak!');
                return;
            }
            
            if (password.length < 6) {
                alert('Parol kamida 6 ta belgidan iborat bo\'lishi kerak!');
                return;
            }
            
            if (password !== passwordConfirm) {
                alert('Parollar mos kelmadi!');
                return;
            }
            
            const users = getUsers();
            
            if (users[username]) {
                alert('Bu username band!');
                return;
            }
            
            users[username] = {
                username,
                password,
                name,
                createdAt: new Date().toISOString()
            };
            
            saveUsers(users);
            setCurrentUser(username);
            window.location.href = 'index.html';
        });
    });
}
