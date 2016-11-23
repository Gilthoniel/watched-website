
const MESSAGES = {
  'invalid_token': '',
  'invalid_grant': 'Invalid email or password',

  'no_overview': 'No overview available'
};

export default function messages(key) {
  return MESSAGES[key] || '';
}