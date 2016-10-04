
const MESSAGES = {
  'invalid_token': '',
  'invalid_grant': 'Invalid email or password'
};

export default function messages(key) {
  return MESSAGES[key] || '';
}