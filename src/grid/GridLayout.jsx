/* eslint-disable react/prop-types */
import React, { useCallback, useMemo, useState } from "react";
import {
  Responsive as ReactGridLayout,
  WidthProvider
} from "react-grid-layout";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { generateGridBackground } from "./utils";

const ResponsiveGridLayout = WidthProvider(ReactGridLayout);

const MOBILE_BREAKPOINT = 752;

export const GRID_WIDTH = 18;

export const GRID_BREAKPOINTS = {
  desktop: MOBILE_BREAKPOINT + 1,
  mobile: MOBILE_BREAKPOINT
};

export const GRID_COLUMNS = {
  desktop: GRID_WIDTH,
  mobile: 1
};

function GridLayout({
  items,
  itemRenderer,
  breakpoints,
  layouts,
  cols: columnsMap,
  width: gridWidth,
  margin: marginMap,
  rowHeight,
  isEditing,
  onLayoutChange,
  ...props
}) {
  const [currentBreakpoint, setCurrentBreakpoint] = useState(
    ReactGridLayout.utils.getBreakpointFromWidth(breakpoints, gridWidth)
  );

  const onLayoutChangeWrapped = useCallback(
    (nextLayout) => {
      onLayoutChange({
        layout: nextLayout,
        // Calculating the breakpoint right here,
        // so we're definitely passing the most recent one
        // Workaround for https://github.com/react-grid-layout/react-grid-layout/issues/889
        breakpoint: ReactGridLayout.utils.getBreakpointFromWidth(
          breakpoints,
          gridWidth
        )
      });
    },
    [onLayoutChange, breakpoints, gridWidth]
  );

  const onBreakpointChange = useCallback((newBreakpoint) => {
    setCurrentBreakpoint(newBreakpoint);
  }, []);

  const margin = useMemo(() => marginMap[currentBreakpoint], [
    marginMap,
    currentBreakpoint
  ]);

  const layout = useMemo(() => layouts[currentBreakpoint], [
    layouts,
    currentBreakpoint
  ]);

  const cols = useMemo(() => columnsMap[currentBreakpoint], [
    columnsMap,
    currentBreakpoint
  ]);

  const cellSize = useMemo(() => {
    const marginSlotsCount = cols - 1;
    const [horizontalMargin] = margin;
    const totalHorizontalMargin = marginSlotsCount * horizontalMargin;
    const freeSpace = gridWidth - totalHorizontalMargin;
    return {
      width: freeSpace / cols,
      height: rowHeight
    };
  }, [cols, gridWidth, rowHeight, margin]);

  const renderItem = useCallback(
    (item) => {
      const itemLayout = layout.find((l) => String(l.i) === String(item.id));
      const gridItemWidth = cellSize.width * (itemLayout?.w ?? 0);
      return itemRenderer({
        item,
        gridItemWidth,
        breakpoint: currentBreakpoint,
        totalNumGridCols: cols
      });
    },
    [layout, cellSize, itemRenderer, currentBreakpoint, cols]
  );

  const height = useMemo(() => {
    let lowestLayoutCellPoint = Math.max(...layout.map((l) => l.y + l.h));
    if (isEditing) {
      lowestLayoutCellPoint += Math.ceil(window.innerHeight / cellSize.height);
    }
    // eslint-disable-next-line no-unused-vars
    const [horizontalMargin, verticalMargin] = margin;
    return (cellSize.height + verticalMargin) * lowestLayoutCellPoint;
  }, [cellSize.height, layout, margin, isEditing]);

  const background = useMemo(
    () => generateGridBackground({ cellSize, margin, cols, gridWidth }),
    [cellSize, gridWidth, margin, cols]
  );

  const style = useMemo(
    () => ({
      width: gridWidth,
      height,
      background: isEditing ? background : ""
    }),
    [gridWidth, height, background, isEditing]
  );

  const isMobile = currentBreakpoint === "mobile";

  // https://github.com/react-grid-layout/react-grid-layout#performance
  const children = useMemo(() => items.map(renderItem), [items, renderItem]);

  return (
    <ResponsiveGridLayout
      breakpoints={breakpoints}
      cols={columnsMap}
      layouts={layouts}
      width={gridWidth}
      margin={margin}
      rowHeight={rowHeight}
      isDraggable={isEditing && !isMobile}
      isResizable={isEditing && !isMobile}
      autoSize={false}
      onLayoutChange={onLayoutChangeWrapped}
      onBreakpointChange={onBreakpointChange}
      style={style}
      {...props}
    >
      {children}
    </ResponsiveGridLayout>
  );
}

export default GridLayout;
