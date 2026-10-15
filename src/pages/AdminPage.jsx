
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminPage.css';

export default function AdminPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState('all');

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const { data: { user }, error: userError } =
        await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        navigate('/admin-login', { replace: true });
        return;
      }

      const { data: admin, error: adminError } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (adminError) throw adminError;

      if (!admin) {
        await supabase.auth.signOut();
        navigate('/admin-login', { replace: true });
        return;
      }

      const { data, error: appointmentsError } = await supabase
        .from('appointments')
        .select(
          'id, service_id, starts_at, ends_at, customer_name, customer_phone, customer_email, status, payment_status, created_at'
        )
        .order('starts_at', { ascending: true });

      if (appointmentsError) throw appointmentsError;

      setAppointments(data ?? []);
    } catch (err) {
      setError(err.message || 'Could not load appointments.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  async function updateStatus(appointmentId, status) {
    setUpdatingId(appointmentId);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId);

      if (updateError) throw updateError;

      await loadAppointments();
    } catch (err) {
      setError(err.message || 'Could not update appointment.');
    } finally {
      setUpdatingId(null);
    }
  }

  async function signOut() {
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
      return;
    }

    navigate('/admin-login', { replace: true });
  }

  const visibleAppointments = appointments.filter((appointment) => {
    return filter === 'all' || appointment.status === filter;
  });

  function formatDate(value) {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Europe/Paris',
    }).format(new Date(value));
  }

  if (loading) return <main className="admin-page"><p>Loading appointments…</p></main>;

  return (
    <main className="admin-page">
      <header className="admin-page__header">
        <div>
          <h1>ELNARA — Appointments</h1>
          <p>Manage client appointment requests.</p>
        </div>
        <div>
          <button type="button" onClick={loadAppointments}>Refresh</button>
          {' '}
          <button type="button" onClick={signOut}>Sign out</button>
        </div>
      </header>

      <div className="admin-page__filters">
        <label htmlFor="appointment-filter">Status</label>
        <select
          id="appointment-filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <span>{visibleAppointments.length} appointment(s)</span>
      </div>

      {error && <p role="alert" className="admin-page__error">{error}</p>}

      {visibleAppointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div className="admin-page__list">
          {visibleAppointments.map((appointment) => (
            <article className="admin-appointment" key={appointment.id}>
              <div className="admin-appointment__top">
                <h2>{appointment.customer_name}</h2>
                <span className={`status status--${appointment.status}`}>
                  {appointment.status}
                </span>
              </div>

              <p><strong>Service:</strong> {appointment.service_id}</p>
              <p><strong>Date:</strong> {formatDate(appointment.starts_at)}</p>
              <p><strong>End:</strong> {formatDate(appointment.ends_at)}</p>
              <p><strong>Phone:</strong> {appointment.customer_phone}</p>
              <p><strong>Email:</strong> {appointment.customer_email}</p>
              <p><strong>Payment:</strong> {appointment.payment_status}</p>

              <div className="admin-appointment__actions">
                <button
                  type="button"
                  onClick={() => updateStatus(appointment.id, 'confirmed')}
                  disabled={
                    updatingId === appointment.id ||
                    appointment.status === 'confirmed' ||
                    appointment.status === 'cancelled'
                  }
                >
                  {updatingId === appointment.id ? 'Updating…' : 'Confirm'}
                </button>

                <button
                  type="button"
                  onClick={() => updateStatus(appointment.id, 'cancelled')}
                  disabled={
                    updatingId === appointment.id ||
                    appointment.status === 'cancelled' ||
                    appointment.status === 'confirmed'
                  }
                >
                  Cancel
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
