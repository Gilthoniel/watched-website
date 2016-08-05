/**
 * Created by Gaylor on 02.08.2016.
 *
 */

const EventEmitter = require('events');

class AbstractEvents extends EventEmitter {

}

const Events = new AbstractEvents();
Events.REGISTER = {
  NAV_CHANGE: 'nav.change'
};

export default Events;
