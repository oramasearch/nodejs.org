'use client';

import { OramaSearchBox, OramaSearchButton } from '@orama/react-components';
import { useTranslations, useLocale } from 'next-intl';
import { useTheme } from 'next-themes';
import { type FC } from 'react';

import {
  ORAMA_CLOUD_ENDPOINT,
  ORAMA_CLOUD_API_KEY,
  DEFAULT_ORAMA_QUERY_PARAMS,
  DEFAULT_ORAMA_SUGGESTIONS,
  BASE_URL,
} from '@/next.constants.mjs';

import { themeConfig } from './utils';

const uppercaseFirst = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1);

const getFormattedPath = (path: string, title: string) =>
  `${path
    .replace(/#.+$/, '')
    .split('/')
    .map(element => element.replaceAll('-', ' '))
    .map(element => uppercaseFirst(element))
    .filter(Boolean)
    .join(' > ')} — ${title}`;

const SearchButton: FC = () => {
  const { resolvedTheme } = useTheme();
  const t = useTranslations();
  const locale = useLocale();
  const colorScheme = resolvedTheme as 'light' | 'dark';

  const sourceMap = {
    title: 'pageSectionTitle',
    description: 'formattedPath',
    path: 'path',
  };

  const resultMap = {
    ...sourceMap,
    description: ({
      path,
      pageSectionTitle,
    }: {
      path: string;
      pageSectionTitle: string;
    }) => {
      return getFormattedPath(path, pageSectionTitle);
    },
    section: 'siteSection',
  };

  return (
    <>
      <OramaSearchButton
        style={{ flexGrow: 1 }}
        colorScheme={colorScheme}
        themeConfig={themeConfig}
        aria-label={t('components.search.searchBox.placeholder')}
      >
        {t('components.search.searchBox.placeholder')}
      </OramaSearchButton>

      <OramaSearchBox
        index={{ api_key: ORAMA_CLOUD_API_KEY, endpoint: ORAMA_CLOUD_ENDPOINT }}
        colorScheme={colorScheme}
        themeConfig={themeConfig}
        sourceBaseUrl={new URL(locale, BASE_URL).href}
        sourcesMap={sourceMap}
        resultMap={resultMap}
        facetProperty="siteSection"
        linksTarget="_self"
        highlightTitle={{
          caseSensitive: false,
          HTMLTag: 'b',
          CSSClass: 'font-bold',
        }}
        searchParams={DEFAULT_ORAMA_QUERY_PARAMS}
        suggestions={DEFAULT_ORAMA_SUGGESTIONS}
      />
    </>
  );
};

export default SearchButton;
