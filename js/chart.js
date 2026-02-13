// Chart rendering
class StockChart {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.data = [];
        this.padding = 40;
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.draw();
    }

    setData(history) {
        this.data = history.map(h => h.price);
        this.draw();
    }

    draw() {
        if (this.data.length === 0) return;

        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Calculate bounds
        const minPrice = Math.min(...this.data);
        const maxPrice = Math.max(...this.data);
        const priceRange = maxPrice - minPrice || 1;

        const chartWidth = width - this.padding * 2;
        const chartHeight = height - this.padding * 2;

        // Draw grid
        ctx.strokeStyle = '#2c3454';
        ctx.lineWidth = 1;

        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
            const y = this.padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(this.padding, y);
            ctx.lineTo(width - this.padding, y);
            ctx.stroke();

            // Price labels
            const price = maxPrice - (priceRange / 5) * i;
            ctx.fillStyle = '#9fa8da';
            ctx.font = '12px Segoe UI';
            ctx.textAlign = 'right';
            ctx.fillText('$' + price.toFixed(2), this.padding - 10, y + 4);
        }

        // Vertical grid lines
        const timePoints = 5;
        for (let i = 0; i <= timePoints; i++) {
            const x = this.padding + (chartWidth / timePoints) * i;
            ctx.beginPath();
            ctx.moveTo(x, this.padding);
            ctx.lineTo(x, height - this.padding);
            ctx.stroke();
        }

        // Draw area under line
        ctx.beginPath();
        ctx.moveTo(this.padding, height - this.padding);

        this.data.forEach((price, index) => {
            const x = this.padding + (chartWidth / (this.data.length - 1)) * index;
            const y = this.padding + chartHeight - ((price - minPrice) / priceRange) * chartHeight;
            
            if (index === 0) {
                ctx.lineTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.lineTo(width - this.padding, height - this.padding);
        ctx.closePath();

        // Gradient fill
        const gradient = ctx.createLinearGradient(0, this.padding, 0, height - this.padding);
        gradient.addColorStop(0, 'rgba(41, 98, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(41, 98, 255, 0.0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw line
        ctx.beginPath();
        this.data.forEach((price, index) => {
            const x = this.padding + (chartWidth / (this.data.length - 1)) * index;
            const y = this.padding + chartHeight - ((price - minPrice) / priceRange) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        // Determine line color based on trend
        const firstPrice = this.data[0];
        const lastPrice = this.data[this.data.length - 1];
        ctx.strokeStyle = lastPrice >= firstPrice ? '#00e676' : '#ff1744';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw points
        this.data.forEach((price, index) => {
            const x = this.padding + (chartWidth / (this.data.length - 1)) * index;
            const y = this.padding + chartHeight - ((price - minPrice) / priceRange) * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = lastPrice >= firstPrice ? '#00e676' : '#ff1744';
            ctx.fill();
        });

        // Draw current price indicator
        const lastX = width - this.padding;
        const lastY = this.padding + chartHeight - ((this.data[this.data.length - 1] - minPrice) / priceRange) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(lastX, lastY, 6, 0, Math.PI * 2);
        ctx.fillStyle = lastPrice >= firstPrice ? '#00e676' : '#ff1744';
        ctx.fill();
        ctx.strokeStyle = '#1e2442';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}
