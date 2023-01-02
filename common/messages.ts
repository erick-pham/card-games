export const scope = "app.containers.App";

const msg = {
  appAPILoading: {
    id: `${scope}.appAPILoading`,
    // defaultMessage: `Please wait. We are handling data...`,
    defaultMessage: `Vui lòng đợi...`,
  },
  appReloading: {
    id: `${scope}.appReloading`,
    defaultMessage: `Reloading app...`,
  },
  defaultMessage: {
    id: `${scope}.defaultMessage`,
    defaultMessage: `Default message`,
  },
};

export default msg;
