import moment from 'moment';

export default class Dates {

  static format(date) {
    return moment(date).format('D MMMM YYYY');
  }

}