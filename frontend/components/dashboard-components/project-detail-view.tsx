'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, MapPin, DollarSign, Calendar, Maximize2, MessageSquare, Check, X } from 'lucide-react';
import { getImageArray } from '@/utils/imageHelper';
import { OfferActions } from '@/components/offers/offer-actions';
import type { Project, Offer } from '@/types';

interface ProjectDetailViewProps {
    project: Project;
    offers: any[]; // ExtendedOffer
    onBack: () => void;
    userRole: string;
}

export function ProjectDetailView({ project, offers, onBack, userRole }: ProjectDetailViewProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = getImageArray(project.images);

    return (
        <div className="space-y-6">
            <Button
                variant="ghost"
                onClick={onBack}
                className="text-gray-400 hover:text-white mb-2 p-0 h-auto font-medium transition-colors"
            >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to projects
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Media & Info */}
                <div className="space-y-6">
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-800 bg-gray-900 shadow-2xl group">
                        {images.length > 0 ? (
                            <img
                                src={images[currentImageIndex]}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                                No images available
                            </div>
                        )}

                        {images.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md">
                                {images.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentImageIndex(i)}
                                        className={`w-2 h-2 rounded-full transition-all ${i === currentImageIndex ? 'bg-primary w-4' : 'bg-gray-500 hover:bg-gray-400'
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-white tracking-tight">{project.title}</h1>
                                <div className="flex items-center gap-3 mt-2 text-gray-400 text-sm">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{project.streetAddress || project.city || 'Address not specified'}</span>
                                    </div>
                                    <span>•</span>
                                    <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs px-3 py-1 selection:bg-primary">
                                {project.status.replace('_', ' ')}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <DollarSign className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Budget Range</p>
                                        <p className="text-white font-semibold">
                                            €{project.budgetMin?.toLocaleString()} - €{project.budgetMax?.toLocaleString()}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                        <Maximize2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Project Size</p>
                                        <p className="text-white font-semibold">{project.size ? `${project.size}m²` : 'N/A'}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="prose prose-invert max-w-none">
                            <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {/* @ts-ignore */}
                                {project.description || 'No description provided.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Offers Management */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                            {userRole === 'HOMEOWNER' ? 'Received Offers' : 'My Bids'}
                        </h2>
                        <Badge variant="outline" className="text-gray-400 border-gray-800">
                            {offers.length} Total
                        </Badge>
                    </div>

                    <div className="space-y-4 scrollbar-hide max-h-[700px] overflow-y-auto pr-2">
                        {offers.length === 0 ? (
                            <div className="py-12 text-center rounded-xl border-2 border-dashed border-gray-800">
                                <MessageSquare className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                                <p className="text-gray-400 font-medium">No offers received for this project yet.</p>
                                <p className="text-xs text-gray-600 mt-1">Offers from contractors will appear here.</p>
                            </div>
                        ) : (
                            offers.map((offer) => (
                                <Card key={offer.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all shadow-md overflow-hidden">
                                    <CardHeader className="p-5 pb-3">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                    {offer.company?.companyName?.[0] || offer.user?.name?.[0] || '?'}
                                                </div>
                                                <div>
                                                    <CardTitle className="text-base text-white">
                                                        {offer.company?.companyName || offer.user?.name || 'Anonymous Contractor'}
                                                    </CardTitle>
                                                    <CardDescription className="text-xs text-gray-500 mt-0.5">
                                                        {new Date(offer.createdAt).toLocaleDateString()}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <Badge className={
                                                offer.status === 'ACCEPTED' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                                    offer.status === 'REJECTED' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                                        'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                            }>
                                                {offer.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-5 pt-0 space-y-4">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-bold text-white">€{(offer.amount / 100).toLocaleString()}</span>
                                        </div>

                                        {offer.message && (
                                            <p className="text-sm text-gray-400 italic bg-black/30 p-3 rounded-lg border border-gray-800/50">
                                                "{offer.message}"
                                            </p>
                                        )}

                                        {userRole === 'HOMEOWNER' && offer.status === 'PENDING' && (
                                            <div className="flex gap-2 pt-2">
                                                <OfferActions
                                                    offerId={offer.id}
                                                    currentStatus={offer.status}
                                                    isHomeowner={true}
                                                    onStatusChange={() => window.location.reload()}
                                                />
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
