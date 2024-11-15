# CRYPTOurists

CRYPTOurists is a decentralized booking platform built on the Camino blockchain network. It enables businesses to list their services and accept cryptocurrency payments, while providing customers with a secure and transparent way to make bookings. All payments are securely held in the smart contract until the booking is either confirmed or refunded by the administrator.

Key Benefits:
- Trustless Transactions: No intermediaries needed - all bookings are handled directly through smart contracts
- Lower Fees: Reduced transaction costs compared to traditional booking platforms
- Instant Settlements: Payments are processed immediately on the blockchain
- Full Transparency: All transactions and booking statuses are publicly verifiable
- Global Accessibility: Accept payments from customers worldwide using cryptocurrency
- Automated Refunds: Smart contract automatically handles payment returns if booking is cancelled
- Dispute Resolution: Administrator oversight ensures fair resolution of any issues

Current Implementation:
- Built on Camino's high-performance, low-cost blockchain
- Uses CAM (Camino's native token) for all transactions
- Supports multiple business accounts and service listings
- Real-time booking status updates
- Integrated wallet connectivity
- Role-based access control for security

## Features

- **Wallet Integration**: Connect your Camino wallet to interact with the platform
- **Smart Contract Integration**: All bookings and payments are handled through secure smart contracts
- **Contract Deployment**: Administrators can deploy new contracts directly from the dashboard
- **Role-Based Access**: Different features for administrators, businesses, and customers
- **Article Management**: Businesses can create and manage their service listings
- **Booking System**: Complete booking lifecycle from creation to completion/refund
- **Transaction Tracking**: View all booking details and transaction history
- **Secure Payment Flow**: 
  - Payments are held in smart contract until booking confirmation/refund
  - Upon confirmation, payment is released to business
  - Upon refund, payment returns to customer (minus operator fee)
  - Operator fee is paid regardless of booking outcome

## Technology Stack

- Frontend: Angular 18.2
- Smart Contracts: Solidity
- Blockchain: Camino Network
- Key Libraries:
  - Web3.js for blockchain interaction
  - Angular Material for UI components
  - Ethers.js for wallet integration

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `ng serve`
4. Navigate to `http://localhost:4200`

## Prerequisites

- Node.js and npm
- Angular CLI v18.2.11
- Camino wallet (e.g., MetaMask configured for Camino network)

## Project Structure

- `src/app/components`: Reusable UI components
- `src/app/services`: Core services for wallet and contract interaction
- `src/app/views`: Main application views/pages
- `src/app/utils`: Helper functions and constants

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Code Documentation

### Components Structure

#### Navbar (`/components/navbar`)
- Main navigation component
- Handles wallet connection/disconnection
- Manages contract deployment for admin users
- Shows different navigation options based on user role (admin/business)

#### Articles (`/views/articles`)
- Displays and manages articles/services
- Allows admins and businesses to create/edit/delete articles
- Filters view based on user role (admins see all, businesses see only their articles)

#### Home (`/views/home`)
- Shows bookings overview
- Different views for admins and businesses
- Admins can see all bookings
- Businesses only see bookings related to their articles

### Services

#### WalletService
- Handles Web3 wallet integration
- Manages wallet connection and authentication
- Stores wallet address in session storage

#### ContractService
- Manages smart contract deployment and interaction
- Handles contract address storage
- Provides contract deployment functionality for admins

#### BookingService
- Manages booking operations
- Handles booking creation, confirmation, and refunds
- Retrieves booking details and history

#### ArticleService
- Handles CRUD operations for tourism articles
- Manages article creation and updates
- Handles article deletion and status changes

### Smart Contract (`/contracts/TourismPayments.sol`)
- Manages the core business logic
- Handles payments and refunds
- Stores article and booking data
- Implements role-based access control
- Manages operator fees and business payments

### User Roles
- **Admin**: Can deploy contracts, manage all articles, and oversee all bookings
- **Business**: Can manage their own articles and handle their bookings

### Key Features
- Web3 wallet integration
- Smart contract deployment and management
- Role-based access control
- IPFS integration for data storage
- Booking management system
- Article management system
- CaminoScan integration for contract verification

### Security
- Role-based access control
- Wallet authentication
- Smart contract security measures
- Protected admin and business functions
