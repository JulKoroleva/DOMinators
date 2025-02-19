import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import sanitizeHtml from 'sanitize-html';
import { ROUTES } from '@/constants/routes';
import { IListItemProps } from './ListItem.interface';
import styles from './ListItem.module.scss';

import { Reactions } from '@/components/EmojiReactions/EmojiReactions';
import { useEmojiPopupVisibility } from '@/hooks/useEmojiPopupVisibility.hook';

export function ListItem({ topic }: IListItemProps) {
  const { id, title, createdAt, description, creator, comments, reactions } = topic;
  const { showPopup, handleMouseEnter } = useEmojiPopupVisibility(100);
  const emojiRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const handleReadTopic = () => {
    navigate(ROUTES.topic(id));
  };

  return (
    <div className={styles['list-item']} onClick={handleReadTopic}>
      <div
        className={styles['list-item__container']}
        onMouseEnter={handleMouseEnter}
        ref={emojiRef}>
        <div className={styles['list-item__header']}>
          <span className={styles['list-item__author']}>{creator}</span>
          <div className={styles['list-item__params']}>
            {comments !== 0 && (
              <span className={styles['list-item__message-count']}>{comments}</span>
            )}
          </div>
        </div>
        <div className={styles['list-item__info']}>
          <span className={styles['list-item__date']}>
            {createdAt.includes('-') ? new Date(createdAt).toDateString() : createdAt}
          </span>
        </div>
        <span className={styles['list-item__title']}>{sanitizeHtml(title)}</span>
        <span className={styles['list-item__description']}>{sanitizeHtml(description)}</span>

        <Reactions id={id} type="topic" reactions={reactions} />
      </div>

      {showPopup && (
        <div id="reaction-popup" className={styles['reaction-popup']} ref={emojiRef}>
          <Reactions id={id} type="topic" showPopup={showPopup} emojiRef={emojiRef} />
        </div>
      )}
    </div>
  );
}
