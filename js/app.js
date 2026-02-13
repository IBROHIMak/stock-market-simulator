// Application state
const state = {
    balance: 10000,
    portfolio: {}, // { symbol: { quantity, avgPrice } }
    selectedStock: null,
    tradeAction: 'buy',
    history: []
};

// Initialize
let chart;

document.addEventListener('DOMContentLoaded', () => {
    initializeStockHistory();
    chart = new StockChart('stockChart');
    
    renderStockList();
    updateUI();
    
    // Start price updates
    setInterval(() => {
        updateStockPrices();
        renderStockList();
        if (state.selectedStock) {
            updateChart();
            updateChartInfo();
        }
        updatePortfolio();
    }, 2000); // Update every 2 seconds
    
    // Event listeners
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.tradeAction = e.target.dataset.action;
            updateTradeButton();
        });
    });
    
    document.getElementById('quantity').addEventListener('input', updateTotalPrice);
    document.getElementById('tradeBtn').addEventListener('click', executeTrade);
    
    // Modal close
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('alertModal');
        if (e.target === modal) closeModal();
    });
});

// Render stock list
function renderStockList() {
    const container = document.getElementById('stockList');
    container.innerHTML = '';
    
    STOCKS.forEach(stock => {
        const change = getPriceChange(stock);
        const isPositive = change >= 0;
        
        const item = document.createElement('div');
        item.className = `stock-item ${state.selectedStock === stock.symbol ? 'active' : ''}`;
        item.innerHTML = `
            <div class="stock-header">
                <span class="stock-symbol">${stock.symbol}</span>
                <span class="stock-price">${formatCurrency(stock.price)}</span>
            </div>
            <div class="stock-name">${stock.name}</div>
            <span class="stock-change ${isPositive ? 'positive' : 'negative'}">
                ${formatPercentage(change)}
            </span>
        `;
        
        item.addEventListener('click', () => selectStock(stock.symbol));
        container.appendChild(item);
    });
}

// Select stock
function selectStock(symbol) {
    state.selectedStock = symbol;
    renderStockList();
    updateChart();
    updateChartInfo();
    updateTotalPrice();
}

// Update chart
function updateChart() {
    const stock = getStock(state.selectedStock);
    if (stock) {
        chart.setData(stock.history);
    }
}

// Update chart info
function updateChartInfo() {
    const stock = getStock(state.selectedStock);
    if (!stock) return;
    
    const change = getPriceChange(stock);
    const isPositive = change >= 0;
    
    document.getElementById('selectedStockName').textContent = `${stock.symbol} - ${stock.name}`;
    document.getElementById('chartPrice').textContent = formatCurrency(stock.price);
    
    const changeEl = document.getElementById('chartChange');
    changeEl.textContent = formatPercentage(change);
    changeEl.className = `price-change ${isPositive ? 'positive' : 'negative'}`;
    changeEl.style.background = isPositive ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255, 23, 68, 0.2)';
    changeEl.style.color = isPositive ? '#00e676' : '#ff1744';
}

// Update total price
function updateTotalPrice() {
    if (!state.selectedStock) {
        document.getElementById('totalPrice').value = '$0.00';
        return;
    }
    
    const stock = getStock(state.selectedStock);
    const quantity = parseInt(document.getElementById('quantity').value) || 0;
    const total = stock.price * quantity;
    
    document.getElementById('totalPrice').value = formatCurrency(total);
}

// Update trade button
function updateTradeButton() {
    const btn = document.getElementById('tradeBtn');
    if (state.tradeAction === 'buy') {
        btn.textContent = 'Sotib olish';
        btn.className = 'trade-btn buy-btn';
    } else {
        btn.textContent = 'Sotish';
        btn.className = 'trade-btn sell-btn';
    }
}

// Execute trade
function executeTrade() {
    if (!state.selectedStock) {
        showModal('Iltimos, aksiya tanlang!');
        return;
    }
    
    const stock = getStock(state.selectedStock);
    const quantity = parseInt(document.getElementById('quantity').value);
    
    if (!quantity || quantity <= 0) {
        showModal('Miqdorni kiriting!');
        return;
    }
    
    const totalCost = stock.price * quantity;
    
    if (state.tradeAction === 'buy') {
        // Buy stock
        if (totalCost > state.balance) {
            showModal('Balans yetarli emas!');
            return;
        }
        
        state.balance -= totalCost;
        
        if (!state.portfolio[stock.symbol]) {
            state.portfolio[stock.symbol] = {
                quantity: 0,
                avgPrice: 0,
                totalInvested: 0
            };
        }
        
        const portfolio = state.portfolio[stock.symbol];
        portfolio.totalInvested += totalCost;
        portfolio.quantity += quantity;
        portfolio.avgPrice = portfolio.totalInvested / portfolio.quantity;
        
        addHistory('buy', stock.symbol, quantity, stock.price);
        showModal(`${quantity} dona ${stock.symbol} sotib olindi!`);
        
    } else {
        // Sell stock
        if (!state.portfolio[stock.symbol] || state.portfolio[stock.symbol].quantity < quantity) {
            showModal('Yetarli aksiya yo\'q!');
            return;
        }
        
        state.balance += totalCost;
        
        const portfolio = state.portfolio[stock.symbol];
        const soldInvestment = portfolio.avgPrice * quantity;
        portfolio.totalInvested -= soldInvestment;
        portfolio.quantity -= quantity;
        
        if (portfolio.quantity === 0) {
            delete state.portfolio[stock.symbol];
        }
        
        addHistory('sell', stock.symbol, quantity, stock.price);
        showModal(`${quantity} dona ${stock.symbol} sotildi!`);
    }
    
    document.getElementById('quantity').value = 1;
    updateUI();
}

