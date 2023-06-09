import cx from "classnames";
import React, { useCallback, useState } from "react";
import ReactDOM from "react-dom";
import "./styles/styles.css";

import GridLayout, { GRID_BREAKPOINTS, GRID_COLUMNS } from "./grid/GridLayout";
import { generateMobileLayout } from "./grid/utils";

const e = React.createElement;
const DEFAULT_CARD_SIZE = {
  width: 2,
  height: 2
};
const styles = {
  main: {
    backgroundColor: "#ffffff",
    height: "inherit",
    minWidth: "100px"
  }
};

function App() {
  const [isEditingLayout, setIsEditingLayout] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);
  // const myRef = useRef(null);
  // const conRef = useRef(null);
  const dashboardCards = [
    {
      id: 1,
      x: 0,
      y: 0,
      w: 2,
      h: 2,
      display: "action"
    },
    {
      id: 2,
      x: 2,
      y: 2,
      w: 2,
      h: 2,
      display: "action"
    }
  ];
  // const layout = {
  //   lg: [
  //     { i: "1", x: 0, y: 0, w: 2, h: 1, minW: 2, minH: 1 },
  //     { i: "2", x: 2, y: 2, w: 2, h: 1, minW: 2, minH: 1 }
  //   ],
  //   md: [
  //     { i: "1", x: 0, y: 0, w: 2, h: 1, minW: 2, minH: 1 },
  //     { i: "2", x: 2, y: 2, w: 2, h: 1, minW: 2, minH: 1 }
  //   ],
  //   xs: [
  //     { i: "1", x: 0, y: 0, w: 2, h: 1, minW: 2, minH: 1 },
  //     { i: "2", x: 2, y: 2, w: 2, h: 1, minW: 2, minH: 1 }
  //   ]
  // };

  // const onLayoutChange = () => {
  //   // console.log(layout);
  //   for (let i = 0; i < echarts.charts.length; i += 1) {
  //     if (echarts.charts[i] !== undefined) {
  //       echarts.charts[i].reflow(); // here is the magic to update charts' looking
  //     }
  //   }
  // };

  function getLayouts(props) {
    const desktop = dashboardCards.map(getLayoutForDashCard);
    const mobile = generateMobileLayout({
      desktopLayout: desktop,
      defaultCardHeight: 6,
      heightByDisplayType: {
        action: 1,
        link: 1,
        text: 2,
        scalar: 4
      }
    });
    return { desktop, mobile };
  }

  function getLayoutForDashCard(dashcard) {
    const initialSize = DEFAULT_CARD_SIZE;
    const minSize = DEFAULT_CARD_SIZE;
    return {
      i: String(dashcard.id),
      x: dashcard.x || 0,
      y: dashcard.y || 0,
      w: dashcard.w || initialSize.width,
      h: dashcard.h || initialSize.height,
      dashcard: dashcard,
      minW: minSize.width,
      minH: minSize.height
    };
  }

  // we need to track whether or not we're dragging so we can disable pointer events on action buttons :-/
  const onDrag = useCallback(() => {
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);
  const onDragStop = useCallback(() => {
    setIsDragging(false);
  }, []);

  const renderGridItem = ({
    item: dc,
    breakpoint,
    gridItemWidth,
    totalNumGridCols
  }) => (
    <div  key={String(dc.id)}>
      <span>
        {dc.title}
      </span>
    </div>
    // <SimpleCard
    //   key={String(dc.id)}
    //   className="DashCard"
    //   style={styles}
    //   isAnimationDisabled={isAnimationPaused}
    //   title={dc.title}
    // >
      
    // </SimpleCard>
  );

  const onLayoutChange = ({ layout, breakpoint }) => {};
  return (
    <div className="grid-container">
      <GridLayout
        layouts={getLayouts()}
        breakpoints={GRID_BREAKPOINTS}
        cols={GRID_COLUMNS}
        rowHeight={75}
        containerPadding={[0, 0]}
        verticalCompact={false}
        width={1200}
        margin={{ desktop: [6, 6], mobile: [6, 10] }}
        className={cx("DashboardGrid", {
          "Dash--editing": isEditingLayout,
          "Dash--dragging": isDragging
        })}
        compactType="vertical"
        isEditing={isEditingLayout}
        onDrag={onDrag}
        onDragStop={onDragStop}
        onLayoutChange={onLayoutChange}
        // onResizeStop={function(event) {
        //   myRef.current.chart.setSize(conRef.current.clientWidth,conRef.current.clientHeight)
        //    console.log('hello', event);
        //  }}
        items={[
          {
            id: 1,
            title: 'item 1',
          },
          {
            id: 2,
            title: 'item 2',          
          }   ,
          {
            id: 3,
            title: 'item 3',          
          }       
        ]}
        itemRenderer={renderGridItem}
      ></GridLayout>
    </div>
  );
}

ReactDOM.render(e(App), document.getElementById("root"));
