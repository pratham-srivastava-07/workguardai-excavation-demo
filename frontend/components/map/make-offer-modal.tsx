'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface MakeOfferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  postTitle?: string;
  currentPrice?: number;
  onSuccess?: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function MakeOfferModal({
  open,
  onOpenChange,
  postId,
  postTitle,
  currentPrice,
  onSuccess,
}: MakeOfferModalProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ amount?: string; message?: string }>({});

  const validate = () => {
    const newErrors: { amount?: string; message?: string } = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid offer amount';
    }

    if (message && message.length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to make an offer',
          variant: 'destructive',
        });
        onOpenChange(false);
        window.location.href = '/login?redirect=/map';
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/posts/${postId}/offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          postId,
          amount: Math.round(parseFloat(amount) * 100), // Convert to cents
          message: message.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit offer');
      }

      toast({
        title: 'Offer Submitted',
        description: 'Your offer has been submitted successfully!',
      });

      // Reset form
      setAmount('');
      setMessage('');
      setErrors({});
      onOpenChange(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit offer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setAmount('');
      setMessage('');
      setErrors({});
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold">
            Make an Offer
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            {postTitle && (
              <span className="block mb-2">
                Post: <span className="text-white font-medium">{postTitle}</span>
              </span>
            )}
            {currentPrice && (
              <span className="block text-sm">
                Current price: €{(currentPrice / 100).toFixed(2)}
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="amount" className="text-white mb-2">
              Offer Amount (€) *
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) {
                  setErrors({ ...errors, amount: undefined });
                }
              }}
              placeholder="0.00"
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              disabled={loading}
              required
            />
            {errors.amount && (
              <p className="text-red-400 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          <div>
            <Label htmlFor="message" className="text-white mb-2">
              Message (Optional)
            </Label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (errors.message) {
                  setErrors({ ...errors, message: undefined });
                }
              }}
              placeholder="Add a message to your offer..."
              rows={4}
              maxLength={1000}
              className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            />
            <div className="flex justify-between mt-1">
              {errors.message && (
                <p className="text-red-400 text-sm">{errors.message}</p>
              )}
              <p className="text-gray-500 text-sm ml-auto">
                {message.length}/1000
              </p>
            </div>
          </div>

          <AlertDialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Offer'
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

