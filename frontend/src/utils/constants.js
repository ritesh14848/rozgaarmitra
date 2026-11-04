export const TRADES = [
  { value: 'ELECTRICIAN', label: 'Electrician' },
  { value: 'PLUMBER', label: 'Plumber' },
  { value: 'CARPENTER', label: 'Carpenter' },
  { value: 'PAINTER', label: 'Painter' },
  { value: 'WELDER', label: 'Welder' },
  { value: 'AC_TECHNICIAN', label: 'AC & Refrigeration Tech' },
  { value: 'MECHANIC', label: 'Mechanic' },
  { value: 'MASON', label: 'Mason / Bricklayer' },
  { value: 'OTHER', label: 'Other Skilled Trade' },
];

export const CITIES = [
  { value: 'Mumbai', label: 'Mumbai' },
  { value: 'Pune', label: 'Pune' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Kolkata', label: 'Kolkata' },
  { value: 'Chennai', label: 'Chennai' },
];

export const AVAILABILITY_OPTIONS = [
  { value: 'Immediate', label: 'Immediate' },
  { value: 'Within 1 Week', label: 'Within 1 Week' },
  { value: 'Part-Time / Weekends Only', label: 'Part-Time / Weekends Only' },
];

export const INDUSTRY_OPTIONS = [
  { value: 'Residential & Home Services', label: 'Residential & Home Services' },
  { value: 'Construction & Real Estate', label: 'Construction & Real Estate' },
  { value: 'Commercial & Retail Facilities', label: 'Commercial & Retail Facilities' },
  { value: 'Manufacturing & Industrial', label: 'Manufacturing & Industrial' },
  { value: 'Automotive & Mechanical Works', label: 'Automotive & Mechanical Works' },
];

export const HOURS_WORK = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
];

export const APPLICATION_STATUS = {
  PENDING: { label: 'Pending Review', color: 'badge-warning' },
  SHORTLISTED: { label: 'Shortlisted', color: 'badge-info' },
  ACCEPTED: { label: 'Accepted / Hired', color: 'badge-success' },
  REJECTED: { label: 'Not Selected', color: 'badge-danger' },
};

export const JOB_STATUS = {
  OPEN: { label: 'Actively Hiring', color: 'badge-success' },
  CLOSED: { label: 'Closed', color: 'badge-secondary' },
};
