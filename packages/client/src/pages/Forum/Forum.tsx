import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

import { FormComponent, Navigation, Popup, ErrorNotification } from '@/components';
import { TopicList, Pagination, TPaginationOptions, TTopic } from './components';

import { ROUTES } from '@/constants/routes';
import { HEADERS } from '@/constants/headers';
import { createNewTopicFields, createNewTopicFieldsInitialValues } from './FormData';

import { useIsAuthorized } from '@/services/hooks';
import { getCookie } from '@/services/cookiesHandler';

import { topicsMockData } from './ForumMock';

import add from '@/assets/icons/add.svg';

import styles from './Forum.module.scss';

export const Forum = () => {
  /**
   * ВРЕМЕННО. УБРАТЬ В GAME-30. До полноценной настройки SRR на клиенте возникает ошибка document is undefined.
   * Т.К. мы идём за куки до того, как документ отрендерился. фиксится в уроке 7/12 SSR */
  if (typeof window === 'undefined') {
    return <></>;
  }
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [topicList, setTopicList] = useState<TTopic[]>([]);
  const [paginationOptions, setPaginationOptions] = useState<TPaginationOptions>({
    page: 1,
    total: 5,
  });
  const [isAuthorized, setIsAuthorized] = useIsAuthorized();

  const authCookie = getCookie('auth');

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = (paginationOptions?: TPaginationOptions) => {
    const res = topicsMockData;
    setTopicList(res.topics);
    setPaginationOptions(paginationOptions || res.pagination);
  };

  const onSubmit = (data: Record<string, string>) => {
    return data;
  };

  useEffect(() => {
    setIsAuthorized(!!authCookie);
  }, [authCookie]);

  return (
    <div className={`${styles['game-forum']} ${styles['fade-in']}`}>
      <ErrorNotification>
        <Navigation title={HEADERS.forum} to={ROUTES.main()} />
        {isAuthorized && (
          <Button
            className={styles['game-forum__button']}
            type="button"
            onClick={() => setIsOpen(prev => !prev)}>
            <img src={add} alt="telegram logo" className={styles['game-forum__buttonIcon']} />
            Add topic
          </Button>
        )}
        <TopicList topicList={topicList} />
        <Pagination options={paginationOptions} onChange={fetchTopics} />
        <Popup open={isOpen} withOverlay onClose={() => setIsOpen(false)}>
          {isOpen && (
            <FormComponent
              fields={createNewTopicFields}
              onSubmit={onSubmit}
              initialValues={createNewTopicFieldsInitialValues}
              submitButtonText="Create topic"
            />
          )}
        </Popup>
      </ErrorNotification>
    </div>
  );
};
