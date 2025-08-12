# 📅 FatiCalendar

[![GitHub top language](https://img.shields.io/github/languages/top/matiasvallejosdev/faticalendar?color=164e2d)](https://github.com/matiasvallejosdev/faticalendar/search?l=typescript)
![License](https://img.shields.io/github/license/matiasvallejosdev/faticalendar?label=license&logo=github&color=f80&logoColor=fff)
![Forks](https://img.shields.io/github/forks/matiasvallejosdev/faticalendar.svg)
![Stars](https://img.shields.io/github/stars/matiasvallejosdev/faticalendar.svg)
![Watchers](https://img.shields.io/github/watchers/matiasvallejosdev/faticalendar.svg)

Experience FatiCalendar in action: [View Production](https://faticalendar.vercel.app/)

## 📘 Introduction

FatiCalendar is a life visualization application that displays your life in weeks as an interactive grid calendar. Built with Next.js 15 and powered by Supabase, it helps users visualize their life journey, track progress, and gain perspective on time through an elegant vintage-themed interface.

## ✨ Key Features

- **Life Visualization**: Interactive grid showing your life in weeks with visual progress indicators
- **Personalized Calculations**: Life expectancy based on nationality and lifestyle factors
- **Real-time Progress**: Current age, life progress percentage, and yearly progress tracking
- **Social Sharing**: Capture and share your life visualization across platforms
- **Responsive Design**: Vintage-themed interface optimized for all devices
- **Data Persistence**: Local storage with optional Supabase cloud backup

## 🛠 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/matiasvallejosdev/faticalendar.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env.local`:
   ```
   # Supabase Configuration (Optional)
   SUPABASE_URL=your_supabase_project_url_here
   SUPABASE_ANON_KEY=your_supabase_anon_key_here
   
   # Client-side variables
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 💡 Usage

1. Visit the app in your browser at `http://localhost:3000`
2. Enter your personal information (name, birth year, nationality)
3. Select your lifestyle factors (diet, exercise, alcohol, smoking)
4. Visualize your life journey as an interactive grid
5. Track your progress with real-time statistics
6. Share your visualization with friends and family

## 🎨 Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **State Management**: Redux Toolkit with localStorage persistence
- **UI Components**: Radix UI primitives with custom vintage theme
- **Backend**: Supabase (optional) for data persistence
- **Icons**: Lucide React
- **Notifications**: Sonner toast system

## 🤝 Contributing

FatiCalendar is an open-source project, and contributions are welcome. Feel free to fork the repository, make your changes, and submit a pull request.

## 📞 Contact

If you have any questions or need further assistance, you can contact the project maintainer:

- **Name**: Matias Vallejos
- **Website**: [matiasvallejos.com](https://matiasvallejos.com/)

Feel free to reach out if you have any inquiries or need any additional information about the project.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
