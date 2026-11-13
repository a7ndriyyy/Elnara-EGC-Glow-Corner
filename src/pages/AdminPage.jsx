
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiSettings, FiTag } from 'react-icons/fi';
import { supabase } from '../lib/supabase';
import './AdminPage.css';
import AdminPromotions from './AdminPromotions';
import { useLanguage } from '../i18n/LanguageContext';
import { fill } from '../utils/format';

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

function formatDay(key, options = {}, locale = 'fr-FR') {
  return new Intl.DateTimeFormat(locale, {
    timeZone: PARIS,
    ...options,
  }).format(dateFromKey(key));
}

function formatTime(value, locale = 'fr-FR') {
  return new Intl.DateTimeFormat(locale, {
    timeZone: PARIS,
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function parisDateTimeToISO(value) {
  if (!value) {
    throw new Error('admin:dateTimeRequired');
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
    throw new Error('admin:dstGap');
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
  const { t } = useLanguage();
  // Admin texts follow the site language (src/i18n/admin.js).
  const ta = useCallback((key, vars) => fill(t(`admin.${key}`), vars || {}), [t]);
  const locale = ta('locale');
  const fmtDay = (key, options = {}) => formatDay(key, options, locale);
  const fmtTime = (value) => formatTime(value, locale);
  const weekdayName = useCallback((weekday) => ta(`weekdays.${weekday}`), [ta]);
  const errText = useCallback((err, fallbackKey) => {
    const message = err?.message || '';
    if (message.startsWith('admin:')) {
      const [code, weekday] = message.slice(6).split('|');
      return ta(`err.${code}`, weekday !== undefined ? { day: weekdayName(weekday) } : {});
    }
    return message || ta(`err.${fallbackKey}`);
  }, [ta, weekdayName]);
  const statusLabel = (status) => {
    const label = t(`admin.status.${status}`);
    return label.startsWith('admin.') ? status : label;
  };
  const paymentLabel = (value) => {
    if (!value) return '—';
    const label = t(`admin.paymentStatus.${value}`);
    return label.startsWith('admin.') ? value : label;
  };

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

  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [rescheduleStart, setRescheduleStart] = useState('');
  const [rescheduleLink, setRescheduleLink] = useState('');
  const [rescheduleBusy, setRescheduleBusy] = useState(false);
  const [rescheduleError, setRescheduleError] = useState('');

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

      // No session at all is the normal logged-out case: go to the login page.
      if (userError && userError.name !== 'AuthSessionMissingError') throw userError;

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
      setError(errText(err, 'loadAppointments'));
    } finally {
      setLoading(false);
    }
  }, [navigate, errText]);

  const loadBusinessHours = useCallback(async () => {
    setHoursLoading(true);
    setError('');

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      // No session at all is the normal logged-out case: go to the login page.
      if (userError && userError.name !== 'AuthSessionMissingError') throw userError;

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
      setError(errText(err, 'loadHours'));
    } finally {
      setHoursLoading(false);
    }
  }, [navigate, errText]);

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
      setError(errText(err, 'loadBlocks'));
    } finally {
      setBlocksLoading(false);
    }
  }, [errText]);

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
          throw new Error(`admin:invalidHours|${day.weekday}`);
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
          throw new Error(`admin:hoursNotFound|${day.weekday}`);
        }
      }

      await loadBusinessHours();
    } catch (err) {
      setError(errText(err, 'saveHours'));
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
      throw new Error('admin:startEndRequired');
    }

    // One continuous interval on one specific date/time.
    if (blockMode === 'single') {
      const startsAt = parisDateTimeToISO(startValue);
      const endsAt = parisDateTimeToISO(endValue);

      if (new Date(endsAt) <= new Date(startsAt)) {
        throw new Error('admin:endAfterStart');
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
      throw new Error('admin:endDateAfterStart');
    }

    if (endTime <= startTime) {
      throw new Error('admin:endTimeAfterStart');
    }

    const selectedWeekdays =
      blockMode === 'all'
        ? WEEKDAYS.map(({ weekday }) => weekday)
        : blockDays;

    if (selectedWeekdays.length === 0) {
      throw new Error('admin:selectDay');
    }

    const candidates = [];
    let currentDate = startDate;

    // A reasonable guard against accidentally generating thousands of rows.
    const lastAllowedDate = addDays(startDate, 366);

    if (endDate > lastAllowedDate) {
      throw new Error('admin:maxRange');
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
      throw new Error('admin:noMatchingDates');
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
        throw new Error('admin:mustBeFuture');
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
              `${fmtDay(item.date, {
                day: 'numeric',
                month: 'short',
              })}${item.name ? ` (${item.name})` : ''}`
          )
          .join(', ');

        throw new Error(
          ta('err.blockConflicts', { list: `${preview}${uniqueConflicts.length > 5 ? ', …' : ''}` })
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
      setError(errText(err, 'createBlock'));
    } finally {
      setBlockSaving(false);
    }
  }

  async function deleteBlockedPeriod(id) {
    const confirmed = window.confirm(
      ta('confirmDeleteBlock')
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
      setError(errText(err, 'deleteBlock'));
    } finally {
      setBlockDeletingId(null);
    }
  }

  function getServiceName(serviceId) {
    return (
      services.find((service) => service.id === serviceId)?.name ||
      serviceId ||
      ta('unknownService')
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
      setError(errText(err, 'updateAppointment'));
    } finally {
      setUpdatingId(null);
    }
  }

  function openReschedule(appointment) {
    setRescheduleTarget(appointment);
    setRescheduleStart(`${addDays(dateKey(new Date()), 1)}T10:00`);
    setRescheduleLink('');
    setRescheduleError('');
  }

  async function createRescheduleProposal(event) {
    event.preventDefault();
    if (!rescheduleTarget || !rescheduleStart) return;

    setRescheduleBusy(true);
    setRescheduleError('');

    try {
      const bytes = new Uint8Array(32);
      window.crypto.getRandomValues(bytes);
      const token = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
      const digest = await window.crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(token)
      );
      const tokenHash = Array.from(new Uint8Array(digest), (byte) =>
        byte.toString(16).padStart(2, '0')
      ).join('');

      const proposedStartsAt = parisDateTimeToISO(rescheduleStart);
      const { data, error: proposalError } = await supabase.rpc(
        'create_reschedule_proposal',
        {
          p_appointment_id: rescheduleTarget.id,
          p_proposed_starts_at: proposedStartsAt,
          p_token_hash: tokenHash,
        }
      );

      if (proposalError) throw proposalError;
      if (!data || !data.length) {
        throw new Error('admin:proposalFailed');
      }

      setRescheduleLink(`${window.location.origin}/#/reschedule?token=${token}`);
      await loadAppointments();
    } catch (err) {
      setRescheduleError(errText(err, 'proposeFailed'));
    } finally {
      setRescheduleBusy(false);
    }
  }

  async function copyRescheduleLink() {
    if (!rescheduleLink) return;
    try {
      await navigator.clipboard.writeText(rescheduleLink);
    } catch {
      setRescheduleError(ta('err.copyFailed'));
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
            {statusLabel(appointment.status)}
          </span>
        </div>

        <p>
          <strong>{ta('time')}:</strong> {fmtTime(appointment.starts_at)} –{' '}
          {fmtTime(appointment.ends_at)}
        </p>
        <p>
          <strong>{ta('service')}:</strong> {getServiceName(appointment.service_id)}
        </p>
        <p>
          <strong>{ta('phone')}:</strong> {appointment.customer_phone || '—'}
        </p>
        <p>
          <strong>{ta('email')}:</strong> {appointment.customer_email || '—'}
        </p>
        <p>
          <strong>{ta('payment')}:</strong> {paymentLabel(appointment.payment_status)}
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
            {updatingId === appointment.id ? ta('updating') : ta('confirm')}
          </button>

          {['pending', 'confirmed'].includes(appointment.status) && (
            <button
              type="button"
              onClick={() => openReschedule(appointment)}
              disabled={updatingId === appointment.id}
            >
              {ta('proposeOther')}
            </button>
          )}

          <button
            type="button"
            onClick={() => updateStatus(appointment.id, 'cancelled')}
            disabled={
              updatingId === appointment.id ||
              appointment.status === 'cancelled' ||
              appointment.status === 'completed'
            }
          >
            {ta('cancel')}
          </button>
        </div>
      </article>
    );
  }

  const periodTitle =
    period === 'day'
      ? fmtDay(selectedDate, { dateStyle: 'full' })
      : period === 'week'
        ? `${fmtDay(weekKeys[0], {
            day: 'numeric',
            month: 'short',
          })} – ${fmtDay(weekKeys[6], {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}`
        : fmtDay(`${selectedDate.slice(0, 7)}-15`, {
            month: 'long',
            year: 'numeric',
          });

  return (
    <main className="admin-page">
      <div className="admin-dashboard">
        <section className="admin-dashboard__content">
          <header className="admin-page__header">
            <div>
              <p className="admin-eyebrow">{ta('eyebrow')}</p>
              <h1>
                {ta(section === 'settings' ? 'settings' : section === 'promotions' ? 'promotions' : section === 'appointments' ? 'appointments' : 'planning')}
              </h1>
              <p>{ta('subtitle')}</p>
            </div>

            <button
              type="button"
              onClick={loadAppointments}
              disabled={loading}
            >
              {loading ? ta('loading') : ta('refresh')}
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
                    aria-label={ta('prevPeriod')}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDate(dateKey(new Date()))}
                  >
                    {ta('today')}
                  </button>
                  <button
                    type="button"
                    onClick={() => movePeriod(1)}
                    aria-label={ta('nextPeriod')}
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
                    {ta('day')}
                  </button>
                  <button
                    className={period === 'week' ? 'is-active' : ''}
                    type="button"
                    onClick={() => changePeriod('week')}
                  >
                    {ta('week')}
                  </button>
                  <button
                    className={period === 'month' ? 'is-active' : ''}
                    type="button"
                    onClick={() => changePeriod('month')}
                  >
                    {ta('month')}
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
                  <option value="all">{ta('filter.all')}</option>
                  <option value="pending">{ta('filter.pending')}</option>
                  <option value="confirmed">{ta('filter.confirmed')}</option>
                  <option value="cancelled">{ta('filter.cancelled')}</option>
                  <option value="completed">{ta('filter.completed')}</option>
                </select>
                <span>{ta('appointmentsTotal', { n: filteredAppointments.length })}</span>
              </div>

              {loading ? (
                <p>{ta('loadingPlanning')}</p>
              ) : period === 'day' ? (
                <div className="admin-calendar__day">
                  <h2>{fmtDay(selectedDate, { dateStyle: 'full' })}</h2>
                  {selectedDayAppointments.length ? (
                    <div className="admin-page__list">
                      {selectedDayAppointments.map(renderAppointment)}
                    </div>
                  ) : (
                    <p className="admin-calendar__empty">
                      {ta('noAppointmentsDay')}
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
                          <span>{fmtDay(key, { weekday: 'short' })}</span>
                          <strong>{fmtDay(key, { day: 'numeric' })}</strong>
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
                              <strong>{fmtTime(appointment.starts_at)}</strong>
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
                    {t('admin.weekdaysShort').map(
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
                          <strong>{fmtDay(key, { day: 'numeric' })}</strong>

                          {dayAppointments.slice(0, 2).map((appointment) => (
                            <span
                              className={`admin-calendar__month-event status-border--${appointment.status}`}
                              key={appointment.id}
                            >
                              {fmtTime(appointment.starts_at)}{' '}
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
                  <option value="all">{ta('filter.all')}</option>
                  <option value="pending">{ta('filter.pending')}</option>
                  <option value="confirmed">{ta('filter.confirmed')}</option>
                  <option value="cancelled">{ta('filter.cancelled')}</option>
                  <option value="completed">{ta('filter.completed')}</option>
                </select>
                <span>{ta('appointmentsCount', { n: filteredAppointments.length })}</span>
              </div>

              {loading ? (
                <p>{ta('loading')}</p>
              ) : filteredAppointments.length ? (
                <div className="admin-page__list">
                  {filteredAppointments.map((appointment) => (
                    <div key={appointment.id}>
                      <p className="admin-appointment__date">
                        {fmtDay(dateKey(appointment.starts_at), {
                          dateStyle: 'full',
                        })}
                      </p>
                      {renderAppointment(appointment)}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="admin-calendar__empty">
                  {ta('noAppointmentsFound')}
                </p>
              )}
            </>
          )}

          {section === 'settings' && (
            <section className="admin-settings">
              <h2>{ta('hoursTitle')}</h2>
              <p>{ta('hoursIntro')}</p>

              {hoursLoading ? (
                <p>{ta('loadingHours')}</p>
              ) : (
                <>
                  <div className="business-hours-list">
                    {businessHours.map((day) => (
                      <div className="business-hours-row" key={day.weekday}>
                        <div className="business-hours-day">
                          <strong>{weekdayName(day.weekday)}</strong>

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
                            {ta('workingDay')}
                          </label>
                        </div>

                        {day.is_closed ? (
                          <span className="business-hours-closed">{ta('closed')}</span>
                        ) : (
                          <div className="business-hours-times">
                            <label>
                              {ta('opens')}
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
                              {ta('closes')}
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
                      ? ta('saving')
                      : ta('saveHours')}
                  </button>
                </>
              )}

              <div className="admin-settings__blocks">
                <h2>{ta('blocksTitle')}</h2>
                <p>{ta('blocksIntro')}</p>

                <div className="blocked-period-mode">
                  <span>{ta('blockType')}</span>

                  <div className="blocked-period-mode__options">
                    <button
                      type="button"
                      className={blockMode === 'single' ? 'is-active' : ''}
                      onClick={() => setBlockMode('single')}
                      aria-pressed={blockMode === 'single'}
                    >
                      {ta('modeSingle')}
                    </button>

                    <button
                      type="button"
                      className={blockMode === 'selected' ? 'is-active' : ''}
                      onClick={() => setBlockMode('selected')}
                      aria-pressed={blockMode === 'selected'}
                    >
                      {ta('modeSelected')}
                    </button>

                    <button
                      type="button"
                      className={blockMode === 'all' ? 'is-active' : ''}
                      onClick={() => setBlockMode('all')}
                      aria-pressed={blockMode === 'all'}
                    >
                      {ta('modeAll')}
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
                        {ta('start')}
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
                        {ta('end')}
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
                        {ta('startDate')}
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
                        {ta('endDateIncl')}
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
                        {ta('startTime')}
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
                        {ta('endTime')}
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
                      <legend>{ta('applyDays')}</legend>

                      <div className="blocked-period-days__options">
                        {WEEKDAYS.map((day) => (
                          <label key={day.weekday}>
                            <input
                              type="checkbox"
                              checked={blockDays.includes(day.weekday)}
                              onChange={() => toggleBlockDay(day.weekday)}
                            />
                            {weekdayName(day.weekday)}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  )}

                  {blockMode === 'all' && (
                    <p className="blocked-period-help">
                      {ta('allDaysHelp')}
                    </p>
                  )}

                  <label>
                    {ta('reason')}
                    <input
                      type="text"
                      maxLength={200}
                      placeholder={ta('reasonPlaceholder')}
                      value={blockForm.reason}
                      onChange={(event) =>
                        updateBlockForm('reason', event.target.value)
                      }
                    />
                  </label>

                  <button type="submit" disabled={blockSaving}>
                    {blockSaving
                      ? ta('blockSaving')
                      : blockMode === 'single'
                        ? ta('blockOne')
                        : ta('blockMany')}
                  </button>
                </form>

                <h3>{ta('savedBlocks')}</h3>

                {blocksLoading ? (
                  <p>{ta('loadingBlocks')}</p>
                ) : blockedPeriods.length === 0 ? (
                  <p className="admin-calendar__empty">
                    {ta('noBlocks')}
                  </p>
                ) : (
                  <div className="blocked-period-list">
                    {blockedPeriods.map((block) => (
                      <article className="blocked-period-item" key={block.id}>
                        <div>
                          <strong>
                            {fmtDay(dateKey(block.starts_at), {
                              dateStyle: 'medium',
                            })}
                          </strong>
                          <p>
                            {fmtTime(block.starts_at)} –{' '}
                            {fmtTime(block.ends_at)}
                          </p>
                          {block.reason && <p>{block.reason}</p>}
                        </div>

                        <button
                          type="button"
                          onClick={() => deleteBlockedPeriod(block.id)}
                          disabled={blockDeletingId === block.id}
                        >
                          {blockDeletingId === block.id
                            ? ta('deleting')
                            : ta('delete')}
                        </button>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* TZ step 9: promotions & news */}
          {section === 'promotions' && <AdminPromotions />}
        </section>

        <aside className="admin-sidebar">
          <div className="admin-sidebar__brand">
            <span className="admin-sidebar__brand-name">
              ELNARA<span>.</span>
            </span>
            <span>{ta('brandSub')}</span>
          </div>

          <p className="admin-sidebar__label">{ta('manage')}</p>

          <nav className="admin-sidebar__nav" aria-label={ta('menuLabel')}>
            <button
              type="button"
              className={section === 'planning' ? 'is-active' : ''}
              onClick={() => setSection('planning')}
            >
              <span aria-hidden="true">▦</span> {ta('planning')}
            </button>

            <button
              type="button"
              className={section === 'appointments' ? 'is-active' : ''}
              onClick={() => setSection('appointments')}
            >
              <FiCalendar aria-hidden="true" /> {ta('appointments')}
            </button>

            <button
              type="button"
              className={section === 'settings' ? 'is-active' : ''}
              onClick={() => setSection('settings')}
            >
              <FiSettings aria-hidden="true" /> {ta('settings')}
            </button>

            <button
              type="button"
              className={section === 'promotions' ? 'is-active' : ''}
              onClick={() => setSection('promotions')}
            >
              <FiTag aria-hidden="true" /> {ta('promotions')}
            </button>
          </nav>

          <div className="admin-sidebar__bottom">
            <div className="admin-sidebar__profile">
              <span className="admin-sidebar__avatar">E</span>
              <span>
                <strong>ELNARA</strong>
                <small>{ta('profile')}</small>
              </span>
            </div>

            <button
              type="button"
              className="admin-sidebar__logout"
              onClick={signOut}
            >
              {ta('logout')} ↗
            </button>
          </div>
        </aside>
      </div>

      {rescheduleTarget && (
        <div className="reschedule-admin-overlay" role="presentation">
          <section
            className="reschedule-admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reschedule-admin-title"
          >
            <button
              type="button"
              className="reschedule-admin-modal__close"
              aria-label={ta('close')}
              onClick={() => setRescheduleTarget(null)}
            >
              ×
            </button>
            <p className="admin-eyebrow">{ta('rescheduleEyebrow')}</p>
            <h2 id="reschedule-admin-title">
              {ta('rescheduleTitle', { name: rescheduleTarget.customer_name })}
            </h2>
            <p>
              {ta('rescheduleIntro')}
            </p>

            {!rescheduleLink ? (
              <form onSubmit={createRescheduleProposal}>
                <label>
                  {ta('newDateTime')}
                  <input
                    type="datetime-local"
                    required
                    min={currentParisDateTimeLocal()}
                    value={rescheduleStart}
                    onChange={(event) => setRescheduleStart(event.target.value)}
                  />
                </label>
                {rescheduleError && (
                  <p className="admin-page__error" role="alert">{rescheduleError}</p>
                )}
                <div className="reschedule-admin-modal__actions">
                  <button type="submit" disabled={rescheduleBusy}>
                    {rescheduleBusy ? ta('creating') : ta('createProposal')}
                  </button>
                  <button type="button" onClick={() => setRescheduleTarget(null)}>
                    {ta('close')}
                  </button>
                </div>
              </form>
            ) : (
              <div className="reschedule-admin-modal__success">
                <p role="status">
                  {ta('proposalCreated')}
                </p>
                <label>
                  {ta('secureLink')}
                  <input readOnly value={rescheduleLink} onFocus={(event) => event.target.select()} />
                </label>
                {rescheduleError && (
                  <p className="admin-page__error" role="alert">{rescheduleError}</p>
                )}
                <div className="reschedule-admin-modal__actions">
                  <button type="button" onClick={copyRescheduleLink}>
                    {ta('copyLink')}
                  </button>
                  <button type="button" onClick={() => setRescheduleTarget(null)}>
                    {ta('done')}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
