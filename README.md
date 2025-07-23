# Smart Notes Chrome Extension

A Chrome extension that helps users manage tasks, notifications, and notes efficiently with AI-powered chat capabilities.

## Features

- 📝 Create, edit, and delete notes with rich text formatting
- 🔍 AI-powered chat interface to query your notes
- 🏷️ Tag and categorize notes for better organization
- 🔒 Secure authentication
- 📱 Responsive design that works on all screen sizes
- ⚡ Built with React, TypeScript, and Tailwind CSS

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Form Handling**: React Hook Form
- **Icons**: Lucide Icons
- **Build Tool**: Vite
- **Linting**: ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Chrome or any Chromium-based browser

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/smart-notes-extension.git
   cd smart-notes-extension
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top-right corner)
   - Click "Load unpacked" and select the `dist` directory

5. The extension should now be loaded and ready to use!

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The production files will be in the `dist` directory, which you can then package and publish to the Chrome Web Store.

## Project Structure

```
src/
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks
├── services/        # API and service layer
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── App.tsx          # Main application component
└── entry.tsx        # Application entry point
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run type-check` - Run TypeScript type checking

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Screenshots

![Screenshot 1](/screenshots/screenshot1.png)
*Main interface with notes list and editor*

![Screenshot 2](/screenshots/screenshot2.png)
*AI chat interface for querying notes*
