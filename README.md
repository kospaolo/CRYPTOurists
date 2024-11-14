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
