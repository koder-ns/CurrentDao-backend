# CurrentDao Backend - Cross-Border Energy Trading Platform

A comprehensive NestJS backend for handling international energy trading with compliance, multi-currency support, and regulatory reporting.

## Features

### 🌍 Cross-Border Energy Trading
- **International Regulation Compliance**: Supports 10+ international energy regulations
- **Multi-Currency Support**: Handles 15+ currencies with real-time exchange rates
- **Cross-Border Transaction Processing**: Processes transactions within 5 minutes
- **Regulatory Reporting**: Automatic generation and submission of regulatory reports
- **Customs and Tariff Management**: Accurate calculation of customs duties and tariffs
- **International Payment Integration**: Support for international banking systems

### 📊 Supported Regulations
- EU Renewable Energy Directive
- US FERC Energy Trading Regulations
- ISO 50001 Energy Management Standard
- IEA Energy Reporting Standards
- EU Cross-Border Electricity Trading Directive
- World Bank Climate Standards
- Oil and Gas Industry Protocol
- Renewable Portfolio Standard
- Carbon Pricing Mechanism Compliance
- International Trade Sanctions Compliance

### 💱 Supported Currencies
- USD, EUR, GBP, JPY, CNY, INR, AUD, CAD, CHF
- SEK, NOK, DKK, SGD, HKD, NZD, KRW, MXN, BRL, RUB, ZAR

### ⚡ Performance
- Handles 1000+ cross-border transactions daily
- Sub-5 minute transaction processing
- 90%+ test coverage
- Real-time compliance checking

## Getting Started

### Prerequisites

- Node.js >= 18.x  
- npm >= 11.x

### Installation

```bash
git clone https://github.com/akordavid373/CurrentDao-backend.git
cd CurrentDao-backend
git checkout feature/cross-border-energy-trading
npm install
```

### Environment Configuration

Create a `.env` file based on `.env.example`:

```env
EXCHANGE_RATE_API_KEY=your_api_key_here
DATABASE_URL=./database.sqlite
```

### Running Locally

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## API Documentation

### Base URL
```
http://localhost:3000
```

### Key Endpoints

#### Transactions
- `POST /cross-border/transactions` - Create new cross-border transaction
- `GET /cross-border/transactions/:transactionId` - Get transaction by ID
- `POST /cross-border/transactions/batch` - Process batch transactions

#### Compliance
- `GET /cross-border/compliance/check` - Check compliance for potential transaction
- `GET /cross-border/compliance/regulations` - Get all regulations

#### Currency
- `POST /cross-border/currency/convert` - Convert currency
- `GET /cross-border/currency/supported` - Get supported currencies

#### Customs
- `POST /cross-border/customs/calculate` - Calculate customs and tariffs
- `GET /cross-border/customs/rules/:sourceCountry/:targetCountry` - Get customs rules

#### Reports
- `POST /cross-border/reports/generate` - Generate regulatory report
- `POST /cross-border/reports/:reportId/submit` - Submit regulatory report

### API Examples

#### Create Cross-Border Transaction
```bash
curl -X POST http://localhost:3000/cross-border/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "TXN-2024-001",
    "transactionType": "export",
    "sourceCountry": "US",
    "targetCountry": "DE",
    "amount": 100000,
    "currency": "USD",
    "energyType": "solar",
    "energyQuantity": 1000,
    "energyUnit": "MWh"
  }'
```

#### Check Compliance
```bash
curl "http://localhost:3000/cross-border/compliance/check?sourceCountry=US&targetCountry=DE&energyType=solar&amount=100000&transactionType=export"
```

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

The project maintains 90%+ test coverage across all cross-border modules.

## Architecture

### Module Structure
```
src/cross-border/
├── compliance/           # International regulation compliance
├── currency/            # Multi-currency support and conversion
├── transactions/        # Transaction processing orchestration
├── tariffs/            # Customs and tariff management
├── reporting/          # Regulatory reporting
├── entities/           # Database entities
├── dto/               # Data transfer objects
└── controller/        # API controllers
```

## Performance Metrics

### Transaction Processing
- **Average Processing Time**: < 5 minutes
- **Daily Transaction Capacity**: 1000+ transactions
- **Compliance Check Time**: < 30 seconds
- **Currency Conversion Time**: < 2 seconds

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow
1. Create feature branch from `feature/cross-border-energy-trading`
2. Implement changes with tests
3. Ensure 90%+ test coverage
4. Run linting and formatting
5. Submit pull request

## License

This project is licensed under the UNLICENSED license.
