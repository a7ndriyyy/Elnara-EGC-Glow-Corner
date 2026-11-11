import React, { useCallback, useEffect, useState } from "react";
import {
  deletePromotion,
  fetchAllPromotions,
  MAX_IMAGE_BYTES,
  removePromotionImage,
  savePromotion,
  setPromotionActive,
  uploadPromotionImage,
} from "../lib/promotions";
import {
  DESCRIPTION_MAX,
  formatEuro,
  isPromotionLive,
  TITLE_MAX,
  todayInZone,
  validatePromotion,
} from "../utils/promotions";
import { pricingRules } from "../data/pricingRules";
import { useLanguage } from "../i18n/LanguageContext";
import { fill } from "../utils/format";
import "./AdminPromotions.css";

// Admin section "Promotions & news" (TZ step 9). Texts: admin.promo.* in src/i18n/admin.js.
const EMPTY = {
  title: "",
  description: "",
  type: "promotion",
  old_price: "",
  new_price: "",
  start_date: "",
  end_date: "",
  is_active: true,
  image_url: null,
};

// Status of a promotion for the admin list (labels come from admin.promo.*).
function statusKey(p, today) {
  if (!p.is_active) return "off";
  if (p.end_date && p.end_date < today) return "expired";
  if (p.start_date && p.start_date > today) return "scheduled";
  return isPromotionLive(p, today) ? "live" : "offline";
}
const STATUS_LABEL_KEY = { off: "statusOff", expired: "statusExpired", scheduled: "statusScheduled", live: "statusLive", offline: "statusOffline" };

const toForm = (p) => ({
  ...EMPTY,
  ...p,
  old_price: p.old_price ?? "",
  new_price: p.new_price ?? "",
  start_date: p.start_date ?? "",
  end_date: p.end_date ?? "",
  description: p.description ?? "",
});

