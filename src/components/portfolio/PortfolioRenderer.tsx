import {
  Mail, Phone, MapPin, Globe, Download, ExternalLink, Github, Twitter,
  Linkedin, Instagram, Youtube, Facebook, Star, ArrowRight, FileText,
  GraduationCap, Briefcase, Award, Trophy, Calendar,
} from 'lucide-react';
import type { PortfolioData } from '@/lib/types';
import { formatDate, formatDateLong, slugify } from '@/lib/utils';
import { SEO } from '@/components/SEO';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';

const socialIcons: Record<string, typeof Github> = {
  github: Github, twitter: Twitter, linkedin: Linkedin, instagram: Instagram,
  youtube: Youtube, facebook: Facebook, website: Globe, email: Mail,
  dribbble: Globe, behance: Globe,
};

interface PortfolioRendererProps {
  data: PortfolioData;
  isPreview?: boolean;
}

export function PortfolioRenderer({ data, isPreview }: PortfolioRendererProps) {
  const { portfolio, profile, education, experience, skills, projects, blogPosts, certificates, achievements, contacts, socialLinks, resumes } = data;
  const contact = contacts[0];
  const resume = resumes[0];
  const title = portfolio.title || profile?.full_name || 'My Portfolio';
  const tagline = portfolio.tagline || profile?.bio?.split('\n')[0] || '';
  const accent = portfolio.accent_color || '#6366f1';

  const featuredProjects = projects.filter((p) => p.featured);
  const publishedPosts = blogPosts.filter((p) => p.published);

  const socialStyle = {
    '--accent': accent,
  } as React.CSSProperties;

  return (
    <div style={socialStyle} className={portfolio.theme === 'dark' ? 'dark' : ''}>
      <SEO
        title={portfolio.seo_title || title}
        description={portfolio.seo_description || tagline || undefined}
        keywords={portfolio.seo_keywords || undefined}
        image={profile?.avatar_url || undefined}
      />
      <div className={portfolio.theme === 'dark' ? 'min-h-screen bg-[#0a0a0f] text-gray-100' : 'min-h-screen bg-white text-gray-900'}>
        {/* Nav */}
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 dark:bg-[#0a0a0f]/70 border-b border-gray-200/60 dark:border-white/5">
          <nav className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <a href="#home" className="flex items-center gap-2">
              <Avatar src={profile?.avatar_url} name={profile?.full_name} size="sm" />
              <span className="font-bold">{profile?.full_name || 'Portfolio'}</span>
            </a>
            <div className="hidden md:flex items-center gap-1">
              {[
                { label: 'About', href: '#about' },
                { label: 'Skills', href: '#skills' },
                { label: 'Projects', href: '#projects' },
                { label: 'Blog', href: '#blog' },
                { label: 'Contact', href: '#contact' },
              ].map((l) => (
                <a key={l.href} href={l.href} className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                  {l.label}
                </a>
              ))}
            </div>
            {resume && (
              <a href={resume.file_url} download className="inline-flex items-center gap-2 h-9 px-4 rounded-xl text-white text-sm font-medium" style={{ background: accent }}>
                <Download className="w-4 h-4" /> Resume
              </a>
            )}
          </nav>
        </header>

        {/* Hero */}
        <section id="home" className="relative pt-24 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] opacity-50" />
          <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full blur-[120px] opacity-20" style={{ background: accent }} />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <Avatar src={profile?.avatar_url} name={profile?.full_name} size="xl" className="w-28 h-28 text-3xl mx-auto mb-6 ring-4 ring-white/10" />
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
              {profile?.full_name || 'Your Name'}
            </h1>
            {tagline && <p className="mt-4 text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{tagline}</p>}
            {profile?.location && (
              <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-gray-400">
                <MapPin className="w-4 h-4" /> {profile.location}
              </p>
            )}
            <div className="mt-8 flex items-center justify-center gap-3">
              {resume && (
                <a href={resume.file_url} download className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-white text-sm font-medium transition-transform hover:scale-105" style={{ background: accent }}>
                  <Download className="w-4 h-4" /> Download Resume
                </a>
              )}
              <a href="#projects" className="inline-flex items-center gap-2 h-11 px-6 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                View Work <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            {socialLinks.length > 0 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                {socialLinks.map((s) => {
                  const Icon = socialIcons[s.platform] ?? Globe;
                  return (
                    <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-white hover:border-transparent transition-all" style={{ '--hover': accent } as React.CSSProperties} onMouseEnter={(e) => { e.currentTarget.style.background = accent; e.currentTarget.style.color = 'white'; }} onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; }}>
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* About */}
        {profile?.bio && (
          <section id="about" className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold mb-8">About Me</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{profile.bio}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section id="experience" className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold mb-8">Experience</h2>
            <div className="space-y-6">
              {experience.map((e) => (
                <div key={e.id} className="relative pl-8 border-l-2" style={{ borderColor: `${accent}40` }}>
                  <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full" style={{ background: accent }} />
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold">{e.role}</h3>
                    <span className="text-sm text-gray-400">{formatDate(e.start_date)} — {e.current ? 'Present' : formatDate(e.end_date)}</span>
                  </div>
                  <p className="text-sm font-medium mb-2" style={{ color: accent }}>{e.company}</p>
                  {e.description && <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{e.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section id="education" className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold mb-8">Education</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {education.map((e) => (
                <div key={e.id} className="rounded-2xl border border-gray-200 dark:border-white/5 p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${accent}15`, color: accent }}>
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{e.institution}</h3>
                      <p className="text-sm text-gray-400">{e.degree}{e.field ? ` · ${e.field}` : ''}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(e.start_date)} — {formatDate(e.end_date) || 'Present'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section id="skills" className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold mb-8">Skills</h2>
            <div className="space-y-6">
              {Object.entries(skills.reduce<Record<string, typeof skills>>((acc, s) => {
                (acc[s.category || 'General'] ??= []).push(s);
                return acc;
              }, {})).map(([cat, items]) => (
                <div key={cat}>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">{cat}</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {items.map((s) => (
                      <span key={s.id} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-sm font-medium">
                        {s.name}
                        <span className="w-10 h-1.5 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                          <span className="block h-full rounded-full" style={{ width: `${s.proficiency}%`, background: accent }} />
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section id="projects" className="py-20 max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold mb-8">Projects</h2>
            {featuredProjects.length > 0 && (
              <div className="mb-8">
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5"><Star className="w-4 h-4" style={{ color: accent }} /> Featured</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {featuredProjects.map((p) => (
                    <ProjectCard key={p.id} project={p} accent={accent} featured />
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.filter((p) => !p.featured).map((p) => (
                <ProjectCard key={p.id} project={p} accent={accent} />
              ))}
            </div>
          </section>
        )}

        {/* Blog */}
        {publishedPosts.length > 0 && (
          <section id="blog" className="py-20 max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold mb-8">Blog</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {publishedPosts.map((p) => (
                <article key={p.id} className="rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden group">
                  {p.cover_image && (
                    <div className="aspect-video overflow-hidden">
                      <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-xs text-gray-400 mb-2">{formatDateLong(p.published_at ?? p.created_at)}</p>
                    <h3 className="font-semibold mb-1.5">{p.title}</h3>
                    {p.excerpt && <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{p.excerpt}</p>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Certificates */}
        {certificates.length > 0 && (
          <section id="certificates" className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold mb-8">Certificates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certificates.map((c) => (
                <div key={c.id} className="rounded-2xl border border-gray-200 dark:border-white/5 p-5 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${accent}15`, color: accent }}>
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{c.title}</h3>
                    <p className="text-sm text-gray-400">{c.issuer}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(c.issue_date)}</p>
                    {c.credential_url && <a href={c.credential_url} target="_blank" rel="noreferrer" className="text-xs font-medium mt-2 inline-flex items-center gap-1" style={{ color: accent }}>View credential <ExternalLink className="w-3 h-3" /></a>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <section id="achievements" className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold mb-8">Achievements</h2>
            <div className="space-y-3">
              {achievements.map((a) => (
                <div key={a.id} className="rounded-2xl border border-gray-200 dark:border-white/5 p-5 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${accent}15`, color: accent }}>
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{a.title}</h3>
                    {a.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{a.description}</p>}
                    {a.date && <p className="text-xs text-gray-400 mt-1">{formatDate(a.date)}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        {(contact || socialLinks.length > 0) && (
          <section id="contact" className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold mb-8">Get in touch</h2>
            <div className="rounded-3xl border border-gray-200 dark:border-white/5 p-8">
              {contact && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contact.email && <a href={`mailto:${contact.email}`} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"><Mail className="w-5 h-5" style={{ color: accent }} /><span className="text-sm">{contact.email}</span></a>}
                  {contact.phone && <a href={`tel:${contact.phone}`} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"><Phone className="w-5 h-5" style={{ color: accent }} /><span className="text-sm">{contact.phone}</span></a>}
                  {contact.location && <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-white/5"><MapPin className="w-5 h-5" style={{ color: accent }} /><span className="text-sm">{contact.location}</span></div>}
                  {contact.website && <a href={contact.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"><Globe className="w-5 h-5" style={{ color: accent }} /><span className="text-sm truncate">{contact.website}</span></a>}
                </div>
              )}
              {socialLinks.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {socialLinks.map((s) => {
                    const Icon = socialIcons[s.platform] ?? Globe;
                    return (
                      <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-white hover:border-transparent transition-all" onMouseEnter={(e) => { e.currentTarget.style.background = accent; e.currentTarget.style.color = 'white'; }} onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; }}>
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-white/5 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} {profile?.full_name || 'Portfolio'}. Built with PortalX.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function ProjectCard({ project, accent, featured }: { project: PortfolioData['projects'][0]; accent: string; featured?: boolean }) {
  return (
    <div className={`rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden group ${featured ? 'lg:col-span-2' : ''}`}>
      <div className={`overflow-hidden ${featured ? 'aspect-[2/1]' : 'aspect-video'} bg-gradient-to-br from-gray-100 to-gray-200 dark:from-white/5 dark:to-white/[0.02]`}>
        {project.image_url ? (
          <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-white/10">
            <FileText className="w-10 h-10" />
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold">{project.title}</h3>
          <div className="flex items-center gap-1 shrink-0">
            {project.project_url && <a href={project.project_url} target="_blank" rel="noreferrer" className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors"><ExternalLink className="w-4 h-4" /></a>}
            {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer" className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors"><Github className="w-4 h-4" /></a>}
          </div>
        </div>
        {project.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{project.description}</p>}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {project.tags.map((t) => <span key={t} className="text-xs px-2 py-1 rounded-md" style={{ background: `${accent}15`, color: accent }}>{t}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}
