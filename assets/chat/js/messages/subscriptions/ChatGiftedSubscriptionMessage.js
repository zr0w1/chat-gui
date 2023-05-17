import { usernameColorFlair } from '../ChatUserMessage';
import ChatUser from '../../user';
import ChatSubscriptionMessage from './ChatSubscriptionMessage';
import MessageTypes from '../MessageTypes';

export default class ChatGiftedSubscriptionMessage extends ChatSubscriptionMessage {
  constructor(message, user, tier, tierLabel, giftee, timestamp) {
    super(message, user, tier, tierLabel, timestamp);
    this.type = MessageTypes.GIFTSUB;
    this.giftee = giftee;
  }

  html(chat = null) {
    const message = super.html(chat);
    const classes = Array.from(message.classList);
    const attributes = message
      .getAttributeNames()
      .reduce((object, attributeName) => {
        if (attributeName === 'class') return object;
        return {
          ...object,
          [attributeName]: message.getAttribute(attributeName),
        };
      }, {});

    attributes['data-giftee'] = this.giftee.toLowerCase();

    message.querySelector('.subscription-icon').classList.add('gift');

    /** @type HTMLAnchorElement */
    const giftee = document
      .querySelector('#user-template')
      ?.content.cloneNode(true).firstElementChild;

    const gifteeUser =
      chat.users.get(this.giftee.toLowerCase()) ?? new ChatUser(this.giftee);
    const gifteeColorFlair = usernameColorFlair(chat.flairs, gifteeUser);
    giftee.classList.add(gifteeColorFlair?.name);
    giftee.innerText = gifteeUser.username;

    const subscriptionInfo = message.querySelector('.event-info');
    const user = message.querySelector('.user');
    const tier = message.querySelector('.tier');
    subscriptionInfo.innerHTML = `${user.outerHTML} gifted ${giftee.outerHTML} a ${tier.outerHTML} subscription`;

    return this.wrap(message.innerHTML, classes, attributes);
  }
}
