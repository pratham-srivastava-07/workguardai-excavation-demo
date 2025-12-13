'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Construction } from 'lucide-react';

export function WalletTab() {
  return (
    <div className="p-6 text-center bg-black text-white">
      <Card className="bg-gray-900 border-gray-800 max-w-md mx-auto">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
              <Wallet className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <CardTitle className="text-white text-xl">Coming Soon</CardTitle>
          <CardDescription className="text-gray-400 mt-2">
            Wallet and payments are under development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <Construction className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">Feature in Progress</p>
                <p className="text-sm text-gray-400 mt-1">
                  We're building a secure payment system with escrow functionality. You'll be able to manage transactions, view payment history, and handle escrow for accepted offers.
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-800">
              <p className="text-sm text-gray-400">
                Payment processing and escrow services will be available soon. All transactions will be secure and protected.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

