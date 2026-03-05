import { Button, Flex, Grid, Spinner, Text } from '@sanity/ui';
import { useEffect, useRef, useState } from 'react';
import { List } from 'react-window';
import { styled } from 'styled-components';

import { ALL_CONFIGURATIONS_PROVIDER } from '../constants/config';
import useMedia from '../hooks/useMedia';
import type { IconObject, IconObjectArray } from '../types';
import { listToMatrix } from '../utils/helpers';
import { ListChildComponentProps } from 'react-window';

const Wrapper = styled.section`
  min-height: 200px;
  width: 100%;
  position: relative;
`;
export type SearchResultsOnSelectCallback = (
  icon: IconObject,
  ele: HTMLButtonElement,
) => void;

interface ISearchResults {
  results: IconObjectArray;
  selected: IconObject | null;
  onSelect: SearchResultsOnSelectCallback;
  filter?: string;
  loading: boolean;
  query: string;
}

const SearchResults = ({
  results,
  selected,
  onSelect,
  filter,
  loading,
  query,
}: ISearchResults) => {
  const [filtered, setFiltered] = useState<IconObjectArray[]>([]);
  const COLUMNS_COUNT = useMedia(
    // Media queries
    ['(min-width: 960px)', '(min-width: 640px)', '(min-width: 512px)'],
    // Column counts (relates to above media queries by array index)
    [6, 4, 2],
    // Default column count
    1,
  );

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setDimensions({ width, height });
      updateIcons(COLUMNS_COUNT);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [COLUMNS_COUNT]);

  const getFiltered = (items: IconObjectArray) => {
    if (!filter || filter === ALL_CONFIGURATIONS_PROVIDER) return items;
    return items.filter((item) => item.provider === filter);
  };
  function updateIcons(cols: number) {
    const icons = getFiltered(results);
    const mappedIcons = listToMatrix(Object.values(icons), cols);
    setFiltered(mappedIcons);
  }

  const createIconButton = (icon: IconObject) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    return (
      <Button
        ref={buttonRef} // <--here
        key={icon.provider.concat(icon.name)}
        mode="ghost"
        onClick={() => onSelect(icon, buttonRef.current!)}
        text={<icon.component />}
        style={{ marginTop: '5px' }}
        selected={
          !!selected &&
          selected.provider === icon.provider &&
          icon.name === selected.name
        }
      />
    );
  };

  const Row = ({ index, style }: ListChildComponentProps) => (
    <Grid
      key={index.toString()}
      style={style}
      columns={[1, 2, 4, 6]}
      gap={[1, 1, 1, 1]}
    >
      {filtered[index].map(createIconButton)}
    </Grid>
  );

  const onResize = () => {
    updateIcons(COLUMNS_COUNT);
  };

  return (
    <Wrapper>
      {loading && (
        <Flex
          align="center"
          justify="center"
          style={{ width: '100%', height: '100%', position: 'absolute' }}
        >
          <Spinner size={4} muted />
        </Flex>
      )}
      {!loading && !!filtered.length && (
        <List
          height={dimensions.height}
          itemCount={filtered.length}
          itemSize={45}
          width={dimensions.width}
        >
          {Row}
        </List>
      )}
      {!loading && !filtered.length && (
        <Flex
          align="center"
          justify="center"
          style={{ width: '100%', height: '100%', position: 'absolute' }}
        >
          <Text>{`No results found for "${query}"`}</Text>
        </Flex>
      )}
    </Wrapper>
  );
};

export default SearchResults;
