'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, Sparkles, MapPin, Calendar, CreditCard, CheckCircle2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/constants/env';

const PROJECT_TYPES = [
    'Bathroom', 'Hallway', 'Kitchen', 'Bedroom', 'Yard', 'Garden',
    'Green Area', 'Floor', 'Walls', 'Pavement', 'Demolition', 'Painting'
];

interface CreateProjectFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialData?: any;
}

export function CreateProjectForm({ onSuccess, onCancel, initialData }: CreateProjectFormProps) {
    const { toast } = useToast();

    const [projectType, setProjectType] = useState(initialData?.projectType || '');
    const [streetAddress, setStreetAddress] = useState(initialData?.streetAddress || '');
    const [city, setCity] = useState(initialData?.city || '');
    const [postalCode, setPostalCode] = useState(initialData?.postalCode || '');
    const [country, setCountry] = useState(initialData?.country || '');
    const [contactEmail, setContactEmail] = useState(initialData?.contactEmail || '');
    const [contactPhone, setContactPhone] = useState(initialData?.contactPhone || '');

    const [images, setImages] = useState<string[]>(initialData?.images || []);
    const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || '');

    const [transportNeeded, setTransportNeeded] = useState(initialData?.transportNeeded || false);
    const [materialsNeeded, setMaterialsNeeded] = useState(initialData?.materialsNeeded || false);

    const [startDate, setStartDate] = useState(initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '');
    const [endDate, setEndDate] = useState(initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '');

    const [budgetMin, setBudgetMin] = useState(initialData?.budgetMin || '');
    const [budgetMax, setBudgetMax] = useState(initialData?.budgetMax || '');

    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');

    const [loading, setLoading] = useState(false);
    const [generatingAI, setGeneratingAI] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        if (images.length + files.length > 6) {
            toast({ title: 'Max 6 images allowed', variant: 'destructive' });
            return;
        }

        // In a real app, upload to S3/Cloudinary. Here we use base64 for MVP.
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const generateAIContent = async () => {
        setGeneratingAI(true);
        // Simulate AI generation
        setTimeout(() => {
            setTitle(`${projectType} Renovation in ${city}`);
            setDescription(`I am looking to renovate my ${projectType.toLowerCase()} located in ${city}. The project involves professional ${projectType.toLowerCase()} work with a focus on quality and timely completion. ${materialsNeeded ? 'Materials need to be provided.' : ''}`);
            setGeneratingAI(false);
            toast({ title: 'AI Generated Content Added' });
        }, 1500);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (images.length < 3) {
            toast({ title: 'Please upload at least 3 pictures', variant: 'destructive' });
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/projects`, {
                method: initialData ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    projectType,
                    streetAddress,
                    city,
                    postalCode,
                    country,
                    contactEmail,
                    contactPhone,
                    transportNeeded,
                    materialsNeeded,
                    startDate: startDate ? new Date(startDate).toISOString() : undefined,
                    endDate: endDate ? new Date(endDate).toISOString() : undefined,
                    budgetMin: budgetMin ? Number(budgetMin) : undefined,
                    budgetMax: budgetMax ? Number(budgetMax) : undefined,
                    images,
                    videoUrl,
                    status: 'OPEN'
                })
            });

            if (!response.ok) throw new Error('Failed to save project');

            toast({ title: 'Project created successfully!' });
            onSuccess?.();
        } catch (err: any) {
            toast({ title: 'Error', description: err.message, variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-8 bg-black text-white min-h-screen pb-24">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold border-b border-gray-800 pb-2">New Project Details</h2>

                {/* Project Type */}
                <div className="space-y-3">
                    <Label className="text-sm font-semibold uppercase tracking-wider text-gray-400">Type of Project *</Label>
                    <div className="grid grid-cols-3 gap-2">
                        {PROJECT_TYPES.map(type => (
                            <Button
                                key={type}
                                type="button"
                                variant={projectType === type ? 'default' : 'outline'}
                                onClick={() => setProjectType(type)}
                                className={cn(
                                    "text-xs transition-all h-10",
                                    projectType === type ? "bg-primary" : "border-gray-800 hover:bg-gray-900"
                                )}
                            >
                                {type}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Address */}
                <div className="space-y-4 pt-4">
                    <Label className="text-sm font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Address
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs">City *</Label>
                            <Input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Lisbon" className="bg-gray-900 border-gray-800" required />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">Postal Code</Label>
                            <Input value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="1234-567" className="bg-gray-900 border-gray-800" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs">Street name and number</Label>
                        <Input value={streetAddress} onChange={e => setStreetAddress(e.target.value)} placeholder="Av. da Liberdade 123" className="bg-gray-900 border-gray-800" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs">Country</Label>
                        <Input value={country} onChange={e => setCountry(e.target.value)} placeholder="Portugal" className="bg-gray-900 border-gray-800" />
                    </div>
                </div>

                {/* Contact */}
                <div className="space-y-4 pt-4">
                    <Label className="text-sm font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                        Contact Details
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs">Email</Label>
                            <Input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="bg-gray-900 border-gray-800" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">Phone</Label>
                            <Input value={contactPhone} onChange={e => setContactPhone(e.target.value)} className="bg-gray-900 border-gray-800" />
                        </div>
                    </div>
                </div>

                {/* Uploads */}
                <div className="space-y-4 pt-4">
                    <Label className="text-sm font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                        <Upload className="w-4 h-4" /> Media Upload (3-6 photos required)
                    </Label>
                    <div className="flex gap-4 items-center">
                        <Button type="button" variant="outline" className="border-dashed border-2 h-24 w-24 flex flex-col gap-2" onClick={() => document.getElementById('image-upload')?.click()}>
                            <Plus className="w-6 h-6" />
                            <span className="text-[10px]">Add Photos</span>
                        </Button>
                        <input id="image-upload" type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />

                        <div className="flex-1 flex gap-2 overflow-x-auto pb-2">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative h-20 w-20 flex-shrink-0">
                                    <img src={img} className="h-full w-full object-cover rounded" />
                                    <button onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))} className="absolute -top-1 -right-1 bg-red-600 rounded-full p-0.5">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs">Video Link (e.g. YouTube/Vimeo)</Label>
                        <Input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://..." className="bg-gray-900 border-gray-800" />
                    </div>
                </div>

                {/* Options */}
                <div className="flex gap-6 pt-4">
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="transport" checked={transportNeeded} onChange={e => setTransportNeeded(e.target.checked)} className="w-4 h-4 rounded border-gray-800 bg-gray-900" />
                        <Label htmlFor="transport" className="text-sm">Transport Needed</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="materials" checked={materialsNeeded} onChange={e => setMaterialsNeeded(e.target.checked)} className="w-4 h-4 rounded border-gray-800 bg-gray-900" />
                        <Label htmlFor="materials" className="text-sm">Materials Needed</Label>
                    </div>
                </div>

                {/* Schedule */}
                <div className="space-y-4 pt-4">
                    <Label className="text-sm font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Schedule
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs">Desired Start</Label>
                            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-gray-900 border-gray-800" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">Desired End</Label>
                            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-gray-900 border-gray-800" />
                        </div>
                    </div>
                </div>

                {/* Budget */}
                <div className="space-y-4 pt-4">
                    <Label className="text-sm font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" /> Budget Range (€)
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                        <Input type="number" value={budgetMin} onChange={e => setBudgetMin(e.target.value)} placeholder="Min Budget" className="bg-gray-900 border-gray-800" />
                        <Input type="number" value={budgetMax} onChange={e => setBudgetMax(e.target.value)} placeholder="Max Budget" className="bg-gray-900 border-gray-800" />
                    </div>
                </div>

                {/* Title & Description with AI */}
                <div className="space-y-4 pt-6 border-t border-gray-800">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold uppercase tracking-wider text-gray-400">Project Branding</Label>
                        <Button type="button" size="sm" variant="secondary" onClick={generateAIContent} disabled={generatingAI}>
                            <Sparkles className="w-3 h-3 mr-2" /> {generatingAI ? 'Writing...' : 'AI Generate'}
                        </Button>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs">Project Title *</Label>
                        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Something catchy..." className="bg-gray-900 border-gray-800" required />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs">Project Description</Label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full min-h-[120px] bg-gray-900 border border-gray-800 rounded-md p-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                            placeholder="Tell builders what you need..."
                        />
                    </div>
                </div>

                <div className="pt-6 flex gap-4">
                    <Button type="submit" className="flex-1 h-12 text-lg font-bold" disabled={loading}>
                        {loading ? 'Creating...' : 'Post Project'}
                        {!loading && <CheckCircle2 className="ml-2 w-5 h-5" />}
                    </Button>
                    <Button type="button" variant="ghost" onClick={onCancel} className="h-12 border border-gray-800">
                        Cancel
                    </Button>
                </div>
            </div>
        </form>
    );
}
