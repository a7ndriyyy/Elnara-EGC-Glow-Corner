// Supabase access for promotions (TZ step 9).
// Table + policies + storage bucket: supabase/migrations/20261111120000_promotions.sql
import { supabase } from "./supabase";
import { pricingRules } from "../data/pricingRules";
import { livePromotions, todayInZone } from "../utils/promotions";

const TABLE = "promotions";
const BUCKET = "promotions";
const COLUMNS =
  "id, title, description, image_url, type, old_price, new_price, start_date, end_date, is_active, created_at";

/**
 * Live promotions for visitors, newest first. RLS already hides inactive and
 * expired rows; the client filter keeps it correct for signed-in admins too.
 */
export async function fetchLivePromotions(limit) {
  const { data, error } = await supabase
    .from(TABLE)
    .select(COLUMNS)
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return livePromotions(data, todayInZone(pricingRules.timeZone), limit);
}

/** Admin: every promotion, including inactive and expired ones. */
export async function fetchAllPromotions() {
  const { data, error } = await supabase.from(TABLE).select(COLUMNS).order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

/** Admin: insert (no id) or update (with id). `row` comes from validatePromotion(). */
export async function savePromotion(id, row) {
  const query = id
    ? supabase.from(TABLE).update(row).eq("id", id)
    : supabase.from(TABLE).insert(row);
  const { data, error } = await query.select(COLUMNS).single();
  if (error) throw error;
  return data;
}

export async function setPromotionActive(id, isActive) {
  const { error } = await supabase.from(TABLE).update({ is_active: isActive }).eq("id", id);
  if (error) throw error;
}

export async function deletePromotion(promotion) {
  const { error } = await supabase.from(TABLE).delete().eq("id", promotion.id);
  if (error) throw error;
  await removePromotionImage(promotion.image_url);
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Admin: upload an image to the public bucket and return its public URL. */
export async function uploadPromotionImage(file) {
  if (!ALLOWED_TYPES.includes(file.type)) throw new Error("invalidImageType");
  if (file.size > MAX_IMAGE_BYTES) throw new Error("imageTooLarge");
  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Best effort: removes an image we uploaded (ignores foreign URLs and errors). */
export async function removePromotionImage(url) {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const at = url ? url.indexOf(marker) : -1;
  if (at < 0) return;
  const path = decodeURIComponent(url.slice(at + marker.length));
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) console.warn("Could not remove promotion image:", error.message);
}
