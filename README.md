# 🤖 AI-Powered Staff Management System

A modern React-based Staff Management System with advanced AI features powered by Google Gemini API.

## ✨ AI Features

### 🧠 **Gemini AI Integration**
- **Smart Task Enhancement**: Transform brief descriptions into detailed, professional tasks
- **AI Email Generation**: Create personalized, professional email notifications
- **Intelligent Mood Analysis**: Comprehensive team mood insights and recommendations
- **Real-time AI Processing**: All AI features use Google Gemini API for accurate results

### 🔐 **Authentication System**
- Secure login with role-based access (Admin/Staff)
- Session management with automatic logout
- Protected routes and secure password handling

### 👥 **User Management**
- **Admin Role**: Full system access and staff management
- **Staff Role**: Task management and mood tracking interface
- Add, edit, and remove staff members with username/password management

### 📋 **Advanced Task Management**
- Create and assign tasks with AI-enhanced descriptions
- Priority levels (Low, Medium, High) with visual indicators
- Status tracking (Pending, In Progress, Completed)
- Due date management with overdue detection
- Task filtering, sorting, and search functionality
- Staff mood tracking on individual tasks

### 📊 **AI Mood Analytics**
- Real-time team mood visualization
- Individual staff mood tracking
- AI-powered mood analysis with actionable insights
- Performance correlation analysis
- Detailed recommendations for team management

### 🎨 **Modern UI/UX**
- Fully responsive design for all devices
- Dark/Light theme toggle with system preference detection
- Smooth animations and micro-interactions
- Professional card-based layout
- Intuitive navigation with breadcrumbs

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager
- Google Gemini API key

### Installation

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/staff-management-system.git
   cd staff-management-system
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Add your Gemini API key to .env file
   ```

4. **Start Development Server**
   ```bash
   npm start
   ```

5. **Open Browser**
   Navigate to `http://localhost:3000`

### Demo Accounts

**Admin Account:**
- Email: `mdqamarahmed123@gmail.com`
- Password: `admin`

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── admin/           # Admin-specific components
│   │   ├── AdminDashboard.js
│   │   ├── AdminLayout.js
│   │   ├── AdminTasksView.js
│   │   ├── AdminStaffView.js
│   │   ├── TaskStats.js
│   │   ├── TaskList.js
│   │   └── MoodAnalytics.js    # AI mood analysis
│   ├── staff/           # Staff-specific components
│   │   ├── StaffDashboard.js
│   │   ├── StaffLayout.js
│   │   └── StaffTasksView.js
│   └── shared/          # Shared components
├── contexts/            # React Context providers
│   ├── AuthContext.js   # Authentication state
│   ├── ThemeContext.js  # Theme management
│   ├── ModalContext.js  # Modal state
│   └── ToastContext.js  # Notifications
├── hooks/               # Custom React hooks
│   └── useTasks.js      # Task management hook
├── services/            # External services
│   ├── taskService.js   # Task CRUD operations
│   └── geminiService.js # AI API integration
└── utils/               # Utility functions
    └── constants.js     # App constants
```

## 🤖 AI Features in Detail

### Task Enhancement
- Input: Brief task description
- Output: Professional, detailed task with clear objectives
- Uses: Google Gemini API for natural language processing

### Email Generation
- Automatically creates professional email notifications
- Personalized content based on task details and staff information
- Includes clear expectations and next steps

### Mood Analysis
- Analyzes team mood patterns and trends
- Provides actionable insights for management
- Identifies potential issues and recommends solutions
- Correlates mood with task performance

## 🚀 Deployment

### Vercel Deployment
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variable: `REACT_APP_GEMINI_API_KEY`
4. Deploy automatically

### Manual Build
```bash
npm run build
```

## 🔧 Configuration

### Environment Variables
```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

### API Configuration
- Gemini API endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
- Temperature: 0.7 for balanced creativity and accuracy
- Max tokens: 1024 for comprehensive responses

## 🛠️ Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run vercel-build` - Build for Vercel deployment

## 🌟 Key Features

- **Real-time AI Processing**: All AI features use live API calls
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme**: Automatic theme detection and manual toggle
- **Secure Authentication**: Role-based access control
- **Data Persistence**: Local storage for offline functionality
- **Performance Optimized**: Lazy loading and efficient state management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- React team for the amazing framework
- Tailwind CSS for beautiful styling
- All contributors and testers

---

**Built with ❤️ using React, Tailwind CSS, and Google Gemini AI**