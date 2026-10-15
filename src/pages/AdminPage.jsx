
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminPage.css';

const PARIS = 'Europe/Paris';

function dateKey(value) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: PARIS,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(value));

  const part = (type) => parts.find((item) => item.type === type).value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

function dateFromKey(key) {
  return new Date(`${key}T12:00:00Z`);
}

function addDays(key, amount) {
  const date = dateFromKey(key);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

function startOfWeek(key) {
  const day = dateFromKey(key).getUTCDay();
  return addDays(key, -(day === 0 ? 6 : day - 1));
}

function formatDay(key, options = {}) {
  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: PARIS,
    ...options,
  }).format(dateFromKey(key));
}

function formatTime(value) {
  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: PARIS,
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

const statusLabels = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  cancelled: 'Annulé',
};

export default function AdminPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [period, setPeriod] = useState('week');
  const [section, setSection] = useState('planning');
  const [selectedDate, setSelectedDate] = useState(() => dateKey(new Date()));
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

      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('id, name, price_eur, duration_minutes');

      if (servicesError) {
        console.error('Impossible de charger les prestations:', servicesError);
      } else {
        setServices(servicesData ?? []);
      }
    } catch (err) {
      setError(err.message || 'Impossible de charger les rendez-vous.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

    function getServiceName(serviceId) {
    return services.find((service) => service.id === serviceId)?.name
      || serviceId
      || 'Prestation inconnue';
  }

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
      setError(err.message || 'Impossible de modifier le rendez-vous.');
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

  const filteredAppointments = appointments.filter((appointment) => (
    filter === 'all' || appointment.status === filter
  ));

  const selectedDayAppointments = filteredAppointments.filter(
    (appointment) => dateKey(appointment.starts_at) === selectedDate
  );

  const weekStart = startOfWeek(selectedDate);
  const weekKeys = Array.from(
    { length: 7 },
    (_, index) => addDays(weekStart, index)
  );

  const monthStart = selectedDate.slice(0, 7) + '-01';
  const monthOffset = (dateFromKey(monthStart).getUTCDay() + 6) % 7;
  const daysInMonth = new Date(
    Date.UTC(
      dateFromKey(monthStart).getUTCFullYear(),
      dateFromKey(monthStart).getUTCMonth() + 1,
      0
    )
  ).getUTCDate();

  const monthKeys = Array.from(
    { length: Math.ceil((monthOffset + daysInMonth) / 7) * 7 },
    (_, index) => addDays(monthStart, index - monthOffset)
  );

  function appointmentsForDay(key) {
    return filteredAppointments.filter(
      (appointment) => dateKey(appointment.starts_at) === key
    );
  }

  function movePeriod(direction) {
    if (period === 'day') {
      setSelectedDate(addDays(selectedDate, direction));
    } else if (period === 'week') {
      setSelectedDate(addDays(selectedDate, direction * 7));
    } else {
      const date = dateFromKey(selectedDate);
      date.setUTCDate(1);
      date.setUTCMonth(date.getUTCMonth() + direction);
      setSelectedDate(date.toISOString().slice(0, 10));
    }
  }

  function changePeriod(nextPeriod) {
    setPeriod(nextPeriod);
    setSection('planning');
  }

  function renderAppointment(appointment) {
    return (
      <article className="admin-appointment" key={appointment.id}>
        <div className="admin-appointment__top">
          <h3>{appointment.customer_name}</h3>
          <span className={`status status--${appointment.status}`}>
            {statusLabels[appointment.status] || appointment.status}
          </span>
        </div>

        <p><strong>Horaire :</strong> {formatTime(appointment.starts_at)} – {formatTime(appointment.ends_at)}</p>
        <p><strong>Prestation :</strong> {getServiceName(appointment.service_id)}</p>
        <p><strong>Téléphone :</strong> {appointment.customer_phone || '—'}</p>
        <p><strong>Email :</strong> {appointment.customer_email || '—'}</p>
        <p><strong>Paiement :</strong> {appointment.payment_status || '—'}</p>

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
            {updatingId === appointment.id ? 'Modification…' : 'Confirmer'}
          </button>

          <button
            type="button"
            onClick={() => updateStatus(appointment.id, 'cancelled')}
            disabled={
            updatingId === appointment.id ||
            appointment.status === 'cancelled'
            }
          >
            Annuler
          </button>
        </div>
      </article>
    );
  }

  const periodTitle = period === 'day'
    ? formatDay(selectedDate, { dateStyle: 'full' })
    : period === 'week'
      ? `${formatDay(weekKeys[0], { day: 'numeric', month: 'short' })} – ${formatDay(weekKeys[6], { day: 'numeric', month: 'short', year: 'numeric' })}`
      : formatDay(selectedDate.slice(0, 7) + '-15', {
          month: 'long',
          year: 'numeric',
        });

  return (
    <main className="admin-page">
      <div className="admin-dashboard">
        <section className="admin-dashboard__content">
          <header className="admin-page__header">
            <div>
              <p className="admin-eyebrow">ESPACE PROFESSIONNEL</p>
              <h1>{section === 'settings' ? 'Paramètres' : section === 'appointments' ? 'Rendez-vous' : 'Planning'}</h1>
              <p>Gérez votre activité et vos rendez-vous.</p>
            </div>

            <button
              type="button"
              onClick={loadAppointments}
              disabled={loading}
            >
              {loading ? 'Chargement…' : 'Actualiser'}
            </button>
          </header>

          {error && (
            <p role="alert" className="admin-page__error">{error}</p>
          )}

          {section === 'planning' && (
            <>
              <div className="admin-calendar__toolbar">
                <div className="admin-calendar__navigation">
                  <button type="button" onClick={() => movePeriod(-1)} aria-label="Période précédente">‹</button>
                  <button type="button" onClick={() => setSelectedDate(dateKey(new Date()))}>Aujourd’hui</button>
                  <button type="button" onClick={() => movePeriod(1)} aria-label="Période suivante">›</button>
                </div>

                <h2>{periodTitle}</h2>

                <div className="admin-calendar__views">
                  <button className={period === 'day' ? 'is-active' : ''} type="button" onClick={() => changePeriod('day')}>Jour</button>
                  <button className={period === 'week' ? 'is-active' : ''} type="button" onClick={() => changePeriod('week')}>Semaine</button>
                  <button className={period === 'month' ? 'is-active' : ''} type="button" onClick={() => changePeriod('month')}>Mois</button>
                </div>
              </div>

              <div className="admin-page__filters">
                <label htmlFor="appointment-filter">Statut</label>
                <select id="appointment-filter" value={filter} onChange={(event) => setFilter(event.target.value)}>
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmés</option>
                  <option value="cancelled">Annulés</option>
                </select>
                <span>{filteredAppointments.length} rendez-vous au total</span>
              </div>

              {loading ? (
                <p>Chargement du planning…</p>
              ) : period === 'day' ? (
                <div className="admin-calendar__day">
                  <h2>{formatDay(selectedDate, { dateStyle: 'full' })}</h2>
                  {selectedDayAppointments.length ? (
                    <div className="admin-page__list">
                      {selectedDayAppointments.map(renderAppointment)}
                    </div>
                  ) : (
                    <p className="admin-calendar__empty">Aucun rendez-vous pour cette journée.</p>
                  )}
                </div>
              ) : period === 'week' ? (
                <div className="admin-calendar__week">
                  {weekKeys.map((key) => {
                    const dayAppointments = appointmentsForDay(key);
                    return (
                      <section className={`admin-calendar__day-column ${key === dateKey(new Date()) ? 'is-today' : ''}`} key={key}>
                        <button className="admin-calendar__day-heading" type="button" onClick={() => { setSelectedDate(key); setPeriod('day'); }}>
                          <span>{formatDay(key, { weekday: 'short' })}</span>
                          <strong>{formatDay(key, { day: 'numeric' })}</strong>
                        </button>
                        {dayAppointments.length ? dayAppointments.map((appointment) => (
                          <button
                            type="button"
                            className={`admin-calendar__event status-border--${appointment.status}`}
                            key={appointment.id}
                            onClick={() => { setSelectedDate(key); setPeriod('day'); }}
                          >
                            <strong>{formatTime(appointment.starts_at)}</strong>
                            <span>{appointment.customer_name}</span>
                            <small>{getServiceName(appointment.service_id)}</small>
                          </button>
                        )) : (
                          <p className="admin-calendar__no-event">Libre</p>
                        )}
                      </section>
                    );
                  })}
                </div>
              ) : (
                <div className="admin-calendar__month">
                  <div className="admin-calendar__weekdays">
                    {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                      <span key={day}>{day}</span>
                    ))}
                  </div>
                  <div className="admin-calendar__month-grid">
                    {monthKeys.map((key) => {
                      const inMonth = key.slice(0, 7) === selectedDate.slice(0, 7);
                      const dayAppointments = appointmentsForDay(key);
                      return (
                        <button
                          type="button"
                          key={key}
                          className={`admin-calendar__month-cell ${inMonth ? '' : 'is-outside'} ${key === selectedDate ? 'is-selected' : ''} ${key === dateKey(new Date()) ? 'is-today' : ''}`}
                          onClick={() => { setSelectedDate(key); setPeriod('day'); }}
                        >
                          <strong>{formatDay(key, { day: 'numeric' })}</strong>
                          {dayAppointments.slice(0, 2).map((appointment) => (
                            <span className={`admin-calendar__month-event status-border--${appointment.status}`} key={appointment.id}>
                              {formatTime(appointment.starts_at)} {appointment.customer_name}
                            </span>
                          ))}
                          {dayAppointments.length > 2 && (
                            <small>+{dayAppointments.length - 2} autres</small>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {section === 'appointments' && (
            <>
              <div className="admin-page__filters">
                <label htmlFor="all-appointment-filter">Statut</label>
                <select id="all-appointment-filter" value={filter} onChange={(event) => setFilter(event.target.value)}>
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmés</option>
                  <option value="cancelled">Annulés</option>
                </select>
                <span>{filteredAppointments.length} rendez-vous</span>
              </div>
              {loading ? <p>Chargement…</p> : filteredAppointments.length ? (
                <div className="admin-page__list">
                  {filteredAppointments.map((appointment) => (
                    <div key={appointment.id}>
                   <p className="admin-appointment__date">
  {formatDay(dateKey(appointment.starts_at), { dateStyle: 'full' })}
</p>
                      {renderAppointment(appointment)}
                    </div>
                  ))}
                </div>
              ) : <p className="admin-calendar__empty">Aucun rendez-vous trouvé.</p>}
            </>
          )}

          {section === 'settings' && (
            <section className="admin-settings">
              <h2>Paramètres du planning</h2>
              <p>La configuration des horaires de travail et des disponibilités sera ajoutée dans la prochaine étape.</p>
              <p>Les rendez-vous actuels continuent d’être gérés depuis Supabase.</p>
            </section>
          )}
        </section>

        <aside className="admin-sidebar">
          <div className="admin-sidebar__brand">
            <span className="admin-sidebar__brand-name">ELNARA<span>.</span></span>
            <span>Espace professionnel</span>
          </div>

          <p className="admin-sidebar__label">GESTION</p>
          <nav className="admin-sidebar__nav" aria-label="Menu professionnel">
            <button type="button" className={section === 'planning' ? 'is-active' : ''} onClick={() => setSection('planning')}>
              <span aria-hidden="true">▦</span> Planning
            </button>
            <button type="button" className={section === 'appointments' ? 'is-active' : ''} onClick={() => setSection('appointments')}>
              <span aria-hidden="true">☷</span> Rendez-vous
            </button>
            <button type="button" className={section === 'settings' ? 'is-active' : ''} onClick={() => setSection('settings')}>
              <span aria-hidden="true">⚙</span> Paramètres
            </button>
          </nav>

          <div className="admin-sidebar__bottom">
            <div className="admin-sidebar__profile">
              <span className="admin-sidebar__avatar">E</span>
              <span><strong>ELNARA</strong><small>Professionnel</small></span>
            </div>
            <button type="button" className="admin-sidebar__logout" onClick={signOut}>Déconnexion ↗</button>
          </div>
        </aside>
      </div>
    </main>
  );
}
