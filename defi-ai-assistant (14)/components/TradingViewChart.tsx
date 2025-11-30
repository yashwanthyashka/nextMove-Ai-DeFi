
import React, { useEffect, useRef, memo } from 'react';

interface TradingViewChartProps {
    symbol: string;
    theme?: 'dark' | 'light';
    interval?: string;
    allowSymbolChange?: boolean;
}

export const TradingViewChart: React.FC<TradingViewChartProps> = memo(({
    symbol,
    theme = 'dark',
    interval = '60',
    allowSymbolChange = true
}) => {
    // Create a stable, unique ID for this chart instance
    const containerId = useRef(`tradingview_widget_${Math.random().toString(36).substring(2, 11)}`);

    useEffect(() => {
        // Ensure the container exists in the DOM before appending the script
        const container = document.getElementById(containerId.current);
        if (!container || !symbol) return;

        // Clean up previous widget content
        container.innerHTML = '';

        // Create the script element
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
        script.type = 'text/javascript';
        script.async = true;
        
        const widgetConfig: any = {
            "autosize": true,
            "symbol": symbol,
            "interval": interval,
            "timezone": "Etc/UTC",
            "theme": theme,
            "locale": "en",
            "enable_publishing": false,
            "allow_symbol_change": allowSymbolChange,
            "container_id": containerId.current
        };

        if (theme === 'dark') {
            widgetConfig.style = "3"; // Area chart
            widgetConfig.hide_top_toolbar = true;
            widgetConfig.withdateranges = true;
            widgetConfig.backgroundColor = "rgba(0, 0, 0, 1)";
            widgetConfig.gridColor = "rgba(0, 0, 0, 0)";
            widgetConfig.overrides = {
                "paneProperties.background": "#000000",
                "paneProperties.vertGridProperties.color": "rgba(0,0,0,0)",
                "paneProperties.horzGridProperties.color": "rgba(0,0,0,0)",
                
                "mainSeriesProperties.areaStyle.color1": "rgba(244, 255, 184, 0.2)",
                "mainSeriesProperties.areaStyle.color2": "rgba(244, 255, 184, 0)",
                "mainSeriesProperties.areaStyle.linecolor": "#f4ffb8",
                "mainSeriesProperties.areaStyle.linewidth": 2,

                "scalesProperties.textColor": "#6b7280",
                "scalesProperties.lineColor": "rgba(255, 255, 255, 0.1)",

                "paneProperties.crossHairProperties.color": "#f4ffb8",
            };
        } else {
            widgetConfig.style = "1";
            widgetConfig.studies = [
                "MovingAverage@tv-basicstudies",
                "RelativeStrengthIndex@tv-basicstudies"
            ];
        }

        script.innerHTML = JSON.stringify(widgetConfig);
        container.appendChild(script);

        return () => {
            if (container) {
                container.innerHTML = '';
            }
        };
    }, [symbol, theme, interval, allowSymbolChange]);

    return <div id={containerId.current} className="h-full w-full" />;
});
