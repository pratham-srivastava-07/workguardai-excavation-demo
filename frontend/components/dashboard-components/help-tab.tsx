'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Map, Package, Briefcase, ShoppingCart, MessageSquare, Wallet, Settings, HelpCircle } from 'lucide-react';

interface HelpSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: {
    title: string;
    description: string;
  }[];
}

const helpSections: HelpSection[] = [
  {
    id: 'menu-items',
    title: 'Left Panel Menu Items',
    icon: Map,
    content: [
      {
        title: 'Map',
        description: 'The default view showing all posts and projects on an interactive map. Clicking Map collapses the left panel to show only the map.',
      },
      {
        title: 'Create Post',
        description: 'Post materials, services, or spaces you want to offer or need. Each post requires location information for map display.',
      },
      {
        title: 'My Posts',
        description: 'View and manage all posts you have created. Edit, update status, or delete your posts from here.',
      },
      {
        title: 'Projects / Offers',
        description: 'View all projects you\'re involved in (as homeowner) or offers you\'ve made/received (as company/city). Click any item to center the map on its location.',
      },
      {
        title: 'Orders',
        description: 'For Companies and Cities: View accepted offers on your material, space, or service posts. These represent active orders requiring fulfillment.',
      },
      {
        title: 'Messages',
        description: 'Coming soon: Direct messaging with other users about posts, offers, and projects.',
      },
      {
        title: 'Wallet / Payments',
        description: 'Coming soon: Manage payments, escrow, and financial transactions.',
      },
      {
        title: 'Settings',
        description: 'Manage your account settings, profile information, and preferences.',
      },
      {
        title: 'Help',
        description: 'Access documentation and support resources (you are here).',
      },
    ],
  },
  {
    id: 'posting',
    title: 'How Posting Works',
    icon: Package,
    content: [
      {
        title: 'Creating a Post',
        description: 'Click "Create Post" and fill in details: type (Material/Service/Space), title, description, location (required for map), quantity, pricing, and availability options.',
      },
      {
        title: 'Post Types',
        description: 'MATERIAL: Physical items (tiles, wood, etc.). SERVICE: Professional services (demolition, transport). SPACE: Available spaces (storage, coworking).',
      },
      {
        title: 'Post Status',
        description: 'Posts can be AVAILABLE, RESERVED (offer accepted), SOLD, or DELETED. Update status as your post changes.',
      },
    ],
  },
  {
    id: 'offers',
    title: 'How Offers Work',
    icon: Briefcase,
    content: [
      {
        title: 'Making an Offer',
        description: 'Browse posts on the map, click a post to view details, and click "Make an Offer" if you\'re interested. You cannot make offers on your own posts.',
      },
      {
        title: 'Offer Lifecycle',
        description: 'Offers start as PENDING. Post owners can ACCEPT, REJECT, or you can WITHDRAW. Accepted offers create orders and reserve the post.',
      },
      {
        title: 'Viewing Offers',
        description: 'Check "Projects / Offers" tab to see offers you\'ve made and received. Companies/Cities see structured offers with pricing and timelines.',
      },
    ],
  },
  {
    id: 'projects',
    title: 'How Projects Work',
    icon: Briefcase,
    content: [
      {
        title: 'Homeowner Projects',
        description: 'Homeowners create renovation projects with budgets and requirements. Contractors can submit quotes for these projects.',
      },
      {
        title: 'Project Status',
        description: 'Projects can be OPEN (accepting quotes), IN_PROGRESS (work started), COMPLETED, or CANCELLED.',
      },
      {
        title: 'Viewing Projects',
        description: 'Homeowners see their projects in the "Projects / Offers" tab. Click any project to center the map on its location.',
      },
    ],
  },
  {
    id: 'roles',
    title: 'Role-Specific Limitations',
    icon: Settings,
    content: [
      {
        title: 'Homeowner',
        description: 'Can create posts and projects. Receive offers on posts. Cannot make offers on posts. View text-based offers only.',
      },
      {
        title: 'Company',
        description: 'Can create service/material posts. Make offers on posts. Receive offers on company posts. View structured offers with pricing. See orders for accepted offers.',
      },
      {
        title: 'City',
        description: 'Can create material/space posts. Receive offers on city posts. View structured offers. See orders for accepted offers. Focus on reuse/diversion metrics.',
      },
    ],
  },
  {
    id: 'payments',
    title: 'Escrow & Payments (Conceptual)',
    icon: Wallet,
    content: [
      {
        title: 'Payment Flow',
        description: 'When an offer is accepted, payment can be held in escrow until order fulfillment. Funds are released upon completion confirmation.',
      },
      {
        title: 'Security',
        description: 'All transactions are secured. Payment details and escrow management will be available in the Wallet section (coming soon).',
      },
    ],
  },
];

export function HelpTab() {
  return (
    <div className="p-6 space-y-6 bg-black text-white">
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <HelpCircle className="w-6 h-6" />
          Help & Documentation
        </h2>
        <p className="text-gray-400">Learn how to use Renowise platform features</p>
      </div>

      <div className="space-y-4">
        {helpSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.id} className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {section.content.map((item, index) => (
                    <AccordionItem key={index} value={`${section.id}-${index}`} className="border-gray-800">
                      <AccordionTrigger className="text-white hover:text-gray-300 cursor-pointer">
                        {item.title}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-400">
                        {item.description}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

