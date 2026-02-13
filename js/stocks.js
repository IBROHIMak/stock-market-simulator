// Stock data with realistic companies
const STOCKS = [
    {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 175.50,
        history: [],
        volatility: 0.02
    },
    {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        price: 142.30,
        history: [],
        volatility: 0.025
    },
    {
        symbol: 'MSFT',
        name: 'Microsoft Corp.',
        price: 378.90,
        history: [],
        volatility: 0.018
    },
    {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        price: 248.75,
        history: [],
        volatility: 0.045
    },
    {
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        price: 178.25,
        history: [],
        volatility: 0.028
    },
    {
        symbol: 'META',
        name: 'Meta Platforms',
        price: 485.60,
        history: [],
        volatility: 0.032
    },
    {
        symbol: 'NVDA',
        name: 'NVIDIA Corp.',
        price: 875.40,
        history: [],
        volatility: 0.038
    },
    {
        symbol: 'NFLX',
        name: 'Netflix Inc.',
        price: 625.30,
        history: [],
        volatility: 0.035
    },
    {
        symbol: 'AMD',
        name: 'AMD Inc.',
        price: 185.90,
        history: [],
        volatility: 0.04
    },
    {
        symbol: 'INTC',
        name: 'Intel Corp.',
        price: 42.15,
        history: [],
        volatility: 0.022
    }
];

// Initialize stock history
function initializeStockHistory() {
    STOCKS.forEach(stock => {
        stock.history = [];
        // Generate 50 historical points
        let price = stock.price;
        for (let i = 50; i >= 0; i--) {
            stock.history.push({
                time: Date.now() - (i * 60000), // 1 minute intervals
                price: price
            });
            // Random walk for historical data
            const change = (Math.random() - 0.5) * stock.volatility * price;
            price = Math.max(price + change, price * 0.5); // Prevent negative prices
        }
        stock.price = price;
    });
}

// Update stock prices with realistic market simulation
function updateStockPrices() {
    STOCKS.forEach(stock => {
        // Geometric Brownian Motion simulation
        const dt = 1 / 252; // Daily time step
        const drift = 0.0001; // Small positive drift
        const randomShock = (Math.random() - 0.5) * 2;
        
        // Calculate price change
        const priceChange = stock.price * (drift * dt + stock.volatility * Math.sqrt(dt) * randomShock);
        
        // Update price (prevent going below $1)
        stock.price = Math.max(stock.price + priceChange, 1);
        
        // Add to history
        stock.history.push({
            time: Date.now(),
            price: stock.price
        });
        
        // Keep only last 50 points
        if (stock.history.length > 50) {
            stock.history.shift();
        }
    });
}

// Get stock by symbol
function getStock(symbol) {
    return STOCKS.find(s => s.symbol === symbol);
}

// Calculate price change percentage
function getPriceChange(stock) {
    if (stock.history.length < 2) return 0;
    const oldPrice = stock.history[0].price;
    const currentPrice = stock.price;
    return ((currentPrice - oldPrice) / oldPrice) * 100;
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Format percentage
function formatPercentage(value) {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
}
