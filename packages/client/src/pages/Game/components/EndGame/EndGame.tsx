import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { IEndGameProps } from './EndGame.interface';
import { AudioComponent } from '../Audio';
import tgLogo from '@/assets/icons/tgLogo.svg';
import lose from '@/assets/media/lose.wav';
import styles from './EndGame.module.scss';

const SHARE_URL = 'https://github.com/JulKoroleva/DOMinators';
const SHARE_TITLE = 'Я достиг отличных результатов в игре, проверь сам! Присоединяйся!';

const handleShare = () => {
  const link = `https://telegram.me/share/url?url=${SHARE_URL}&text=${SHARE_TITLE}`;
  window.open(link, '_blank');
};

export function EndGame({ isOpen, results, handleRepeat }: IEndGameProps) {
  const navigate = useNavigate();

  const handleGoToMain = () => {
    navigate('/main');
  };

  return (
    <div className={styles['end-game']}>
      {isOpen ? <AudioComponent src={lose} /> : null}
      <h2 className={styles['end-game__title']}>Match results</h2>
      <div className={styles['end-game__results']}>
        {results?.map(({ id, title, value }) => (
          <article key={id} className={styles.result}>
            <h3 className={styles.result__mark}>{title}</h3>
            <p className={styles.result__value}>{value}</p>
          </article>
        ))}
      </div>
      <Button
        className={`${styles['end-game__button']} ${styles['end-game__button_transparent']}`}
        type="button"
        onClick={handleShare}>
        <img src={tgLogo} alt="telegram logo" className={styles['end-game__buttonIcon']} />
        Share to Telegram
      </Button>
      <Button className={styles['end-game__button']} type="button" onClick={handleRepeat}>
        Повторить
      </Button>
      <Button className={styles['end-game__button']} type="button" onClick={handleGoToMain}>
        Главное меню
      </Button>
    </div>
  );
}