// Add to history
function addHistory(action, symbol, quantity, price) {
    state.history.unshift({
        action,
        symbol,
        quantity,
        price,
        total: quantity * price,
        time: new Date()
    });
    
    // Keep last 20 transactions
    if (state.history.length > 20) {
        state.history.pop();
    }
    
    renderHistory();
}

// Render history
function renderHistory() {
    const container = document.getElementById('historyList');
    
    if (state.history.length === 0) {
        container.innerHTML = '<p class="empty-history">Hali tranzaksiya yo\'q</p>';
        return;
    }
    
    container.innerHTML = '';
    state.history.forEach(item => {
        const el = document.createElement('div');
        el.className = `history-item ${item.action}`;
        el.innerHTML = `
            <div class="history-info">
                <span class="history-action ${item.action}">${item.action === 'buy' ? 'SOTIB OLISH' : 'SOTISH'}</span>
                <span class="history-details">
                    ${item.quantity} x ${item.symbol} @ ${formatCurrency(item.price)}
                </span>
            </div>
            <div>
                <div style="font-weight: 600; color: ${item.action === 'buy' ? '#ff1744' : '#00e676'}">
                    ${item.action === 'buy' ? '-' : '+'}${formatCurrency(item.total)}
                </div>
                <div class="history-time">${formatTime(item.time)}</div>
            </div>
        `;
        container.appendChild(el);
    });
}

// Update portfolio display
function updatePortfolio() {
    const container = document.getElementById('portfolioList');
    
    const portfolioItems = Object.keys(state.portfolio);
    if (portfolioItems.length === 0) {
        container.innerHTML = '<div class="empty-portfolio"><p>Hali aksiya sotib olmagansiz</p></div>';
        return;
    }
    
    container.innerHTML = '';
    portfolioItems.forEach(symbol => {
        const portfolio = state.portfolio[symbol];
        const stock = getStock(symbol);
        const currentValue = stock.price * portfolio.quantity;
        const invested = portfolio.avgPrice * portfolio.quantity;
        const profit = currentValue - invested;
        const profitPercent = (profit / invested) * 100;
        
        const el = document.createElement('div');
        el.className = 'portfolio-item';
        el.innerHTML = `
            <div class="portfolio-header">
                <span class="portfolio-symbol">${symbol}</span>
                <span class="portfolio-quantity">${portfolio.quantity} dona</span>
            </div>
            <div class="portfolio-details">
                <span>O'rtacha:</span>
                <span>${formatCurrency(portfolio.avgPrice)}</span>
            </div>
            <div class="portfolio-details">
                <span>Hozirgi:</span>
                <span>${formatCurrency(stock.price)}</span>
            </div>
            <div class="portfolio-details">
                <span>Qiymat:</span>
                <span>${formatCurrency(currentValue)}</span>
            </div>
            <div class="portfolio-profit" style="color: ${profit >= 0 ? '#00e676' : '#ff1744'}">
                ${profit >= 0 ? '+' : ''}${formatCurrency(profit)} (${formatPercentage(profitPercent)})
            </div>
        `;
        container.appendChild(el);
    });
}

// Update UI
function updateUI() {
    // Update balance
    document.getElementById('balance').textContent = formatCurrency(state.balance);
    
    // Calculate portfolio value
    let portfolioValue = 0;
    let totalInvested = 0;
    
    Object.keys(state.portfolio).forEach(symbol => {
        const portfolio = state.portfolio[symbol];
        const stock = getStock(symbol);
        portfolioValue += stock.price * portfolio.quantity;
        totalInvested += portfolio.avgPrice * portfolio.quantity;
    });
    
    document.getElementById('portfolioValue').textContent = formatCurrency(portfolioValue);
    
    // Calculate total profit
    const totalProfit = portfolioValue - totalInvested;
    const profitEl = document.getElementById('totalProfit');
    profitEl.textContent = formatCurrency(state.balance + portfolioValue);
    profitEl.className = 'profit';
    
    const totalChange = state.balance + portfolioValue - 10000;
    if (totalChange >= 0) {
        profitEl.classList.add('positive');
    } else {
        profitEl.classList.add('negative');
    }
    
    updatePortfolio();
    updateTotalPrice();
}

// Show modal
function showModal(message) {
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('alertModal').style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('alertModal').style.display = 'none';
}

// Format time
function formatTime(date) {
    return date.toLocaleTimeString('uz-UZ', { 
        hour: '2-digit', 
        minute: '2-digit'
    });
}
