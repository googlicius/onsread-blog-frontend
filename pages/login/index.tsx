import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Head from 'next/head';
import cs from 'classnames';
import { meQueryAsync, selectMe } from '@/redux/meProducer';
import { useLoginMutation } from '@/graphql/generated';
import Navigation from '@/components/layout/Navigation';
import styles from './index.module.scss';
import { NextPage } from 'next';

interface FormData {
  identifier: string;
  password: string;
}

const Login: NextPage = () => {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const [loginMutation, { error }] = useLoginMutation();
  const router = useRouter();
  const me = useSelector(selectMe);
  const dispatch = useDispatch();

  const loading = isSubmitting || me.status === 'loading';

  const onSubmit = async (formData: FormData) => {
    try {
      const res = await loginMutation({
        variables: {
          input: formData,
        },
      });
      localStorage.setItem(
        process.env.NEXT_PUBLIC_JWT_TOKEN_KEY,
        res.data.login.jwt,
      );
      dispatch(meQueryAsync());
    } catch (err) {
      // Throw error
    }
  };

  useEffect(() => {
    emailInputRef.current?.focus();
  }, [emailInputRef]);

  useEffect(() => {
    if (me.value) {
      router.push('/');
    }
  }, [me]);

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>

      <Navigation isTransparentBg={false} />

      <div className="container mt-7">
        <div className="row">
          <div className="col-md-5 mx-auto">
            <div className="myform form ">
              <div className="logo mb-3">
                <div className="col-md-12 text-center">
                  <h1>Login</h1>
                </div>
              </div>

              {error && (
                <div className="alert alert-warning">
                  Email or password is invalid
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label>Email address</label>

                  <input
                    {...register('identifier', {
                      required: { value: true, message: 'Email is required' },
                    })}
                    ref={emailInputRef}
                    type="email"
                    className={cs('form-control', {
                      'is-invalid': !!errors.identifier,
                    })}
                    aria-describedby="emailHelp"
                    placeholder="Enter email"
                  />
                  <div className="invalid-feedback">
                    {errors.identifier?.message}
                  </div>
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    {...register('password', {
                      required: {
                        value: true,
                        message: 'Password is required',
                      },
                    })}
                    className={cs('form-control', {
                      'is-invalid': !!errors.password,
                    })}
                    aria-describedby="emailHelp"
                    placeholder="Enter Password"
                  />
                  <div className="invalid-feedback">
                    {errors.password?.message}
                  </div>
                </div>

                <div className="form-group">
                  <p className="text-center">
                    By signing up you accept our <a href="#">Terms Of Use</a>
                  </p>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className=" btn btn-big btn-block mybtn btn-primary tx-tfm"
                  >
                    {loading && (
                      <div className="spinner-border mr-3" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    )}
                    Login
                  </button>
                </div>

                <div className={`mt-5 ${styles['login-or']}`}>
                  <hr className={styles['hr-or']} />
                  <span className={styles['span-or']}>or</span>
                </div>

                <div className="mb-3">
                  <p className="text-center">
                    <a
                      href="#"
                      className={` btn btn-big mybtn ${styles.google}`}
                    >
                      <i className="fa fa-google-plus"></i> Signup using Google
                    </a>
                  </p>
                </div>

                <div className="form-group">
                  <p className="text-center">
                    Don&apos;t have account?{' '}
                    <a href="#" id="signup">
                      Sign up here
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
