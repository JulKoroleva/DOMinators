import sanitizeHtml from 'sanitize-html';
import { TLeaderBoardItemProps } from './LeaderBoardItem.interface';
import styles from './LeaderBoardItem.module.scss';

const MY_USER_ID = 6;

export function LeaderBoardItem({ item }: TLeaderBoardItemProps) {
  const { userId, rank, userName, score } = item;
  const itsMe = userId === MY_USER_ID;

  return (
    <div
      className={`${styles['leaderboard-item']} ${itsMe ? styles['leaderboard-item_its-me'] : ''}`}>
      <div className={styles['leaderboard-item__rank']}>
        <div className={styles['leaderboard-item__medal']}>{rank}</div>
      </div>
      <div className={styles['leaderboard-item__name']}>{sanitizeHtml(userName)}</div>
      <div className={styles['leaderboard-item__score']}>{score}</div>
    </div>
  );
}
