'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Package, Calendar, User } from 'lucide-react';
import { API_BASE_URL } from '@/constants/env';

interface Order {
  id: string;
  amount?: number;
  status: string;
  createdAt: string;
  post: {
    id: string;
    title: string;
    type: string;
    subtype: string;
    latitude: number;
    longitude: number;
    address?: string;
    quantity?: number;
    unit?: string;
    price?: number;
    images?: any;
    status: string;
  };
  user: {
    id: string;
    name?: string;
    email: string;
  };
  company?: {
    id: string;
    companyName: string;
    logoUrl?: string;
  };
}

interface OrdersTabProps {
  onOrderClick?: (order: Order) => void;
  onMapCenter?: (lat: number, lng: number) => void;
}

export function OrdersTab({ onOrderClick, onMapCenter }: OrdersTabProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      console.log("REACHED HERE");
      
      try {
        const token = localStorage.getItem('accessToken');
        console.log("GOT TOKEN");
        
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/api/v1/orders`, {
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log("RESPONSE", response);
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const handleOrderClick = (order: Order) => {
    if (onMapCenter) {
      onMapCenter(order.post.latitude, order.post.longitude);
    }
    setExpandedOrder(expandedOrder === order.id ? null : order.id);
    if (onOrderClick) {
      onOrderClick(order);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-gray-400">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-6 text-center">
        <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No orders yet</p>
        <p className="text-sm text-gray-500 mt-2">Orders will appear here when offers are accepted on your posts</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Orders</h2>
        <p className="text-sm text-gray-400">Accepted offers on your material, space, and service posts</p>
      </div>

      <div className="space-y-4">
        {orders.map((order: any) => (
          <Card
            key={order.id}
            className="bg-gray-900 border-gray-800 cursor-pointer hover:bg-gray-850 transition-colors"
            onClick={() => handleOrderClick(order)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg">{order.post.title}</CardTitle>
                  <CardDescription className="text-gray-400 mt-1">
                    {order.post.subtype} • {order.post.type}
                  </CardDescription>
                </div>
                <Badge className="bg-green-900 text-green-200">
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                {order.post.quantity && (
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    <span>{order.post.quantity} {order.post.unit || 'units'}</span>
                  </div>
                )}
                {order.post.address && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate max-w-[200px]">{order.post.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {order.user && (
                <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">
                    Ordered by: {order.user.name || order.user.email}
                  </span>
                </div>
              )}

              {order.amount && (
                <div className="text-sm">
                  <span className="text-gray-400">Offer Amount: </span>
                  <span className="font-semibold text-white">€{(order.amount / 100).toFixed(2)}</span>
                </div>
              )}

              {/* Expanded Details */}
              {expandedOrder === order.id && (
                <div className="pt-4 mt-4 border-t border-gray-800 space-y-3">
                  <div className="text-sm text-gray-400">
                    <strong className="text-white">Post Details:</strong>
                    <div className="mt-2 space-y-1">
                      {order.post.quantity && (
                        <div>Quantity: {order.post.quantity} {order.post.unit || 'units'}</div>
                      )}
                      {order.post.price && (
                        <div>Original Price: €{(order.post.price / 100).toFixed(2)}</div>
                      )}
                      {order.post.condition && (
                        <div>Condition: {order.post.condition}</div>
                      )}
                    </div>
                  </div>
                  {order.post.images && Array.isArray(order.post.images) && order.post.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {order.post.images.slice(0, 4).map((img: string, idx: number) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Order ${idx + 1}`}
                          className="w-full h-24 object-cover rounded border border-gray-700"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

