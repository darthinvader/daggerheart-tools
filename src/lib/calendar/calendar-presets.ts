import type { CalendarState } from '@/lib/schemas/calendar';
import {
  CALENDAR_SCHEMA_VERSION,
  DEFAULT_CALENDAR_COLOR,
} from '@/lib/schemas/calendar';
import { generateId } from '@/lib/utils';

// =====================================================================================
// Calendar preset factories — each returns a complete CalendarState (v2 envelope)
// =====================================================================================

/** Daggerheart default: 12 months × 30 days, 7-day weeks, 2 moons, 4 seasons. */
export function createDaggerheartDefault(): CalendarState {
  const id = generateId();
  return {
    version: CALENDAR_SCHEMA_VERSION,
    activeCalendarId: id,
    calendars: [
      {
        id,
        name: 'Main Calendar',
        color: DEFAULT_CALENDAR_COLOR,
        preset: 'daggerheart-default',
        definition: {
          months: [
            { name: 'Frostmere', days: 30 },
            { name: 'Snowveil', days: 30 },
            { name: 'Thawbreak', days: 30 },
            { name: 'Bloomtide', days: 30 },
            { name: 'Greenswell', days: 30 },
            { name: 'Sunpeak', days: 30 },
            { name: 'Goldwane', days: 30 },
            { name: 'Emberveil', days: 30 },
            { name: 'Harvestfall', days: 30 },
            { name: 'Duskmere', days: 30 },
            { name: 'Greywind', days: 30 },
            { name: 'Longnight', days: 30 },
          ],
          weekdays: [
            'Starday',
            'Sunday',
            'Moonday',
            'Fireday',
            'Waterday',
            'Earthday',
            'Windday',
          ],
          moons: [
            { name: 'Silver Eye', cycleDays: 29, offset: 0 },
            { name: 'Red Veil', cycleDays: 45, offset: 12 },
          ],
          seasons: [
            { name: 'Winter', startMonth: 1, startDay: 1 },
            { name: 'Spring', startMonth: 4, startDay: 1 },
            { name: 'Summer', startMonth: 7, startDay: 1 },
            { name: 'Autumn', startMonth: 10, startDay: 1 },
          ],
        },
        currentDay: 0,
        epochLabel: '',
        eraName: '',
        events: [],
        customCategories: [],
      },
    ],
  };
}

/** Gregorian-like: 12 months (28–31 days), 7-day weeks, 1 moon, 4 seasons. */
export function createGregorianLike(): CalendarState {
  const id = generateId();
  return {
    version: CALENDAR_SCHEMA_VERSION,
    activeCalendarId: id,
    calendars: [
      {
        id,
        name: 'Main Calendar',
        color: DEFAULT_CALENDAR_COLOR,
        preset: 'gregorian',
        definition: {
          months: [
            { name: 'January', days: 31 },
            { name: 'February', days: 28 },
            { name: 'March', days: 31 },
            { name: 'April', days: 30 },
            { name: 'May', days: 31 },
            { name: 'June', days: 30 },
            { name: 'July', days: 31 },
            { name: 'August', days: 31 },
            { name: 'September', days: 30 },
            { name: 'October', days: 31 },
            { name: 'November', days: 30 },
            { name: 'December', days: 31 },
          ],
          weekdays: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          moons: [{ name: 'Moon', cycleDays: 29, offset: 0 }],
          seasons: [
            { name: 'Winter', startMonth: 1, startDay: 1 },
            { name: 'Spring', startMonth: 3, startDay: 20 },
            { name: 'Summer', startMonth: 6, startDay: 21 },
            { name: 'Autumn', startMonth: 9, startDay: 22 },
            { name: 'Winter', startMonth: 12, startDay: 21 },
          ],
        },
        currentDay: 0,
        epochLabel: '',
        eraName: '',
        events: [],
        customCategories: [],
      },
    ],
  };
}

/** Forgotten Realms Harptos: 12 months × 30 days + 5 festival days, 10-day tendays, 1 moon. */
export function createHarptos(): CalendarState {
  const id = generateId();
  return {
    version: CALENDAR_SCHEMA_VERSION,
    activeCalendarId: id,
    calendars: [
      {
        id,
        name: 'Main Calendar',
        color: DEFAULT_CALENDAR_COLOR,
        preset: 'harptos',
        definition: {
          months: [
            { name: 'Hammer', days: 30 },
            { name: 'Midwinter', days: 1 },
            { name: 'Alturiak', days: 30 },
            { name: 'Ches', days: 30 },
            { name: 'Tarsakh', days: 30 },
            { name: 'Greengrass', days: 1 },
            { name: 'Mirtul', days: 30 },
            { name: 'Kythorn', days: 30 },
            { name: 'Flamerule', days: 30 },
            { name: 'Midsummer', days: 1 },
            { name: 'Eleasis', days: 30 },
            { name: 'Eleint', days: 30 },
            { name: 'Highharvestide', days: 1 },
            { name: 'Marpenoth', days: 30 },
            { name: 'Uktar', days: 30 },
            { name: 'Feast of the Moon', days: 1 },
            { name: 'Nightal', days: 30 },
          ],
          weekdays: [
            '1st',
            '2nd',
            '3rd',
            '4th',
            '5th',
            '6th',
            '7th',
            '8th',
            '9th',
            '10th',
          ],
          moons: [{ name: 'Selûne', cycleDays: 30, offset: 14 }],
          seasons: [
            { name: 'Winter', startMonth: 1, startDay: 1 },
            { name: 'Spring', startMonth: 4, startDay: 1 },
            { name: 'Summer', startMonth: 7, startDay: 1 },
            { name: 'Autumn', startMonth: 11, startDay: 1 },
          ],
        },
        currentDay: 0,
        epochLabel: 'DR',
        eraName: 'Dale Reckoning',
        events: [],
        customCategories: [],
      },
    ],
  };
}
