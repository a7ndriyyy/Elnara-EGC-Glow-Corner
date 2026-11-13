// Feature flags. Flip a value and redeploy — no other code changes needed.
export const features = {
  // TZ step 8: training is "in development". false → /about shows the locked
  // placeholder and the "Навчання" direction card is locked; true → the full
  // training page (src/pages/StudyPage.jsx, kept intact) is back.
  trainingEnabled: false,
};
