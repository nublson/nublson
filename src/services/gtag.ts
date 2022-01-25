interface GtagProps {
  action: string;
  category: string;
  label: string;
  value: number;
}

export const pageView = (url: string) => {
  window.gtag("config", process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
    page_path: url,
  });
};

export const event = ({ action, category, label, value }: GtagProps) => {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
};
