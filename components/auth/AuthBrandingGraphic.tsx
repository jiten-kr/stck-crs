"use client";

import { TrendingUp, BarChart3, LineChart } from "lucide-react";

/**
 * AuthBrandingGraphic - A decorative graphic for auth pages
 * Uses CSS/HTML instead of images for faster loading
 */
export default function AuthBrandingGraphic() {
    return (
        <div className="relative w-32 h-32 md:w-40 md:h-40">
            {/* Outer ring with gradient */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-white/10 border-2 border-white/20"></div>

            {/* Middle ring */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-400/30 to-blue-600/30 border border-white/30"></div>

            {/* Inner circle with candlestick chart */}
            <div className="absolute inset-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
                {/* Candlestick chart graphic */}
                <div className="flex items-end gap-1.5 h-12 md:h-14">
                    {/* Candlestick 1 - Red/bearish */}
                    <div className="flex flex-col items-center">
                        <div className="w-0.5 h-2 bg-red-300"></div>
                        <div className="w-2 h-4 bg-red-400 rounded-sm"></div>
                        <div className="w-0.5 h-1.5 bg-red-300"></div>
                    </div>
                    {/* Candlestick 2 - Green/bullish */}
                    <div className="flex flex-col items-center">
                        <div className="w-0.5 h-1.5 bg-green-300"></div>
                        <div className="w-2 h-6 bg-green-400 rounded-sm"></div>
                        <div className="w-0.5 h-2 bg-green-300"></div>
                    </div>
                    {/* Candlestick 3 - Green/bullish tall */}
                    <div className="flex flex-col items-center">
                        <div className="w-0.5 h-1 bg-green-300"></div>
                        <div className="w-2 h-8 bg-green-400 rounded-sm"></div>
                        <div className="w-0.5 h-1 bg-green-300"></div>
                    </div>
                    {/* Candlestick 4 - Red/bearish */}
                    <div className="flex flex-col items-center">
                        <div className="w-0.5 h-2 bg-red-300"></div>
                        <div className="w-2 h-3 bg-red-400 rounded-sm"></div>
                        <div className="w-0.5 h-1.5 bg-red-300"></div>
                    </div>
                </div>
            </div>

            {/* Floating icons around the circle */}
            <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
                <TrendingUp className="w-5 h-5 text-white" />
            </div>

            <div className="absolute -bottom-2 -left-2 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
                <BarChart3 className="w-4 h-4 text-white" />
            </div>

            <div className="absolute top-1/2 -right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
                <LineChart className="w-4 h-4 text-white" />
            </div>
        </div>
    );
}
