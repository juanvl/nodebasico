import * as Yup from 'yup';

export async function store(req, res, next) {
  try {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Invalid/Missing data in form', messages: error.inner });
  }
}

export async function update(req, res, next) {
  try {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      currentPassword: Yup.string(),
      password: Yup.string()
        .min(6)
        .when('currentPassword', (currentPassword, field) =>
          currentPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Invalid/Missing data in form', messages: error.inner });
  }
}
