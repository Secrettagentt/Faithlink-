import dayjs from 'dayjs';

type InputValue = Date | string | number | null | undefined;

export function fDate(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'DD MMM YYYY';

  return date ? dayjs(new Date(date)).format(fm) : '';
}

export function fDateTime(date: InputValue) {
  return date ? dayjs(new Date(date)).format('DD MMM YYYY, hh:mm A') : '';
}
