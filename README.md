# Tax Rate Manager

A Next.js application for creating, managing, and applying tax rates with intelligent auto-selection features built with shadcn/ui.

## Features

### 🛠️ Tax Rate Management
- Create, edit, and delete tax rates
- Organize by region and category (sales, income, property, excise, other)
- Enable/disable rates as needed
- Professional table view with sorting and filtering

### 🧮 Tax Calculator
- Select from available tax rates via dropdown
- Real-time tax calculations
- Clear breakdown of amounts (base, tax, total)
- Professional currency formatting

### 🤖 Auto-Selection
- Intelligent tax rate selection based on user criteria
- Region-based matching
- Category filtering
- Configurable fallback rates
- User location and preference detection

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tax-rate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── example/           # Tax calculator page
│   ├── manage/            # Tax rate management page
│   ├── layout.tsx         # Root layout with navigation
│   └── page.tsx           # Homepage
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui base components
│   ├── navbar.tsx        # Navigation component
│   ├── tax-rate-form.tsx # Create/edit tax rate form
│   ├── tax-rate-table.tsx # Tax rates display table
│   └── auto-selection-settings.tsx # Auto-selection config
├── lib/                  # Utilities and services
│   ├── utils.ts          # shadcn/ui utilities
│   └── tax-rate-service.ts # Tax rate business logic
└── types/                # TypeScript type definitions
    └── tax-rate.ts       # Tax rate related types
```

## Usage Guide

### 1. Managing Tax Rates

Navigate to the "Manage Tax Rates" page to:
- Add new tax rates with name, rate percentage, region, and category
- Edit existing rates by clicking the edit button
- Delete rates with confirmation dialog
- Toggle active/inactive status

### 2. Using the Calculator

On the "Tax Calculator" page:
- Select a tax rate from the dropdown menu
- Enter a base amount to calculate taxes
- View the calculated tax amount and total
- Use auto-selection for intelligent rate matching

### 3. Auto-Selection Setup

Configure automatic tax rate selection:
- Enable/disable auto-selection
- Set default region and category criteria
- Configure fallback rate for when no match is found
- Test with different user inputs

## Example Tax Rates

The application comes pre-loaded with sample tax rates:
- California Sales Tax (7.25%)
- New York Income Tax (4%)
- Texas Property Tax (1.83%)

## Data Storage

Currently uses in-memory storage for demonstration purposes. In a production environment, you would integrate with:
- Database (PostgreSQL, MySQL, etc.)
- API endpoints for CRUD operations
- User authentication and authorization
- Data validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.