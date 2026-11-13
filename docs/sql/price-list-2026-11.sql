-- Elnara's price list (12–13.11.2026) for the online booking system.
-- GENERATED from src/data/priceList.js — edit that file, not this one.
-- Run once in Supabase → SQL Editor. Safe to re-run (upsert by id).
--
-- What it does:
--   • adds or updates every bookable service with Elnara's price and duration
--     ("from" prices use the starting price; time ranges use the longest time,
--     so the calendar reserves enough time)
--   • switches off Smokey Eyes, which is not in her price list
-- Not included: lifting-makeup (no duration in the price list yet); lash-clusters (add-on, added to another service).

begin;

insert into public.services (id, category, name, price_eur, duration_minutes, is_active)
values
  ('powder-brows', 'Перманентний макіяж', 'Пудрові брови', 300, 150, true),
  ('lip-blush', 'Перманентний макіяж', 'Акварельні губи', 300, 150, true),
  ('lipstick-lips', 'Перманентний макіяж', 'Помадний ефект губ', 350, 180, true),
  ('dark-lips-neutralization', 'Перманентний макіяж', 'Нейтралізація темних губ', 260, 150, true),
  ('lash-line-upper', 'Перманентний макіяж', 'Міжвійка верхня', 160, 90, true),
  ('lash-line-lower', 'Перманентний макіяж', 'Міжвійка нижня', 110, 60, true),
  ('lash-line-both', 'Перманентний макіяж', 'Міжвійка верхня + нижня', 220, 120, true),
  ('eyeliner-classic', 'Перманентний макіяж', 'Класична стрілка', 220, 120, true),
  ('eyeliner-ombre', 'Перманентний макіяж', 'Стрілка з розтушовкою', 260, 150, true),
  ('beauty-mark', 'Перманентний макіяж', 'Перманентна мушка', 50, 30, true),
  ('freckles', 'Перманентний макіяж', 'Веснянки', 120, 60, true),
  ('retouch-6-12', 'Перманентний макіяж', 'Оновлення 6–12 місяців', 150, 90, true),
  ('retouch-12-18', 'Перманентний макіяж', 'Оновлення 12–18 місяців', 180, 120, true),
  ('pmu-cover', 'Перманентний макіяж', 'Перекриття старого перманенту', 280, 180, true),
  ('brow-shaping', 'Брови та вії', 'Корекція форми брів', 20, 20, true),
  ('brow-architecture', 'Брови та вії', 'Архітектура брів (побудова нової форми)', 30, 30, true),
  ('brow-tint', 'Брови та вії', 'Фарбування брів фарбою', 20, 20, true),
  ('brow-shaping-coloring', 'Брови та вії', 'Корекція + фарбування фарбою', 35, 40, true),
  ('brow-lift', 'Брови та вії', 'Ламінування брів', 50, 45, true),
  ('lash-tint', 'Брови та вії', 'Фарбування вій', 20, 20, true),
  ('lash-lift', 'Брови та вії', 'Ламінування вій', 40, 60, true),
  ('lash-lift-tint-botox', 'Брови та вії', 'Ламінування + фарбування + ботокс', 45, 75, true),
  ('brow-lash-lift', 'Брови та вії', 'Комплекс: ламінування брів і вій', 60, 90, true),
  ('brow-lash-full', 'Брови та вії', 'Повний комплекс брів і вій з фарбуванням', 75, 105, true),
  ('day-makeup', 'Макіяж', 'Денний макіяж', 100, 60, true),
  ('evening-makeup', 'Макіяж', 'Вечірній макіяж', 120, 90, true),
  ('photoshoot-makeup', 'Макіяж', 'Макіяж для фотосесії', 120, 90, true),
  ('graduation-makeup', 'Макіяж', 'Макіяж для випускного', 100, 75, true),
  ('bridal-makeup', 'Макіяж', 'Весільний макіяж', 200, 120, true),
  ('bridal-trial', 'Макіяж', 'Пробний весільний макіяж', 120, 120, true),
  ('self-makeup-lesson', 'Макіяж', 'Індивідуальний урок самомакіяжу', 120, 120, true),
  ('pack-brow-beauty', 'Комплекси', 'Brow Beauty — форма + фарбування', 35, 40, true),
  ('pack-brow-premium', 'Комплекси', 'Brow Premium — ламінування + форма + фарбування', 50, 75, true),
  ('pack-full-beauty', 'Комплекси', 'Full Beauty — ламінування брів і вій + форма + фарбування', 75, 105, true),
  ('pack-perfect-look', 'Комплекси', 'Perfect Look — оформлення брів + вечірній макіяж', 120, 120, true),
  ('tattoo-consultation', 'Видалення', 'Видалення тату: Консультація', 20, 20, true),
  ('tattoo-xs', 'Видалення', 'Видалення тату: Дуже маленьке тату (до 5 см²)', 100, 20, true),
  ('tattoo-s', 'Видалення', 'Видалення тату: Маленьке тату (5–15 см²)', 120, 30, true),
  ('tattoo-m', 'Видалення', 'Видалення тату: Середнє тату (16–50 см²)', 180, 40, true),
  ('tattoo-l', 'Видалення', 'Видалення тату: Велике тату (51–100 см²)', 230, 45, true),
  ('remover-consultation', 'Видалення', 'Ремувер: Консультація', 20, 20, true),
  ('remover-first', 'Видалення', 'Ремувер: Перша процедура', 100, 60, true),
  ('remover-next', 'Видалення', 'Ремувер: Повторна процедура', 80, 60, true),
  ('carbon-face', 'Обличчя', 'Карбоновий пілінг обличчя', 120, 45, true),
  ('carbon-face-neck', 'Обличчя', 'Карбоновий пілінг обличчя та шиї', 150, 60, true),
  ('carbon-face-neck-decollete', 'Обличчя', 'Карбоновий пілінг обличчя, шиї та декольте', 180, 75, true)
on conflict (id) do update set
  category = excluded.category,
  name = excluded.name,
  price_eur = excluded.price_eur,
  duration_minutes = excluded.duration_minutes,
  is_active = true;

update public.services set is_active = false where id = 'smokey-eyes';

commit;

-- Optional — ONLY if Elnara confirms she offers nothing else (massages, facials…):
-- update public.services set is_active = false
-- where id not in ('powder-brows', 'lip-blush', 'lipstick-lips', 'dark-lips-neutralization', 'lash-line-upper', 'lash-line-lower', 'lash-line-both', 'eyeliner-classic', 'eyeliner-ombre', 'beauty-mark', 'freckles', 'retouch-6-12', 'retouch-12-18', 'pmu-cover', 'brow-shaping', 'brow-architecture', 'brow-tint', 'brow-shaping-coloring', 'brow-lift', 'lash-tint', 'lash-lift', 'lash-lift-tint-botox', 'brow-lash-lift', 'brow-lash-full', 'day-makeup', 'evening-makeup', 'photoshoot-makeup', 'graduation-makeup', 'bridal-makeup', 'bridal-trial', 'self-makeup-lesson', 'pack-brow-beauty', 'pack-brow-premium', 'pack-full-beauty', 'pack-perfect-look', 'tattoo-consultation', 'tattoo-xs', 'tattoo-s', 'tattoo-m', 'tattoo-l', 'remover-consultation', 'remover-first', 'remover-next', 'carbon-face', 'carbon-face-neck', 'carbon-face-neck-decollete');
