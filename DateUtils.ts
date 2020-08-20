export class DateUtils {

  /**
   * Returns the date in the format DD/MM/YYYY
   *
   * @param day
   * @param month
   * @param year
   */
  getDate(year: number, month: number, day: number = 1): string {
    let registrationMonth: string = !!month ? `${month}` : null;
    if (!!registrationMonth && Number(registrationMonth) < 10) {
      registrationMonth = '0' + registrationMonth;
    }

    let registrationDay: string = !!day ? `${day}` : null;
    if (!!registrationDay && Number(registrationDay) < 10) {
      registrationDay = '0' + registrationDay;
    }

    let registrationYear = !!year ? `${year}` : null;
    return !!registrationYear && !!registrationMonth ?
      `${registrationDay}/${registrationMonth}/${registrationYear}` : null;
  }

  /**
   * Returns the day from a date in the format DD/MM/YYYY
   *
   * @param date
   */
  static getDay(date: string) {
    return date.slice(3, 5);
  }

  /**
   * Returns the month from a date in the format DD/MM/YYYY
   *
   * @param date
   */
  static getMonth(date: string) {
    return date.slice(3, 5);
  }

  /**
   * Returns the year from a date in the format DD/MM/YYYY
   *
   * @param date
   */
  static getYear(date: string) {
    return date.slice(6, 10);
  }

  /**
   * Return the months list in IT language
   */
  static get monthsList(): string[] {
    return ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
  }
}
