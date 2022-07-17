import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import {
  deleteItem, deleteAll, MarkerOption, setInsertBefore,
  setAppend, setTime, loadMarkers, setMarkersDisplay,
} from './Reducer/markersSlice';
import { RootState } from './store';

interface MarkerItemProps {
  index: number;
  option: MarkerOption;
}

const MarkerItem: React.FC<MarkerItemProps> = ({ option, index }) => {
  const insertOption = useSelector((rootState: RootState) => rootState.markers.insertOption);
  const dispatch = useDispatch();
  const dispatchSetInsertBefore = () => dispatch(setInsertBefore(index));
  const dispatchDeleteItem = () => dispatch(deleteItem(index));
  const dispatchSetTime = (time: number) => dispatch(setTime({ index, time }));
  return (
    <div>
      <div>
        {`${index}, Time: `}
        <input type="number" value={option.time} onChange={e => dispatchSetTime(Number.parseFloat(e.target.value) || 0)} />
      </div>
      <button type="button" onClick={dispatchDeleteItem}>Delete</button>
      <button
        type="button"
        onClick={dispatchSetInsertBefore}
        style={typeof insertOption === 'object' && insertOption.insertBefore === index
          ? { border: '2px solid black' } : {}}
      >
        Insert Before
      </button>
    </div>
  );
};

const Timeline = () => {
  const markers = useSelector((rootState: RootState) => rootState.markers);
  const dispatch = useDispatch();
  const dispatchDeleteAll = () => dispatch(deleteAll());
  const dispatchAppend = () => dispatch(setAppend());
  const dispatchLoadMarker = (m: typeof markers.markers) => dispatch(loadMarkers(m));
  const dispatchMarkersDisplay = (show: boolean) => dispatch(setMarkersDisplay(show));
  const saveMarkersIntoLocal = () => {
    localStorage.setItem('markers', JSON.stringify(markers.markers));
  };
  const loadMarkersFromLocal = () => {
    const m = localStorage.getItem('markers');
    if (m) {
      dispatchLoadMarker(JSON.parse(m));
    }
  };

  return (
    <div>
      <div className="timeline_markers">
        {markers.markers.map((marker, i) => (
          <MarkerItem
            key={marker.createTime}
            index={i}
            option={marker}
          />
        ))}
      </div>
      <div>
        <button
          onClick={dispatchAppend}
          type="button"
          style={markers.insertOption === 'append'
            ? { border: '2px solid black' } : {}}
        >
          Append
        </button>
        <button type="button" onClick={dispatchDeleteAll}>Delete all</button>
        <button type="button" onClick={saveMarkersIntoLocal}>Save</button>
        <button type="button" onClick={loadMarkersFromLocal}>Load</button>
        <button
          type="button"
          onClick={() => dispatchMarkersDisplay(!markers.show)}
        >
          {markers.show ? 'Hide Markers' : 'Show Markers'}
        </button>
      </div>
    </div>
  );
};

export default Timeline;
