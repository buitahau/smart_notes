import { Inngest } from 'inngest';

export const inngest = new Inngest({
  name: 'Smart Notes Backend',
});

export const INNGEST_EVENTS = {
  WELCOME_USER: 'user/welcome',
};

export default inngest;
