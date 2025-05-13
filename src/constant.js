export const MAX_ALLOWED_ATTRIBUTES_COUNT = 30;
export const MAX_ALLOWED_EVENT_SIZE = 50000;

export const defaultConfig = {
  debug: false,
  queueCapacity : 20, // 20 clickEvent type events can be batched by default
  queueInterval : 60 // 1 minute is default time after which batched events will be sent to server by default
};

export const exceptionTypeEnum = [
  'ReferenceError',
  'SyntaxError',
  'TypeError',
  'NetworkError',
  'RangeError',
  'URIError',
  'InternalError',
];
