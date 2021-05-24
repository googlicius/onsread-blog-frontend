import Head from 'next/head';
import { NextPageContext } from 'next';
import {
  Post,
  PostBySlugDocument,
  PostBySlugQuery,
  useUpdatePostMutation,
} from '@/graphql/generated';
import client from '@/apollo-client';
import { useSelector } from 'react-redux';
import { selectMe } from '@/redux/meProducer';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import EditFormStep1 from '@/components/posts/edit/EditFormStep1';
import EditFormStep2 from '@/components/posts/edit/EditFormStep2';
import {
  Step1FormData,
  Step2FormData,
  FormData,
} from '@/components/posts/edit/interface';

interface Props {
  postData: PostBySlugQuery;
}

const PostEdit = ({ postData }: Props) => {
  const router = useRouter();
  const [postModifiedData, setPostModifiedData] = useState<FormData>(null);
  const [step, setStep] = useState(1);

  const me = useSelector(selectMe);
  const [updatePostMutation] = useUpdatePostMutation();

  const handleStep1DataChange = (step1FormData: Step1FormData) => {
    setPostModifiedData((prevValue) => ({
      ...prevValue,
      ...step1FormData,
    }));
    setStep(2);
  };

  const handleStep2DataChange = async (step2FormData: Step2FormData) => {
    await updatePostMutation({
      variables: {
        input: {
          where: {
            id: postData.postBySlug.id,
          },
          data: {
            ...postModifiedData,
            ...step2FormData,
          },
        },
      },
    });

    router.push(`/posts/${postData.postBySlug.slug}`);
  };

  const handleBackToStep1 = (step2FormData: Step2FormData) => {
    setPostModifiedData({
      ...postModifiedData,
      ...step2FormData,
    });
    setStep(1);
  };

  useEffect(() => {
    if (me.value?.id !== postData.postBySlug?.user?.id) {
      router.back();
    }
  }, [me, postData]);

  useEffect(() => {
    const { content, contentType, title, description } = postData.postBySlug;

    setPostModifiedData({
      content,
      contentType,
      title,
      description,
    });
  }, []);

  const renderFormByStep = (stepp: number) => {
    switch (stepp) {
      case 1:
        return (
          <EditFormStep1
            formData={postModifiedData}
            onChange={handleStep1DataChange}
          />
        );

      case 2:
        return (
          <EditFormStep2
            post={postData.postBySlug as Post}
            formData={postModifiedData}
            onChange={handleStep2DataChange}
            goBack={handleBackToStep1}
          />
        );
    }
  };

  return (
    <>
      <Head>
        <title>Post Edit</title>
      </Head>

      {postModifiedData && renderFormByStep(step)}
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
