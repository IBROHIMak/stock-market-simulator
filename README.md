# 📈 Virtual Stock Market Simulator

Professional virtual stock trading platform with real-time price updates and portfolio management.

## ✨ Features

- 💰 $10,000 starting balance
- 📊 10 different stocks (AAPL, GOOGL, MSFT, TSLA, etc.)
- 📈 Real-time price updates every 2 seconds
- 🎯 Realistic market simulation (Geometric Brownian Motion)
- 💼 Portfolio management with profit/loss tracking
- 📉 Interactive canvas-based charts
- 📜 Transaction history
- 🎨 Professional dark theme UI

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎮 How to Use

1. **Select a Stock** - Click on any stock from the left sidebar
2. **View Chart** - See real-time price movements on the interactive chart
3. **Buy/Sell** - Use the trading panel to execute trades
4. **Monitor Portfolio** - Track your investments in the right sidebar
5. **Check History** - View all your transactions at the bottom

## 🏗️ Project Structure

```
stock-market-simulator/
├── index.html          # Main HTML file
├── css/
│   └── style.css      # All styles
├── js/
│   ├── app.js         # Main application logic
│   ├── stocks.js      # Stock data and price simulation
│   └── chart.js       # Canvas chart rendering
├── assets/            # Images and static files
├── package.json       # Project dependencies
└── README.md          # Documentation
```

## 🛠️ Technologies

- **Vanilla JavaScript** - No frameworks, pure JS
- **Canvas API** - For chart rendering
- **CSS3** - Modern styling with gradients and animations
- **Vite** - Fast build tool and dev server

## 📊 Stock Simulation

The simulator uses Geometric Brownian Motion to create realistic price movements:
- Each stock has its own volatility level
- Prices update every 2 seconds
- Historical data is maintained for charting
- Prevents negative prices

## 🎨 Design

- Professional dark theme (blue/black palette)
- Smooth animations and transitions
- Responsive layout
- Color-coded profit/loss indicators
- Modern glassmorphism effects

## 📝 License

MIT License - feel free to use for learning and personal projects

## 🤝 Contributing

This is a learning project. Feel free to fork and modify!
