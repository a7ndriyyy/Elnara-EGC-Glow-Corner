
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

function parisDateTimeToISO(value) {
  if (!value) {
    throw new Error('Veuillez renseigner la date et l’heure.');
  }

  const [datePart, timePart] = value.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);

  const target = Date.UTC(year, month - 1, day, hour, minute);
  let timestamp = target;

  for (let i = 0; i < 3; i += 1) {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: PARIS,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(new Date(timestamp));

    const values = Object.fromEntries(
      parts.map(({ type, value: partValue }) => [type, partValue])
    );

    const represented = Date.UTC(
      Number(values.year),
      Number(values.month) - 1,
      Number(values.day),
      Number(values.hour),
      Number(values.minute)
    );

    timestamp += target - represented;
  }

  const result = new Date(timestamp);

  const checkParts = new Intl.DateTimeFormat('en-GB', {
    timeZone: PARIS,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(result);

  const check = Object.fromEntries(
    checkParts.map(({ type, value: partValue }) => [type, partValue])
  );

  if (
    Number(check.year) !== year ||
    Number(check.month) !== month ||
    Number(check.day) !== day ||
    Number(check.hour) !== hour ||
    Number(check.minute) !== minute
  ) {
    throw new Error(
      "Cette heure n'existe pas à Paris en raison du changement d'heure."
    );
  }

  return result.toISOString();
}

function currentParisDateTimeLocal() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: PARIS,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  );

  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`;
}

const statusLabels = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  cancelled: 'Annulé',
  completed: 'Terminé',
};

const WEEKDAYS = [
  { weekday: 1, label: 'Lundi', short: 'Lun' },
  { weekday: 2, label: 'Mardi', short: 'Mar' },
  { weekday: 3, label: 'Mercredi', short: 'Mer' },
  { weekday: 4, label: 'Jeudi', short: 'Jeu' },
  { weekday: 5, label: 'Vendredi', short: 'Ven' },
  { weekday: 6, label: 'Samedi', short: 'Sam' },
  { weekday: 0, label: 'Dimanche', short: 'Dim' },
];

function defaultBusinessHours() {
  return WEEKDAYS.map(({ weekday, label }) => ({
    weekday,
    label,
    opens_at: '09:00',
    closes_at: '17:00',
    is_closed: false,
  }));
}

function weekdayForDate(key) {
  return dateFromKey(key).getUTCDay();
}

function localDateTime(date, time) {
  return `${date}T${time}`;
}

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

  const [businessHours, setBusinessHours] = useState(defaultBusinessHours);
  const [hoursLoading, setHoursLoading] = useState(false);
  const [hoursSaving, setHoursSaving] = useState(false);

  const [blockedPeriods, setBlockedPeriods] = useState([]);
  const [blocksLoading, setBlocksLoading] = useState(false);
  const [blockSaving, setBlockSaving] = useState(false);
  const [blockDeletingId, setBlockDeletingId] = useState(null);

  // single = one interval; selected = selected weekdays; all = every weekday
  const [blockMode, setBlockMode] = useState('single');
  const [blockDays, setBlockDays] = useState([1, 3, 5]);

  const [blockForm, setBlockForm] = useState(() => ({
    starts_at: currentParisDateTimeLocal(),
    ends_at: '',
    reason: '',
  }));

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

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

  const loadBusinessHours = useCallback(async () => {
    setHoursLoading(true);
    setError('');

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

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

      const { data, error: hoursError } = await supabase
        .from('business_hours')
        .select('weekday, opens_at, closes_at, is_closed');

      if (hoursError) throw hoursError;

      const savedHours = data ?? [];

      setBusinessHours(
        WEEKDAYS.map(({ weekday, label }) => {
          const saved = savedHours.find((item) => item.weekday === weekday);

          return {
            weekday,
            label,
            opens_at: saved?.opens_at?.slice(0, 5) || '09:00',
            closes_at: saved?.closes_at?.slice(0, 5) || '17:00',
            is_closed: saved?.is_closed ?? false,
          };
        })
      );
    } catch (err) {
      setError(err.message || 'Impossible de charger les horaires.');
    } finally {
      setHoursLoading(false);
    }
  }, [navigate]);

  const loadBlockedPeriods = useCallback(async () => {
    setBlocksLoading(true);

    try {
      const { data, error: blocksError } = await supabase
        .from('blocked_periods')
        .select('id, starts_at, ends_at, reason')
        .order('starts_at', { ascending: true });

      if (blocksError) throw blocksError;

      setBlockedPeriods(data ?? []);
    } catch (err) {
      setError(err.message || 'Impossible de charger les indisponibilités.');
    } finally {
      setBlocksLoading(false);
    }
  }, []);

  // Effects are declared after the callbacks they use.
  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  useEffect(() => {
    if (section === 'settings') {
      loadBusinessHours();
      loadBlockedPeriods();
    }
  }, [section, loadBusinessHours, loadBlockedPeriods]);

  function updateBusinessHour(weekday, field, value) {
    setBusinessHours((current) =>
      current.map((day) =>
        day.weekday === weekday ? { ...day, [field]: value } : day
      )
    );
  }

  async function saveBusinessHours() {
    setHoursSaving(true);
    setError('');

    try {
      for (const day of businessHours) {
        if (!day.is_closed && day.opens_at >= day.closes_at) {
          throw new Error(
            `Les horaires de ${day.label} sont invalides : la fermeture doit être après l'ouverture.`
          );
        }
      }

      for (const day of businessHours) {
        const { data, error: updateError } = await supabase
          .from('business_hours')
          .update({
            opens_at: day.opens_at,
            closes_at: day.closes_at,
            is_closed: day.is_closed,
          })
          .eq('weekday', day.weekday)
          .select('weekday');

        if (updateError) throw updateError;

        if (!data?.length) {
          throw new Error(`Aucun horaire trouvé pour ${day.label}.`);
        }
      }

      await loadBusinessHours();
    } catch (err) {
      setError(err.message || 'Impossible d’enregistrer les horaires.');
    } finally {
      setHoursSaving(false);
    }
  }

  function updateBlockForm(field, value) {
    setBlockForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function toggleBlockDay(weekday) {
    setBlockDays((current) =>
      current.includes(weekday)
        ? current.filter((day) => day !== weekday)
        : [...current, weekday]
    );
  }

  function getBlockCandidates() {
    const startValue = blockForm.starts_at;
    const endValue = blockForm.ends_at;

    if (!startValue || !endValue) {
      throw new Error('Veuillez renseigner le début et la fin.');
    }

    // One continuous interval on one specific date/time.
    if (blockMode === 'single') {
      const startsAt = parisDateTimeToISO(startValue);
      const endsAt = parisDateTimeToISO(endValue);

      if (new Date(endsAt) <= new Date(startsAt)) {
        throw new Error('La fin doit être après le début.');
      }

      return [{ starts_at: startsAt, ends_at: endsAt }];
    }

    // For recurring pauses, the dates define the inclusive date range.
    // The time in starts_at is the daily start time.
    // The time in ends_at is the daily end time.
    const startDate = startValue.slice(0, 10);
    const endDate = endValue.slice(0, 10);
    const startTime = startValue.slice(11, 16);
    const endTime = endValue.slice(11, 16);

    if (endDate < startDate) {
      throw new Error('La date de fin doit être après la date de début.');
    }

    if (endTime <= startTime) {
      throw new Error(
        'Pour une pause répétée, l’heure de fin doit être après l’heure de début le même jour.'
      );
    }

    const selectedWeekdays =
      blockMode === 'all'
        ? WEEKDAYS.map(({ weekday }) => weekday)
        : blockDays;

    if (selectedWeekdays.length === 0) {
      throw new Error('Veuillez sélectionner au moins un jour.');
    }

    const candidates = [];
    let currentDate = startDate;

    // A reasonable guard against accidentally generating thousands of rows.
    const lastAllowedDate = addDays(startDate, 366);

    if (endDate > lastAllowedDate) {
      throw new Error('La période ne peut pas dépasser 366 jours.');
    }

    while (currentDate <= endDate) {
      if (selectedWeekdays.includes(weekdayForDate(currentDate))) {
        const startsAt = parisDateTimeToISO(
          localDateTime(currentDate, startTime)
        );
        const endsAt = parisDateTimeToISO(
          localDateTime(currentDate, endTime)
        );

        candidates.push({
          starts_at: startsAt,
          ends_at: endsAt,
        });
      }

      currentDate = addDays(currentDate, 1);
    }

    if (candidates.length === 0) {
      throw new Error(
        'Aucune date ne correspond aux jours sélectionnés dans cette période.'
      );
    }

    return candidates;
  }

  async function createBlockedPeriod(event) {
    event.preventDefault();
    setBlockSaving(true);
    setError('');

    try {
      const candidates = getBlockCandidates();
      const now = Date.now();

      if (candidates.some((item) => new Date(item.starts_at).getTime() <= now)) {
        throw new Error(
          'Toutes les périodes bloquées doivent commencer dans le futur.'
        );
      }

      const earliestStart = candidates.reduce(
        (earliest, item) =>
          item.starts_at < earliest ? item.starts_at : earliest,
        candidates[0].starts_at
      );

      const latestEnd = candidates.reduce(
        (latest, item) =>
          item.ends_at > latest ? item.ends_at : latest,
        candidates[0].ends_at
      );

      // Fetch active appointments across the candidate range, then check
      // each candidate interval. No block is inserted if any conflict exists.
      const { data: activeAppointments, error: overlapError } = await supabase
        .from('appointments')
        .select('id, customer_name, starts_at, ends_at, status')
        .in('status', ['pending', 'confirmed'])
        .lt('starts_at', latestEnd)
        .gt('ends_at', earliestStart);

      if (overlapError) throw overlapError;

      const conflicts = [];

      for (const candidate of candidates) {
        const candidateStart = new Date(candidate.starts_at).getTime();
        const candidateEnd = new Date(candidate.ends_at).getTime();

        const overlapping = (activeAppointments ?? []).filter((appointment) => {
          const appointmentStart = new Date(appointment.starts_at).getTime();
          const appointmentEnd = new Date(appointment.ends_at).getTime();

          return (
            appointmentStart < candidateEnd &&
            appointmentEnd > candidateStart
          );
        });

        for (const appointment of overlapping) {
          conflicts.push({
            date: dateKey(candidate.starts_at),
            name: appointment.customer_name,
          });
        }
      }

      if (conflicts.length) {
        const uniqueConflicts = [
          ...new Map(
            conflicts.map((item) => [
              `${item.date}-${item.name}`,
              item,
            ])
          ).values(),
        ];

        const preview = uniqueConflicts
          .slice(0, 5)
          .map(
            (item) =>
              `${formatDay(item.date, {
                day: 'numeric',
                month: 'short',
              })}${item.name ? ` (${item.name})` : ''}`
          )
          .join(', ');

        throw new Error(
          `Aucun blocage n’a été créé : un ou plusieurs rendez-vous actifs se trouvent sur cette période. Conflits : ${preview}${uniqueConflicts.length > 5 ? ', …' : ''}.`
        );
      }

      const rows = candidates.map((candidate) => ({
        ...candidate,
        reason: blockForm.reason.trim() || null,
      }));

      const { error: insertError } = await supabase
        .from('blocked_periods')
        .insert(rows);

      if (insertError) throw insertError;

      setBlockForm({
        starts_at: currentParisDateTimeLocal(),
        ends_at: '',
        reason: '',
      });

      await loadBlockedPeriods();
    } catch (err) {
      setError(err.message || 'Impossible de créer cette indisponibilité.');
    } finally {
      setBlockSaving(false);
    }
  }

  async function deleteBlockedPeriod(id) {
    const confirmed = window.confirm(
      'Supprimer cette indisponibilité ? Les clients pourront de nouveau demander un rendez-vous sur cette période.'
    );

    if (!confirmed) return;

    setBlockDeletingId(id);
    setError('');

    try {
      const { error: deleteError } = await supabase
        .from('blocked_periods')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await loadBlockedPeriods();
    } catch (err) {
      setError(err.message || 'Impossible de supprimer cette indisponibilité.');
    } finally {
      setBlockDeletingId(null);
    }
  }

  function getServiceName(serviceId) {
    return (
      services.find((service) => service.id === serviceId)?.name ||
      serviceId ||
      'Prestation inconnue'
    );
  }

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

  const filteredAppointments = appointments.filter(
    (appointment) => filter === 'all' || appointment.status === filter
  );

  const selectedDayAppointments = filteredAppointments.filter(
    (appointment) => dateKey(appointment.starts_at) === selectedDate
  );

  const weekStart = startOfWeek(selectedDate);
  const weekKeys = Array.from({ length: 7 }, (_, index) =>
    addDays(weekStart, index)
  );

  const monthStart = `${selectedDate.slice(0, 7)}-01`;
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

        <p>
          <strong>Horaire :</strong> {formatTime(appointment.starts_at)} –{' '}
          {formatTime(appointment.ends_at)}
        </p>
        <p>
          <strong>Prestation :</strong> {getServiceName(appointment.service_id)}
        </p>
        <p>
          <strong>Téléphone :</strong> {appointment.customer_phone || '—'}
        </p>
        <p>
          <strong>Email :</strong> {appointment.customer_email || '—'}
        </p>
        <p>
          <strong>Paiement :</strong> {appointment.payment_status || '—'}
        </p>

        <div className="admin-appointment__actions">
          <button
            type="button"
            onClick={() => updateStatus(appointment.id, 'confirmed')}
            disabled={
              updatingId === appointment.id ||
              appointment.status === 'confirmed' ||
              appointment.status === 'cancelled' ||
              appointment.status === 'completed'
            }
          >
            {updatingId === appointment.id ? 'Modification…' : 'Confirmer'}
          </button>

          <button
            type="button"
            onClick={() => updateStatus(appointment.id, 'cancelled')}
            disabled={
              updatingId === appointment.id ||
              appointment.status === 'cancelled' ||
              appointment.status === 'completed'
            }
          >
            Annuler
          </button>
        </div>
      </article>
    );
  }

  const periodTitle =
    period === 'day'
      ? formatDay(selectedDate, { dateStyle: 'full' })
      : period === 'week'
        ? `${formatDay(weekKeys[0], {
            day: 'numeric',
            month: 'short',
          })} – ${formatDay(weekKeys[6], {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}`
        : formatDay(`${selectedDate.slice(0, 7)}-15`, {
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
              <h1>
                {section === 'settings'
                  ? 'Paramètres'
                  : section === 'appointments'
                    ? 'Rendez-vous'
                    : 'Planning'}
              </h1>
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
            <p role="alert" className="admin-page__error">
              {error}
            </p>
          )}

          {section === 'planning' && (
            <>
              <div className="admin-calendar__toolbar">
                <div className="admin-calendar__navigation">
                  <button
                    type="button"
                    onClick={() => movePeriod(-1)}
                    aria-label="Période précédente"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDate(dateKey(new Date()))}
                  >
                    Aujourd’hui
                  </button>
                  <button
                    type="button"
                    onClick={() => movePeriod(1)}
                    aria-label="Période suivante"
                  >
                    ›
                  </button>
                </div>

                <h2>{periodTitle}</h2>

                <div className="admin-calendar__views">
                  <button
                    className={period === 'day' ? 'is-active' : ''}
                    type="button"
                    onClick={() => changePeriod('day')}
                  >
                    Jour
                  </button>
                  <button
                    className={period === 'week' ? 'is-active' : ''}
                    type="button"
                    onClick={() => changePeriod('week')}
                  >
                    Semaine
                  </button>
                  <button
                    className={period === 'month' ? 'is-active' : ''}
                    type="button"
                    onClick={() => changePeriod('month')}
                  >
                    Mois
                  </button>
                </div>
              </div>

              <div className="admin-page__filters">
                <label htmlFor="appointment-filter">Statut</label>
                <select
                  id="appointment-filter"
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmés</option>
                  <option value="cancelled">Annulés</option>
                  <option value="completed">Terminés</option>
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
                    <p className="admin-calendar__empty">
                      Aucun rendez-vous pour cette journée.
                    </p>
                  )}
                </div>
              ) : period === 'week' ? (
                <div className="admin-calendar__week">
                  {weekKeys.map((key) => {
                    const dayAppointments = appointmentsForDay(key);

                    return (
                      <section
                        className={`admin-calendar__day-column ${
                          key === dateKey(new Date()) ? 'is-today' : ''
                        }`}
                        key={key}
                      >
                        <button
                          className="admin-calendar__day-heading"
                          type="button"
                          onClick={() => {
                            setSelectedDate(key);
                            setPeriod('day');
                          }}
                        >
                          <span>{formatDay(key, { weekday: 'short' })}</span>
                          <strong>{formatDay(key, { day: 'numeric' })}</strong>
                        </button>

                        {dayAppointments.length ? (
                          dayAppointments.map((appointment) => (
                            <button
                              type="button"
                              className={`admin-calendar__event status-border--${appointment.status}`}
                              key={appointment.id}
                              onClick={() => {
                                setSelectedDate(key);
                                setPeriod('day');
                              }}
                            >
                              <strong>{formatTime(appointment.starts_at)}</strong>
                              <span>{appointment.customer_name}</span>
                              <small>
                                {getServiceName(appointment.service_id)}
                              </small>
                            </button>
                          ))
                        ) : (
                          <p className="admin-calendar__no-event">Libre</p>
                        )}
                      </section>
                    );
                  })}
                </div>
              ) : (
                <div className="admin-calendar__month">
                  <div className="admin-calendar__weekdays">
                    {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(
                      (day) => (
                        <span key={day}>{day}</span>
                      )
                    )}
                  </div>

                  <div className="admin-calendar__month-grid">
                    {monthKeys.map((key) => {
                      const inMonth =
                        key.slice(0, 7) === selectedDate.slice(0, 7);
                      const dayAppointments = appointmentsForDay(key);

                      return (
                        <button
                          type="button"
                          key={key}
                          className={`admin-calendar__month-cell ${
                            inMonth ? '' : 'is-outside'
                          } ${key === selectedDate ? 'is-selected' : ''} ${
                            key === dateKey(new Date()) ? 'is-today' : ''
                          }`}
                          onClick={() => {
                            setSelectedDate(key);
                            setPeriod('day');
                          }}
                        >
                          <strong>{formatDay(key, { day: 'numeric' })}</strong>

                          {dayAppointments.slice(0, 2).map((appointment) => (
                            <span
                              className={`admin-calendar__month-event status-border--${appointment.status}`}
                              key={appointment.id}
                            >
                              {formatTime(appointment.starts_at)}{' '}
                              {appointment.customer_name}
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
                <select
                  id="all-appointment-filter"
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmés</option>
                  <option value="cancelled">Annulés</option>
                  <option value="completed">Terminés</option>
                </select>
                <span>{filteredAppointments.length} rendez-vous</span>
              </div>

              {loading ? (
                <p>Chargement…</p>
              ) : filteredAppointments.length ? (
                <div className="admin-page__list">
                  {filteredAppointments.map((appointment) => (
                    <div key={appointment.id}>
                      <p className="admin-appointment__date">
                        {formatDay(dateKey(appointment.starts_at), {
                          dateStyle: 'full',
                        })}
                      </p>
                      {renderAppointment(appointment)}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="admin-calendar__empty">
                  Aucun rendez-vous trouvé.
                </p>
              )}
            </>
          )}

          {section === 'settings' && (
            <section className="admin-settings">
              <h2>Horaires de travail</h2>
              <p>
                Configurez les jours et les heures pendant lesquels les clients
                peuvent demander un rendez-vous.
              </p>

              {hoursLoading ? (
                <p>Chargement des horaires…</p>
              ) : (
                <>
                  <div className="business-hours-list">
                    {businessHours.map((day) => (
                      <div className="business-hours-row" key={day.weekday}>
                        <div className="business-hours-day">
                          <strong>{day.label}</strong>

                          <label>
                            <input
                              type="checkbox"
                              checked={!day.is_closed}
                              onChange={(event) =>
                                updateBusinessHour(
                                  day.weekday,
                                  'is_closed',
                                  !event.target.checked
                                )
                              }
                            />
                            Jour travaillé
                          </label>
                        </div>

                        {day.is_closed ? (
                          <span className="business-hours-closed">Fermé</span>
                        ) : (
                          <div className="business-hours-times">
                            <label>
                              Ouverture
                              <input
                                type="time"
                                value={day.opens_at}
                                onChange={(event) =>
                                  updateBusinessHour(
                                    day.weekday,
                                    'opens_at',
                                    event.target.value
                                  )
                                }
                              />
                            </label>

                            <label>
                              Fermeture
                              <input
                                type="time"
                                value={day.closes_at}
                                onChange={(event) =>
                                  updateBusinessHour(
                                    day.weekday,
                                    'closes_at',
                                    event.target.value
                                  )
                                }
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={saveBusinessHours}
                    disabled={hoursSaving || hoursLoading}
                  >
                    {hoursSaving
                      ? 'Enregistrement…'
                      : 'Enregistrer les horaires'}
                  </button>
                </>
              )}

              <div className="admin-settings__blocks">
                <h2>Pauses et indisponibilités</h2>
                <p>
                  Bloquez une pause ponctuelle ou répétez-la sur plusieurs jours.
                  Les créneaux concernés ne seront plus proposés aux clients.
                </p>

                <div className="blocked-period-mode">
                  <span>Type d’indisponibilité</span>

                  <div className="blocked-period-mode__options">
                    <button
                      type="button"
                      className={blockMode === 'single' ? 'is-active' : ''}
                      onClick={() => setBlockMode('single')}
                      aria-pressed={blockMode === 'single'}
                    >
                      Une seule période
                    </button>

                    <button
                      type="button"
                      className={blockMode === 'selected' ? 'is-active' : ''}
                      onClick={() => setBlockMode('selected')}
                      aria-pressed={blockMode === 'selected'}
                    >
                      Jours sélectionnés
                    </button>

                    <button
                      type="button"
                      className={blockMode === 'all' ? 'is-active' : ''}
                      onClick={() => setBlockMode('all')}
                      aria-pressed={blockMode === 'all'}
                    >
                      Tous les jours
                    </button>
                  </div>
                </div>

                <form
                  className="blocked-period-form"
                  onSubmit={createBlockedPeriod}
                >
                  {blockMode === 'single' ? (
                    <>
                      <label>
                        Début
                        <input
                          type="datetime-local"
                          required
                          value={blockForm.starts_at}
                          onChange={(event) =>
                            updateBlockForm('starts_at', event.target.value)
                          }
                        />
                      </label>

                      <label>
                        Fin
                        <input
                          type="datetime-local"
                          required
                          min={blockForm.starts_at}
                          value={blockForm.ends_at}
                          onChange={(event) =>
                            updateBlockForm('ends_at', event.target.value)
                          }
                        />
                      </label>
                    </>
                  ) : (
                    <>
                      <label>
                        Date de début
                        <input
                          type="date"
                          required
                          value={blockForm.starts_at.slice(0, 10)}
                          onChange={(event) => {
                            const date = event.target.value;
                            if (!date) return;

                            updateBlockForm(
                              'starts_at',
                              `${date}T${blockForm.starts_at.slice(11, 16)}`
                            );
                          }}
                        />
                      </label>

                      <label>
                        Date de fin incluse
                        <input
                          type="date"
                          required
                          min={blockForm.starts_at.slice(0, 10)}
                          value={blockForm.ends_at.slice(0, 10)}
                          onChange={(event) => {
                            const date = event.target.value;
                            if (!date) return;

                            updateBlockForm(
                              'ends_at',
                              `${date}T${blockForm.ends_at.slice(11, 16)}`
                            );
                          }}
                        />
                      </label>

                      <label>
                        Heure de début
                        <input
                          type="time"
                          required
                          value={blockForm.starts_at.slice(11, 16)}
                          onChange={(event) =>
                            updateBlockForm(
                              'starts_at',
                              `${blockForm.starts_at.slice(0, 10)}T${event.target.value}`
                            )
                          }
                        />
                      </label>

                      <label>
                        Heure de fin
                        <input
                          type="time"
                          required
                          value={blockForm.ends_at.slice(11, 16)}
                          onChange={(event) =>
                            updateBlockForm(
                              'ends_at',
                              `${blockForm.ends_at.slice(0, 10)}T${event.target.value}`
                            )
                          }
                        />
                      </label>
                    </>
                  )}

                  {blockMode === 'selected' && (
                    <fieldset className="blocked-period-days">
                      <legend>Appliquer aux jours suivants</legend>

                      <div className="blocked-period-days__options">
                        {WEEKDAYS.map((day) => (
                          <label key={day.weekday}>
                            <input
                              type="checkbox"
                              checked={blockDays.includes(day.weekday)}
                              onChange={() => toggleBlockDay(day.weekday)}
                            />
                            {day.label}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  )}

                  {blockMode === 'all' && (
                    <p className="blocked-period-help">
                      La pause sera appliquée chaque jour de la période, du
                      lundi au dimanche.
                    </p>
                  )}

                  <label>
                    Motif (facultatif)
                    <input
                      type="text"
                      maxLength={200}
                      placeholder="Pause déjeuner, absence…"
                      value={blockForm.reason}
                      onChange={(event) =>
                        updateBlockForm('reason', event.target.value)
                      }
                    />
                  </label>

                  <button type="submit" disabled={blockSaving}>
                    {blockSaving
                      ? 'Vérification et enregistrement…'
                      : blockMode === 'single'
                        ? 'Bloquer cette période'
                        : 'Créer les indisponibilités'}
                  </button>
                </form>

                <h3>Indisponibilités enregistrées</h3>

                {blocksLoading ? (
                  <p>Chargement des indisponibilités…</p>
                ) : blockedPeriods.length === 0 ? (
                  <p className="admin-calendar__empty">
                    Aucune indisponibilité enregistrée.
                  </p>
                ) : (
                  <div className="blocked-period-list">
                    {blockedPeriods.map((block) => (
                      <article className="blocked-period-item" key={block.id}>
                        <div>
                          <strong>
                            {formatDay(dateKey(block.starts_at), {
                              dateStyle: 'medium',
                            })}
                          </strong>
                          <p>
                            {formatTime(block.starts_at)} –{' '}
                            {formatTime(block.ends_at)}
                          </p>
                          {block.reason && <p>{block.reason}</p>}
                        </div>

                        <button
                          type="button"
                          onClick={() => deleteBlockedPeriod(block.id)}
                          disabled={blockDeletingId === block.id}
                        >
                          {blockDeletingId === block.id
                            ? 'Suppression…'
                            : 'Supprimer'}
                        </button>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </section>

        <aside className="admin-sidebar">
          <div className="admin-sidebar__brand">
            <span className="admin-sidebar__brand-name">
              ELNARA<span>.</span>
            </span>
            <span>Espace professionnel</span>
          </div>

          <p className="admin-sidebar__label">GESTION</p>

          <nav className="admin-sidebar__nav" aria-label="Menu professionnel">
            <button
              type="button"
              className={section === 'planning' ? 'is-active' : ''}
              onClick={() => setSection('planning')}
            >
              <span aria-hidden="true">▦</span> Planning
            </button>

            <button
              type="button"
              className={section === 'appointments' ? 'is-active' : ''}
              onClick={() => setSection('appointments')}
            >
              <span aria-hidden="true">☷</span> Rendez-vous
            </button>

            <button
              type="button"
              className={section === 'settings' ? 'is-active' : ''}
              onClick={() => setSection('settings')}
            >
              <span aria-hidden="true">⚙</span> Paramètres
            </button>
          </nav>

          <div className="admin-sidebar__bottom">
            <div className="admin-sidebar__profile">
              <span className="admin-sidebar__avatar">E</span>
              <span>
                <strong>ELNARA</strong>
                <small>Professionnel</small>
              </span>
            </div>

            <button
              type="button"
              className="admin-sidebar__logout"
              onClick={signOut}
            >
              Déconnexion ↗
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
