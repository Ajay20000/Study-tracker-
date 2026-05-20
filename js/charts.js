/**
 * Warriors Arena - Advanced Charting & Data Visuals Engine
 * Clean Production Build - High Contrast Color Separation
 */

window.triggerDashboardChartsRefresh = function() {
    console.log("Refreshing metrics grid data...");
    fetchAndRenderChartData();
};

async function fetchAndRenderChartData() {
    const client = window.currentSupabaseClient;
    if (!client) return;

    try {
        const { data: records, error } = await client
            .from("study_logs")
            .select("username, qa_score, lr_score, en_score, ga_score, tier_type");

        if (error) throw error;
        renderMultiUserRadarChart(records);
    } catch (err) {
        console.error("Failed to load charting stream data: ", err);
    }
}

function renderMultiUserRadarChart(records) {
    const ctx = document.getElementById("radar-canvas-element");
    if (!ctx) return;

    // Zero-out and restructure datasets aggregation maps
    const datasetAggregationMap = {};

    records.forEach(row => {
        if (!datasetAggregationMap[row.username]) {
            datasetAggregationMap[row.username] = { qa: 0, lr: 0, en: 0, ga: 0, count: 0 };
        }
        
        // Map elements directly utilizing absolute 0-100% metrics boundaries
        datasetAggregationMap[row.username].qa += row.qa_score || 0;
        datasetAggregationMap[row.username].lr += row.lr_score || 0;
        datasetAggregationMap[row.username].en += row.en_score || 0;
        datasetAggregationMap[row.username].ga += row.ga_score || 0;
        datasetAggregationMap[row.username].count++;
    });

    const datasetsAssemblyArray = [];
    let loopIdx = 0;

    Object.keys(datasetAggregationMap).forEach(user => {
        const agg = datasetAggregationMap[user];
        const entriesCount = agg.count || 1;
        
        // Uncompressed direct absolute average computation percentages
        const trueAverages = [
            agg.qa / entriesCount,
            agg.lr / entriesCount,
            agg.en / entriesCount,
            agg.ga / entriesCount
        ];

        const isMe = (user === window.currentIdentityUser);
        
        // Strict high contrast design system separation metrics
        const borderColorHex = isMe ? "#4f46e5" : "#00f0ff"; // Solid Indigo vs Sharp Neon Cyan
        const bgFillColorHex = isMe ? "rgba(79, 70, 229, 0.2)" : "rgba(0, 0, 0, 0)"; // Disabling buddy overlay fills to block blending artifacts

        datasetsAssemblyArray.push({
            label: isMe ? `You (${user})` : `Warrior: ${user}`,
            data: trueAverages, // Normalized directly to absolute percentage validation targets
            backgroundColor: bgFillColorHex,
            borderColor: borderColorHex,
            borderWidth: isMe ? 3 : 2,
            pointBackgroundColor: borderColorHex,
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: borderColorHex,
            fill: isMe // Only fill user area to entirely prevent dull blending overlaps
        });

        loopIdx++;
    });

    if (window.radarChartInstance) {
        window.radarChartInstance.destroy();
    }

    window.radarChartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Quant Analytics', 'Logical Reasoning', 'English Master', 'General Awareness'],
            datasets: datasetsAssemblyArray
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    pointLabels: { color: '#9ca3af', font: { size: 12 } },
                    ticks: { color: '#6b7280', backdropColor: 'transparent' },
                    suggestedMin: 0,
                    suggestedMax: 100 // Proper metric alignment scaling out of absolute 100% bounds
                }
            },
            plugins: {
                legend: { labels: { color: '#e5e7eb' } }
            }
        }
    });
}
