//===========================Data layer========================

function loadUsers() {
    const data = localStorage.getItem('fintrack_users');//for users registering 
    return data ? JSON.parse(data) : [];
}

function saveUsers(users) {
    localStorage.setItem('fintrack_users', JSON.stringify(users));
}

function getCurrentUser() {
    const data = localStorage.getItem('fintrack_currentUser');// for users currently using 
    return data ? JSON.parse(data) : null;
}

function setCurrentUser(user) {
    localStorage.setItem('fintrack_currentUser', JSON.stringify(user));
}

function clearCurrentUser() {
    localStorage.removeItem('fintrack_currentUser');
}



//=====================User Avatar======================

function getInitials(firstName, lastName) {
    const first = firstName.trim().charAt(0).toUpperCase();
    const last = lastName.trim().charAt(0).toUpperCase();
    return first + last;
}

//=====================Registration form data===================

const registerForm = document.querySelector(".register-inputs");

registerForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const firstName = document.getElementById('regFirstName').value.trim();
    const lastName = document.getElementById('regLastName').value.trim();
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    const errorEl = document.getElementById('registerError');


    if (!firstName || !lastName || !username || !password) {
        errorEl.textContent = 'Please fill in every field.';
        return;
    }

    const users = loadUsers();
    const exists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
    if (exists) {
        errorEl.textContent = 'That username is already taken.';
        return;
    }

    users.push({ firstName, lastName, username, password });
    saveUsers(users);

    errorEl.textContent = '';
    // Autoswitch to login after successful registration

    document.querySelector('.register-form').style.display = 'none';
    document.querySelector('.login-form').style.display = 'block';
    document.getElementById('loginUsername').value = username; 

});

//=========================Login Form===========================

const loginForm = document.querySelector('.login-inputs')
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.querySelector('#loginUsername').value.trim();
    const password = document.querySelector('#loginPassword').value;
    const errorEl = document.getElementById('loginError');

    const users = loadUsers();
    const match = users.find(u =>
        u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (!match) {
        errorEl.textContent = 'Incorrect username or password.';
        return;
    }

    setCurrentUser(match);
    enterApp(match);
});

//=============Switching between login to register =============

const showReg =document.querySelector('.showRegister')
showReg.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('.login-form').style.display = 'none';
    document.querySelector('.register-form').style.display = 'block';
});

const showLogin = document.querySelector('.showLogin')
showLogin.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('.register-form').style.display = 'none';
    document.querySelector('.login-form').style.display = 'block';
});

//================Entering the main page=======================


function enterApp(user) {
    
    document.querySelector('.page-entry').style.display = 'none';
    document.querySelector('.main-section').style.display = 'flex';

    document.querySelector('.userFullName').textContent = `${user.firstName} ${user.lastName}`;
    document.querySelector('#avatarBtn').textContent = getInitials(user.firstName, user.lastName);

    masterRefresh();  
}



//============================Logout============================

function logout() {
    clearCurrentUser();
    document.querySelector('.main-section').style.display = 'none';
    document.querySelector('.page-entry').style.display = 'flex';
    document.getElementById('avatarMenu').style.display = 'none';
    document.querySelector('.login-inputs').reset();
}

document.querySelectorAll('.logout-item').forEach(function(btn) {
    btn.addEventListener('click', logout);
});

document.addEventListener('click', function(e) {
    const avatarBtn = document.getElementById('avatarBtn');
    const avatarMenu = document.getElementById('avatarMenu');

    const clickedAvatar = avatarBtn.contains(e.target);
    const clickedMenu = avatarMenu.contains(e.target);

    if (!clickedAvatar && !clickedMenu) {
        avatarMenu.style.display = 'none';
    }
});

document.getElementById('avatarBtn').addEventListener('click', function() {
   const menu = document.getElementById('avatarMenu');
    menu.style.display = (menu.style.display === 'flex') ? 'none' : 'flex';
});

//===============toggle==========================

function applyDarkMode(isDark) {
    document.body.classList.toggle('dark-theme', isDark);
    localStorage.setItem('fintrack_darkMode', isDark ? 'true' : 'false');
}
document.getElementById('darkModeToggle').addEventListener('change', function() {
    applyDarkMode(this.checked);
});
(function() {
    const saved = localStorage.getItem('fintrack_darkMode') === 'true';
    applyDarkMode(saved);
    document.getElementById('darkModeToggle').checked = saved;
})();


//=============Transactions data layer===================
function loadTransactions() {
    const data = localStorage.getItem('fintrack_transactions');
    return data ? JSON.parse(data) : [];
}
function saveTransactions(transactions) {
    localStorage.setItem('fintrack_transactions', JSON.stringify(transactions));
}


