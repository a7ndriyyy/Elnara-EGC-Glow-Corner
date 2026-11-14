
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { supabase } from '../lib/supabase';
import './AdminPage.css';
import { useLanguage } from '../i18n/LanguageContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) throw loginError;

      const { data: admin, error: adminError } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (adminError) throw adminError;

      if (!admin) {
        await supabase.auth.signOut();
        throw new Error(t('admin.login.notAdmin'));
      }

      navigate('/admin');
    } catch (err) {
      setError(err.message || t('admin.login.failed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login">
      <form onSubmit={handleSubmit} className="admin-login__form">
        <h1>{t('admin.login.title')}</h1>
        <p>{t('admin.login.intro')}</p>

        <label htmlFor="admin-email">{t('admin.login.email')}</label>
        <input
          id="admin-email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="admin-password">{t('admin.login.password')}</label>
        {/* eye button shows / hides what was typed */}
        <div className="admin-login__password">
          <input
            id="admin-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button
            type="button"
            className="admin-login__eye"
            onClick={() => setShowPassword((shown) => !shown)}
            aria-label={showPassword ? t('admin.login.hidePassword') : t('admin.login.showPassword')}
            aria-pressed={showPassword}
            aria-controls="admin-password"
          >
            {showPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
          </button>
        </div>

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? t('admin.login.submitting') : t('admin.login.submit')}
        </button>
      </form>
    </main>
  );
}
