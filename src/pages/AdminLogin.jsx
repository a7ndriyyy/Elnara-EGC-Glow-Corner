
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminPage.css';
import { useLanguage } from '../i18n/LanguageContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? t('admin.login.submitting') : t('admin.login.submit')}
        </button>
      </form>
    </main>
  );
}
