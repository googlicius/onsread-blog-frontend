import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { NextPageContext } from 'next';
import {
  Post,
  PostBySlugDocument,
  PostBySlugQuery,
  useUpdatePostMutation,
} from '@/graphql/generated';
import client from '@/apollo-client';
import { selectMe } from '@/redux/meProducer';
import EditFormStep1 from '@/components/posts/edit/EditFormStep1';
import EditFormStep2 from '@/components/posts/edit/EditFormStep2';
import { FormData } from '@/components/posts/edit/interface';
import Loading from '@/components/Loading/Loading';

interface Props {
  postData: PostBySlugQuery;
}

const PostEdit = ({ postData }: Props): JSX.Element => {
  const router = useRouter();
  const [formDefaultValues, setFormDefaultValues] = useState<FormData>(null);
  const [step, setStep] = useState(1);

  const me = useSelector(selectMe);
  const [updatePostMutation] = useUpdatePostMutation();
  const methods = useForm();
  const {
    handleSubmit,
    formState: { isDirty },
  } = methods;

  const checkPageUnSaved = useCallback(() => {
    if (isDirty && !confirm('Do you want to cancel editing?')) {
      router.events.emit('routeChangeComplete');
      throw 'Abort route change. Please ignore this error.';
    }
  }, [isDirty]);

  useEffect(() => {
    if (me.value?.id !== postData.postBySlug?.user?.id) {
      router.back();
    }
  }, [me, postData]);

  useEffect(() => {
    const {
      content,
      contentType,
      displayType,
      title,
      description,
      category,
    } = postData.postBySlug;

    setFormDefaultValues({
      content,
      contentType,
      displayType,
      title,
      description,
      category: category.id,
    });
  }, [postData]);

  useEffect(() => {
    router.events.on('routeChangeStart', checkPageUnSaved);

    return function cleanUp() {
      router.events.off('routeChangeStart', checkPageUnSaved);
    };
  }, [checkPageUnSaved]);

  const onSubmit = async (data: FormData): Promise<void> => {
    const { data: updatePostData } = await updatePostMutation({
      variables: {
        input: {
          where: {
            id: postData.postBySlug.id,
          },
          data,
        },
      },
    });

    router.events.off('routeChangeStart', checkPageUnSaved);
    router.push(`/posts/${updatePostData.updatePost.post.slug}`);
    toast.dark('Post updated successfully');
  };

  return (
    <>
      <Head>
        <title>Post Edit</title>
      </Head>

      {formDefaultValues ? (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {
              {
                1: (
                  <EditFormStep1
                    defaultValues={formDefaultValues}
                    onNextStep={() => setStep(2)}
                  />
                ),
                2: (
                  <EditFormStep2
                    post={postData?.postBySlug as Post}
                    defaultValues={formDefaultValues}
                    goBack={() => setStep(1)}
                  />
                ),
              }[step]
            }
          </form>
        </FormProvider>
      ) : (
        <Loading />
      )}
    </>
  );
};

PostEdit.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const { query } = ctx;

  const { data: postData } = await client.query<PostBySlugQuery>({
    query: PostBySlugDocument,
    variables: {
      slug: query.slug,
    },
  });

  return {
    postData,
  };
};

export default PostEdit;
