# GrowthCast - Business Analytics & Data Cleaning Platform  

A clean, intuitive SaaS platform for small business and factory owners to clean Excel files, visualize business data, and predict future growth.

## 🚀 Features

### 1. 🧹 Excel File Cleaning (✅ LIVE)
Automatically clean your Excel files with 13 powerful operations:
- Remove duplicates
- Handle missing values
- Trim extra spaces
- Convert data types
- Standardize date formats
- Fix text case
- Remove blank rows/columns
- Validate data (email, phone, numbers)
- Merge multiple sheets
- Normalize column names
- Find & replace
- Filter unwanted data
- Sort data

**All cleaning is non-AI based and happens in your browser!**

### 2. � Admin Dashboard (Coming Soon)
- View all uploaded files
- Track cleaning history
- Manage reports
- User settings

### 3. 📈 Predictive Analysis (Coming Soon)
- AI-powered business forecasts
- 3, 6, and 12-month predictions
- Confidence intervals
- Trend analysis

### 4. 📄 Report Generation (Coming Soon)
- Generate professional reports from Excel
- Custom templates
- Charts and visualizations
- Export to PDF

## Tech Stack

- **React** - UI Framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **Heroicons** - Icon library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
GrowthCast/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── FileUpload.jsx
│   │   ├── Dashboard.jsx
│   │   ├── KPICard.jsx
│   │   ├── ReportChart.jsx
│   │   └── ForecastTable.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Components

- **Header** - Application header with logo and user profile
- **FileUpload** - Drag-and-drop file upload interface
- **Dashboard** - Main dashboard view with all metrics
- **KPICard** - Reusable card for displaying key metrics
- **ReportChart** - Chart component using Chart.js
- **ForecastTable** - Table displaying growth predictions

## License

MIT
