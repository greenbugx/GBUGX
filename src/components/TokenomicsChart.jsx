import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useRef, useState, useEffect } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TokenomicsChart() {
  const chartRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const data = {
    labels: ['Liquidity (60%)', 'Community (10%)', 'Ecosystem (30%)'],
    datasets: [
      {
        data: [60, 10, 30],
        backgroundColor: [
          'rgba(0, 255, 0, 0.7)',
          'rgba(102, 255, 102, 0.7)',
          'rgba(0, 100, 0, 0.7)'
        ],
        borderColor: [
          'rgba(0, 255, 0, 1)',
          'rgba(102, 255, 102, 1)',
          'rgba(0, 150, 0, 1)'
        ],
        borderWidth: 1,
        hoverBorderWidth: 2,
        hoverBorderColor: '#00FF00',
        hoverBackgroundColor: [
          'rgba(0, 255, 0, 0.9)',
          'rgba(102, 255, 102, 0.9)',
          'rgba(0, 100, 0, 0.9)'
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'left',
        align: 'center',
        labels: {
          color: '#05df72',
          font: {
            family: "'Courier New', monospace",
            size: 16, // Slightly smaller font
            weight: 'bold'
          },
          padding: 12, // Reduced padding
          boxWidth: 16, // Smaller color boxes
          usePointStyle: true,
          pointStyle: 'rectRot',
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 20, 0, 0.9)',
        titleColor: '#00FF00',
        bodyColor: '#66FF66',
        borderColor: '#00FF00',
        borderWidth: 1,
        cornerRadius: 0,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            return ` ${context.label}: ${context.raw}%`;
          }
        }
      },
    },
    elements: {
      arc: {
        borderRadius: 3,
        borderJoinStyle: 'round',
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1500,
      easing: 'easeOutQuart',
    },
    cutout: '60%', // Smaller cutout for more space
    rotation: -90,
    circumference: 360,
    layout: {
      padding: {
        left: 10, // Adjust based on legend position
        right: 10,
        top: 0,
        bottom: 0
      }
    }
  };
  
  const getLegendPosition = () => {
    if (!isClient) return 'bottom'; // Default during SSR
    return window.innerWidth < 768 ? 'bottom' : 'left';
  };

  return (
    <div className="relative w-full max-w-lg">
      <div className="relative z-10" style={{ 
        height: 'clamp(300px, 40vw, 400px)',
        minHeight: '300px'
      }}>
        {isClient && (
          <Pie 
            ref={chartRef}
            data={data} 
            options={{
              ...options,
              plugins: {
                ...options.plugins,
                legend: {
                  ...options.plugins.legend,
                  position: getLegendPosition()
                }
              }
            }}
          />
        )}
      </div>
      
      <style jsx global>{`
        /* Adjust chart canvas size */
        .chartjs-render-monitor {
          width: 100% !important;
          height: 100% !important;
        }
        /* Mobile legend adjustments */
        @media (max-width: 768px) {
          .chartjs-legend {
            margin-bottom: 10px !important;
          }
          .chartjs-legend li {
            margin-right: 8px !important;
            margin-bottom: 8px !important;
          }
        }
      `}</style>
    </div>
  );
}