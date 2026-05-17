import { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthForm } from '../hooks/useAuthForm';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { email, setEmail, password, setPassword, error, loading, onSubmit } = useAuthForm('login');

  const submit = (event: FormEvent) => onSubmit(event, () => navigate('/dashboard'));

  return (
    <div className="min-h-screen flex items-stretch">
      {/* Left Side: Editorial Brand Panel */}
      <section className="hidden lg:flex lg:w-1/2 relative editorial-gradient overflow-hidden items-center justify-center p-margin-desktop">
        {/* Background Imagery Decor */}
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <img alt="Editorial Workspace" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8eau_e56WkEexeZZNdMDw6dTHTRjF9lSwzSz7vA-h2qy6m1za0sMZC-D68zDkm8U4T0TgSXz_SajIO5uSenRCcYi8GdH5VXf-592eMANw1hSoAD4A3wxUqecdo3yYYtB-ohHCyPnBsp1cgG0wEWjw240mBomb69MnF5ZPN-wdDiE8XLZyauwdv4tMzR0HvcCxb9tLd2NX8TxWxNEQoellW3Z-L_-dyl86c3Zuy9hccJ-kTFtiaY4NfASuZ2JRw8Nh4bG_PJhMm-4" />
        </div>
        <div className="relative z-10 max-w-xl">
          <div className="mb-stack-lg">
            <span className="font-label-sm text-label-sm text-primary tracking-widest bg-primary-container/20 px-3 py-1 rounded-full">WORKSPACE v4.0</span>
          </div>
          <h1 className="font-display-lg text-display-lg text-on-primary-container mb-stack-md leading-tight">
            Achieve Absolute <span className="text-primary italic">Focus and Clarity</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-lg max-w-md opacity-80">
            A professional-grade environment designed for high-performance teams. Task Manager eliminates the noise, leaving only what matters.
          </p>
          <div className="flex gap-stack-md pt-stack-lg border-t border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-label-sm text-label-sm text-on-surface uppercase">Uninterrupted Workflow</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-label-sm text-label-sm text-on-surface uppercase">Premium Security</span>
            </div>
          </div>
        </div>
        {/* Brand Footer Anchor */}
        <div className="absolute bottom-margin-desktop left-margin-desktop">
          <p className="font-headline-md text-headline-md font-bold tracking-tight text-white">Task Manager</p>
        </div>
      </section>

      {/* Right Side: Login Form */}
      <main className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-surface p-margin-mobile md:p-margin-desktop relative">
        {/* Mobile Header */}
        <div className="lg:hidden absolute top-stack-lg left-margin-mobile">
          <p className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface">Task Manager</p>
        </div>

        <div className="w-full max-w-sm flex flex-col space-y-stack-lg">
          <header className="space-y-base">
            <h2 className="font-headline-lg text-headline-lg text-on-surface lg:text-left text-center">Welcome Back</h2>
            <p className="font-body-md text-body-md text-on-surface-variant lg:text-left text-center">Sign in to your editorial workspace.</p>
          </header>

          <form onSubmit={submit} className="space-y-stack-md">
            {error && (
              <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="space-y-base">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase ml-1" htmlFor="email">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-[20px]">mail</span>
                </div>
                <input 
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-3 pl-10 pr-4 text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200" 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-base">
              <div className="flex justify-between items-center px-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase" htmlFor="password">Password</label>
                <a className="font-label-sm text-label-sm text-primary hover:text-primary-fixed transition-colors" href="#">Forgot?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-[20px]">lock</span>
                </div>
                <input 
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-3 pl-10 pr-4 text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200" 
                  id="password" 
                  name="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required 
                />
              </div>
            </div>

            <div className="pt-stack-sm">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary-container text-on-primary-container font-headline-md text-headline-md py-4 rounded-lg shadow-sm hover:brightness-110 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </form>

          <div className="relative py-stack-md flex items-center">
            <div className="grow border-t border-outline-variant/20"></div>
            <span className="shrink mx-4 font-label-sm text-label-sm text-outline uppercase">Or continue with</span>
            <div className="grow border-t border-outline-variant/20"></div>
          </div>

          <div className="grid grid-cols-2 gap-stack-md">
            <button className="flex items-center justify-center gap-2 bg-surface-container-high border border-outline-variant/30 py-3 rounded-lg hover:bg-surface-bright active:scale-[0.98] transition-all">
              <img alt="Google" className="w-5 h-5 grayscale contrast-125" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQk_aJ2wagaAhVRHEsmufv9266zQgvVzEF3ic0pjZV52_gzm76eJq6XgGTS7EfXMuqgtnnf6mA86Fg8HT3WL8_MWm6IBonC59LlQvW6krbNYy0IGbwW-ES1JxGJsUfH86LPKEu77CiEhee8sz94DtqIe0hUoibz8teblHDJBLvjd1bYQWXVjtHNm4VPZ5z2S_-jHPeIupvSN7Pn6B0qUUQTBMmtcRrHayS5mTNes0aoo77ptQr4A4pXf5RYq8Ba7NutvIVigzI9Ys" />
              <span className="font-body-md text-body-md font-medium text-on-surface">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 bg-surface-container-high border border-outline-variant/30 py-3 rounded-lg hover:bg-surface-bright active:scale-[0.98] transition-all">
              <span className="material-symbols-outlined text-on-surface text-[20px]">terminal</span>
              <span className="font-body-md text-body-md font-medium text-on-surface">SSO</span>
            </button>
          </div>

          <footer className="pt-stack-lg text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Don&apos;t have an account? 
              <Link className="text-primary font-semibold ml-1 hover:underline underline-offset-4" to="/register">Create an account</Link>
            </p>
          </footer>
        </div>

        <div className="absolute bottom-stack-lg opacity-40 flex items-center gap-4">
          <span className="font-label-sm text-label-sm text-outline">Privacy Policy</span>
          <span className="w-1 h-1 bg-outline rounded-full"></span>
          <span className="font-label-sm text-label-sm text-outline">Terms of Service</span>
        </div>
      </main>
    </div>
  );
};
