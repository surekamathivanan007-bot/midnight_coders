import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { AdminLayout } from '@/components/admin/AdminLayout';

import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { DashboardHome } from '@/pages/dashboard/DashboardHome';
import { ProfilePage } from '@/pages/dashboard/ProfilePage';
import { EducationPage } from '@/pages/dashboard/EducationPage';
import { ExperiencePage } from '@/pages/dashboard/ExperiencePage';
import { SkillsPage } from '@/pages/dashboard/SkillsPage';
import { ProjectsPage } from '@/pages/dashboard/ProjectsPage';
import { BlogPage } from '@/pages/dashboard/BlogPage';
import { CertificatesPage } from '@/pages/dashboard/CertificatesPage';
import { AchievementsPage } from '@/pages/dashboard/AchievementsPage';
import { ResumePage } from '@/pages/dashboard/ResumePage';
import { ContactPage } from '@/pages/dashboard/ContactPage';
import { SocialPage } from '@/pages/dashboard/SocialPage';
import { ThemePage } from '@/pages/dashboard/ThemePage';
import { PreviewPage } from '@/pages/dashboard/PreviewPage';
import { PublishPage } from '@/pages/dashboard/PublishPage';
import { PublicPortfolioPage } from '@/pages/PublicPortfolioPage';
import { AdminLogin } from '@/pages/admin/AdminLogin';
import { AdminOverview } from '@/pages/admin/AdminOverview';
import { AdminUsers } from '@/pages/admin/AdminUsers';
import { AdminProjects } from '@/pages/admin/AdminProjects';
import { AdminSkills } from '@/pages/admin/AdminSkills';
import { AdminBlog } from '@/pages/admin/AdminBlog';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/u/:slug" element={<PublicPortfolioPage />} />

              {/* Admin */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminOverview />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="skills" element={<AdminSkills />} />
                <Route path="blog" element={<AdminBlog />} />
              </Route>

              {/* User dashboard (protected) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardHome />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="education" element={<EducationPage />} />
                  <Route path="experience" element={<ExperiencePage />} />
                  <Route path="skills" element={<SkillsPage />} />
                  <Route path="projects" element={<ProjectsPage />} />
                  <Route path="blog" element={<BlogPage />} />
                  <Route path="certificates" element={<CertificatesPage />} />
                  <Route path="achievements" element={<AchievementsPage />} />
                  <Route path="resume" element={<ResumePage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="social" element={<SocialPage />} />
                  <Route path="theme" element={<ThemePage />} />
                  <Route path="preview" element={<PreviewPage />} />
                  <Route path="publish" element={<PublishPage />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