//====================Calculate totals===================
function calculateTotals(transactions) {
    let income = 0, expense = 0;
    transactions.forEach(t => {
        if (t.type === 'income') income += t.amount;
        else expense += t.amount;
    });
    return { income, expense, balance: income - expense };
}

//===============render cards=======================

function renderCards() {
    const transactions = loadTransactions();
    const { income, expense, balance } = calculateTotals(transactions);
    const sym = getCurrencySymbol();

    document.getElementById('balanceValue').textContent = `${sym}${balance.toFixed(2)}`;
    document.getElementById('incomeValue').textContent = `${sym}${income.toFixed(2)}`;
    document.getElementById('expenseValue').textContent = `${sym}${expense.toFixed(2)}`;
    document.getElementById('transactionCountValue').textContent = transactions.length;
}



//============Render chart (Chart.js)==================
let cashFlowChartInstance = null;

function renderChart() {
    const transactions = loadTransactions();
    const { income, expense } = calculateTotals(transactions);

    const ctx = document.getElementById('cashFlowChart').getContext('2d');

    // destroying old chart before drawing a new one, or they stack
    if (cashFlowChartInstance) {
        cashFlowChartInstance.destroy();
    }

    cashFlowChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Income vs Expenses'],
            datasets: [
                {
                    label: 'Income',
                    data: [income],
                    backgroundColor: '#166534',
                    borderRadius: 6,
                },
                {
                    label: 'Expenses',
                    data: [expense],
                    backgroundColor: '#991b1b',
                    borderRadius: 6,
                }
            ]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } }, // you already built a custom legend in HTML
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

//======================Master refresh==========================
function masterRefresh() {
    renderCards();
    renderChart();
    renderTable();
  
}


//====================transaction-table=====================

function renderTable() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter').value;
    const sym = getCurrencySymbol();

    let transactions = loadTransactions();

    // Apply type filter
    if (typeFilter !== 'all') {
        transactions = transactions.filter(t => t.type === typeFilter);
    }

    // Apply search (matches description)
    if (searchTerm) {
        transactions = transactions.filter(t => t.description.toLowerCase().includes(searchTerm));
    }

    const tbody = document.getElementById('transactionTableBody');

    const cardsBody = document.getElementById('transactionCardsBody');
    tbody.innerHTML = '';
    cardsBody.innerHTML = '';

    transactions.forEach(t => {
        const sign = t.type === 'income' ? '+' : '-';
        const colorClass = t.type === 'income' ? 'text-green' : 'text-red';

        tbody.innerHTML += `
            <tr>
                <td>${t.date}</td>
                <td><strong>${t.description}</strong></td>
                <td><span class="category-pill">${t.category}</span></td>
                <td class="${colorClass}">${sign}${sym}${t.amount.toFixed(2)}</td>
                <td class="action-cell">
                    <button class="edit-btn" onclick="openEditForm(${t.id})"><i class="ri-pencil-line"></i></button>
                    <button class="delete-btn" onclick="deleteTransaction(${t.id})"><i class="ri-delete-bin-line"></i></button>
                </td>
            </tr>`;

        cardsBody.innerHTML += `
            <div class="tx-card">
                <div class="tx-card-left">
                    <span class="tx-card-desc">${t.description}</span>
                    <span class="tx-card-meta">${t.date} • ${t.category}</span>
                </div>
                <div class="tx-card-right">
                    <span class="tx-card-amount ${t.type}">${sign}${sym}${t.amount.toFixed(2)}</span>
                    <button class="edit-btn" onclick="openEditForm(${t.id})"><i class="ri-pencil-line"></i></button>
                    <button class="delete-btn" onclick="deleteTransaction(${t.id})"><i class="ri-delete-bin-line"></i></button>
                </div>
            </div>`;
    });
}

function deleteTransaction(id) {
    const confirmed = confirm('Delete this transaction?');
    if (!confirmed) return;
    saveTransactions(loadTransactions().filter(t => t.id !== id));
    masterRefresh();
}

document.getElementById('searchInput').addEventListener('input', renderTable);
document.getElementById('typeFilter').addEventListener('change', renderTable);



//====================Edit model ==========================

let editingId = null;   // null = adding new, otherwise holds the id being edited

function openEditForm(id) {
    const transaction = loadTransactions().find(t => t.id === id);
    if (!transaction) return;

    editingId = id;

    document.getElementById('trans-type').value = transaction.type;
    document.getElementById('txDescription').value = transaction.description;
    document.getElementById('transactionAmount').value = transaction.amount;
    document.getElementById('transactionDate').value = transaction.date;
    document.getElementById('transactionCategory').value = transaction.category;

    document.querySelector('.transaction-heading').textContent = 'Edit Transaction';
    addTransactionModal.classList.add('active');
}