export default function AdminPromotions() {
  const { t } = useLanguage();
  const tp = useCallback((key, vars) => fill(t(`admin.promo.${key}`), vars || {}), [t]);
  const ERRORS_TEXT = (code) => t(`admin.promo.errors.${code}`);
  const locale = t("admin.locale");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // null | { id?, form }
  const [formErrors, setFormErrors] = useState({});
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const today = todayInZone(pricingRules.timeZone);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await fetchAllPromotions());
    } catch (err) {
      const missing = err?.code === "42P01" || err?.code === "PGRST205";
      setError(
        missing
          ? tp("tableMissing")
          : tp("loadFailed", { error: err?.message || err }),
      );
    } finally {
      setLoading(false);
    }
  }, [tp]);

  useEffect(() => {
    load();
  }, [load]);

  // Free the object URL used for the local image preview.
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const openForm = (promotion) => {
    setEditing({ id: promotion?.id, form: promotion ? toForm(promotion) : { ...EMPTY } });
    setFormErrors({});
    setFile(null);
    setPreview(null);
  };

  const closeForm = () => {
    setEditing(null);
    setFile(null);
    setPreview(null);
  };

  const setField = (field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setEditing((prev) => ({ ...prev, form: { ...prev.form, [field]: value } }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const pickFile = (event) => {
    const picked = event.target.files?.[0];
    if (!picked) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(picked.type)) {
      setFormErrors((prev) => ({ ...prev, image_url: "invalidImageType" }));
      return;
    }
    if (picked.size > MAX_IMAGE_BYTES) {
      setFormErrors((prev) => ({ ...prev, image_url: "imageTooLarge" }));
      return;
    }
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
    setFormErrors((prev) => ({ ...prev, image_url: undefined }));
  };

  const removeImage = () => {
    setFile(null);
    setPreview(null);
    setEditing((prev) => ({ ...prev, form: { ...prev.form, image_url: null } }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const { errors, row } = validatePromotion(editing.form);
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    setError("");
    const previous = editing.id ? items.find((p) => p.id === editing.id) : null;
    let uploadedUrl = null;
    try {
      if (file) {
        uploadedUrl = await uploadPromotionImage(file);
        row.image_url = uploadedUrl;
      }
      await savePromotion(editing.id, row);
      // The old image is no longer used once the row points elsewhere.
      if (previous?.image_url && previous.image_url !== row.image_url) {
        await removePromotionImage(previous.image_url);
      }
      closeForm();
      await load();
    } catch (err) {
      if (uploadedUrl) await removePromotionImage(uploadedUrl);
      setError(t(`admin.promo.errors.${err?.message}`).startsWith("admin.") ? tp("saveFailed", { error: err?.message || err }) : ERRORS_TEXT(err?.message));
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (p) => {
    setBusyId(p.id);
    try {
      await setPromotionActive(p.id, !p.is_active);
      await load();
    } catch (err) {
      setError(tp("updateFailed", { error: err?.message || err }));
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (p) => {
    if (!window.confirm(tp("confirmDelete", { title: p.title }))) return;
    setBusyId(p.id);
    try {
      await deletePromotion(p);
      await load();
    } catch (err) {
      setError(tp("deleteFailed", { error: err?.message || err }));
    } finally {
      setBusyId(null);
    }
  };

  const fieldError = (field) =>
    formErrors[field] ? <span className="admin-promos__field-error">{ERRORS_TEXT(formErrors[field])}</span> : null;

  const form = editing?.form;
  const imageShown = preview || form?.image_url;

  return (
    <section className="admin-promos" aria-labelledby="admin-promos-title">
      <div className="admin-promos__head">
        <div>
          <h2 id="admin-promos-title">{tp("title")}</h2>
          <p>{tp("intro")}</p>
        </div>
        {!editing && (
          <button type="button" className="admin-promos__primary" onClick={() => openForm(null)}>
            {tp("new")}
          </button>
        )}
      </div>

      {error && <p role="alert" className="admin-page__error">{error}</p>}

      {editing && (
        <form className="admin-promos__form" onSubmit={handleSave} noValidate>
          <h3>{editing.id ? tp("editTitle") : tp("newTitle")}</h3>

          <label>
            {tp("fieldTitle")}
            <input type="text" value={form.title} maxLength={TITLE_MAX} onChange={setField("title")} />
            <small>{form.title.length}/{TITLE_MAX}</small>
            {fieldError("title")}
          </label>

          <label>
            {tp("fieldDescription")}
            <textarea rows={4} value={form.description} maxLength={DESCRIPTION_MAX} onChange={setField("description")} />
            <small>{form.description.length}/{DESCRIPTION_MAX} — {tp("descriptionHint")}</small>
            {fieldError("description")}
          </label>

          <div className="admin-promos__grid">
            <label>
              {tp("fieldType")}
              <select value={form.type} onChange={setField("type")}>
                <option value="promotion">{tp("typePromotion")}</option>
                <option value="new">{tp("typeNew")}</option>
              </select>
              {fieldError("type")}
            </label>
            <label>
              {tp("oldPrice")}
              <input type="text" inputMode="decimal" value={form.old_price} onChange={setField("old_price")} placeholder={tp("oldPricePh")} />
              {fieldError("old_price")}
            </label>
            <label>
              {tp("newPrice")}
              <input type="text" inputMode="decimal" value={form.new_price} onChange={setField("new_price")} placeholder={tp("newPricePh")} />
              {fieldError("new_price")}
            </label>
            <label>
              {tp("start")}
              <input type="date" value={form.start_date} onChange={setField("start_date")} />
              {fieldError("start_date")}
            </label>
            <label>
              {tp("end")}
              <input type="date" value={form.end_date} onChange={setField("end_date")} />
              {fieldError("end_date")}
            </label>
          </div>

          <div className="admin-promos__image">
            {imageShown ? (
              <img src={imageShown} alt="" />
            ) : (
              <span className="admin-promos__noimg">{tp("noImage")}</span>
            )}
            <div>
              <label className="admin-promos__file">
                {imageShown ? tp("changeImage") : tp("addImage")}
                <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={pickFile} />
              </label>
              {imageShown && (
                <button type="button" onClick={removeImage}>{tp("removeImage")}</button>
              )}
              <small>{tp("imageHint")}</small>
              {fieldError("image_url")}
            </div>
          </div>

          <label className="admin-promos__check">
            <input type="checkbox" checked={form.is_active} onChange={setField("is_active")} />
            {tp("active")}
          </label>

          <div className="admin-promos__actions">
            <button type="submit" className="admin-promos__primary" disabled={saving}>
              {saving ? t("admin.saving") : tp("save")}
            </button>
            <button type="button" onClick={closeForm} disabled={saving}>{tp("cancel")}</button>
          </div>
        </form>
      )}

      {loading ? (
        <p role="status">{t("admin.loading")}</p>
      ) : items.length === 0 && !error ? (
        <p className="admin-calendar__empty">{tp("empty")}</p>
      ) : (
        <ul className="admin-promos__list">
          {items.map((p) => {
            const status = statusKey(p, today);
            return (
              <li key={p.id} className="admin-promos__item">
                {p.image_url ? <img src={p.image_url} alt="" /> : <span className="admin-promos__noimg">—</span>}
                <div className="admin-promos__info">
                  <div className="admin-promos__tags">
                    <span className={`admin-promos__type admin-promos__type--${p.type}`}>{p.type === "new" ? tp("typeNew") : tp("typePromotion")}</span>
                    <span className={`admin-promos__status admin-promos__status--${status}`}>{tp(STATUS_LABEL_KEY[status])}</span>
                  </div>
                  <strong>{p.title}</strong>
                  <span className="admin-promos__meta">
                    {p.old_price != null && <s>{formatEuro(p.old_price, locale)}</s>}{" "}
                    {p.new_price != null && <b>{formatEuro(p.new_price, locale)}</b>}
                    {(p.start_date || p.end_date) && (
                      <> · {p.start_date || "…"} → {p.end_date || "…"}</>
                    )}
                  </span>
                </div>
                <div className="admin-promos__row-actions">
                  <button type="button" onClick={() => openForm(p)} disabled={busyId === p.id || saving}>{tp("edit")}</button>
                  <button type="button" onClick={() => toggle(p)} disabled={busyId === p.id}>
                    {p.is_active ? tp("deactivate") : tp("activate")}
                  </button>
                  <button type="button" className="admin-promos__danger" onClick={() => remove(p)} disabled={busyId === p.id}>
                    {tp("delete")}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
