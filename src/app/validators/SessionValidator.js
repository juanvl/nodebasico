import * as Yup from 'yup';

export async function store(req, res, next) { // eslint-disable-line
  try {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Invalid/Missing data in form', messages: error.inner });
  }
}
