import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import sanitizeHtml from 'sanitize-html';
import { Comment } from './components';
import {
  FormComponent,
  IModalConfig,
  Navigation,
  TModalStatus,
  UniversalModal,
} from '@/components';

import { TypeDispatch } from '@/redux/store';
import { addTopicComment, getTopicById } from '@/redux/requests';
import {
  selectGetTopicByIdError,
  selectTopicById,
  selectTopicCommentError,
  selectTopicCommentStatus,
  selectUser,
} from '@/redux/selectors';

import { usePage } from '@/services/hooks';

import { ROUTES } from '@/constants/routes';
import { topicPostFormData, topicPostFormDataInitialValues } from './topicPostFormData';

import { initForumPage } from '@/pages/Forum/Forum';

import { ITopicPostProps } from './TopicPost.interface';
import { TTopic } from '@/pages/Forum/components';

import styles from './TopicPost.module.scss';
import { Reactions } from '@/components/EmojiReactions/EmojiReactions';
import { useEmojiPopupVisibility } from '@/hooks/useEmojiPopupVisibility.hook';

import { useDeleteForumEntity } from '@/hooks/useDeleteForumEntity';

export function TopicPost({ id }: ITopicPostProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<TypeDispatch>();
  const emojiRef = useRef<HTMLDivElement | null>(null);

  const { showPopup, handleMouseEnter, handleMouseLeave } = useEmojiPopupVisibility(100);
  const [topicData, setTopicData] = useState<TTopic | null>(null);
  const [modalConfig, setModalConfig] = useState<IModalConfig>({
    show: false,
    header: '',
    status: undefined,
    children: undefined,
  });
  const [localTopicPostFormDataInitialValues, setLocalTopicPostFormDataInitialValues] = useState(
    topicPostFormDataInitialValues,
  );

  const topicDataFromServer = useSelector(selectTopicById);
  const getTopicByIdError = useSelector(selectGetTopicByIdError);

  const addTopicCommentStatus = useSelector(selectTopicCommentStatus);
  const addTopicCommentError = useSelector(selectTopicCommentError);

  const userInfo = useSelector(selectUser);

  const deleteTopic = useDeleteForumEntity();

  const handleDelete = () => {
    setModalConfig({
      children: (
        <div className={styles['topic-post__modal__content']}>
          <p className={styles['topic-post__modal__content_text']}>
            Are you sure you want to delete this topic?
          </p>
          <div className={styles['topic-post__modal__content_buttons']}>
            <Button onClick={handleCloseModal} className={styles['close-button']}>
              Cancel
            </Button>
            <Button
              onClick={e => {
                deleteTopic(topicData!.id, 'topic', e);
                handleCloseModal();
                navigate(ROUTES.forum());
              }}
              className={styles['delete-button']}>
              Delete
            </Button>
          </div>
        </div>
      ),
      show: true,
      header: 'Delete topic',
      status: 'failed',
    });
  };

  const onSubmit = (data: Record<string, string>) => {
    const id = topicData?.id;
    if (id) {
      dispatch(
        addTopicComment({
          topicId: id,
          message: data.message,
          creator: userInfo.login,
          creatorId: userInfo.id,
        }),
      ).then(() => {
        dispatch(getTopicById({ id }));
      });
    }
    setLocalTopicPostFormDataInitialValues({ message: '' });
  };

  const handleCloseModal = () => {
    setModalConfig({ show: false, header: '', status: undefined, children: undefined });
  };

  useEffect(() => {
    dispatch(getTopicById({ id }));
  }, []);

  useEffect(() => {
    if (topicDataFromServer) {
      setTopicData(topicDataFromServer);
    }
    if (getTopicByIdError) {
      navigate('/error404');
    }
  }, [topicDataFromServer, getTopicByIdError]);

  useEffect(() => {
    let header = '';
    let statusValue: TModalStatus = 'idle';
    let error: typeof addTopicCommentError = '';
    let succeeded = '';

    if (addTopicCommentStatus !== 'idle') {
      statusValue = addTopicCommentStatus;
      error = addTopicCommentError;
      succeeded = 'Comment added successfully';
    }

    switch (statusValue) {
      case 'loading':
        header = 'Loading...';
        statusValue = 'loading';
        break;
      case 'succeeded':
        header = succeeded;
        statusValue = 'succeeded';
        dispatch(getTopicById({ id }));
        break;
      case 'failed':
        header = error || 'Something went wrong';
        statusValue = 'failed';
        break;
      default:
        break;
    }

    if (statusValue) {
      setModalConfig({
        show: statusValue !== 'idle',
        header,
        status: statusValue,
      });
    }
  }, [addTopicCommentStatus, addTopicCommentError]);

  usePage({ initPage: initForumPage });

  return (
    <div className={`${styles['topic-post']} ${styles['fade-in']}`}>
      <Navigation title={`Discussion #${id}`} to={ROUTES.forum()} />
      <div
        className={styles['topic-post__container']}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={emojiRef}>
        <div className={styles['topic-post__info']}>
          <span className={styles['topic-post__topic-author']}>
            {sanitizeHtml(topicData?.creator ?? '')}
          </span>
          <div>
            <span className={styles['topic-post__topic-date']}>
              {topicData?.createdAt &&
              typeof topicData.createdAt === 'string' &&
              topicData.createdAt.includes('-')
                ? new Date(topicData.createdAt).toDateString()
                : (topicData?.createdAt ?? '-')}
            </span>
          </div>
        </div>
        <span className={styles['topic-post__topic-title']}>
          {sanitizeHtml(topicData?.title ?? '')}
        </span>
        <span className={styles['topic-post__topic-text']}>
          {sanitizeHtml(topicData?.description ?? '')}
        </span>
        {topicData !== null && <Reactions id={id} type="topic" reactions={topicData.reactions} />}

        {showPopup && (
          <div className={styles['reaction-popup']} ref={emojiRef}>
            <Reactions id={id} type="topic" showPopup={showPopup} emojiRef={emojiRef} />
          </div>
        )}
      </div>
      {topicData?.commentsList && topicData?.commentsList?.length !== 0 && (
        <div className={styles['topic-post__container']}>
          <AnimatePresence>
            {topicData?.commentsList?.map(message => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}>
                <Comment comment={message} topicData={topicData} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      {userInfo.login && (
        <div
          className={`${styles['topic-post__comment-wrapper']} ${styles['topic-post__container']}`}>
          <FormComponent
            fields={topicPostFormData}
            onSubmit={onSubmit}
            initialValues={localTopicPostFormDataInitialValues}
            submitButtonText="Publish"
          />
        </div>
      )}

      {userInfo.id === topicData?.creatorId && (
        <Button
          className={styles['delete-button']}
          type="button"
          variant="outline"
          onClick={() => handleDelete()}>
          {'Delete topic'}
        </Button>
      )}

      <UniversalModal
        show={modalConfig.show}
        title={modalConfig.header}
        status={modalConfig.status}
        children={
          modalConfig.status === 'failed' && modalConfig.children ? modalConfig.children : null
        }
        zIndex={2000}
        onHide={handleCloseModal}
      />
    </div>
  );
}
