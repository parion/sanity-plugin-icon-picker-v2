import { Button, Flex, Grid, Spinner, Text } from '@sanity/ui';
import { useMemo, useRef } from 'react';
import { styled } from 'styled-components';

import { ALL_CONFIGURATIONS_PROVIDER } from '../constants/config';
import useMedia from '../hooks/useMedia';
import type { IconObject, IconObjectArray } from '../types';
import { listToMatrix } from '../utils/helpers';
import { useVirtualizer } from '@tanstack/react-virtual';

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
  // const [filtered, setFiltered] = useState<IconObjectArray[]>([]);
  const COLUMNS_COUNT = useMedia(
    // Media queries
    ['(min-width: 960px)', '(min-width: 640px)', '(min-width: 512px)'],
    // Column counts (relates to above media queries by array index)
    [6, 4, 2],
    // Default column count
    1,
  );
  const filtered = useMemo<IconObjectArray[]>(() => {
    const icons =
      !filter || filter === ALL_CONFIGURATIONS_PROVIDER
        ? results
        : results.filter((item) => item.provider === filter);
    console.log('filtered icons', icons);
    return listToMatrix(Object.values(icons), COLUMNS_COUNT);
  }, [results, filter, COLUMNS_COUNT]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 35,
  });

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <Grid style={style} columns={[1, 2, 4, 6]} gap={[1, 1, 1, 1]}>
      {filtered[index].map((icon) => (
        <Button
          key={icon.provider.concat(icon.name)}
          mode="ghost"
          onClick={(e) => onSelect(icon, e.currentTarget as HTMLButtonElement)} // no useRef needed
          text={<icon.component />}
          style={{ marginTop: '5px' }}
          selected={!!selected && selected.provider === icon.provider && icon.name === selected.name}
        />
      ))}
    </Grid>
  );

  return (
    <Wrapper>
      {/* The scrollable element for your list */}
      <div
        ref={scrollRef}
        style={{
          height: `400px`,
          overflow: 'auto', // Make it scroll!
        }}
      >
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
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {/* Only the visible items in the virtualizer, manually positioned to be in view */}
            {rowVirtualizer.getVirtualItems().map((virtualItem) => (
              <div
                key={virtualItem.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              ><Row index={virtualItem.index} style={{ height: `${virtualItem.size}px` }} /></div>
            ))}
          </div>
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
      </div>
    </Wrapper>
  );
};

export default SearchResults;