document.querySelectorAll('.add-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
        editingId = null;
        document.querySelector('.transaction-heading').textContent = 'Add Transaction';
        document.getElementById('transactionForm').reset();
        document.getElementById('transactionDate').valueAsDate = new Date();
        addTransactionModal.classList.add('active');
    });
});

//================Add Transaction model open/close===============
const addTransactionModel = document.getElementById('addTransactionModal');

document.querySelectorAll('.add-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById('transactionDate').valueAsDate = new Date();
        addTransactionModal.classList.add('active');
    });
});

document.getElementById('closeModalBtn').addEventListener('click', () => {
    addTransactionModal.classList.remove('active');
});

// click outside modal card closes it
addTransactionModal.addEventListener('click', (e) => {
    if (e.target === addTransactionModal) {
        addTransactionModal.classList.remove('active');
    }
});


//========================Currency========================
function getCurrencySymbol() {
    return localStorage.getItem('fintrack_currency') || '$';
}

function setCurrencySymbol(symbol) {
    localStorage.setItem('fintrack_currency', symbol);
}



//=========================Income/Expense toggle buttons=========================
document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('transactionType').value = btn.dataset.type;
    });
});

//=========================Submit new transaction=================================
document.getElementById('transactionForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const type = document.getElementById('trans-type').value;
    const description = document.getElementById('txDescription').value.trim();
    const amount = parseFloat(document.getElementById('transactionAmount').value);
    const date = document.getElementById('transactionDate').value;
    const category = document.getElementById('transactionCategory').value;
    const errorEl = document.getElementById('transactionError');

    if (!description || !amount || amount <= 0 || !date || !category) {
        errorEl.textContent = 'Please fill in every field with a valid amount.';
        return;
    }

    const transactions = loadTransactions();
    transactions.push({
        id: Date.now(),         
        type, description, amount, date, category
    });
    saveTransactions(transactions);

     errorEl.textContent = '';
    this.reset();
    addTransactionModal.classList.remove('active');
    masterRefresh();  
});

//================preferences--- reset btn===================

document.getElementById('resetDataBtn').addEventListener('click', function() {
    const confirmed = confirm('This will permanently delete all your transactions. Are you sure?');
    if (!confirmed) return;
    localStorage.removeItem('fintrack_transactions');
    masterRefresh();  
});

//========================Page switching (Dashboard/Settings)========================
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // toggle active class on all nav buttons across BOTH sidebar and floating bar
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll(`.nav-btn[data-target="${this.dataset.target}"]`).forEach(b => b.classList.add('active'));

        // hide all views, show the target one
        document.getElementById('dashboard-view').style.display = 'none';
        document.getElementById('settings-view').style.display = 'none';
        document.getElementById(this.dataset.target).style.display = 'flex';

        if (this.dataset.target === 'settings-view') {
            loadSettingsForm();   // pre-fill with current user's info
        }
    });
});

//========================Settings form========================
function loadSettingsForm() {
    const user = getCurrentUser();
    document.getElementById('settingFirstName').value = user.firstName;
    document.getElementById('settingLastName').value = user.lastName;
    document.getElementById('settingUsername').value = user.username;
    document.getElementById('settingPassword').value = ''
    document.getElementById('settingCurrency').value = getCurrencySymbol();
}

document.getElementById('settingsForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const firstName = document.getElementById('settingFirstName').value.trim();
    const lastName = document.getElementById('settingLastName').value.trim();
    const newUsername = document.getElementById('settingUsername').value.trim();
    const newPassword = document.getElementById('settingPassword').value;
    const currency = document.getElementById('settingCurrency').value;

    if (!firstName || !lastName || !newUsername) return;

  
    const user = getCurrentUser();
    const users = loadUsers();

    // If username changed, make sure nobody else already has it
    const usernameTaken = users.some(u =>
        u.username.toLowerCase() === newUsername.toLowerCase() && u.username !== user.username
    );
    if (usernameTaken) {
        alert('That username is already taken.');
        return;
    }

    const updatedUser = {
        ...user,
        firstName,
        lastName,
        username: newUsername,
        password: newPassword ? newPassword : user.password  
    };

    const updatedUsers = users.map(u => u.username === user.username ? updatedUser : u);
    saveUsers(updatedUsers);
    setCurrentUser(updatedUser);

    // Update currency preference
    setCurrencySymbol(currency);

    document.querySelector('.userFullName').textContent = `${firstName} ${lastName}`;
    document.getElementById('avatarBtn').textContent = getInitials(firstName, lastName);

    masterRefresh();   
    alert('Settings saved!');
});


//=================check session on page loading================

window.addEventListener('DOMContentLoaded', function() {
    const user = getCurrentUser();
    if (user) {
        enterApp(user);
    }
});