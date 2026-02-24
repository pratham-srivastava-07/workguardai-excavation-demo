'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Building2,
    Package,
    Leaf,
    Map as MapIcon,
    Search,
    ArrowRight,
    Globe,
    Users,
    BarChart3,
    Lightbulb
} from 'lucide-react';

interface ExplorationDetailProps {
    onSearchCategory: (category: string) => void;
    onExploreMore: () => void;
}

export function ExplorationDetail({ onSearchCategory, onExploreMore }: ExplorationDetailProps) {
    const categories = [
        { name: 'Tiles & Flooring', icon: Package, color: 'text-blue-400', search: 'tiles' },
        { name: 'Wood & Timber', icon: Tree, color: 'text-orange-400', search: 'wood' },
        { name: 'Metal & Steel', icon: Box, color: 'text-gray-400', search: 'metal' },
        { name: 'Windows & Doors', icon: Layout, color: 'text-green-400', search: 'window' },
    ];

    return (
        <div className="space-y-8 p-6 bg-black text-white selection:bg-primary/30">
            {/* Hero Header */}
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase">
                    <Globe className="w-3.5 h-3.5" />
                    Circular Economy For Renovation
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
                    Welcome to <span className="text-primary italic">RenoWise</span>
                </h1>
                <p className="text-gray-400 text-lg leading-relaxed">
                    Reducing construction waste by connecting reusable materials with local renovation projects.
                </p>
            </div>

            {/* Mission Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
                    <div className="text-2xl font-bold text-white">450kg</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">CO2 Saved locally</div>
                </div>
                <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
                    <div className="text-2xl font-bold text-white">12</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Active Diverters</div>
                </div>
            </div>

            {/* Guide Section */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" /> How to Explore
                </h3>
                <div className="space-y-4">
                    <div className="flex gap-4 group">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm border border-primary/30 group-hover:bg-primary group-hover:text-black transition-colors">1</div>
                        <div>
                            <h4 className="font-semibold text-white">Browse the Map</h4>
                            <p className="text-sm text-gray-400">Markers represent materials, tools, or projects available near you.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 group">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm border border-primary/30 group-hover:bg-primary group-hover:text-black transition-colors">2</div>
                        <div>
                            <h4 className="font-semibold text-white">Filter & Search</h4>
                            <p className="text-sm text-gray-400">Use the top bar to find specific items like "Timber" or "Stone".</p>
                        </div>
                    </div>
                    <div className="flex gap-4 group">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm border border-primary/30 group-hover:bg-primary group-hover:text-black transition-colors">3</div>
                        <div>
                            <h4 className="font-semibold text-white">Join the Network</h4>
                            <p className="text-sm text-gray-400">Sign up to make offers, post items, or start your own renovation project.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Search Categories */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Popular Materials</h3>
                <div className="grid grid-cols-2 gap-3">
                    {categories.map((cat, i) => (
                        <button
                            key={i}
                            onClick={() => onSearchCategory(cat.search)}
                            className="flex items-center gap-3 p-3 rounded-xl bg-gray-900 border border-gray-800 hover:border-primary/50 hover:bg-gray-850 transition-all text-left group"
                        >
                            <cat.icon className={`w-5 h-5 ${cat.color}`} />
                            <span className="text-sm font-medium text-gray-300 group-hover:text-white">{cat.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Call to Action */}
            <div className="pt-4">
                <Button
                    onClick={onExploreMore}
                    className="w-full bg-primary hover:bg-primary/90 text-black font-bold h-12 shadow-lg shadow-primary/20 group"
                >
                    Explore More Features
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </div>
    );
}

// Minimal icons for internal map 
function Tree({ className }: { className?: string }) { return <Package className={className} />; }
function Box({ className }: { className?: string }) { return <Package className={className} />; }
function Layout({ className }: { className?: string }) { return <Package className={className} />; }
