# Renowise Platform - Complete User Roadmap & Guide

## Table of Contents
1. [Platform Overview](#platform-overview)
2. [Getting Started](#getting-started)
3. [Role-Based Features](#role-based-features)
   - [Homeowner](#homeowner)
   - [Company](#company)
   - [City](#city)
4. [Navigation Guide](#navigation-guide)
5. [Core Features](#core-features)
6. [Map-Centric Interface](#map-centric-interface)
7. [Posting & Offers System](#posting--offers-system)
8. [Projects & Orders](#projects--orders)
9. [Dashboard Overview](#dashboard-overview)
10. [Best Practices](#best-practices)

---

## Platform Overview

**Renowise** is a role-based, map-centric marketplace platform that connects three key actors in the circular economy:

- **Homeowners**: Post materials, request services, and manage renovation projects
- **Companies**: Offer services, purchase materials, and manage business operations
- **Cities**: Manage municipal resources, spaces, and promote circular economy initiatives

### Key Principles
- **Map as Single Source of Truth**: All spatial data is visualized on an interactive map
- **Role-Based Access**: Each role has distinct capabilities and views
- **Real-Time Data**: All information is dynamically fetched from APIs (no hardcoded data)
- **Persistent Map State**: Map remains mounted and stateful across navigation

---

## Getting Started

### Registration & Login
1. Visit the Renowise homepage
2. Click **"Sign Up"** to create an account
3. Select your role: **Homeowner**, **Company**, or **City**
4. Complete your profile with required information
5. Verify your email (if required)
6. Log in with your credentials

### First Steps After Login
1. **Complete Your Profile**: Add details specific to your role
2. **Explore the Map**: Familiarize yourself with the map-centric interface
3. **View Your Dashboard**: Check your role-specific dashboard for overview
4. **Create Your First Post**: Start by posting materials, services, or spaces

---

## Role-Based Features

## Homeowner

### What Homeowners Can Do

#### 1. **Create Posts**
- **Material Posts**: List materials you want to sell or give away
  - Examples: Roof tiles, wooden planks, windows, doors, etc.
  - Set quantity, unit, price, condition, and location
  - Upload 2-6 images
  - Specify pickup/transport options
  
- **Service Requests**: Request services for your home
  - Examples: Demolition, renovation, installation
  - Set hourly/daily rates
  - Specify timeline and requirements
  
- **Space Posts**: Offer or request spaces
  - Examples: Storage space, coworking space, parking
  - Set rental duration and rates

#### 2. **Manage Projects**
- Create renovation projects with:
  - Project type (bathroom, kitchen, full renovation, etc.)
  - Size (m²)
  - Budget range
  - Material preferences
- View project status (OPEN, IN_PROGRESS, COMPLETED)
- Track milestones and payments
- Receive quotes from contractors

#### 3. **Receive & Manage Offers**
- View offers received on your posts
- Accept or reject offers
- See offer details (amount, message, offerer info)
- Text-based offers only (no structured pricing)

#### 4. **View Dashboard**
- **Total Posts Created**: Count of all your posts
- **Active Projects**: Currently ongoing projects
- **Pending Offers**: Offers waiting for your response
- **Completed Projects**: Finished renovation projects
- Recent activity feed

### What Homeowners Can See

#### Map View
- All available materials, services, and spaces in their area
- Posts from companies and cities
- Distance from their location
- Filter by type, price range, condition

#### Left Panel Options
- **Map**: Collapse panel to view full map
- **My Posts**: View and manage all your posts
- **Projects & Offers**: 
  - View your projects
  - See offers you've received
  - Track project progress
- **Messages**: Coming soon
- **Wallet / Payments**: Coming soon
- **Help**: Access documentation and support

#### Restrictions
- **Cannot** make offers on posts (only receive them)
- **Cannot** access Company or City dashboards
- **Cannot** see structured offer details (only text-based)

---

## Company

### What Companies Can Do

#### 1. **Create Service Posts**
- Post services you offer:
  - Demolition services
  - Installation services
  - Transport services
  - Material collection services
- Set hourly/daily rates
- Specify service area and availability

#### 2. **Create Material Posts**
- Post materials you're selling:
  - New or used materials
  - Bulk materials (sand, gravel, etc.)
  - Set pricing and quantity
  - Specify pickup/collection options

#### 3. **Make Offers**
- Make structured offers on homeowner posts:
  - Set offer amount (in cents)
  - Add message/notes
  - View post details before offering
- Make offers on available posts from Projects/Offers tab
- Modify pending offers (amount, message)
- Track offer status (PENDING, ACCEPTED, REJECTED)

#### 4. **Manage Orders**
- View accepted offers (these become orders)
- See order details:
  - Post information
  - Quantity and pricing
  - Location and images
  - Customer information
- Track order fulfillment

#### 5. **View Dashboard**
- **Services/Materials Posted**: Count of your posts
- **Active Jobs**: Ongoing work assignments
- **Pending Offers**: Offers waiting for response
- **Orders in Progress**: Active orders to fulfill
- **Workload Indicators**: Count-based metrics
- Recent offers and activity

### What Companies Can See

#### Map View
- All posts from homeowners, companies, and cities
- Filter by type, location, price
- Click pins to view post details
- Make offers directly from map

#### Left Panel Options
- **Map**: Full map view
- **My Posts**: Your service and material posts
- **Projects & Offers**:
  - **Available Posts**: Homeowner posts you can make offers on
  - **Offers Made**: Your submitted offers
  - **Offers Received**: Offers on your posts
- **Orders**: Accepted offers (orders) to fulfill
- **Messages**: Coming soon
- **Wallet / Payments**: Coming soon
- **Help**: Documentation

#### Key Features
- **Self-Offer Restriction**: Cannot make offers on your own posts
- **Structured Offers**: Full pricing, timelines, and status tracking
- **Order Management**: Complete order lifecycle tracking

---

## City

### What Cities Can Do

#### 1. **Create Municipal Posts**
- **Material Posts**: City-owned materials available for reuse
  - Examples: Street furniture, construction materials, public assets
  - Set availability dates
  - Specify permit requirements
  
- **Space Posts**: Municipal spaces available for use
  - Examples: Public spaces, storage facilities, event spaces
  - Set rental duration and terms
  - Specify usage requirements

#### 2. **Manage Pickups & Allocations**
- Track material pickups
- Manage space allocations
- Monitor reuse/diversion metrics

#### 3. **Receive Offers**
- Receive offers on city posts
- Accept/reject offers from companies and homeowners
- Track engagement and reuse statistics

#### 4. **View Dashboard**
- **City Posts**: Total materials and spaces posted
- **Reuse/Diversion Metrics**: 
  - Materials recycled count
  - Active pickups
  - Engagement overview
- **Active Allocations**: Current space/material allocations
- **Hazardous Materials**: Count of hazardous material posts

### What Cities Can See

#### Map View
- All posts in the city area
- Municipal resources
- Public spaces and facilities
- Engagement hotspots

#### Left Panel Options
- **Map**: Full map view
- **My Posts**: City posts (materials, spaces)
- **Projects & Offers**:
  - **Offers Received**: Offers on city posts
- **Orders**: Accepted offers and allocations
- **Messages**: Coming soon
- **Wallet / Payments**: Coming soon
- **Help**: Documentation

#### Key Features
- **Municipal Focus**: Manage public resources and spaces
- **Reuse Tracking**: Monitor circular economy metrics
- **Public Engagement**: Track community participation

---

## Navigation Guide

### Main Navigation Elements

#### 1. **Top Bar**
- **Logo**: Click to return to homepage
- **Search Bar**: Search for materials, services, projects, or locations
- **User Menu**: Access profile, settings, logout

#### 2. **Left Panel Menu** (Dashboard Menu)
Located on the left side of the map interface:

- **Map Icon**: Collapse panel to view full map
- **Create Post**: Open post creation form
- **My Posts**: View all your posts
- **Projects & Offers**: Access projects/offers tab
- **Orders**: View orders (Company/City only)
- **Messages**: Access messaging (Coming Soon)
- **Wallet / Payments**: Payment features (Coming Soon)
- **Settings**: Account settings
- **Help**: Documentation and support

#### 3. **Map Interface**
- **Interactive Map**: Pan, zoom, click pins
- **Map Controls**: Zoom in/out, fullscreen
- **Pin Colors**: Different colors for different post types
- **Click Behavior**:
  - Click pin → Opens post detail card
  - Click map (empty area) → Collapses left panel
  - Click post in list → Centers map on post location

#### 4. **Left Panel Content**
The left panel displays different content based on menu selection:
- Post lists
- Post details
- Project/offer information
- Order details
- Help documentation

### Navigation Flow Examples

#### Creating a Post (Homeowner)
1. Click **"Create Post"** in left menu
2. Select post type (Material/Service/Space)
3. Fill in required information
4. Upload images (2-6 required)
5. Set location (use current location or enter manually)
6. Submit post
7. Post appears on map and in "My Posts"

#### Making an Offer (Company)
1. Browse map or "Available Posts" tab
2. Click on a post pin or post card
3. View post details in left panel
4. Click **"Make an Offer"** button
5. Enter offer amount and message
6. Submit offer
7. Offer appears in "Offers Made" tab

#### Managing Orders (Company/City)
1. Click **"Orders"** in left menu
2. View list of accepted offers (orders)
3. Click on an order to expand details
4. View post information, images, customer details
5. Map automatically centers on order location

---

## Core Features

### 1. **Post Creation System**

#### Post Types
- **MATERIAL**: Physical items (tiles, wood, windows, etc.)
- **SERVICE**: Services offered or requested
- **SPACE**: Spaces for rent or use

#### Post Fields
- **Basic Info**: Title, description, subtype
- **Pricing**: Price (in cents), quantity, unit
- **Location**: Latitude, longitude, address (required)
- **Images**: 2-6 images (base64 encoded)
- **Options**: Pickup allowed, transport needed, hazardous materials, etc.
- **Availability**: Date when item/space becomes available

#### Post Status
- **AVAILABLE**: Open for offers
- **RESERVED**: Offer accepted, pending completion
- **COMPLETED**: Transaction finished
- **CANCELLED**: Post cancelled

### 2. **Offer System**

#### Offer Lifecycle
1. **Create**: Company makes offer on homeowner/city post
2. **Pending**: Waiting for post owner's response
3. **Accepted**: Post owner accepts offer → becomes order
4. **Rejected**: Post owner rejects offer
5. **Modified**: Offer creator can modify pending offers

#### Offer Features
- **Structured Offers** (Company/City): Full pricing, timelines, status
- **Text-Based Offers** (Homeowner): Simple message-based offers
- **Self-Offer Prevention**: Cannot offer on own posts
- **Modification**: Can modify pending offers (amount, message)

### 3. **Map Synchronization**

#### Automatic Map Actions
- Click post/project/offer → Map centers on location
- Pin highlights when item selected
- Smooth panning and zooming
- Persistent map state across navigation

#### Map Features
- **Geolocation**: Calculate distance from user location
- **Filtering**: Filter by type, price, condition, radius
- **Search**: Search by keywords, location
- **Pin Clustering**: Group nearby pins for better performance

### 4. **Dashboard System**

#### Homeowner Dashboard
- Total posts created
- Active projects count
- Pending offers count
- Completed projects count
- Recent projects and posts

#### Company Dashboard
- Services/materials posted
- Active jobs/workload
- Pending offers
- Orders in progress
- Recent offers and activity

#### City Dashboard
- City posts (materials, spaces)
- Reuse/diversion metrics
- Active pickups/allocations
- Engagement overview
- Hazardous materials count

### 5. **Projects System** (Homeowner Only)

#### Project Creation
- Project type selection
- Size (m²) input
- Budget range (min/max)
- Material preferences
- Description

#### Project Management
- View project status
- Track milestones
- Receive quotes from contractors
- Monitor progress

### 6. **Orders System** (Company/City)

#### Order Sources
- Accepted offers automatically become orders
- Assigned pickups
- Service bookings

#### Order Features
- Expandable details
- Post information and images
- Customer/offerer information
- Location mapping
- Status tracking

---

## Map-Centric Interface

### Map Behavior

#### Always Visible
- Map remains mounted and visible at all times
- Left panel overlays the map (doesn't replace it)
- Map state persists across navigation

#### Interaction Rules
1. **Pin Click**: Opens post detail card, expands left panel
2. **Map Click** (empty area): Collapses left panel, shows full map
3. **List Item Click**: Centers map on item location, highlights pin
4. **Panel Toggle**: Can manually expand/collapse left panel

#### Responsive Design
- **Desktop**: Left panel on left, map fills remaining space
- **Tablet**: Similar to desktop, adjusted sizing
- **Mobile**: 
  - Map becomes full-screen by default
  - Left panel behaves as bottom sheet/slide-up drawer
  - No functionality loss on smaller screens

### Map Features

#### Visual Elements
- **Pins**: Different colors/shapes for different post types
- **Clusters**: Grouped pins for better performance
- **Popups**: Quick info on pin hover
- **Controls**: Zoom, fullscreen, geolocation

#### Search & Filter
- **Text Search**: Search by keywords
- **Type Filter**: Filter by Material/Service/Space
- **Price Range**: Min/max price filter
- **Radius**: Search within X km
- **Condition**: Filter by new/used/damaged

---

## Posting & Offers System

### Creating Posts

#### Step-by-Step Process
1. Click **"Create Post"** in left menu
2. Select post type (Material/Service/Space)
3. Choose subtype (e.g., "tiles", "windows", "demolition")
4. Enter title and description
5. Set quantity and unit (if applicable)
6. Set price (in euros, converted to cents)
7. **Set Location** (required):
   - Use "Use My Location" button, OR
   - Enter address, OR
   - Enter coordinates manually
8. Upload 2-6 images
9. Set options (pickup allowed, transport needed, etc.)
10. Submit post

#### Post Requirements
- **Minimum 2 images** required
- **Location is mandatory** (for map display)
- **Title and subtype** required
- **Price optional** (can be free)

### Making Offers

#### For Companies
1. Browse available posts (map or "Available Posts" tab)
2. Click on a post
3. Review post details, images, location
4. Click **"Make an Offer"** button
5. Enter:
   - Offer amount (in euros)
   - Message/notes (optional)
6. Submit offer
7. Offer appears in "Offers Made" tab with status "PENDING"

#### Offer Restrictions
- **Cannot offer on own posts** (button hidden/disabled)
- **Post must be AVAILABLE** status
- **Can modify pending offers** (change amount/message)
- **Only post owner can accept/reject** offers

### Accepting/Rejecting Offers

#### For Post Owners
1. View offers in "Offers Received" tab
2. Click on an offer to see details
3. Review offer amount, message, offerer info
4. Choose action:
   - **Accept**: Offer becomes order, post status → RESERVED
   - **Reject**: Offer status → REJECTED
5. Notification sent to offerer

---

## Projects & Orders

### Projects (Homeowner)

#### Creating Projects
1. Navigate to "Projects & Offers" tab
2. Click "Create Project" (if available)
3. Enter project details:
   - Title and description
   - Project type
   - Size (m²)
   - Budget range
   - Material preferences
4. Submit project
5. Project appears in "Projects" tab

#### Managing Projects
- View project status (OPEN, IN_PROGRESS, COMPLETED)
- Track milestones
- Receive quotes from contractors
- Monitor budget and timeline

### Orders (Company/City)

#### Viewing Orders
1. Click **"Orders"** in left menu
2. View list of accepted offers (orders)
3. Orders show:
   - Post title and type
   - Offer amount
   - Status
   - Customer/offerer info
   - Location

#### Order Details
- Click on order to expand details
- View:
  - Full post information
  - Quantity and pricing
  - Images
  - Condition and specifications
  - Customer contact info
- Map automatically centers on order location

#### Order Fulfillment
- Track order progress
- Update order status
- Complete transactions
- Mark orders as fulfilled

---

## Dashboard Overview

### Accessing Dashboards

#### Role-Specific Routes
- **Homeowner**: `/homeowner-dashboard`
- **Company**: `/company-dashboard`
- **City**: `/city-dashboard`

#### Access Control
- Each role can only access their own dashboard
- Attempting to access another role's dashboard redirects to your dashboard
- Authentication required for all dashboards

### Dashboard Components

#### Metrics Cards
- **Count-based metrics**: All numbers are computed server-side
- **Real-time updates**: Refresh on navigation
- **No hardcoded data**: All metrics from API

#### Recent Activity
- Recent posts
- Recent offers
- Recent projects
- Recent orders

#### Quick Actions
- Create new post
- View pending offers
- Check active projects
- Manage orders

---

## Best Practices

### For Homeowners

1. **Post Quality**
   - Upload clear, well-lit images (2-6 photos)
   - Write detailed descriptions
   - Set accurate location
   - Price items fairly

2. **Project Management**
   - Create detailed project descriptions
   - Set realistic budget ranges
   - Respond to offers promptly
   - Track project milestones

3. **Offer Management**
   - Review all offers carefully
   - Respond in a timely manner
   - Accept offers that meet your needs
   - Communicate clearly with offerers

### For Companies

1. **Service Posts**
   - Clearly describe services offered
   - Set competitive rates
   - Specify service area
   - Include availability

2. **Making Offers**
   - Research posts before offering
   - Make competitive offers
   - Include helpful messages
   - Follow up on pending offers

3. **Order Fulfillment**
   - Respond quickly to accepted offers
   - Communicate with customers
   - Update order status
   - Complete transactions promptly

### For Cities

1. **Municipal Posts**
   - Clearly identify public resources
   - Set appropriate availability dates
   - Specify permit requirements
   - Include usage guidelines

2. **Resource Management**
   - Track reuse metrics
   - Monitor engagement
   - Manage allocations efficiently
   - Promote circular economy

### General Tips

1. **Location Accuracy**
   - Always set accurate locations
   - Use "Use My Location" when possible
   - Verify addresses before posting

2. **Image Quality**
   - Use high-quality images
   - Show multiple angles
   - Include condition details in photos

3. **Communication**
   - Respond to offers promptly
   - Be clear in messages
   - Update post status when needed

4. **Map Usage**
   - Use map to find nearby resources
   - Filter by distance for convenience
   - Check location before making offers

---

## Help & Support

### Accessing Help
1. Click **"Help"** in left menu
2. View structured documentation
3. Browse by topic:
   - Left panel items
   - Posting guide
   - Offers system
   - Orders management
   - Projects (homeowners)
   - Role-specific limitations
   - Escrow/payments (conceptual)

### Help Content
- **Getting Started**: Basic platform overview
- **Role Guides**: Specific features for each role
- **Feature Explanations**: Detailed feature documentation
- **FAQ**: Common questions and answers
- **Contact Support**: How to get help

---

## Technical Notes

### Data Flow
- **No Hardcoded Data**: All UI states, counts, lists driven by APIs
- **Real-Time Updates**: Data refreshes on navigation
- **Server-Side Computation**: Metrics calculated on backend
- **Persistent State**: Map and panel state maintained across navigation

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- JavaScript enabled required
- Geolocation permissions for location features
- Responsive design for all screen sizes

### Performance
- Map pin clustering for large datasets
- Lazy loading of images
- Efficient API calls
- Optimized rendering

---

## Conclusion

Renowise provides a comprehensive platform for circular economy transactions with role-specific features, map-centric navigation, and real-time data. Whether you're a homeowner looking to reuse materials, a company offering services, or a city managing municipal resources, the platform offers tools tailored to your needs.

**Key Takeaways:**
- Map is always the central interface
- Each role has distinct capabilities
- All data is dynamic and real-time
- Navigation is intuitive and role-appropriate
- Help is always available

For additional support or questions, use the Help section in the left panel or contact support through your dashboard.

---

*Last Updated: 2024*
*Version: 1.0*

