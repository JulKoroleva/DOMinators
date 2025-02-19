import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import sanitizeHtml from 'sanitize-html';
import { Reactions } from '@/components/EmojiReactions/EmojiReactions';
import { IModalConfig, UniversalModal } from '@/components';

import { selectUser } from '@/redux/selectors';

import { useEmojiPopupVisibility } from '@/hooks/useEmojiPopupVisibility.hook';
import { useDeleteForumEntity } from '@/hooks/useDeleteForumEntity';
import { IComment } from './Comment.interface';

import trashButton from '@/assets/icons/trash.svg';

import styles from './Comment.module.scss';

export function Comment({ comment, topicData }: IComment) {
  const { id, creator, creatorId, createdAt, message, reactions } = comment;
  const { showPopup, handleMouseEnter, handleMouseLeave } = useEmojiPopupVisibility(100);
  const emojiRef = useRef<HTMLDivElement | null>(null);
  const userInfo = useSelector(selectUser);
  const deleteTopicComment = useDeleteForumEntity();

  const [modalConfig, setModalConfig] = useState<IModalConfig>({
    show: false,
    header: '',
    status: undefined,
    children: undefined,
  });

  const handleDelete = () => {
    setModalConfig({
      children: (
        <div className={styles['comment__modal__content']}>
          <p className={styles['comment__modal__content_text']}>
            Are you sure you want to delete this comment?
          </p>
          <div className={styles['comment__modal__content_buttons']}>
            <Button onClick={handleCloseModal} className={styles['close-button']}>
              Cancel
            </Button>
            <Button
              onClick={e => {
                deleteTopicComment(id, 'comment', e, topicData.id);
                handleCloseModal();
              }}
              className={styles['delete-button']}>
              Delete
            </Button>
          </div>
        </div>
      ),
      show: true,
      header: 'Delete comment',
      status: 'failed',
    });
  };

  const handleCloseModal = () => {
    setModalConfig({ show: false, header: '', status: undefined, children: undefined });
  };

  return (
    <div
      className={styles.comment}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={emojiRef}>
      <div className={styles.comment__info}>
        <span className={styles.comment__author}>
          {sanitizeHtml(creator)}
          {creatorId === topicData.creatorId && (
            <span className={styles.comment__author_self}>{` author`}</span>
          )}
        </span>
        <div>
          <span className={styles.comment__date}>
            {createdAt.includes('-') ? new Date(createdAt).toDateString() : createdAt}
          </span>
          {showPopup && userInfo.login === creator && (
            <button onClick={() => handleDelete()} className={styles['comment__delete-btn']}>
              <img src={trashButton} alt="delete" />
            </button>
          )}
        </div>
      </div>
      <p className={styles.comment__text}>{sanitizeHtml(message)}</p>
      <Reactions id={id} type="comment" reactions={reactions} />

      {showPopup && (
        <div id="reaction-popup" className={styles['reaction-popup']} ref={emojiRef}>
          <Reactions id={id} type="comment" showPopup={showPopup} emojiRef={emojiRef} />
        </div>
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
