import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Enum_Post_Contenttype,
  Enum_Post_Displaytype,
  useCreatePostMutation,
} from '@/graphql/generated';
import EditFormStep1 from '@/components/posts/edit/EditFormStep1';
import EditFormStep2 from '@/components/posts/edit/EditFormStep2';
import { FormData } from '@/components/posts/edit/interface';
import { useTranslation } from 'react-i18next';
import useFormGuard from '@/hooks/form-guard';

const PostCreate = (): JSX.Element => {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [createPostMutation] = useCreatePostMutation();
  const { t } = useTranslation();
  const methods = useForm<FormData>({
    defaultValues: {
      title: null,
      content: null,
      contentType: Enum_Post_Contenttype.Html,
      displayType: Enum_Post_Displaytype.WithImage,
      description: null,
      category: null,
      story: null,
      storySeq: null,
      published_at: null,
    },
  });
  const {
    handleSubmit,
    formState: { isDirty },
  } = methods;

  const { me, checkUnSavedForm } = useFormGuard({ isDirty });

  const onSubmit = async (data: FormData): Promise<void> => {
    const { data: createPostData } = await createPostMutation({
      variables: {
        input: {
          data: {
            ...data,
            user: me.value.id,
          },
        },
      },
    });

    router.events.off('routeChangeStart', checkUnSavedForm);
    router.push(`/posts/${createPostData.createPost.post.slug}`);
    toast.dark(t('Post created successfully.'));
  };

  return (
    <>
      <Head>
        <title>{t('Post Create')}</title>
      </Head>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {
            {
              1: (
                <EditFormStep1
                  title={t('Create new Post')}
                  onNextStep={() => setStep(2)}
                />
              ),
              2: <EditFormStep2 goBack={() => setStep(1)} />,
            }[step]
          }
        </form>
      </FormProvider>
    </>
  );
};

export default PostCreate;
