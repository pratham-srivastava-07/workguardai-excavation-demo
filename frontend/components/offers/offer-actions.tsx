'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast"; // updated import
import { api } from '@/utils/api';
import axios from "axios"
import { API_BASE_URL } from '@/constants/env';

interface OfferActionsProps {
  offerId: string;
  currentStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  onStatusChange?: (newStatus: 'ACCEPTED' | 'REJECTED') => void;
  isHomeowner?: boolean;
}

export function OfferActions({ 
  offerId, 
  currentStatus,
  onStatusChange,
  isHomeowner = false 
}: OfferActionsProps) {
  const [isLoading, setIsLoading] = useState<'accept' | 'reject' | null>(null);
  const { toast } = useToast();

  const handleAction = async (action: 'accept' | 'reject') => {
  if (currentStatus !== 'PENDING') return;

  const token = localStorage.getItem("accessToken");
  if (!token) return;

  setIsLoading(action);

  try {
    await axios.post(
      `${API_BASE_URL}/offers/${offerId}/${action}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const newStatus =
      action === 'accept' ? 'ACCEPTED' : 'REJECTED';

    onStatusChange?.(newStatus);

    toast({
      title: `Offer ${action === 'accept' ? 'Accepted' : 'Rejected'}`,
      description: `The offer has been ${action === 'accept' ? 'accepted' : 'rejected'} successfully.`,
    });
  } catch (error: any) {
    console.error(`Error ${action}ing offer:`, error);

    toast({
      title: 'Error',
      description:
        error.response?.data?.message ||
        'Failed to update offer status',
      variant: 'destructive',
    });
  } finally {
    setIsLoading(null);
  }
};

  // If the offer is not pending, show status badge
  if (currentStatus !== 'PENDING') {
    return (
      <div className="flex items-center space-x-2">
        <span className={`px-2 py-1 text-xs rounded-full ${
          currentStatus === 'ACCEPTED' 
            ? 'bg-green-100 text-green-800' 
            : currentStatus === 'REJECTED' 
              ? 'bg-red-100 text-red-800' 
              : 'bg-gray-100 text-gray-800'
        }`}>
          {currentStatus.charAt(0) + currentStatus.slice(1).toLowerCase()}
        </span>
      </div>
    );
  }

  // If user is not a homeowner, don't show any actions
  if (!isHomeowner) {
    return (
      <span className="text-sm text-gray-500">
        Waiting for response...
      </span>
    );
  }

  // Show accept/reject buttons for pending offers
  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        className="h-8 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
        onClick={() => handleAction('accept')}
        disabled={isLoading !== null}
      >
        {isLoading === 'accept' ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Check className="w-4 h-4 mr-1" />
        )}
        Accept
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
        onClick={() => handleAction('reject')}
        disabled={isLoading !== null}
      >
        {isLoading === 'reject' ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <X className="w-4 h-4 mr-1" />
        )}
        Reject
      </Button>
    </div>
  );
}
