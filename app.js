const app = {
    data: {
        revenue: 45231,
        users: 1205,
        serverLoad: 34,
        trafficPoints: [20, 45, 30, 60, 55, 80, 70, 90, 65, 85, 50, 95]
    },

    init() {
        this.startClock();
        this.renderKPIs();
        this.renderChart();
        this.generateLogs();
        
        // Simulate "Live" updates every 3 seconds
        setInterval(() => {
            this.simulateLiveUpdate();
        }, 3000);
    },

    startClock() {
        const update = () => {
            const now = new Date();
            document.getElementById('clock').innerText = now.toLocaleTimeString();
        };
        update();
        setInterval(update, 1000);
    },

    renderKPIs() {
        document.getElementById('kpi-revenue').innerText = '$' + this.data.revenue.toLocaleString();
        document.getElementById('kpi-users').innerText = this.data.users.toLocaleString();
        document.getElementById('kpi-server').innerText = this.data.serverLoad + '%';
        
        // Dynamic color for server load
        const serverEl = document.getElementById('kpi-server');
        if(this.data.serverLoad > 80) serverEl.style.color = '#ef4444';
        else serverEl.style.color = '#f1f5f9';
    },

    // Custom SVG Chart Engine
    renderChart() {
        const container = document.getElementById('mainChartContainer');
        const points = this.data.trafficPoints;
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        // Calculate X and Y coordinates relative to the SVG box
        const maxVal = Math.max(...points);
        const xStep = width / (points.length - 1);
        
        const coordinates = points.map((val, index) => {
            const x = index * xStep;
            // Invert Y because SVG 0 is at the top
            const y = height - ((val / 100) * height); 
            return `${x},${y}`;
        }).join(' ');

        // Create SVG HTML
        container.innerHTML = `
            <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:var(--accent);stop-opacity:0.2" />
                        <stop offset="100%" style="stop-color:var(--accent);stop-opacity:0" />
                    </linearGradient>
                </defs>
                <polygon points="0,${height} ${coordinates} ${width},${height}" fill="url(#gradient)" />
                <polyline points="${coordinates}" />
                ${points.map((val, index) => {
                    const x = index * xStep;
                    const y = height - ((val / 100) * height);
                    return `<circle cx="${x}" cy="${y}" r="4" fill="#0f172a" stroke="var(--accent)" stroke-width="2" />`
                }).join('')}
            </svg>
        `;
    },

    generateLogs() {
        const actions = ['Login', 'Purchase', 'Update', 'Error', 'Logout'];
        const users = ['Admin', 'User_88', 'Guest', 'System'];
        const list = document.getElementById('activityLog');
        
        list.innerHTML = '';
        for(let i=0; i<6; i++) {
            const action = actions[Math.floor(Math.random() * actions.length)];
            const user = users[Math.floor(Math.random() * users.length)];
            const time = new Date().toLocaleTimeString();
            
            list.innerHTML += `<li><span>${time}</span>: ${user} performed ${action}</li>`;
        }
    },

    simulateLiveUpdate() {
        // Randomize data
        this.data.revenue += Math.floor(Math.random() * 100);
        this.data.serverLoad = Math.floor(Math.random() * 60) + 20;
        
        // Shift chart data
        const newPoint = Math.floor(Math.random() * 80) + 10;
        this.data.trafficPoints.push(newPoint);
        this.data.trafficPoints.shift();

        this.renderKPIs();
        this.renderChart();
        
        // 30% chance to update logs
        if(Math.random() > 0.7) this.generateLogs();
    },
    
    refreshData() {
        this.data.trafficPoints = Array.from({length: 12}, () => Math.floor(Math.random() * 100));
        this.renderChart();
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    app.init();
    // Handle resize redrawing
    window.addEventListener('resize', () => app.renderChart());
});
