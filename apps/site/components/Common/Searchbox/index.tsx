'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { CollectionManager } from '@orama/core';
import { SearchRoot, ChatRoot, Modal } from '@orama/ui/components';
import { useSearchContext } from '@orama/ui/contexts';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import { useState, type FC, type PropsWithChildren } from 'react';

import { SlidingChatPanel } from './Chat';
import styles from './index.module.css';
import { Search } from './Search';

// TODO: test collection, replace with production collection and env variables
const collectionManager = new CollectionManager({
  collectionID: '85f541b3-b691-4d3e-9874-e7b3b4630adb',
  apiKey: 'c1_d2ZKYw9ugj_tyVyWE_o$$Y-RBNf9GcTFfocEufnuRl7rCl3KJlhNJnP2MG-',
  cluster: {
    readURL: 'https://staging.collections.orama.com',
  },
});

const InnerSearchBox: FC<PropsWithChildren> = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChatPanel = (): void => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <Search onChatTrigger={toggleChatPanel} />
      <SlidingChatPanel open={isChatOpen} onClose={toggleChatPanel} />
    </>
  );
};

const SearchWithModal: FC = () => {
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const { searchTerm } = useSearchContext();

  const toggleSearchBox = (): void => {
    setOpen(!open);
  };

  return (
    <>
      <button
        type="button"
        onClick={toggleSearchBox}
        className={styles.searchButton}
      >
        <div className={styles.searchButtonContent}>
          <MagnifyingGlassIcon />
          {t('components.search.searchPlaceholder')}
        </div>
        <span className={styles.searchButtonShortcut}>⌘ K</span>
      </button>

      <Modal.Wrapper
        open={open}
        onModalClosed={toggleSearchBox}
        closeOnOutsideClick={true}
        closeOnEscape={true}
        className={classNames(styles.modalWrapper, {
          [styles.modalWrapperWithResults]: searchTerm,
        })}
      >
        <Modal.Inner className={styles.modalInner}>
          <Modal.Content className={styles.modalContent}>
            <InnerSearchBox />
          </Modal.Content>
        </Modal.Inner>
      </Modal.Wrapper>
    </>
  );
};

const OramaSearch: FC<PropsWithChildren> = () => (
  <SearchRoot client={collectionManager}>
    <ChatRoot client={collectionManager}>
      <SearchWithModal />
    </ChatRoot>
  </SearchRoot>
);

export default OramaSearch;
