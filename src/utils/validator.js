import * as yup from 'yup';

export default (rssUrl, feeds) => {
  yup.setLocale({
    mixed: {
      test: 'exists',
      required: 'required',
    },
    string: {
      url: 'invalid',
    },
  });
  const schema = yup
    .string()
    .required()
    .url()
    .test(
      'isNewUrl',
      'exists',
      (testUrl) => !feeds.some(({ url }) => url === testUrl),
    );
  return schema.validate(rssUrl, { strict: true, abortEarly: false });
};
